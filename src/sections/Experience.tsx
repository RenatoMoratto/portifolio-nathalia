import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cubicBezier, useReducedMotion } from 'framer-motion';
import { ListBullet } from '../components';
import { useExperiences } from '../content';
import { cn } from '../utils/cn';
import { formatPeriod } from '../utils/date';
import { ChevronRight } from 'lucide-react';

// Keep in sync with the card wrapper's width transition.
const EXPAND_MS = 500;
const EXPAND_EASE = cubicBezier(0.25, 1, 0.5, 1);

function centeredScrollLeft(rail: HTMLElement, card: HTMLElement) {
  return card.offsetLeft - rail.offsetWidth / 2 + card.offsetWidth / 2;
}

function hasSelectionInside(card: HTMLElement) {
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return false;

  return card.contains(selection.anchorNode) && card.contains(selection.focusNode);
}

interface ExperienceDetailsProps {
  id: string;
  isOpen: boolean;
  children: React.ReactNode;
}

// Re-measure during width changes so text reflow does not snap the panel height.
function ExperienceDetails({ id, isOpen, children }: ExperienceDetailsProps) {
  const shouldReduceMotion = useReducedMotion();
  const clipRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number | null>(null);
  const isFirstRun = useRef(true);

  useEffect(() => {
    const clip = clipRef.current;
    const content = contentRef.current;
    if (!clip || !content) return;

    if (isFirstRun.current) {
      isFirstRun.current = false;
      clip.style.height = isOpen ? 'auto' : '0px';
      return;
    }

    const from = clip.offsetHeight;
    const duration = shouldReduceMotion ? 0 : EXPAND_MS;
    const start = performance.now();

    const step = (now: number) => {
      const progress = duration === 0 ? 1 : Math.min((now - start) / duration, 1);
      const to = isOpen ? content.offsetHeight : 0;

      clip.style.height = `${from + (to - from) * EXPAND_EASE(progress)}px`;

      if (progress < 1) {
        frame.current = requestAnimationFrame(step);
        return;
      }

      frame.current = null;
      clip.style.height = isOpen ? 'auto' : '0px';
    };

    frame.current = requestAnimationFrame(step);

    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = null;
    };
  }, [isOpen, shouldReduceMotion]);

  return (
    // Prevent details flashing open before the effect runs.
    <div id={id} ref={clipRef} className="h-0 overflow-hidden">
      <div
        ref={contentRef}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          'transition-opacity ease-out-quart',
          // Keep text hidden while the panel is cramped.
          isOpen ? 'opacity-100 duration-300 delay-150' : 'opacity-0 duration-150',
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function Experience() {
  const { t, i18n } = useTranslation();
  const shouldReduceMotion = useReducedMotion();
  // Stable per language and ordered oldest first.
  const orderedExperiences = useExperiences();
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const timelineWrapperRef = useRef<HTMLDivElement | null>(null);
  const timelineStartRef = useRef<HTMLSpanElement | null>(null);
  const timelineEndRef = useRef<HTMLSpanElement | null>(null);
  const cardsRef = useRef<Map<number, HTMLDivElement>>(new Map());

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const snapTimeout = useRef<number | null>(null);
  const scrollFrame = useRef<number | null>(null);

  const cancelScroll = useCallback(() => {
    if (scrollFrame.current !== null) {
      cancelAnimationFrame(scrollFrame.current);
      scrollFrame.current = null;
    }
  }, []);

  // Track changing card width so centering remains a single motion.
  const centerCard = useCallback(
    (id: number) => {
      const rail = scrollRef.current;
      const card = cardsRef.current.get(id);
      if (!rail || !card) return;

      cancelScroll();

      const from = rail.scrollLeft;
      // Wait one frame for the new width before measuring.
      const duration = shouldReduceMotion ? 0 : EXPAND_MS;
      const start = performance.now();

      const step = (now: number) => {
        const elapsed = now - start;
        const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
        const to = centeredScrollLeft(rail, card);

        rail.scrollTo({
          left: from + (to - from) * EXPAND_EASE(progress),
          behavior: 'instant',
        });

        scrollFrame.current = progress < 1 ? requestAnimationFrame(step) : null;
      };

      scrollFrame.current = requestAnimationFrame(step);
    },
    [cancelScroll, shouldReduceMotion],
  );

  const snapToClosest = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const containerCenter = el.scrollLeft + el.offsetWidth / 2;

    let closestId: number | null = null;
    let minDistance = Infinity;

    cardsRef.current.forEach((card, id) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(containerCenter - cardCenter);

      if (dist < minDistance) {
        minDistance = dist;
        closestId = id;
      }
    });

    if (closestId !== null) {
      centerCard(closestId);
    }
  }, [centerCard]);

  const scheduleSnap = useCallback(() => {
    if (snapTimeout.current) window.clearTimeout(snapTimeout.current);

    snapTimeout.current = window.setTimeout(() => {
      snapToClosest();
    }, 180);
  }, [snapToClosest]);

  useEffect(
    () => () => {
      if (snapTimeout.current) window.clearTimeout(snapTimeout.current);
      cancelScroll();
    },
    [cancelScroll],
  );

  useEffect(() => {
    if (!scrollRef.current || orderedExperiences.length === 0) return;

    const last = orderedExperiences[orderedExperiences.length - 1];
    // Wait for layout before centering the latest card.
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerCard(last.id);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [centerCard, orderedExperiences]);

  useEffect(() => {
    if (expandedId === null) return;

    const onClickOutside = (e: MouseEvent) => {
      const card = cardsRef.current.get(expandedId);
      if (card && !card.contains(e.target as Node)) {
        setExpandedId(null);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [expandedId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-card]')) return;

      isDragging.current = true;
      startX.current = e.pageX;
      scrollLeft.current = el.scrollLeft;

      if (snapTimeout.current) {
        clearTimeout(snapTimeout.current);
        snapTimeout.current = null;
      }
      cancelScroll();

      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.pageX - startX.current;
      el.scrollTo({ left: scrollLeft.current - dx, behavior: 'instant' });
    };

    const onPointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (expandedId === null) scheduleSnap();
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointerleave', onPointerUp);
    el.addEventListener('wheel', cancelScroll, { passive: true });
    el.addEventListener('touchmove', cancelScroll, { passive: true });

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointerleave', onPointerUp);
      el.removeEventListener('wheel', cancelScroll);
      el.removeEventListener('touchmove', cancelScroll);
    };
  }, [cancelScroll, expandedId, scheduleSnap]);

  // Recenter after responsive card widths change.
  useEffect(() => {
    window.addEventListener('resize', scheduleSnap);
    return () => window.removeEventListener('resize', scheduleSnap);
  }, [scheduleSnap]);

  // Keep the opening or closing card centered during its width transition.
  const previousExpandedId = useRef<number | null>(null);
  useEffect(() => {
    const target = expandedId ?? previousExpandedId.current;
    previousExpandedId.current = expandedId;

    if (target === null) return;
    centerCard(target);
  }, [centerCard, expandedId]);

  useEffect(() => {
    const wrapper = timelineWrapperRef.current;
    const scroller = scrollRef.current;
    const start = timelineStartRef.current;
    const end = timelineEndRef.current;

    if (!wrapper || !scroller || !start || !end) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.target === start) {
            wrapper.toggleAttribute('data-start', entry.isIntersecting);
          }

          if (entry.target === end) {
            wrapper.toggleAttribute('data-end', entry.isIntersecting);
          }
        }
      },
      {
        root: scroller,
        threshold: 1,
      },
    );

    observer.observe(start);
    observer.observe(end);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience">
      <div className="pt-20 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="heading-2 text-slate-900 dark:text-white mb-16">
          {t('nav.experience')}
        </h2>

        <div ref={timelineWrapperRef} className="relative overflow-hidden">
          <div
            className="
              absolute top-10 left-0 right-0 h-px
              bg-primary-400/50
              [--fade:30%]
              timeline
            "
          />

          <div
            ref={scrollRef}
            className="
              timeline-rail
              flex
              overflow-x-auto
              overscroll-x-contain
              scroll-smooth
              pt-20 pb-32
              -mx-4 sm:-mx-6 lg:-mx-8
              cursor-grab active:cursor-grabbing
              scrollbar-hide
            "
          >
            <span ref={timelineStartRef} aria-hidden className="w-px h-full shrink-0" />
            {orderedExperiences.map((exp) => {
              const isExpanded = expandedId === exp.id;
              const isCurrent = !exp.endDate;

              return (
                <div
                  key={exp.id}
                  ref={(el) => {
                    if (!el) return;
                    cardsRef.current.set(exp.id, el);
                    // Avoid detached nodes skewing snap calculations.
                    return () => {
                      cardsRef.current.delete(exp.id);
                    };
                  }}
                  className={cn(
                    'shrink-0 transition-[width] duration-500 ease-out-quart relative',
                    // Keep expanded cards within the rail.
                    isExpanded ? 'w-[min(520px,var(--rail-width))]' : 'w-(--rail-card)',
                  )}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2',
                        'transition-[background-color,border-color,box-shadow,transform] duration-500 ease-out-quart',
                        isExpanded
                          ? 'bg-primary-500 border-primary-500 scale-125'
                          : 'bg-primary-300 border-primary-400/50',
                        isCurrent && 'ring-4 ring-primary-500/15',
                      )}
                    />
                    <span
                      className={cn(
                        'mt-2 text-xs font-semibold whitespace-nowrap',
                        'transition-colors duration-500 ease-out-quart',
                        isExpanded
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-primary-500/80',
                      )}
                    >
                      {formatPeriod(
                        exp.startDate,
                        exp.endDate,
                        i18n.language,
                        t('experience.present'),
                      )}
                    </span>
                  </div>

                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={(e) => {
                      if (hasSelectionInside(e.currentTarget)) return;
                      setExpandedId(isExpanded ? null : exp.id);
                    }}
                    data-card
                    aria-expanded={isExpanded}
                    aria-controls={`experience-details-${exp.id}`}
                    className={cn(
                      'group w-full text-left rounded-2xl select-text cursor-pointer',
                      'flex flex-col min-h-44 p-5 sm:p-6 border',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      'focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg',
                      // Exclude width, which the wrapper animates.
                      'transition-[background-color,border-color,box-shadow,transform] duration-500 ease-out-quart',
                      isExpanded
                        ? [
                            'bg-white dark:bg-dark-surface-elevated',
                            'border-primary-200 dark:border-primary-500/30',
                            'shadow-xl shadow-slate-900/10 dark:shadow-black/40',
                          ]
                        : [
                            'bg-white dark:bg-dark-surface',
                            'border-light-border dark:border-dark-border',
                            'shadow-sm',
                            'hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-900/5',
                            'dark:hover:shadow-black/30',
                            'hover:border-primary-200 dark:hover:border-primary-500/30',
                          ],
                    )}
                  >
                    <h3 className="heading-3 text-slate-900 dark:text-slate-100">
                      {exp.role}
                    </h3>

                    <p className="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                      {exp.company}
                    </p>

                    {/* Keep the disclosure affordance at the card's bottom. */}
                    <ExperienceDetails
                      id={`experience-details-${exp.id}`}
                      isOpen={isExpanded}
                    >
                      <div className="mt-5 pt-5 border-t border-light-border dark:border-dark-border">
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                          {exp.description}
                        </p>

                        <ul className="mt-5 space-y-3">
                          {exp.highlights.map((h, i) => (
                            <li
                              key={i}
                              className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed"
                            >
                              <ListBullet className="mt-2" />
                              <span>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </ExperienceDetails>

                    <div
                      className={cn(
                        'mt-auto pt-5 flex items-center gap-1.5',
                        'text-xs font-semibold',
                        'text-primary-600 dark:text-primary-400',
                        'transition-opacity duration-500 ease-out-quart',
                        !isExpanded && 'opacity-70 group-hover:opacity-100',
                      )}
                    >
                      <ChevronRight
                        size={14}
                        aria-hidden="true"
                        className={cn(
                          'transition-transform duration-500 ease-out-quart',
                          isExpanded && 'rotate-90',
                        )}
                      />
                      <span>
                        {isExpanded
                          ? t('experience.showLess')
                          : t('experience.showDetails')}
                      </span>
                    </div>
                  </button>
                </div>
              );
            })}
            <span ref={timelineEndRef} aria-hidden className="w-px h-full shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
