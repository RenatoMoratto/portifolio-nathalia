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
    <section className="section-padding bg-light-surface dark:bg-dark-surface">
      <div className="section-container">
        <SectionHeading
          title={t('howIWork.title', 'Como eu trabalho')}
          subtitle=""
          className="mb-16"
        />

        <div ref={ref} className="max-w-4xl mx-auto relative">
          {/* Timeline central line */}
          <div
            className={cn(
              'absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2',
              'bg-gradient-to-b from-primary-300/50 via-primary-400/30 to-transparent',
              'dark:from-primary-500/40 dark:via-primary-600/20 dark:to-transparent',
              'hidden md:block',
            )}
          />

          {/* Mobile line - left aligned */}
          <div
            className={cn(
              'absolute left-4 top-0 bottom-0 w-px',
              'bg-gradient-to-b from-primary-300/50 via-primary-400/30 to-transparent',
              'dark:from-primary-500/40 dark:via-primary-600/20 dark:to-transparent',
              'md:hidden',
            )}
          />

          <ul className="relative space-y-8 md:space-y-12">
            {steps.map((stepKey, index) => {
              const isEven = index % 2 === 0;

              return (
                <li
                  key={index}
                  className={cn(
                    'relative flex items-start gap-4 md:gap-0',
                    'transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]',
                    isVisible ? 'opacity-100' : 'opacity-0',
                    // Mobile: always left-aligned with padding for line
                    'pl-12 md:pl-0',
                    // Desktop: alternate sides
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse',
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                >
                  {/* Timeline node - center dot */}
                  <div
                    className={cn(
                      'absolute md:left-1/2 md:-translate-x-1/2',
                      'left-4 -translate-x-1/2',
                      'w-3 h-3 rounded-full',
                      'bg-primary-400 dark:bg-primary-500',
                      'ring-4 ring-light-surface dark:ring-dark-surface',
                      'transition-all duration-300',
                      'top-2',
                    )}
                  />

                  {/* Content card */}
                  <div
                    className={cn(
                      'md:w-[calc(50%-2rem)] w-full',
                      'p-5 rounded-xl',
                      'bg-white dark:bg-dark-surface-elevated',
                      'border border-light-border dark:border-dark-border',
                      'hover:border-primary-200 dark:hover:border-primary-800/50',
                      'hover:shadow-lg hover:shadow-primary-500/5',
                      'transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]',
                      // Slide animation from alternating sides
                      isVisible
                        ? 'translate-x-0'
                        : isEven
                          ? 'md:-translate-x-4'
                          : 'md:translate-x-4',
                    )}
                  >
                    {/* Step number badge */}
                    <div className="flex items-start gap-4">
                      <span
                        className={cn(
                          'shrink-0 w-8 h-8 flex items-center justify-center',
                          'rounded-full text-sm font-semibold',
                          'bg-primary-100 dark:bg-primary-900/40',
                          'text-primary-600 dark:text-primary-400',
                          'transition-colors duration-300',
                        )}
                      >
                        {index + 1}
                      </span>

                      {/* Step text */}
                      <p className="text-base md:text-lg text-slate-700 dark:text-slate-300 leading-relaxed pt-1">
                        <span dangerouslySetInnerHTML={{ __html: t(stepKey) }} />
                      </p>
                    </div>
                  </div>

                  {/* Spacer for the other side (desktop only) */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
