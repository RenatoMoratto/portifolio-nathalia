import { useEffect, useState } from 'react';

/** Tracks the section nearest the viewport top without depending on array identity. */
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

  return sectionIds.length === 0 ? null : activeId;
}
