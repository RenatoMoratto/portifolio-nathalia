import { createContext, useContext } from 'react';
import type { Dispatch, SetStateAction } from 'react';

export type Theme = 'light' | 'dark';

export interface ThemeContextValue {
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
  toggleTheme: () => void;
  isDark: boolean;
}

/**
 * Context and hook live in their own module, separate from the provider
 * component. Mixing a component and non-component exports in one file breaks
 * React Fast Refresh (`react-refresh/only-export-components`).
 */
export const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
