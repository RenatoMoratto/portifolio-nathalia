import { useTranslation } from 'react-i18next';
import type { HowIWorkStep } from '../../content';
import { cn } from '../../utils/cn';
import { RichText } from '../RichText';

interface HowIWorkStepFrontProps {
  step: HowIWorkStep;
  index: number;
  hidden: boolean;
}

export function HowIWorkStepFront({ step, index, hidden }: HowIWorkStepFrontProps) {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      className={cn(
        'w-full h-full backface-hidden',
        'col-start-1 row-start-1',
        'flex flex-col p-6 md:p-8',
        'bg-white dark:bg-dark-surface-elevated',
        'border border-light-border dark:border-dark-border',
        'rounded-2xl shadow-sm',
        'justify-between',
      )}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <span
            className={cn(
              'flex items-center justify-center w-10 h-10 shrink-0',
              'rounded-full text-base font-bold',
              'bg-primary-100 dark:bg-primary-900/30',
              'text-primary-600 dark:text-primary-400',
            )}
          >
            {index + 1}
          </span>

          <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-slate-100 font-display">
            {step.title}
          </h3>
        </div>

        <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed min-h-18">
          <RichText text={step.description} />
        </p>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800 flex items-center justify-end text-primary-600 dark:text-primary-400 opacity-80">
        <span className="sr-only hidden md:inline">{t('howIWork.card.revealHover')}</span>
        <span className="sr-only md:hidden">{t('howIWork.card.revealTap')}</span>
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
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
