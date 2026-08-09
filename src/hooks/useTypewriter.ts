import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPING_SPEED = 150;
const DELETING_SPEED = 100;
const PAUSE_DURATION = 2000;

type Phase = 'typing' | 'deleting';

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
        delay = PAUSE_DURATION;
        step = () => setPhase('deleting');
      }
    } else if (typedText.length > 0) {
      delay = DELETING_SPEED;
      step = () => setTypedText(currentRole.slice(0, typedText.length - 1));
    } else {
      delay = 0;
      step = () => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setPhase('typing');
      };
    }

    const timeoutId = setTimeout(step, delay);
    return () => clearTimeout(timeoutId);
  }, [isAnimated, phase, typedText, currentRole, roles.length]);

  if (!isAnimated) return roles[0] ?? '';

  return typedText;
}
