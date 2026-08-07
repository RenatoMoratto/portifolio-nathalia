import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTypewriter } from './useTypewriter';

const ROLES = ['AB', 'CD'];

/** Advance exactly one scheduled tick and flush the resulting render. */
function step(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

describe('useTypewriter', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts empty and types one character at a time', () => {
    const { result } = renderHook(() => useTypewriter(ROLES));
    expect(result.current).toBe('');

    act(() => void vi.advanceTimersByTime(150));
    expect(result.current).toBe('A');

    act(() => void vi.advanceTimersByTime(150));
    expect(result.current).toBe('AB');
  });

  it('pauses, deletes, then advances to the next role', () => {
    const { result } = renderHook(() => useTypewriter(ROLES));

    // Each tick must be advanced separately: the next timer is only scheduled
    // once the state update from the previous one has re-run the effect.
    step(150); // "A"
    step(150); // "AB"
    expect(result.current).toBe('AB');

    step(2000); // hold, then switch to deleting
    step(100);
    expect(result.current).toBe('A');

    step(100);
    expect(result.current).toBe('');

    step(0); // advance to the next role
    step(150);
    expect(result.current).toBe('C');
  });

  it('wraps around to the first role', () => {
    const { result } = renderHook(() => useTypewriter(['A', 'B']));

    step(150); // "A"
    step(2000); // hold
    step(100); // ""
    step(0); // -> role 2
    step(150);
    expect(result.current).toBe('B');

    step(2000);
    step(100);
    step(0); // wrap back to role 1
    step(150);
    expect(result.current).toBe('A');
  });

  it('returns an empty string for an empty roles list instead of throwing', () => {
    // `roles[roleIndex].length` used to throw here.
    const { result } = renderHook(() => useTypewriter([]));
    expect(result.current).toBe('');
    act(() => void vi.advanceTimersByTime(5000));
    expect(result.current).toBe('');
  });

  it('clears its pending timer on unmount', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderHook(() => useTypewriter(ROLES));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
