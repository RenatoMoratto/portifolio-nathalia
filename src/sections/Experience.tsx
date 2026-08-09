import { useState, useRef, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { cubicBezier, useReducedMotion } from 'framer-motion';
import { ListBullet } from '../components';
import { useExperiences } from '../content';
import { cn } from '../utils/cn';
import { formatPeriod } from '../utils/date';
import { ChevronRight } from 'lucide-react';

/**
 * How long a card takes to grow or shrink, and the curve it uses. The rail
 * scroll runs on the same pair so the card growing and the rail travelling read
 * as a single movement rather than two.
 *
 * Keep in sync with the `duration-500 ease-out-quart` on the card wrapper.
 */
const EXPAND_MS = 500;
const EXPAND_EASE = cubicBezier(0.25, 1, 0.5, 1); // --ease-out-quart

/** Scroll offset that puts `card` in the middle of the rail, at its current size. */
function centeredScrollLeft(rail: HTMLElement, card: HTMLElement) {
  return card.offsetLeft - rail.offsetWidth / 2 + card.offsetWidth / 2;
}

/**
 * The card is a `<button>`, whose text the UA stylesheets make unselectable -
 * `select-text` on the card opts back in. Selecting by dragging then still ends
 * in a click on mouseup, which would expand/collapse the card the reader was
 * mid-selection on, so those clicks are ignored.
 */
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

/**
 * The disclosure panel, height-animated by hand.
 *
 * Framer's `height: 'auto'` resolves the target by measuring once, when the
 * animation starts - and at that moment the card is still at its collapsed
 * width, so the details are laid out narrow and therefore tall. The panel grew
 * to that measurement and then snapped down to the real height the instant the
 * width transition finished.
 *
 * Re-measuring the content on every frame tracks the height *down* as the card
 * widens and the text reflows, so the panel arrives at the final height instead
 * of correcting to it. Handing the height back to `auto` at the end keeps later
 * reflows - a language switch, a resize - working on their own.
 */
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

    // Nothing to animate from on the first pass - just adopt the state.
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
      // `content` is clipped by this wrapper, never compressed by it, so its
      // offsetHeight is the natural height at the width of the moment.
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
    // `h-0` is the pre-JS default so the details never flash open on first
    // paint; the inline height set above wins from then on.
    <div id={id} ref={clipRef} className="h-0 overflow-hidden">
      <div
        ref={contentRef}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className={cn(
          'transition-opacity ease-out-quart',
          // Opening, the text waits for the box to have opened up rather than
          // fading in while cramped; closing, it clears out first so the box is
          // never seen shutting on top of readable text.
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
  // Referentially stable per language, and already ordered oldest -> newest.
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

  /* --------------------------------------------
   * CENTRALIZAR CARD
   * ------------------------------------------ */
  /**
   * Expanding a card animates its width for `EXPAND_MS`, which moves the card's
   * own centre for that whole time. A target computed once at click time is
   * therefore only correct for the width the card had *before* it grew, so the
   * card used to slide to that stale spot and then get dragged to its real one
   * by a corrective second centring. Re-reading the geometry every frame keeps
   * the card centred continuously as it grows, in one uninterrupted movement.
   *
   * Driving the frames ourselves also means opting out of the rail's
   * `scroll-smooth`, which would otherwise turn every step into its own
   * competing smooth scroll.
   */
  const centerCard = useCallback(
    (id: number) => {
      const rail = scrollRef.current;
      const card = cardsRef.current.get(id);
      if (!rail || !card) return;

      cancelScroll();

      const from = rail.scrollLeft;
      // Reduced motion still needs a frame: the width transition has not
      // applied yet on the tick the card is clicked, so measuring now would
      // land on the old width.
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

  /* --------------------------------------------
   * SNAP AUTOMÁTICO
   * ------------------------------------------ */
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

  /* --------------------------------------------
   * SNAP
   * ------------------------------------------ */
  const scheduleSnap = useCallback(() => {
    if (snapTimeout.current) window.clearTimeout(snapTimeout.current);

    snapTimeout.current = window.setTimeout(() => {
      snapToClosest();
    }, 180);
  }, [snapToClosest]);

  // Pending work must not outlive the component: it would scroll a detached node.
  useEffect(
    () => () => {
      if (snapTimeout.current) window.clearTimeout(snapTimeout.current);
      cancelScroll();
    },
    [cancelScroll],
  );

  /* --------------------------------------------
   * SCROLL INICIAL NO MAIS RECENTE
   * ------------------------------------------ */
  useEffect(() => {
    if (!scrollRef.current || orderedExperiences.length === 0) return;

    const last = orderedExperiences[orderedExperiences.length - 1];
    // Aguarda o layout com o padding dinâmico para centralizar o último card
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        centerCard(last.id);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [centerCard, orderedExperiences]);

  /* --------------------------------------------
   * CLICK FORA FECHA CARD
   * ------------------------------------------ */
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

  /* --------------------------------------------
   * DRAG HORIZONTAL NATIVO
   * ------------------------------------------ */
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
      // The finger wins over anything still centring a card.
      cancelScroll();

      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.pageX - startX.current;
      // `behavior: instant` because the rail is `scroll-smooth`: a plain
      // `scrollLeft` assignment would ease towards the finger instead of
      // following it.
      el.scrollTo({ left: scrollLeft.current - dx, behavior: 'instant' });
    };

    const onPointerUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      if (expandedId === null) scheduleSnap();
    };

    // A browser-run smooth scroll gets out of the way as soon as the reader
    // scrolls themselves; a hand-driven one has to be told to. Only actual
    // movement counts - a bare touchstart is the beginning of a tap on a card,
    // which is what asked for the centring in the first place.
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

  // Card width is a fraction of the rail, so a resize both moves and resizes
  // every card and leaves the focused one off-centre. Re-centre whichever card
  // is closest now; scheduleSnap already debounces the resize storm.
  useEffect(() => {
    window.addEventListener('resize', scheduleSnap);
    return () => window.removeEventListener('resize', scheduleSnap);
  }, [scheduleSnap]);

  /* --------------------------------------------
   * CENTRALIZA AO ABRIR E AO FECHAR
   * ------------------------------------------ */
  // Collapsing shrinks the card by the same amount expanding grew it, so the
  // card that is closing has to be tracked back to the centre too - otherwise
  // it slides sideways as it shrinks.
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
            {/* Start sentinel */}
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
                    // Must delete on detach, otherwise the map keeps detached
                    // nodes whose offsetLeft is 0 and skews the snap maths.
                    return () => {
                      cardsRef.current.delete(exp.id);
                    };
                  }}
                  className={cn(
                    'shrink-0 transition-[width] duration-500 ease-out-quart relative',
                    // Capped at the rail so an expanded card never grows past
                    // the visible area - on a phone a flat 520px left both
                    // edges cut off once `centerCard` centred it.
                    isExpanded ? 'w-[min(520px,var(--rail-width))]' : 'w-(--rail-card)',
                  )}
                >
                  {/* Timeline node + date */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2',
                        'transition-[background-color,border-color,box-shadow,transform] duration-500 ease-out-quart',
                        isExpanded
                          ? 'bg-primary-500 border-primary-500 scale-125'
                          : 'bg-primary-300 border-primary-400/50',
                        // The role with no end date is the one she holds now:
                        // a halo marks it without needing a second label, since
                        // the period below already reads "... - Present".
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
                      // Padding lives here rather than on an inner box so the
                      // whole card surface is the hit target. `min-h` lines the
                      // collapsed cards up with each other, and `mt-auto` on the
                      // footer keeps the affordance on the bottom edge whatever
                      // the role and company happen to wrap to.
                      'flex flex-col min-h-44 p-5 sm:p-6 border',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      'focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg',
                      // Every property is named: `transition-all` would catch
                      // `width` too and animate the card a second time, a beat
                      // behind the wrapper that actually drives the expansion.
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

                    {/*
                      The details sit above the footer rather than below it, so
                      the affordance stays pinned to the bottom edge in both
                      states instead of jumping up the card as the panel opens.
                    */}
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
                          // Rotated rather than swapped for a down chevron, so
                          // the marker turns with the panel instead of blinking
                          // into a different glyph.
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
            {/* End sentinel */}
            <span ref={timelineEndRef} aria-hidden className="w-px h-full shrink-0" />
          </div>
        </div>
      </div>
    </section>
  );
}
