import { writable } from 'svelte/store';

export const modals = writable([]);

export const opener = ({ id, content, props = {} }) => {
  modals.update(state => [...state, { id, content, props }]);
};

export const closer = ({ id }) => {
  modals.update(state => state.filter(m => m.id !== id));
};
