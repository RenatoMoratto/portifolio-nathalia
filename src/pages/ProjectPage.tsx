import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProjectBySlug, type ProjectSection } from '../data/projects';
import { LaneToggle, type LaneType } from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

function ProjectSectionBlock({ section }: { section: ProjectSection }) {
  const id = slugifyHeading(section.heading);
  return (
    <section id={id} className="mb-16 scroll-mt-40">
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
  // Filter out sections with no content
  const validSections = sections.filter(
    (section) => section.content && section.content.length > 0
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
  const project = slug ? getProjectBySlug(slug) : undefined;
  const [lane, setLane] = useState<LaneType>('fast');
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();
  const titleRef = useRef<HTMLDivElement>(null);
  const [showTitleInSticky, setShowTitleInSticky] = useState(false);
  const scrollToSectionRef = useRef<string | null>(null);

  const currentSections =
    project === undefined
      ? undefined
      : lane === 'fast'
      ? project.fastLane
      : project.slowLane;

  // 1) Sticky title: show when title area has scrolled past the top (observe a persistent wrapper)
  const updateStickyTitle = () => {
    const el = titleRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setShowTitleInSticky(rect.bottom < 100);
  };

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    updateStickyTitle();
    const observer = new IntersectionObserver(
      ([entry]) => setShowTitleInSticky(!entry.isIntersecting),
      { root: null, rootMargin: '-100px 0px 0px 0px', threshold: 0 }
    );
    observer.observe(el);
    window.addEventListener('scroll', updateStickyTitle, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateStickyTitle);
    };
  }, [project?.title]);

  // 2) On lane change: find current section (first one in view below sticky), then scroll to same id in new lane
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
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="heading-2 text-slate-900 dark:text-white mb-4">
          Project not found
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The project you're looking for doesn't exist.
        </p>
      </div>
    );
  }

  const PAGE_MAX_WIDTH = 'max-w-3xl';

  return (
    <article className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div ref={ref} className={cn('max-w-6xl mx-auto', PAGE_MAX_WIDTH)}>
        {/* Cover image (when available) */}
        {project.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={project.coverImage}
              alt=""
              className="w-full aspect-video object-cover"
            />
          </div>
        )}

        {/* Title: h1 when in view; sticky span when scrolled. No shared layoutId to avoid collapse on return. */}
        <div ref={titleRef} className="min-h-18 mb-6">
          {!showTitleInSticky ? (
            <motion.h1
              key="title-main"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={cn(
                'heading-1 text-slate-900 dark:text-white',
                'transition-all duration-700 delay-100',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              )}
            >
              {project.title}
            </motion.h1>
          ) : (
            <span
              className="heading-1 text-transparent select-none pointer-events-none block min-h-18"
              aria-hidden
            >
              {project.title}
            </span>
          )}
        </div>

        {/* Sticky lane switcher — no border-top; title only when scrolled past h1 */}
        <div
          className={cn(
            'sticky top-16 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-3 mb-8',
            'bg-light-bg/95 dark:bg-dark-bg/95 backdrop-blur-md',
            'border-b border-slate-200/50 dark:border-slate-700/50',
            'transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-4 mx-auto',
              PAGE_MAX_WIDTH
            )}
          >
            <div
              className="min-w-0 min-h-6 flex items-center flex-1"
              style={{ minHeight: showTitleInSticky ? '1.5rem' : undefined }}
            >
              <AnimatePresence mode="wait">
                {showTitleInSticky && (
                  <motion.span
                    key="title-sticky"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate block"
                  >
                    {project.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <LaneToggle value={lane} onChange={handleLaneChange} />
          </div>
        </div>

        {/* Lane content */}
        <div
          className={cn(
            'transition-all duration-700 delay-300',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          )}
        >
          <AnimatePresence mode="wait">
            <LaneContent sections={currentSections ?? []} laneType={lane} />
          </AnimatePresence>
        </div>
      </div>
    </article>
  );
}
