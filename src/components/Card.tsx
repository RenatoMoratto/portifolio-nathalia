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
      default: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
      glass:
        'bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/20 dark:border-slate-700/50',
      outline: 'bg-transparent border-2 border-slate-200 dark:border-slate-700',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-6 transition-all duration-300',
          variants[variant],
          hover &&
            'hover:shadow-xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/30 hover:-translate-y-1',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
