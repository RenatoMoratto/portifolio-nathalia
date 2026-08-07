import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in view.
 *
 * Uses IntersectionObserver with a rootMargin so a section counts as "active"
 * once its top is near the top of the viewport.
 *
 * The ids are joined into a string key rather than used as a raw array
 * dependency: callers build the array inline, so comparing by reference would
 * re-create the observer on every render.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sectionIdKey = sectionIds.join(',');

  useEffect(() => {
    const ids = sectionIdKey ? sectionIdKey.split(',') : [];
    if (ids.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top),
          );

        const closest = intersecting[0];
        if (closest) setActiveId(closest.target.id);
      },
      { root: null, rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sectionIdKey]);

  // Derived rather than stored, so an empty list needs no setState-in-effect.
  return sectionIds.length === 0 ? null : activeId;
}
