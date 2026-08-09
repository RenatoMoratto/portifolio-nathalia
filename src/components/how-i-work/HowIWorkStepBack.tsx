import { useTranslation } from 'react-i18next';
import type { HowIWorkStep } from '../../content';
import { cn } from '../../utils/cn';

interface HowIWorkStepBackProps {
  step: HowIWorkStep;
  hidden: boolean;
}

export function HowIWorkStepBack({ step, hidden }: HowIWorkStepBackProps) {
  const { t } = useTranslation();

  return (
    <div
      aria-hidden={hidden}
      inert={hidden}
      className={cn(
        'w-full h-full backface-hidden rotate-y-180',
        'col-start-1 row-start-1',
        'flex flex-col p-6 md:p-8',
        'bg-slate-900 dark:bg-primary-950',
        'border border-slate-800 dark:border-primary-900',
        'rounded-2xl shadow-xl',
        'text-white',
      )}
    >
      <div className="space-y-6 h-full flex flex-col justify-center">
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-primary-400 mb-3">
            {t('howIWork.card.tools')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {step.tools.map((tool) => (
              <span
                key={tool}
                className="px-2 py-1 rounded-md bg-white/10 text-xs text-slate-200 border border-white/5"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-primary-400 mb-3">
            {t('howIWork.card.practices')}
          </h4>
          <ul className="space-y-2">
            {step.practices.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span
                  className="mt-1.5 w-1 h-1 rounded-full bg-primary-500 shrink-0"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
