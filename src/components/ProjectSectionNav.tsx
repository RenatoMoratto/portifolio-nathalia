import { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { LaneToggle, type LaneType } from './LaneToggle';
import { useActiveSection } from '../hooks/useActiveSection';
import { slugifyHeading } from '../utils/slug';
import type { ProjectSection } from '../content';

interface ProjectSectionNavProps {
  /** Already filtered to sections that have content. */
  sections: ProjectSection[];
  lane: LaneType;
  onLaneChange: (lane: LaneType) => void;
  className?: string;
}

export function ProjectSectionNav({
  sections,
  lane,
  onLaneChange,
  className,
}: ProjectSectionNavProps) {
  const { t } = useTranslation();
  const validSections = sections;
  const sectionIds = useMemo(
    () => validSections.map((s) => slugifyHeading(s.heading)),
    [validSections],
  );
  const activeId = useActiveSection(sectionIds);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }
  }, []);

  return (
    <nav
      className={cn('flex flex-col gap-6', className)}
      aria-label={t('projectNav.aria.sections')}
    >
      <div>
        <LaneToggle value={lane} onChange={onLaneChange} />
      </div>

      {validSections.length > 0 && (
        <ol
          role="list"
          className="flex flex-col gap-1"
          aria-label={t('projectNav.aria.nav')}
        >
          {validSections.map((section, idx) => {
            const id = slugifyHeading(section.heading);
            const isActive = activeId === id;

            return (
              <li key={id} role="listitem">
                <button
                  type="button"
                  onClick={() => scrollToSection(id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToSection(id);
                    }
                    // Arrow key navigation
                    if (e.key === 'ArrowDown' && idx < validSections.length - 1) {
                      e.preventDefault();
                      document
                        .getElementById(
                          `nav-${slugifyHeading(validSections[idx + 1].heading)}`,
                        )
                        ?.focus();
                    }
                    if (e.key === 'ArrowUp' && idx > 0) {
                      e.preventDefault();
                      document
                        .getElementById(
                          `nav-${slugifyHeading(validSections[idx - 1].heading)}`,
                        )
                        ?.focus();
                    }
                  }}
                  id={`nav-${id}`}
                  aria-current={isActive ? 'location' : undefined}
                  className={cn(
                    'w-full text-left text-sm font-medium py-2 px-3 -mx-3 rounded-lg',
                    'transition-all duration-200 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-dark-bg',
                    'hover:bg-slate-100/80 dark:hover:bg-slate-800/60',
                    'hover:translate-x-0.5 hover:text-slate-900 dark:hover:text-slate-100',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/20'
                      : 'text-slate-600 dark:text-slate-400',
                  )}
                >
                  <motion.span
                    className="inline-block"
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.2 }}
                  >
                    {section.heading}
                  </motion.span>
                </button>
              </li>
            );
          })}
        </ol>
      )}
    </nav>
  );
}
