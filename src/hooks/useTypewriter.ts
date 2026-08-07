import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPING_SPEED = 150;
const DELETING_SPEED = 100;
const PAUSE_DURATION = 2000;

type Phase = 'typing' | 'deleting';

/**
 * Cycles through `roles`, typing and deleting one character at a time.
 *
 * `roles` must be referentially stable (a module constant or memoized value):
 * the effect re-arms its timer whenever the array identity changes, so a fresh
 * array each render would continually restart the animation.
 *
 * The effect always schedules exactly one timer and every state update happens
 * inside that timer's callback - never synchronously in the effect body, which
 * would cascade an extra render each tick. The old explicit "pausing" phase is
 * now just a longer delay before deletion starts.
 *
 * Under `prefers-reduced-motion` the first role is shown statically, derived
 * during render rather than written through an effect.
 */
export function useTypewriter(roles: readonly string[]): string {
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [roleIndex, setRoleIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const currentRole = roles[roleIndex] ?? '';
  const isAnimated = !shouldReduceMotion && roles.length > 0;

  useEffect(() => {
    if (!isAnimated) return;

    let delay: number;
    let step: () => void;

    if (phase === 'typing') {
      if (typedText.length < currentRole.length) {
        delay = TYPING_SPEED;
        step = () => setTypedText(currentRole.slice(0, typedText.length + 1));
      } else {
        // Fully typed: hold, then start deleting.
        delay = PAUSE_DURATION;
        step = () => setPhase('deleting');
      }
    } else if (typedText.length > 0) {
      delay = DELETING_SPEED;
      step = () => setTypedText(currentRole.slice(0, typedText.length - 1));
    } else {
      // Fully deleted: advance to the next role immediately.
      delay = 0;
      step = () => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setPhase('typing');
      };
    }

    const timeoutId = setTimeout(step, delay);
    return () => clearTimeout(timeoutId);
  }, [isAnimated, phase, typedText, currentRole, roles.length]);

  // Derived, so the reduced-motion path needs no setState inside an effect.
  if (!isAnimated) return roles[0] ?? '';

  return typedText;
}
