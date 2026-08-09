import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ListBulletProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md';
  animated?: boolean;
  delay?: number;
  isVisible?: boolean;
}

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
