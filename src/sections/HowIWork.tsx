import { useTranslation } from 'react-i18next';
import { SectionHeading, ScrollReveal } from '../components';
import { useHowIWorkSteps } from '../content';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';
import { getStaggerDelay } from '../utils/animations';
import { HowIWorkStepCard } from '../components/how-i-work/HowIWorkStepCard';

export function HowIWork() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const howIWorkSteps = useHowIWorkSteps();

  return (
    <section className="section-padding bg-slate-50/50 dark:bg-dark-surface">
      <div className="section-container">
        <ScrollReveal>
          <SectionHeading title={t('howIWork.title')} subtitle="" className="mb-16" />
        </ScrollReveal>

        <div ref={ref} className="max-w-4xl mx-auto relative">
          {/* Timeline central line */}
          <div
            className={cn(
              'absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2',
              'bg-linear-to-b from-primary-300/50 via-primary-400/30 to-transparent',
              'dark:from-primary-500/40 dark:via-primary-600/20 dark:to-transparent',
              'hidden md:block',
            )}
          />

          {/* Mobile line - left aligned */}
          <div
            className={cn(
              'absolute left-4 top-0 bottom-0 w-px',
              'bg-linear-to-b from-primary-300/50 via-primary-400/30 to-transparent',
              'dark:from-primary-500/40 dark:via-primary-600/20 dark:to-transparent',
              'md:hidden',
            )}
          />

          <ul className="relative space-y-16 md:space-y-24">
            {howIWorkSteps.map((step, index) => {
              const isEven = index % 2 === 0;

              return (
                <li
                  key={step.id}
                  className={cn(
                    'relative flex items-center md:items-start gap-4 md:gap-0',
                    'transition-all duration-700 ease-out-quart',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12',
                    // Mobile: always left-aligned with padding for line
                    'pl-12 md:pl-0',
                    // Desktop: alternate sides
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse',
                  )}
                  style={{
                    transitionDelay: isVisible ? `${getStaggerDelay(index)}ms` : '0ms',
                  }}
                >
                  {/* Timeline node - center dot */}
                  <div
                    className={cn(
                      'absolute md:left-1/2 md:-translate-x-1/2',
                      'left-4 -translate-x-1/2',
                      'w-4 h-4 rounded-full',
                      'bg-primary-500 dark:bg-primary-400',
                      'ring-4 ring-slate-50 dark:ring-dark-surface',
                      'shadow-sm z-20',
                      'top-8 md:top-1/2 md:-mt-2', // Adjust based on card height? Actually top-8 aligns with card top roughly
                    )}
                  />

                  {/* Card Container */}
                  <div className="w-full md:w-[calc(50%-3rem)]">
                    <HowIWorkStepCard step={step} index={index} />
                  </div>

                  {/* Spacer for the other side (desktop only) */}
                  <div className="hidden md:block md:w-[calc(50%-3rem)]" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
