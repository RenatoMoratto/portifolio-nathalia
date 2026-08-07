import { useState, useCallback } from 'react';
import type { KeyboardEvent } from 'react';

/**
 * Flip-card interaction state.
 *
 * The card is driven by a real `<button>`, so Enter/Space already reach
 * `toggle` through the native click behaviour - `handleKeyDown` only needs to
 * add Escape. Hover is applied on pointer-capable devices only; touch users get
 * tap-to-toggle.
 */
export function useFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const canHover = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

  const handleMouseEnter = useCallback(() => {
    if (canHover()) setIsFlipped(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (canHover()) setIsFlipped(false);
  }, []);

  const toggle = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsFlipped(false);
    }
  }, []);

  return { isFlipped, handleMouseEnter, handleMouseLeave, toggle, handleKeyDown };
}
