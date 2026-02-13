import { useTranslation } from 'react-i18next';
import type { HowIWorkStep } from '../../data/howIWorkSteps';
import { cn } from '../../utils/cn';

interface HowIWorkStepFrontProps {
  step: HowIWorkStep;
  index: number;
}

export function HowIWorkStepFront({ step, index }: HowIWorkStepFrontProps) {
  const { t } = useTranslation();

  return (
    <div
      className={cn(
        'absolute inset-0 w-full h-full backface-hidden',
        'flex flex-col p-6 md:p-8',
        'bg-white dark:bg-dark-surface-elevated',
        'border border-light-border dark:border-dark-border',
        'rounded-2xl shadow-sm',
        'justify-between',
      )}
    >
      {/* Number and Header */}
      <div className="flex items-start justify-between">
        <span
          className={cn(
            'flex items-center justify-center w-10 h-10',
            'rounded-full text-base font-bold',
            'bg-primary-100 dark:bg-primary-900/30',
            'text-primary-600 dark:text-primary-400',
          )}
        >
          {index + 1}
        </span>

        {/* Decorative element or verified icon could go here */}
        <div className="w-2 h-2 rounded-full bg-primary-400/20" />
      </div>

      {/* Content */}
      <div className="mt-6 space-y-3">
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
          {t(`${step.translationKey}.title`)}
        </h3>

        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed min-h-[4.5rem]">
          <span
            dangerouslySetInnerHTML={{
              __html: t(`${step.translationKey}.description`),
            }}
          />
        </p>
      </div>

      {/* Action hint */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-medium opacity-80">
        <span className="hidden md:inline">Hover to reveal</span>
        <span className="md:hidden">Tap to reveal</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          />
        </svg>
      </div>
    </div>
  );
}
