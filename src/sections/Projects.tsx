import { Link } from 'react-router-dom';
import { SectionHeading, Card } from '../components';
import { projects } from '../data/portfolio';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

export function Projects() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section
      id="projects"
      className="section-padding bg-slate-200/50 dark:bg-slate-900/30 relative shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none"
    >
      <div className="section-container">
        <SectionHeading title={t('nav.projects')} subtitle="Coming soon" />

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className={cn(
                'block h-full',
                'transition-all duration-700 ease-out-expo',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
              )}
              style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
            >
              <Card
                className={cn(
                  'h-full group',
                  'hover:border-primary-500/30 dark:hover:border-primary-500/20',
                )}
              >
                {/* Image placeholder */}
                <div className="h-48 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                  <span className="text-slate-400 dark:text-slate-500 text-sm">
                    Project Image Placeholder
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300">
                  {project.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {project.description}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
