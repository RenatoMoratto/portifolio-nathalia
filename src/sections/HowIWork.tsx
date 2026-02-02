import { useTranslation } from 'react-i18next';
import { SectionHeading } from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

export function HowIWork() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  const steps = [
    'howIWork.step1',
    'howIWork.step2',
    'howIWork.step3',
    'howIWork.step4',
    'howIWork.step5',
    'howIWork.step6',
  ];

  return (
    <section className="section-padding bg-white dark:bg-dark-bg">
      <div className="section-container">
        <SectionHeading
          title={t('howIWork.title', 'Como eu trabalho')}
          subtitle=""
          className="mb-12"
        />

        <div ref={ref} className="max-w-3xl mx-auto">
          <ul className="space-y-4">
            {steps.map((stepKey, index) => (
              <li
                key={index}
                className={cn(
                  'group flex gap-4 p-5 rounded-xl',
                  'border border-transparent',
                  'hover:bg-slate-50 dark:hover:bg-slate-800/30',
                  'hover:border-slate-100 dark:hover:border-slate-800',
                  'transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4',
                )}
                style={{ transitionDelay: isVisible ? `${index * 75}ms` : '0ms' }}
              >
                {/* Number badge */}
                <span
                  className={cn(
                    'shrink-0 w-7 h-7 flex items-center justify-center',
                    'rounded-full text-sm font-semibold',
                    'bg-primary-100 dark:bg-primary-900/40',
                    'text-primary-600 dark:text-primary-400',
                    'group-hover:bg-primary-500 group-hover:text-white',
                    'dark:group-hover:bg-primary-500',
                    'transition-colors duration-300',
                  )}
                >
                  {index + 1}
                </span>

                {/* Step text */}
                <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed pt-0.5">
                  <span dangerouslySetInnerHTML={{ __html: t(stepKey) }} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
