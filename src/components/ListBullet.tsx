import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ListBulletProps extends HTMLAttributes<HTMLSpanElement> {
  /** Size variant for the bullet */
  size?: 'sm' | 'md';
  /** Whether to animate the bullet on visibility */
  animated?: boolean;
  /** Animation delay in milliseconds (only applies if animated=true) */
  delay?: number;
  /** Whether bullet is currently visible (for animation control) */
  isVisible?: boolean;
}

/**
 * Standardized list bullet component
 *
 * Used across About, Experience, and HowIWork sections for consistent
 * bullet point styling with optional animation support.
 *
 * @example
 * <ListBullet /> // Simple bullet, medium size
 *
 * @example
 * <ListBullet size="sm" animated isVisible={isVisible} delay={100} />
 */
export function ListBullet({
  size = 'md',
  animated = false,
  delay = 0,
  isVisible = true,
  className,
  ...props
}: ListBulletProps) {
  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
  };

  return (
    <span
      className={cn(
        'rounded-full bg-primary-500 shrink-0',
        sizes[size],
        animated && [
          'transition-all duration-500',
          isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
        ],
        className,
      )}
      style={
        animated && delay > 0
          ? { transitionDelay: isVisible ? `${delay}ms` : '0ms' }
          : undefined
      }
      aria-hidden="true"
      {...props}
    />
  );
}
