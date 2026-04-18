const THEME_KEY = 'notes_theme';

export type ThemeMode = 'dark' | 'light';

export function getTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const t = localStorage.getItem(THEME_KEY) as ThemeMode | null;
  return t === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  root.classList.remove('light', 'dark');
  root.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function toggleTheme() {
  const next: ThemeMode = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}