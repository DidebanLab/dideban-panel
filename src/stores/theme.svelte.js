import { writable } from 'svelte/store';

const themeSaved = localStorage.getItem('theme');
export const theme = writable(themeSaved || 'dark');

theme.subscribe(value => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', value === 'dark');
    localStorage.setItem('theme', value === 'dark' ? 'dark' : 'light');
  }
});
