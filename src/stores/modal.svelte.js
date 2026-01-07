import { writable } from 'svelte/store';

export const modals = writable([]);

export const opener = ({ id, content }) => {
  modals.update(state => [...state, { id, content }]);
};

export const closer = ({ id }) => {
  modals.update(state => state.filter(m => m.id !== id));
};
