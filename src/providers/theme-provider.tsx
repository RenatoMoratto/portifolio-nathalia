import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import { ThemeContext, type Theme } from './useTheme';

// Ignore legacy auto-detected values stored under the old key.
const STORAGE_KEY = 'theme-preference';

const LIGHT_QUERY = '(prefers-color-scheme: light)';

/** Only an explicit light preference overrides the dark default. */
function readDeviceTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia?.(LIGHT_QUERY).matches ? 'light' : 'dark';
}

/** `null` means no explicit choice, so the site follows the device. */
function readStoredChoice(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // Storage may be unavailable.
  }
  return null;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Theme | null>(readStoredChoice);
  const [deviceTheme, setDeviceTheme] = useState<Theme>(readDeviceTheme);

  const theme = choice ?? deviceTheme;

  // Keep the fallback theme synced with OS changes.
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
      // Storage may be unavailable.
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

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, isDark: theme === 'dark' }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
