import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { SectionHeading, Card } from '../components';
import { getAllProjects } from '../data/projects';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';
import { getProjectSharedLayoutIds, premiumEasing } from '../utils/projectMotion';

export function Projects() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const projects = getAllProjects();
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="projects"
      className="section-padding bg-slate-200/50 dark:bg-slate-900/30 relative shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] dark:shadow-none"
    >
      <div className="section-container">
        <SectionHeading
          title={t('nav.projects')}
          subtitle={projects.length > 0 ? '' : t('projects.comingSoon')}
        />

        {projects.length > 0 && (
          <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {projects.map((project, index) => {
              const { imageLayoutId, titleLayoutId } = getProjectSharedLayoutIds(
                project.slug,
                {
                  hasCoverImage: Boolean(project.coverImage),
                  reduceMotion: !!shouldReduceMotion,
                }
              );

              return (
                <Link
                  key={project.slug}
                  to={`/projects/${project.slug}`}
                  aria-label={`${project.title}: ${project.shortDescription}`}
                  className={cn(
                    'block h-full',
                    'transition-all duration-700 ease-out-expo',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg rounded-2xl',
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  )}
                  style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                >
                  <Card
                    className={cn(
                      'h-full group',
                      'hover:border-primary-500/30 dark:hover:border-primary-500/20'
                    )}
                  >
                    {/* Cover image or placeholder */}
                    {project.coverImage ? (
                      <motion.div
                        layoutId={imageLayoutId}
                        transition={{
                          layout: {
                            duration: 0.6,
                            ease: premiumEasing,
                          },
                        }}
                        className="h-48 w-full rounded-xl mb-5 overflow-hidden"
                      >
                        <img
                          src={project.coverImage}
                          alt={`Cover: ${project.title}`}
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                    ) : (
                      <div className="h-48 bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl mb-5 flex items-center justify-center overflow-hidden">
                        <span className="text-slate-400 dark:text-slate-500 text-sm font-medium">
                          {project.title}
                        </span>
                      </div>
                    )}

                    {/* Content */}
                    <motion.h3
                      layoutId={titleLayoutId}
                      transition={{
                        layout: {
                          duration: 0.45,
                          ease: premiumEasing,
                        },
                      }}
                      className="text-xl font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-300"
                    >
                      {project.title}
                    </motion.h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
