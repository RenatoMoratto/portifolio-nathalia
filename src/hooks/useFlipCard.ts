import { useState, useCallback, useRef } from 'react';
import type { KeyboardEvent, MouseEvent, PointerEvent } from 'react';

const DRAG_THRESHOLD_PX = 6;

/** Coordinates hover, pinning, keyboard control, and text-selection-safe clicks. */
export function useFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const pressOrigin = useRef<{ x: number; y: number } | null>(null);

  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

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

    // Ignore stale pointer coordinates for keyboard clicks.
    const dragged =
      origin !== null &&
      e.detail > 0 &&
      Math.hypot(e.clientX - origin.x, e.clientY - origin.y) > DRAG_THRESHOLD_PX;

    if (dragged || hasTextSelection()) return;

    setIsFlipped((prev) => !prev);
  }, []);

  // Preserve the current face until hover resumes.
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
