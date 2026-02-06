import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components';
import { experiences } from '../data/portfolio';
import { cn } from '../utils/cn';
import { ChevronRight, ChevronDown } from 'lucide-react';

const CARD_WIDTH = 320;
const HALF_CARD = CARD_WIDTH / 2;

/* --------------------------------------------
 * HELPERS
 * ------------------------------------------ */
const formatPeriod = (startDate: string, endDate?: string) => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  });

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  return `${formatter.format(start)} – ${end ? formatter.format(end) : 'Present'}`;
};

export function Experience() {
  const { t } = useTranslation();
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

  /* --------------------------------------------
   * ORDENAR EXPERIÊNCIAS (antigas → recentes)
   * ------------------------------------------ */
  const orderedExperiences = useMemo(() => {
    return [...experiences].sort((a, b) => {
      const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity;
      const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity;

      return aEnd - bEnd;
    });
  }, []);

  /* --------------------------------------------
   * CENTRALIZAR CARD
   * ------------------------------------------ */
  const centerCard = useCallback(
    (id: number) => {
      const el = scrollRef.current;
      const card = cardsRef.current.get(id);
      if (!el || !card) return;

      const left = card.offsetLeft - el.offsetWidth / 2 + card.offsetWidth / 2;
      el.scrollTo({ left, behavior: 'smooth' });
    },
    [cardsRef]
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
  }, [cardsRef, centerCard]);

  /* --------------------------------------------
   * SNAP
   * ------------------------------------------ */
  const scheduleSnap = useCallback(() => {
    if (snapTimeout.current) window.clearTimeout(snapTimeout.current);

    snapTimeout.current = window.setTimeout(() => {
      snapToClosest();
    }, 180);
  }, [snapToClosest]);

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

      el.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.pageX - startX.current;
      el.scrollLeft = scrollLeft.current - dx;
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

    return () => {
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointerleave', onPointerUp);
    };
  }, [expandedId, scheduleSnap]);

  /* --------------------------------------------
   * CENTRALIZA AO ABRIR (logo ao expandir + após a transição de largura)
   * ------------------------------------------ */
  const EXPAND_TRANSITION_MS = 500;
  useEffect(() => {
    if (expandedId === null) return;
    centerCard(expandedId);
    const id = setTimeout(() => {
      centerCard(expandedId);
    }, EXPAND_TRANSITION_MS);
    return () => clearTimeout(id);
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
      }
    );

    observer.observe(start);
    observer.observe(end);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="py-32">
      <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              flex gap-12
              overflow-x-auto
              overscroll-x-contain
              scroll-smooth
              pt-20 pb-32
              -mx-4 sm:-mx-6 lg:-mx-8
              cursor-grab active:cursor-grabbing
              scrollbar-hide
            "
            style={{
              paddingLeft: `max(${HALF_CARD}px, calc(50% - ${HALF_CARD}px))`,
              paddingRight: `max(${HALF_CARD}px, calc(50% - ${HALF_CARD}px))`,
            }}
          >
            {/* Start sentinel */}
            <span ref={timelineStartRef} aria-hidden className="w-px h-full shrink-0" />
            {orderedExperiences.map((exp) => {
              const isExpanded = expandedId === exp.id;

              return (
                <div
                  key={exp.id}
                  ref={(el) => {
                    if (el) cardsRef.current.set(exp.id, el);
                  }}
                  className={cn(
                    'shrink-0 transition-[width] duration-500 ease-out relative',
                    isExpanded ? 'w-[520px]' : 'w-[320px]'
                  )}
                >
                  {/* Timeline node + date */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full border-2',
                        isExpanded
                          ? 'bg-primary-500 border-primary-500'
                          : 'bg-primary-300 border-primary-400/50'
                      )}
                    />
                    <span className="mt-2 text-xs font-semibold text-primary-500 whitespace-nowrap">
                      {formatPeriod(exp.startDate, exp.endDate)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                    data-card
                    className={cn(
                      'w-full text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
                      isExpanded
                        ? 'bg-white dark:bg-slate-800 shadow-xl'
                        : 'bg-white/70 dark:bg-white/10 hover:bg-white'
                    )}
                  >
                    <Card className="p-6 border-0 bg-transparent shadow-none">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {exp.role}
                      </h3>

                      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {exp.company}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-primary-500/70">
                        {isExpanded ? (
                          <ChevronDown size={14} />
                        ) : (
                          <ChevronRight size={14} />
                        )}
                        <span>{isExpanded ? 'Show less' : 'Show details'}</span>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-6">
                              <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-6">
                                {exp.description}
                              </p>

                              <ul className="space-y-3">
                                {exp.highlights.map((h, i) => (
                                  <li
                                    key={i}
                                    className="flex gap-3 text-sm text-slate-500 dark:text-slate-400"
                                  >
                                    <span className="mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0" />
                                    <span>{h}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
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
