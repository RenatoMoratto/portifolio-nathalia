import { useTranslation } from 'react-i18next';
import { Card } from '../components';
import { experiences } from '../data/portfolio';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

function ExperienceItem({
  experience,
  index,
  isVisible,
}: {
  experience: (typeof experiences)[0];
  index: number;
  isVisible: boolean;
}) {
  const isEven = index % 2 === 0;

  return (
    <div
      className={cn(
        'relative flex items-start gap-8 md:gap-0 transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        isEven ? 'md:flex-row' : 'md:flex-row-reverse',
      )}
      style={{ transitionDelay: isVisible ? `${(index + 1) * 150}ms` : '0ms' }}
    >
      {/* Timeline Node */}
      <div
        className={cn(
          'absolute left-4 md:left-1/2 -translate-x-1/2 top-8 z-10',
          'w-4 h-4 rounded-full border-4 border-white dark:border-dark-bg transition-all duration-500',
          isVisible
            ? 'bg-primary-500 scale-100'
            : 'bg-slate-200 dark:bg-slate-700 scale-0',
        )}
      />

      {/* Content Card */}
      <div
        className={cn(
          'w-full md:w-[45%] pl-12 md:pl-0',
          isEven ? 'md:pr-12' : 'md:pl-12',
        )}
      >
        <Card
          className={cn(
            'p-6 relative transition-all duration-300',
            'hover:shadow-xl hover:-translate-y-1',
          )}
        >
          {/* Period - Desktop */}
          <div
            className={cn(
              'hidden md:block absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-500 whitespace-nowrap',
              isEven ? 'left-[calc(100%+2.5rem)]' : 'right-[calc(100%+2.5rem)]',
            )}
          >
            {experience.period}
          </div>

          {/* Period - Mobile */}
          <span className="md:hidden inline-block px-3 py-1 text-xs font-semibold text-primary-500 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-3">
            {experience.period}
          </span>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              {experience.role}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium">
              {experience.company}
            </p>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            {experience.description}
          </p>

          <ul className="space-y-3">
            {experience.highlights.map((highlight, i) => (
              <li
                key={i}
                className="text-sm text-slate-500 dark:text-slate-400 flex items-start gap-3"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-600 shrink-0" />
                <span className="leading-relaxed">{highlight}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Spacer for alternating layout */}
      <div className="hidden md:block md:w-[45%]" />
    </div>
  );
}

export function Experience() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="experience" className="mb-24 scroll-mt-24">
      <div ref={ref}>
        <h2 className="heading-2 mb-12 text-slate-900 dark:text-white">
          {t('nav.experience')}
        </h2>

        <div className="relative">
          {/* Timeline Line */}
          <div
            className={cn(
              'absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2',
              'bg-linear-to-b from-primary-200 via-primary-400 to-transparent',
              'dark:from-primary-900/50 dark:via-primary-700/30 dark:to-transparent',
              'transition-all duration-1000 origin-top',
              isVisible ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0',
            )}
          />

          <div className="space-y-12 md:space-y-16">
            {experiences.map((experience, index) => (
              <ExperienceItem
                key={experience.id}
                experience={experience}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
