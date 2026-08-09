import type { ProjectSection } from '../../content';
import { slugifyHeading } from '../../utils/slug';

interface ProjectSectionBlockProps {
  section: ProjectSection;
}

/** Shares slug generation with navigation and section observation. */
export function ProjectSectionBlock({ section }: ProjectSectionBlockProps) {
  return (
    <section id={slugifyHeading(section.heading)} className="mb-16 scroll-mt-24">
      <h2 className="heading-3 text-slate-900 dark:text-white mb-4">{section.heading}</h2>
      <div className="space-y-4">
        {section.content.map((paragraph, idx) => (
          <p
            key={idx}
            className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
