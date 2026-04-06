import { writable } from 'svelte/store';

export const modals = writable([]);

export const opener = ({ id, content, props = {}, isOutClicker = true }) => {
  modals.update(state => [...state, { id, content, isOutClicker, props }]);
};

export const closer = ({ id }) => {
  modals.update(state => state.filter(m => m.id !== id));
};
