import type { ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { UseScrollAnimationOptions } from '../hooks/useScrollAnimation';

interface ScrollRevealProps extends UseScrollAnimationOptions {
  children: ReactNode;
  className?: string;
  translateY?: number;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'span';
}

/** Uses an inline offset because Tailwind cannot detect interpolated classes. */
export function ScrollReveal({
  children,
  className,
  translateY = 8,
  delay = 0,
  as: Component = 'div',
  threshold = 0.1,
  rootMargin = '0px',
  triggerOnce = true,
}: ScrollRevealProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  return (
    <Component
      // Allowed tags share an HTMLElement-compatible ref.
      ref={ref as Ref<HTMLDivElement & HTMLElement>}
      className={cn(
        'transition-all duration-700 ease-out-expo',
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{
        transform: isVisible ? 'none' : `translateY(${translateY}px)`,
        transitionDelay: isVisible && delay > 0 ? `${delay}ms` : '0ms',
      }}
    >
      {children}
    </Component>
  );
}
