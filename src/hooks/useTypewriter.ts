import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPING_SPEED = 150;
const DELETING_SPEED = 100;
const PAUSE_DURATION = 2000;

type Phase = 'typing' | 'pausing' | 'deleting';

export function useTypewriter(roles: string[]) {
  const [typedText, setTypedText] = useState('');
  const [phase, setPhase] = useState<Phase>('typing');
  const [roleIndex, setRoleIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // If reduced motion is enabled, just show the full text of the first role (or all roles if feasible, but static text is safer)
    if (shouldReduceMotion) {
      setTypedText(roles[0]);
      return;
    }

    const currentRole = roles[roleIndex];

    switch (phase) {
      case 'typing': {
        if (typedText.length < currentRole.length) {
          const timeoutId = setTimeout(() => {
            setTypedText(currentRole.slice(0, typedText.length + 1));
          }, TYPING_SPEED);
          return () => clearTimeout(timeoutId);
        } else {
          setPhase('pausing');
        }
        break;
      }

      case 'pausing': {
        const timeoutId = setTimeout(() => {
          setPhase('deleting');
        }, PAUSE_DURATION);
        return () => clearTimeout(timeoutId);
      }

      case 'deleting': {
        if (typedText.length > 0) {
          const timeoutId = setTimeout(() => {
            setTypedText(currentRole.slice(0, typedText.length - 1));
          }, DELETING_SPEED);
          return () => clearTimeout(timeoutId);
        } else {
          setPhase('typing');
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
        break;
      }
    }
  }, [roles, typedText, phase, roleIndex, shouldReduceMotion]);

  return typedText;
}
