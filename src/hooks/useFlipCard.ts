import { useState, useCallback, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';

/** Pointer travel above which a press is read as a drag instead of a click. */
const DRAG_THRESHOLD_PX = 6;

/**
 * Flip-card interaction state.
 *
 * The card is driven by a real `<button>`, so Enter/Space already reach
 * `handleClick` through the native click behaviour - `handleKeyDown` only needs
 * to add Escape. Hover is applied on pointer-capable devices only; touch users
 * get tap-to-toggle.
 *
 * Hover only drives the card until the visitor takes it over: the first press
 * pins the card, after which nothing but a click flips it. Without that,
 * selecting text on a face flips the card away mid-selection as soon as the
 * pointer crosses an edge. For the same reason a press that travels (a
 * selection drag) or that ends on a selection is not treated as a click, and
 * hover is ignored while a button is held, so a selection dragged across the
 * timeline leaves the cards alone.
 *
 * Pinning is a visible state - the card shows a lock the visitor can release -
 * so it is only entered where hover was doing something in the first place.
 * `unpin` hands the card back to hover; Escape does the same and returns to the
 * front.
 */
export function useFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  /** Pointer position at press time, kept in a ref: it is never rendered. */
  const pressOrigin = useRef<{ x: number; y: number } | null>(null);

  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  /** A press that leaves a selection behind was a selection, not a click. */
  const hasTextSelection = () => {
    const selection = typeof window !== 'undefined' ? window.getSelection() : null;
    return selection !== null && !selection.isCollapsed;
  };

  const handleMouseEnter = useCallback(
    (e: MouseEvent) => {
      if (isPinned || e.buttons !== 0) return;
      if (canHover()) setIsFlipped(true);
    },
    [isPinned],
  );

  const handleMouseLeave = useCallback(
    (e: MouseEvent) => {
      if (isPinned || e.buttons !== 0) return;
      if (canHover()) setIsFlipped(false);
    },
    [isPinned],
  );

  const handlePointerDown = useCallback((e: PointerEvent) => {
    pressOrigin.current = { x: e.clientX, y: e.clientY };
    if (canHover()) setIsPinned(true);
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const origin = pressOrigin.current;
    pressOrigin.current = null;
    if (canHover()) setIsPinned(true);

    // `detail` is 0 for Enter/Space, which arrive without a preceding press and
    // so carry no meaningful coordinates to compare against.
    const dragged =
      origin !== null &&
      e.detail > 0 &&
      Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > DRAG_THRESHOLD_PX;

    if (dragged || hasTextSelection()) return;

    setIsFlipped((prev) => !prev);
  }, []);

  /**
   * Leaves the current face alone: the pointer is still on the card when the
   * lock is released, so flipping here would be an unrequested animation. The
   * next enter/leave picks the card back up.
   */
  const unpin = useCallback(() => {
    pressOrigin.current = null;
    setIsPinned(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        unpin();
        setIsFlipped(false);
      }
    },
    [unpin],
  );

  return {
    isFlipped,
    isPinned,
    handleMouseEnter,
    handleMouseLeave,
    handlePointerDown,
    handleClick,
    handleKeyDown,
    unpin,
  };
}
