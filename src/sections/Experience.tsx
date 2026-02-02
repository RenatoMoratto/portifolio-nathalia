import { SectionHeading } from '../components';
import { experiences } from '../data/portfolio';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

function TimelineItem({
  experience,
  index,
}: {
  experience: (typeof experiences)[0];
  index: number;
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={cn(
        'relative flex items-center transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        'md:justify-center'
      )}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline line - visible on md+ */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

      {/* Content */}
      <div
        className={cn(
          'w-full md:w-5/12',
          isEven ? 'md:pr-12 md:text-right' : 'md:pl-12 md:ml-auto'
        )}
      >
        <div
          className={cn(
            'p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
            'shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20',
            'hover:shadow-xl hover:-translate-y-1 transition-all duration-300',
            'relative'
          )}
        >
          {/* Dot on timeline */}
          <div
            className={cn(
              'hidden md:flex absolute top-8 w-4 h-4 rounded-full bg-primary-500 border-4 border-white dark:border-slate-900',
              'items-center justify-center',
              isEven ? '-right-[2.1rem]' : '-left-[2.1rem]'
            )}
          >
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>

          {/* Period badge */}
          <span className="inline-block px-3 py-1 text-sm font-medium text-primary-500 bg-primary-50 dark:bg-primary-900/30 rounded-full mb-3">
            {experience.period}
          </span>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
            {experience.role}
          </h3>

          <p className="text-primary-500 font-medium mb-3">{experience.company}</p>

          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {experience.description}
          </p>

          <ul className={cn('space-y-2', isEven ? 'md:text-right' : '')}>
            {experience.highlights.map((highlight, i) => (
              <li
                key={i}
                className={cn(
                  'text-sm text-slate-500 dark:text-slate-500 flex items-start gap-2',
                  isEven ? 'md:flex-row-reverse' : ''
                )}
              >
                <svg
                  className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function Experience() {
  return (
    <section id="experience" className="section-padding bg-white dark:bg-dark-bg">
      <div className="section-container">
        <SectionHeading
          title="Experience"
          subtitle="My professional journey and the impact I've made"
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Mobile timeline line */}
          <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-500 to-accent-500" />

          <div className="space-y-8 md:space-y-12">
            {experiences.map((experience, index) => (
              <TimelineItem key={experience.id} experience={experience} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
