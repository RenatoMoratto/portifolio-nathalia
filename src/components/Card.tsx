import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'outline';
  hover?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const variants = {
      default: cn(
        'bg-white dark:bg-dark-surface',
        'border border-light-border dark:border-dark-border',
      ),
      glass: cn(
        'bg-white/70 dark:bg-dark-surface/70',
        'backdrop-blur-xl',
        'border border-white/40 dark:border-dark-border-subtle',
      ),
      outline: cn(
        'bg-transparent',
        'border-2 border-light-border dark:border-dark-border',
      ),
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6',
          'transition-all duration-300 ease-out-quart',
          variants[variant],
          hover && [
            'hover:shadow-xl hover:shadow-slate-900/8 dark:hover:shadow-black/20',
            'hover:-translate-y-0.5',
            'hover:border-light-border dark:hover:border-dark-border',
          ],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';
