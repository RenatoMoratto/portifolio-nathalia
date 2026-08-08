import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { ThemeContext, type Theme } from './useTheme';

/**
 * Deliberately not the old `theme` key. That one was written on every mount, so
 * an automatically detected theme is indistinguishable from a chosen one and
 * every returning visitor carries a value that would pin them forever. A new
 * key retires those, at the cost of forgetting genuine choices once.
 */
const STORAGE_KEY = 'theme-preference';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

/**
 * Read the device preference.
 *
 * Asks for `prefers-color-scheme: light` rather than `dark`. A `dark` query
 * reports `false` both for a device set to light *and* for one that expresses
 * no preference at all, so testing it would quietly hand the undecided
 * visitors light. Only an explicit light preference opts out of dark.
 */
function readDeviceTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia?.(LIGHT_QUERY).matches ? 'light' : 'dark';
}

/**
 * Read the visitor's *explicit* choice, or `null` for "never chose, follow the
 * device". Only ThemeToggle writes this - detection must never persist, or the
 * site stops tracking the device after a single page view.
 */
function readStoredChoice(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Private browsing / blocked storage - treat as no choice.
  }
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Theme | null>(readStoredChoice);
  const [deviceTheme, setDeviceTheme] = useState<Theme>(readDeviceTheme);

  const theme = choice ?? deviceTheme;

  // Stay subscribed rather than sampling once: a visitor who has made no choice
  // should see the site follow their OS flipping to dark at sunset, and the
  // preference can also change between the first render and this effect.
  useEffect(() => {
    const query = window.matchMedia?.(LIGHT_QUERY);
    if (!query) return;

    const sync = () => setDeviceTheme(query.matches ? 'light' : 'dark');
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    if (choice === null) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Persisting the preference is best-effort.
    }
  }, [choice]);

  const setTheme = useCallback<Dispatch<SetStateAction<Theme>>>(
    (action) =>
      setChoice((prev) =>
        typeof action === 'function' ? action(prev ?? deviceTheme) : action,
      ),
    [deviceTheme],
  );

  const toggleTheme = useCallback(() => {
    setChoice(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  // Memoized so every consumer does not re-render on unrelated parent renders.
  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
