import { useRef, useEffect } from 'react';
import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';

export type LaneType = 'fast' | 'slow';

interface LaneToggleProps {
  value: LaneType;
  onChange: (lane: LaneType) => void;
  className?: string;
}

export function LaneToggle({ value, onChange, className }: LaneToggleProps) {
  const { t } = useTranslation();
  const liveRef = useRef<HTMLSpanElement>(null);
  const isFast = value === 'fast';

  const handleToggle = () => {
    const newLane: LaneType = isFast ? 'slow' : 'fast';
    onChange(newLane);
  };

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = t('projects.laneToggle.liveRegion', {
        lane:
          value === 'fast'
            ? t('projects.laneToggle.fast')
            : t('projects.laneToggle.slow'),
      });
    }
  }, [value, t]);

  return (
    <div
      role="group"
      aria-label={t('projects.laneToggle.ariaLabel', {
        current:
          value === 'fast'
            ? t('projects.laneToggle.fast')
            : t('projects.laneToggle.slow'),
      })}
      className={cn('inline-flex flex-col gap-2', className)}
    >
      <button
        type="button"
        role="switch"
        aria-checked={!isFast}
        aria-label={t('projects.laneToggle.ariaLabel', {
          current: isFast ? t('projects.laneToggle.fast') : t('projects.laneToggle.slow'),
        })}
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleToggle();
          }
        }}
        className={cn(
          'relative inline-flex w-full min-w-40 h-11 rounded-xl',
          'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm',
          'border border-slate-200/60 dark:border-slate-700/60',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg',
          'transition-all duration-300 ease-out',
        )}
      >
        <span
          className={cn(
            'absolute top-1 bottom-1 rounded-lg',
            'bg-white dark:bg-dark-surface shadow-sm',
            'border border-slate-200/60 dark:border-slate-600/60',
            'transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]',
            isFast ? 'left-1 right-[50%]' : 'left-[50%] right-1',
          )}
          aria-hidden
        />
        <span
          className={cn(
            'relative z-10 flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-200',
            isFast
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-500 dark:text-slate-400',
          )}
        >
          {t('projects.laneToggle.fast')}
        </span>
        <span
          className={cn(
            'relative z-10 flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-200',
            !isFast
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-500 dark:text-slate-400',
          )}
        >
          {t('projects.laneToggle.slow')}
        </span>
      </button>
      <span ref={liveRef} aria-live="polite" aria-atomic="true" className="sr-only" />
    </div>
  );
}
