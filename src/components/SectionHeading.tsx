import { cn } from '../utils/cn';

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
  return (
    <div
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' ? 'text-center' : 'text-left',
        className,
      )}
    >
      <h2 className="heading-2 text-slate-900 dark:text-white mb-3">{title}</h2>
      {subtitle && (
        <p
          className={cn(
            'text-lg text-slate-500 dark:text-slate-400 max-w-2xl',
            align === 'center' ? 'mx-auto' : '',
          )}
        >
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          'h-0.5 bg-linear-to-r from-primary-500 to-accent-500 rounded-full mt-6 w-16',
          align === 'center' ? 'mx-auto' : '',
        )}
      />
    </div>
  );
}
