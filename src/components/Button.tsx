import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../utils/cn';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: cn(
        'bg-primary-500 text-white',
        'hover:bg-primary-600 hover:shadow-lg hover:shadow-primary-500/20',
        'active:bg-primary-700',
      ),
      secondary: cn(
        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white',
        'hover:bg-slate-200 dark:hover:bg-slate-700',
        'active:bg-slate-300 dark:active:bg-slate-600',
      ),
      outline: cn(
        'border-2 border-primary-500 text-primary-500',
        'hover:bg-primary-500 hover:text-white',
        'active:bg-primary-600',
      ),
      ghost: cn(
        'text-slate-600 dark:text-slate-400',
        'hover:text-primary-500 dark:hover:text-primary-400',
        'hover:bg-primary-50 dark:hover:bg-primary-900/20',
        'active:bg-primary-100 dark:active:bg-primary-900/30',
      ),
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium rounded-xl',
          'transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500',
          'dark:focus-visible:ring-offset-dark-bg',
          'hover:scale-[1.02] active:scale-[0.98]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
          variants[variant],
          sizes[size],
          className,
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
