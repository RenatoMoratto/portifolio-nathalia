import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { UseScrollAnimationOptions } from '../hooks/useScrollAnimation';

interface ScrollRevealProps extends UseScrollAnimationOptions {
  children: ReactNode;
  /** CSS class name to apply to wrapper */
  className?: string;
  /** Translation amount in pixels (default: 8px for subtle reveal) */
  translateY?: number;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Container element type (default: div) */
  as?: 'div' | 'section' | 'article' | 'span';
}

/**
 * Reusable scroll-triggered reveal animation component
 *
 * Wraps children with fade-in and slide-up animation that triggers
 * when the element enters the viewport.
 *
 * @example
 * <ScrollReveal>
 *   <Card>Content appears on scroll</Card>
 * </ScrollReveal>
 *
 * @example
 * <ScrollReveal translateY={24} delay={200}>
 *   <h2>Larger movement with delay</h2>
 * </ScrollReveal>
 */
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
      ref={ref as any}
      className={cn(
        'transition-all duration-700 ease-out-expo',
        isVisible
          ? 'opacity-100 translate-y-0'
          : `opacity-0 translate-y-[${translateY}px]`,
        className,
      )}
      style={
        delay > 0
          ? {
              transitionDelay: isVisible ? `${delay}ms` : '0ms',
            }
          : undefined
      }
    >
      {children}
    </Component>
  );
}
