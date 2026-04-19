const THEME_KEY = 'notes_theme';
export type ThemeMode = 'dark' | 'light';

export function getTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(THEME_KEY) as ThemeMode | null;
  return saved === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: ThemeMode) {
  if (typeof window === 'undefined') return;
  const html = document.documentElement;
  html.classList.remove('light', 'dark');
  html.classList.add(theme);
  localStorage.setItem(THEME_KEY, theme);
}

export function initTheme() {
  const theme = getTheme();
  applyTheme(theme);
  return theme;
}

export function toggleTheme() {
  const next: ThemeMode = getTheme() === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}