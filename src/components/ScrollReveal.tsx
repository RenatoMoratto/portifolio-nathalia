import type { ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import type { UseScrollAnimationOptions } from '../hooks/useScrollAnimation';

interface ScrollRevealProps extends UseScrollAnimationOptions {
  children: ReactNode;
  /** CSS class name to apply to wrapper */
  className?: string;
  /** Distance in pixels the element rises from (default: 8px for a subtle reveal) */
  translateY?: number;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Container element type (default: div) */
  as?: 'div' | 'section' | 'article' | 'span';
}

/**
 * Reusable scroll-triggered reveal animation.
 *
 * The offset is applied as an inline `transform` rather than a Tailwind class.
 * The previous implementation interpolated the value into the class name
 * (`translate-y-[${translateY}px]`), which Tailwind's scanner cannot see - it
 * reads source files as plain text - so no such rule was ever generated and the
 * slide silently did nothing. Only the fade was visible.
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
      // Every allowed tag is an HTMLElement, and the ref is only ever read as
      // one; the cast just reconciles the per-tag ref types.
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
