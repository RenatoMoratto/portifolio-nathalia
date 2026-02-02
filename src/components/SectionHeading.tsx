import { cn } from '../utils/cn';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  title,
  subtitle,
  className,
  align = 'center',
}: SectionHeadingProps) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={cn(
        'mb-12 md:mb-16',
        'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
        align === 'center' ? 'text-center' : 'text-left',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      )}
    >
      <h2 className="heading-2 text-slate-900 dark:text-white mb-3">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'text-lg text-slate-500 dark:text-slate-400 max-w-2xl',
            'transition-all duration-700 delay-100',
            align === 'center' ? 'mx-auto' : '',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-6',
          'transition-all duration-700 delay-200 ease-[cubic-bezier(0.16,1,0.3,1)]',
          align === 'center' ? 'mx-auto' : '',
          isVisible ? 'w-16 opacity-100' : 'w-0 opacity-0',
        )}
      />
    </div>
  );
}
