// src/stores/alert.js
import { writable } from 'svelte/store';

let nextId = 0;

function createAlertStore() {
  const { subscribe, update } = writable([]);

  return {
    subscribe,

    addAlert: ({ message, details, type, id }) => {
      update(alerts => [
        ...alerts,
        {
          id: id ?? nextId++,
          message,
          details,
          type, // 'error' | 'successful' | 'warning'
        },
      ]);
    },

    removeAlert: id => {
      update(alerts => alerts.filter(alert => alert.id !== id));
    },
  };
}

export const alertStore = createAlertStore();
