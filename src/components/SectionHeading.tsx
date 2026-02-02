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
        'mb-12 md:mb-16 transition-all duration-700',
        align === 'center' ? 'text-center' : 'text-left',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      <h2 className="heading-2 text-slate-900 dark:text-white mb-4">{title}</h2>
      {subtitle && (
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'w-20 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mt-6',
          align === 'center' ? 'mx-auto' : ''
        )}
      />
    </div>
  );
}
