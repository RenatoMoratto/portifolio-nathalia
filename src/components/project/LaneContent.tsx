import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { ProjectSection } from '../../content';
import { slugifyHeading } from '../../utils/slug';
import { ProjectSectionBlock } from './ProjectSectionBlock';

interface LaneContentProps {
  /** Already filtered to sections that have content. */
  sections: ProjectSection[];
}

/** Must remain a keyed direct child of `AnimatePresence` for exit transitions. */
export function LaneContent({ sections }: LaneContentProps) {
  const { t } = useTranslation();

  if (sections.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        {t('projects.emptyLane')}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {sections.map((section) => (
        <ProjectSectionBlock key={slugifyHeading(section.heading)} section={section} />
      ))}
    </motion.div>
  );
}
