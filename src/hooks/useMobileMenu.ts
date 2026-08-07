import { useCallback, useEffect, useRef, useState } from 'react';

/** Tailwind's `md` breakpoint - the width where the desktop nav takes over. */
const DESKTOP_QUERY = '(min-width: 768px)';

/** Everything inside the panel a keyboard can land on. */
const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled])';

/**
 * Open/close state for the mobile navigation panel, plus the behaviour a panel
 * that covers the page owes the visitor.
 *
 * The panel is a disclosure, but once it dims and locks the page behind it, it
 * has to behave like a dialog: Escape closes it, the page underneath does not
 * scroll away beneath the visitor's thumb, and Tab cycles between the toggle
 * and the panel instead of walking into content hidden behind the scrim.
 *
 * `pathname` is passed in rather than read from the router so the hook stays
 * testable without a `Router` wrapper. Any change to it closes the panel, which
 * covers navigation the panel does not initiate itself - browser back, in
 * particular, used to leave the menu hanging open over the new page.
 *
 * Focus moves into the panel on open and returns to the toggle on close, so a
 * keyboard visitor is never dropped on `<body>` when the panel unmounts.
 */
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

  // Navigating anywhere puts the panel away. Adjusted during render rather than
  // in an effect so the panel never paints once over the page it just left.
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setIsOpen(false);
  }

  // Resizing into the desktop layout hides the toggle. Without this the panel
  // stays "open" and leaves the body scroll locked with no way to release it.
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

      // The toggle leads the cycle: it is the visible "close", so a keyboard
      // visitor must always be able to reach it without leaving the panel.
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
