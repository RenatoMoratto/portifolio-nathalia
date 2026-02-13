import { useState, useCallback } from 'react';

export function useFlipCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleMouseEnter = useCallback(() => {
    // Only on desktop/hover capable devices could we force this,
    // but typically we let CSS/implementation decide.
    // Here we just set state.
    if (window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (window.matchMedia('(hover: hover)').matches) {
      setIsFlipped(false);
    }
  }, []);

  const handleFocus = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFlipped(false);
  }, []);

  const handleClick = useCallback(() => {
    // Toggle on click (essential for mobile)
    setIsFlipped((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFlipped((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsFlipped(false);
    }
  }, []);

  return {
    isFlipped,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleClick,
    handleKeyDown,
  };
}
