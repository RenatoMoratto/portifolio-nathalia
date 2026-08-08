import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ThemeProvider } from './theme-provider';
import { useTheme } from './useTheme';

/**
 * Two things here are easy to break and invisible without cover:
 *
 * 1. A device with *no* colour-scheme preference matches neither media query.
 *    A `prefers-color-scheme: dark` check reports false for it, which silently
 *    handed those visitors light.
 * 2. Persisting the theme on mount rather than on choice. That stamped the
 *    detected value into storage on the first page view, so the site followed
 *    the device exactly once per visitor and never again.
 */

type Preference = 'light' | 'dark' | 'none';

/** Answer the colour-scheme queries as a device set to `preference` would. */
function stubDevice(preference: Preference) {
  const listeners = new Set<() => void>();
  let current = preference;

  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) =>
      ({
        get matches() {
          return current !== 'none' && query.includes(current);
        },
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: (_: string, listener: () => void) =>
          void listeners.add(listener),
        removeEventListener: (_: string, listener: () => void) =>
          void listeners.delete(listener),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList,
  );

  return {
    /** Flip the OS setting and notify subscribers, as a real theme switch does. */
    change(next: Preference) {
      current = next;
      act(() => listeners.forEach((listener) => listener()));
    },
  };
}

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

const mountTheme = () => renderHook(() => useTheme(), { wrapper });

const storedChoice = () => window.localStorage.getItem('theme-preference');

beforeEach(() => {
  window.localStorage.clear();
  document.documentElement.classList.remove('dark');
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('boot theme', () => {
  it('follows a device set to light', () => {
    stubDevice('light');
    expect(mountTheme().result.current.theme).toBe('light');
  });

  it('follows a device set to dark', () => {
    stubDevice('dark');
    expect(mountTheme().result.current.theme).toBe('dark');
  });

  it('falls back to dark when the device states no preference', () => {
    stubDevice('none');
    expect(mountTheme().result.current.theme).toBe('dark');
  });

  it('falls back to dark when the browser has no matchMedia', () => {
    vi.stubGlobal('matchMedia', undefined);
    expect(mountTheme().result.current.theme).toBe('dark');
  });

  it('prefers a stored choice over the device preference', () => {
    stubDevice('dark');
    window.localStorage.setItem('theme-preference', 'light');
    expect(mountTheme().result.current.theme).toBe('light');
  });

  it('ignores a stored value that is not a theme', () => {
    stubDevice('light');
    window.localStorage.setItem('theme-preference', 'sepia');
    expect(mountTheme().result.current.theme).toBe('light');
  });
});

describe('following the device', () => {
  it('persists nothing until the visitor actually chooses', () => {
    stubDevice('light');
    mountTheme();
    // The regression: writing here pins the visitor to light forever.
    expect(storedChoice()).toBeNull();
  });

  it('tracks the device switching theme mid-session', () => {
    const device = stubDevice('light');
    const { result } = mountTheme();
    expect(result.current.theme).toBe('light');

    device.change('dark');

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('stops tracking the device once the visitor has chosen', () => {
    const device = stubDevice('light');
    const { result } = mountTheme();

    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe('dark');

    device.change('light');

    expect(result.current.theme).toBe('dark');
  });

  it('keeps a stored choice across a reload', () => {
    const device = stubDevice('light');
    const { result, unmount } = mountTheme();

    act(() => result.current.toggleTheme());
    unmount();
    device.change('light');

    expect(mountTheme().result.current.theme).toBe('dark');
  });
});

describe('applying the theme', () => {
  it('drives the `dark` class on <html> and persists the choice', () => {
    stubDevice('light');
    const { result } = mountTheme();
    expect(document.documentElement).not.toHaveClass('dark');

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(document.documentElement).toHaveClass('dark');
    expect(storedChoice()).toBe('dark');
  });

  it('accepts a functional update relative to the displayed theme', () => {
    stubDevice('dark');
    const { result } = mountTheme();

    act(() => result.current.setTheme((prev) => (prev === 'dark' ? 'light' : 'dark')));

    expect(result.current.theme).toBe('light');
    expect(storedChoice()).toBe('light');
  });
});
