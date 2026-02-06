import { cn } from '../utils/cn';
import { useTranslation } from 'react-i18next';
import { Zap, BookOpen } from 'lucide-react';

export type LaneType = 'fast' | 'slow';

interface LaneToggleProps {
  value: LaneType;
  onChange: (lane: LaneType) => void;
  className?: string;
}

export function LaneToggle({ value, onChange, className }: LaneToggleProps) {
  const { t } = useTranslation();

  return (
    <div
      role="radiogroup"
      aria-label={t('projects.laneToggle.ariaLabel', {
        current:
          value === 'fast'
            ? t('projects.laneToggle.fast')
            : t('projects.laneToggle.slow'),
      })}
      className={cn(
        'inline-flex p-1 rounded-xl',
        'bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-sm',
        'border border-slate-200/60 dark:border-slate-700/60',
        'shadow-sm',
        className
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={value === 'fast'}
        aria-label={t('projects.laneToggle.fast')}
        onClick={() => onChange('fast')}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg',
          value === 'fast'
            ? 'bg-white dark:bg-dark-surface text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        )}
      >
        <Zap className="w-4 h-4 shrink-0" aria-hidden />
        <span>{t('projects.laneToggle.fast')}</span>
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={value === 'slow'}
        aria-label={t('projects.laneToggle.slow')}
        onClick={() => onChange('slow')}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg',
          value === 'slow'
            ? 'bg-white dark:bg-dark-surface text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
        )}
      >
        <BookOpen className="w-4 h-4 shrink-0" aria-hidden />
        <span>{t('projects.laneToggle.slow')}</span>
      </button>
    </div>
  );
}
