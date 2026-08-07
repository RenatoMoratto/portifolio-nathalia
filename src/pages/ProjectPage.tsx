import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { getValidSections, useProject } from '../content';
import {
  LaneContent,
  ProjectMetadataDashboard,
  ProjectSectionNav,
  type LaneType,
} from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';
import { getProjectSharedLayoutIds } from '../utils/projectMotion';
import { premiumEasing } from '../utils/animations';

export function ProjectPage() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const project = useProject(slug);
  const [lane, setLane] = useState<LaneType>('fast');
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const scrollToSectionRef = useRef<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Memoized so the section list keeps a stable identity across renders -
  // `ProjectSectionNav` derives its observer keys from it.
  const currentSections = useMemo(
    () =>
      getValidSections((lane === 'fast' ? project?.fastLane : project?.slowLane) ?? []),
    [project, lane],
  );

  /**
   * Remember which section is currently in view so the same one can be restored
   * after the lane swaps out the entire section list.
   */
  const handleLaneChange = (newLane: LaneType) => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const stickyBottom = 100;
    for (const el of sections) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80 && rect.bottom > stickyBottom) {
        scrollToSectionRef.current = el.id;
        break;
      }
    }
    setLane(newLane);
  };

  useEffect(() => {
    const targetId = scrollToSectionRef.current;
    if (!targetId) return;
    scrollToSectionRef.current = null;

    // Two frames: one for React to commit the new lane, one for layout to settle.
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => {
        document
          .getElementById(targetId)
          ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
      });
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [lane]);

  if (!project) {
    return (
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
        <h1 className="heading-2 text-slate-900 dark:text-white mb-4">
          {t('projects.notFound.title')}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          {t('projects.notFound.message')}
        </p>
      </div>
    );
  }

  const { imageLayoutId, titleLayoutId } = getProjectSharedLayoutIds(project.slug, {
    hasCoverImage: Boolean(project.coverImage),
    reduceMotion: !!shouldReduceMotion,
  });

  return (
    <motion.div
      className="bg-slate-50/50 dark:bg-dark-surface pt-24 pb-20 px-3 sm:px-4 lg:px-6"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{ duration: 0.25, ease: premiumEasing }}
    >
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* Project title overlaying the darkened cover */}
        <motion.div
          layoutId={imageLayoutId}
          transition={{ layout: { duration: 0.6, ease: premiumEasing } }}
          className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-slate-900"
        >
          <img
            src={project.coverImage}
            alt=""
            width={1024}
            height={768}
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-x-0 bottom-0 px-6 py-5 sm:px-8 sm:py-6 bg-linear-to-t from-black/70 via-black/35 to-transparent backdrop-blur-[2px]">
            <motion.h1
              layoutId={titleLayoutId}
              transition={{ layout: { duration: 0.45, ease: premiumEasing } }}
              className="heading-1 text-white"
            >
              {project.title}
            </motion.h1>
          </div>
        </motion.div>

        <ProjectMetadataDashboard project={project} />

        {/* Section navigation + lane toggle | project content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,220px)_1fr] gap-8 lg:gap-12">
          {/* The nested <nav> carries its own accessible name. */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ProjectSectionNav
              sections={currentSections}
              lane={lane}
              onLaneChange={handleLaneChange}
            />
          </aside>

          <div
            className={cn(
              'min-w-0',
              'max-w-2xl lg:max-w-none',
              'transition-all duration-700 delay-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            <AnimatePresence mode="wait">
              <LaneContent key={lane} sections={currentSections} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
