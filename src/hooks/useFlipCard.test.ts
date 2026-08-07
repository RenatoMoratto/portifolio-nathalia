import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useFlipCard } from './useFlipCard';

/** jsdom answers every media query with `false`, so hover has to be faked. */
function setHoverCapable(matches: boolean) {
  vi.spyOn(window, 'matchMedia').mockImplementation(
    (query: string) => ({ matches, media: query }) as MediaQueryList,
  );
}

/** Report a live text selection for the next `handleClick`. */
function selectText() {
  vi.spyOn(window, 'getSelection').mockReturnValue({ isCollapsed: false } as Selection);
}

// The handlers only ever read these fields off the event.
const hover = (buttons = 0) => ({ buttons }) as React.MouseEvent;
const press = (x: number, y: number) =>
  ({ clientX: x, clientY: y }) as React.PointerEvent;
const click = (x: number, y: number) =>
  ({ clientX: x, clientY: y, detail: 1 }) as React.MouseEvent;
/** Enter/Space reach `onClick` with no coordinates and `detail: 0`. */
const keyActivation = () => ({ clientX: 0, clientY: 0, detail: 0 }) as React.MouseEvent;
const escape = () => ({ key: 'Escape' }) as React.KeyboardEvent;

describe('useFlipCard', () => {
  beforeEach(() => setHoverCapable(true));
  afterEach(() => vi.restoreAllMocks());

  it('flips on hover and back again when the pointer leaves', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover()));
    expect(result.current.isFlipped).toBe(true);

    act(() => result.current.handleMouseLeave(hover()));
    expect(result.current.isFlipped).toBe(false);
  });

  it('leaves the card alone on devices without hover', () => {
    setHoverCapable(false);
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover()));
    expect(result.current.isFlipped).toBe(false);

    act(() => result.current.handleClick(keyActivation()));
    expect(result.current.isFlipped).toBe(true);
    // Nothing to unpin where hover never drove the card in the first place.
    expect(result.current.isPinned).toBe(false);
  });

  it('stops answering hover once the card has been pressed', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover()));
    act(() => result.current.handlePointerDown(press(10, 10)));
    act(() => result.current.handleClick(click(10, 10)));
    expect(result.current.isFlipped).toBe(false);
    expect(result.current.isPinned).toBe(true);

    act(() => result.current.handleMouseLeave(hover()));
    act(() => result.current.handleMouseEnter(hover()));
    expect(result.current.isFlipped).toBe(false);
  });

  it('hands the card back to hover when unpinned, without flipping it', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover()));
    act(() => result.current.handlePointerDown(press(10, 10)));
    expect(result.current.isPinned).toBe(true);

    act(() => result.current.unpin());
    expect(result.current.isPinned).toBe(false);
    expect(result.current.isFlipped).toBe(true);

    act(() => result.current.handleMouseLeave(hover()));
    expect(result.current.isFlipped).toBe(false);
  });

  it('holds its face when a press travels far enough to be a selection drag', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover()));
    act(() => result.current.handlePointerDown(press(10, 10)));
    // Dragging out of the card and back in must not disturb the face either.
    act(() => result.current.handleMouseLeave(hover(1)));
    act(() => result.current.handleMouseEnter(hover(1)));
    act(() => result.current.handleClick(click(80, 24)));

    expect(result.current.isFlipped).toBe(true);
  });

  it('holds its face when the press ends on a text selection', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover()));
    act(() => result.current.handlePointerDown(press(10, 10)));
    selectText();
    act(() => result.current.handleClick(click(10, 10)));

    expect(result.current.isFlipped).toBe(true);
  });

  it('ignores hover while a button is held, so a selection can cross the card', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handleMouseEnter(hover(1)));
    expect(result.current.isFlipped).toBe(false);
  });

  it('still toggles on a keyboard activation after an abandoned press', () => {
    const { result } = renderHook(() => useFlipCard());

    // Pressed, then released outside the card: no click ever followed.
    act(() => result.current.handlePointerDown(press(10, 10)));
    act(() => result.current.handleClick(keyActivation()));

    expect(result.current.isFlipped).toBe(true);
  });

  it('returns to the front on Escape and hands the card back to hover', () => {
    const { result } = renderHook(() => useFlipCard());

    act(() => result.current.handlePointerDown(press(10, 10)));
    act(() => result.current.handleClick(click(10, 10)));
    expect(result.current.isFlipped).toBe(true);

    act(() => result.current.handleKeyDown(escape()));
    expect(result.current.isFlipped).toBe(false);
    expect(result.current.isPinned).toBe(false);

    act(() => result.current.handleMouseEnter(hover()));
    expect(result.current.isFlipped).toBe(true);
  });
});
