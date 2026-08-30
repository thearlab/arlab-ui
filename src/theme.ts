export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'arlab-theme';

/** Call once on app boot, before paint, to avoid a flash of the wrong theme. */
export function initTheme(): Theme {
  const stored = typeof localStorage !== 'undefined' ? (localStorage.getItem(STORAGE_KEY) as Theme | null) : null;
  const theme = stored ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  return theme;
}

export function setTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

export function getTheme(): Theme {
  return (document.documentElement.getAttribute('data-theme') as Theme) ?? 'light';
}
