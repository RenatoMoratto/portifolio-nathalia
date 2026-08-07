import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useProjects, type ProjectSection } from '../content';
import {
  ProjectMetadataDashboard,
  ProjectSectionNav,
  type LaneType,
} from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';
import { getProjectSharedLayoutIds } from '../utils/projectMotion';
import { premiumEasing } from '../utils/animations';

function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function ProjectSectionBlock({ section }: { section: ProjectSection }) {
  const id = slugifyHeading(section.heading);
  return (
    <section id={id} className="mb-16 scroll-mt-24">
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

function LaneContent({
  sections,
  laneType,
}: {
  sections: ProjectSection[];
  laneType: LaneType;
}) {
  const validSections = sections.filter(
    (section) => section.content && section.content.length > 0,
  );

  if (validSections.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
        No content available for this lane.
      </div>
    );
  }

  return (
    <motion.div
      key={laneType}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {validSections.map((section, idx) => (
        <ProjectSectionBlock key={`${laneType}-${idx}`} section={section} />
      ))}
    </motion.div>
  );
}

export function ProjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const projects = useProjects();
  const project = projects.find((p) => p.slug === slug);
  const [lane, setLane] = useState<LaneType>('fast');
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const scrollToSectionRef = useRef<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const currentSections =
    project === undefined
      ? undefined
      : lane === 'fast'
        ? project.fastLane
        : project.slowLane;

  const handleLaneChange = (newLane: LaneType) => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]');
    const stickyBottom = 100;
    for (let i = 0; i < sections.length; i++) {
      const el = sections[i];
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
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ block: 'start', behavior: 'smooth' });
        }
      });
    });
  }, [lane, currentSections]);

  if (!project) {
    return (
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 text-center">
        <h1 className="heading-2 text-slate-900 dark:text-white mb-4">
          Project not found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The project you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    );
  }

  const { imageLayoutId, titleLayoutId } = getProjectSharedLayoutIds(project.slug, {
    hasCoverImage: Boolean(project.coverImage),
    reduceMotion: !!shouldReduceMotion,
  });

  return (
    <motion.main
      className="bg-slate-50/50 dark:bg-dark-surface pt-24 pb-20 px-3 sm:px-4 lg:px-6"
      initial={shouldReduceMotion ? false : { opacity: 0 }}
      animate={shouldReduceMotion ? undefined : { opacity: 1 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
      transition={{
        duration: 0.25,
        ease: [0.22, 1, 0.36, 1], // premium, easeOutExpo-ish
      }}
    >
      <div ref={ref} className="max-w-6xl mx-auto">
        {/* 1 & 2. Project title + Cover image (title overlays darkened cover) */}
        <motion.div
          layoutId={imageLayoutId}
          transition={{
            layout: { duration: 0.6, ease: premiumEasing },
          }}
          className="relative aspect-video rounded-xl overflow-hidden mb-6 bg-slate-900"
        >
          <img
            src={project.coverImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-70"
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-x-0 bottom-0 px-6 py-5 sm:px-8 sm:py-6 bg-linear-to-t from-black/70 via-black/35 to-transparent backdrop-blur-[2px]">
            <motion.h1
              layoutId={titleLayoutId}
              transition={{
                layout: { duration: 0.45, ease: premiumEasing },
              }}
              className="heading-1 text-white"
            >
              {project.title}
            </motion.h1>
          </div>
        </motion.div>

        {/* 3. Project metadata dashboard */}
        <ProjectMetadataDashboard project={project} />

        {/* 4 & 5. Section navigation + lane toggle | Project content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,220px)_1fr] gap-8 lg:gap-12">
          {/* Left: section nav with lane toggle at top */}
          <aside
            className="lg:sticky lg:top-24 lg:self-start"
            aria-label="Project navigation"
          >
            <ProjectSectionNav
              sections={currentSections ?? []}
              lane={lane}
              onLaneChange={handleLaneChange}
            />
          </aside>

          {/* Right: main content - reduced lateral padding */}
          <div
            className={cn(
              'min-w-0',
              'max-w-2xl lg:max-w-none',
              'transition-all duration-700 delay-300',
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            <AnimatePresence mode="wait">
              <LaneContent sections={currentSections ?? []} laneType={lane} />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.main>
  );
}
