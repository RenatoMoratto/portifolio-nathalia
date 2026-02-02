import { Link } from 'react-router-dom';
import { SectionHeading, Card } from '../components';
import { projects } from '../data/portfolio';
import { useTranslation } from 'react-i18next';

export function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="section-padding bg-slate-50 dark:bg-slate-900/50">
      <div className="section-container">
        <SectionHeading title={t('nav.projects')} subtitle="Coming soon" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/projects/${project.id}`}
              className="block h-full"
            >
              <Card className="h-full group hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                  {/* Placeholder Image */}
                  <span>Project Image Placeholder</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">
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
