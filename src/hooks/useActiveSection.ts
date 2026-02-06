import { useEffect, useState } from 'react';

/**
 * Returns the id of the section currently in view.
 * Uses IntersectionObserver with a rootMargin so the section is considered
 * "active" when its top is near the top of the viewport.
 */
export function useActiveSection(sectionIds: string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (sectionIds.length === 0) {
      setActiveId(null);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => {
            const aRect = a.boundingClientRect;
            const bRect = b.boundingClientRect;
            return Math.abs(aRect.top) - Math.abs(bRect.top);
          });

        if (intersecting.length > 0) {
          setActiveId(intersecting[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds.join(',')]);

  return activeId;
}
