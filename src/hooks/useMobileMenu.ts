import { useCallback, useEffect, useRef, useState } from 'react';

/** Matches Tailwind's `md` breakpoint. */
const DESKTOP_QUERY = '(min-width: 768px)';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/** Provides dialog-like focus, keyboard, and scroll behavior for mobile navigation. */
export function useMobileMenu(pathname: string) {
  const [isOpen, setIsOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  /** Distinguishes "closed" from "just closed" so mount does not steal focus. */
  const wasOpen = useRef(false);

  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((open) => !open), []);

  const getPanelFocusables = useCallback(
    () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? [],
      ),
    [],
  );

  // Close before rendering a newly navigated route.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  // Release the scroll lock when desktop navigation takes over.
  useEffect(() => {
    if (!isOpen) return;
    const query = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      // Keep the visible close control in the focus cycle.
      const cycle = [triggerRef.current, ...getPanelFocusables()].filter(
        (element): element is HTMLElement => element !== null,
      );
      if (cycle.length === 0) return;

      const first = cycle[0];
      const last = cycle[cycle.length - 1];
      const active = document.activeElement;

      if (
        event.shiftKey &&
        (active === first || !cycle.includes(active as HTMLElement))
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, getPanelFocusables]);

  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      getPanelFocusables()[0]?.focus();
    } else if (wasOpen.current) {
      wasOpen.current = false;
      triggerRef.current?.focus();
    }
  }, [isOpen, getPanelFocusables]);

  return { isOpen, toggle, close, panelRef, triggerRef };
}
