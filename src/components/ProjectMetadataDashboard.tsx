import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import type { Project } from '../content';

interface ProjectMetadataDashboardProps {
  project: Project;
  className?: string;
}

export function ProjectMetadataDashboard({
  project,
  className,
}: ProjectMetadataDashboardProps) {
  const { t } = useTranslation();
  const { role, platform, designTools } = project;

  const items: { term: string; value: string }[] = [];
  if (role) items.push({ term: t('projects.metadata.role'), value: role });
  if (platform) items.push({ term: t('projects.metadata.platform'), value: platform });
  if (designTools)
    items.push({ term: t('projects.metadata.designTools'), value: designTools });

  if (items.length === 0) return null;

  return (
    <dl
      className={cn(
        'grid gap-x-6 gap-y-3 py-6',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
        'border-y border-slate-200/60 dark:border-slate-700/60',
        className,
      )}
    >
      {items.map(({ term, value }) => (
        <div key={term} className="flex flex-col gap-1">
          <dt className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {term}
          </dt>
          <dd className="text-sm font-medium text-slate-800 dark:text-slate-200">
            {value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
