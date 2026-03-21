import { PUBLIC_API_WS } from '$env/static/public';

// ws.js  —  reusable WebSocket singleton
const BASE_WS = PUBLIC_API_WS;

let socket = null;
let reconnectTimer = null;
const handlers = {}; // { eventType: [fn, fn, ...] }
const pendingSubs = new Set(); // channels to re-subscribe after reconnect

export function connect() {
  socket = new WebSocket(BASE_WS);

  socket.addEventListener('open', () => {
    console.log('[ws] connected');
    clearTimeout(reconnectTimer);

    // Re-subscribe to all channels after reconnect
    for (const ch of pendingSubs) {
      _send({ action: 'subscribe', channel: ch });
    }
  });

  socket.addEventListener('message', e => {
    const msg = JSON.parse(e.data);
    dispatch(msg);
  });

  socket.addEventListener('close', () => {
    console.warn('[ws] disconnected — reconnecting in 3s');
    reconnectTimer = setTimeout(connect, 3000);
  });

  socket.addEventListener('error', err => {
    console.error('[ws] error', err);
    socket.close();
  });
}

export function subscribe(channel) {
  pendingSubs.add(channel);
  if (socket?.readyState === WebSocket.OPEN) {
    _send({ action: 'subscribe', channel });
  }
}

export function unsubscribe(channel) {
  pendingSubs.delete(channel);
  if (socket?.readyState === WebSocket.OPEN) {
    _send({ action: 'unsubscribe', channel });
  }
}

export function on(eventType, fn) {
  if (!handlers[eventType]) handlers[eventType] = [];
  handlers[eventType].push(fn);
  return () => off(eventType, fn); // returns an unsubscribe function
}

export function off(eventType, fn) {
  handlers[eventType] = (handlers[eventType] || []).filter(h => h !== fn);
}

function dispatch(msg) {
  // route by event type
  const fns = handlers[msg.event] || [];
  fns.forEach(fn => fn(msg.data, msg));

  // also route by channel for catch-all listeners
  const chFns = handlers[`channel:${msg.channel}`] || [];
  chFns.forEach(fn => fn(msg.data, msg));
}

function _send(obj) {
  socket.send(JSON.stringify(obj));
}
