import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { ResumeButton } from './ResumeButton';
import { useMobileMenu } from '../hooks';
import { premiumEasing } from '../utils/animations';
import { cn } from '../utils/cn';

const MOBILE_MENU_ID = 'mobile-menu';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();
  const { isOpen, toggle, close, panelRef, triggerRef } = useMobileMenu(
    location.pathname,
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: t('nav.home'), href: '/' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  const duration = shouldReduceMotion ? 0 : 0.35;
  const panelTransition = { duration, ease: premiumEasing };

  return (
    <>
      {/* Dim under the bar and panel so they read as one sheet. */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-slate-900/30 dark:bg-black/50 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
            onClick={close}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-500 ease-out-quart',
          isOpen
            ? 'bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl shadow-sm shadow-slate-900/5 dark:shadow-black/10'
            : isScrolled
              ? 'bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl shadow-sm shadow-slate-900/5 dark:shadow-black/10'
              : 'bg-transparent',
        )}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="hidden md:flex items-center gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={location.pathname === link.href ? 'page' : undefined}
                  className={cn(
                    'relative py-1 font-medium',
                    'transition-colors duration-300',
                    location.pathname === link.href
                      ? 'text-primary-500 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                  )}
                >
                  {link.label}
                  <span
                    className={cn(
                      'absolute -bottom-0.5 left-0 h-0.5 bg-primary-500 rounded-full',
                      'transition-all duration-300 ease-out-quart',
                      location.pathname === link.href
                        ? 'w-full opacity-100'
                        : 'w-0 opacity-0',
                    )}
                  />
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              <LanguageToggle />
              <ResumeButton className="ml-2" />
            </div>

            <div className="flex items-center gap-3 md:hidden ml-auto">
              <ThemeToggle />
              <LanguageToggle />
              <button
                ref={triggerRef}
                onClick={toggle}
                className={cn(
                  // Preserve a 44px touch target.
                  'flex h-11 w-11 -mr-2 items-center justify-center rounded-xl',
                  'text-slate-600 dark:text-slate-400',
                  'hover:text-slate-900 dark:hover:text-white',
                  'hover:bg-slate-100 dark:hover:bg-slate-800',
                  'transition-colors duration-200',
                )}
                aria-label={
                  isOpen ? t('navbar.aria.closeMenu') : t('navbar.aria.openMenu')
                }
                aria-expanded={isOpen}
                aria-controls={MOBILE_MENU_ID}
              >
                <MenuIcon isOpen={isOpen} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              id={MOBILE_MENU_ID}
              ref={panelRef}
              className="md:hidden overflow-hidden border-t border-slate-200/70 dark:border-dark-border/70"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={panelTransition}
            >
              {/* Keep the menu usable in short landscape viewports. */}
              <div className="max-h-[calc(100dvh-4rem)] overflow-y-auto max-w-6xl mx-auto px-4 sm:px-6 py-3">
                {/* Avoid nesting navigation landmarks. */}
                <ul className="flex flex-col gap-1" aria-label={t('navbar.aria.menu')}>
                  {links.map((link, index) => {
                    const isActive = location.pathname === link.href;

                    return (
                      <motion.li
                        key={link.href}
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration,
                          ease: premiumEasing,
                          delay: shouldReduceMotion ? 0 : 0.05 + index * 0.05,
                        }}
                      >
                        <Link
                          to={link.href}
                          onClick={close}
                          aria-current={isActive ? 'page' : undefined}
                          className={cn(
                            'relative flex items-center rounded-xl pl-5 pr-4 py-3',
                            'text-base font-medium transition-colors duration-200',
                            isActive
                              ? 'text-primary-600 dark:text-primary-300 bg-primary-50 dark:bg-primary-500/10'
                              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-white/5',
                          )}
                        >
                          <span
                            className={cn(
                              'absolute left-1.5 top-1/2 -translate-y-1/2',
                              'h-5 w-1 rounded-full bg-primary-500',
                              'transition-opacity duration-200',
                              isActive ? 'opacity-100' : 'opacity-0',
                            )}
                            aria-hidden="true"
                          />
                          {link.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>

                {/* Keep resume access available on the narrowest screens. */}
                <motion.div
                  className="mt-3 pt-3 border-t border-slate-200/70 dark:border-dark-border/70"
                  initial={{ opacity: 0, y: shouldReduceMotion ? 0 : -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration,
                    ease: premiumEasing,
                    delay: shouldReduceMotion ? 0 : 0.05 + links.length * 0.05,
                  }}
                >
                  <ResumeButton className="w-full py-3" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}

const MENU_BAR = 'absolute left-0 h-0.5 w-5 rounded-full bg-current';

/** Morphs bars instead of swapping icons to preserve toggle feedback. */
function MenuIcon({ isOpen }: { isOpen: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const transition = { duration: shouldReduceMotion ? 0 : 0.3, ease: premiumEasing };

  return (
    <span className="relative block h-4 w-5" aria-hidden="true">
      <motion.span
        className={cn(MENU_BAR, 'top-0')}
        animate={isOpen ? { y: 7, rotate: 45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
      <motion.span
        className={cn(MENU_BAR, 'top-1.75')}
        animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0.4 : 1 }}
        transition={transition}
      />
      <motion.span
        className={cn(MENU_BAR, 'top-3.5')}
        animate={isOpen ? { y: -7, rotate: -45 } : { y: 0, rotate: 0 }}
        transition={transition}
      />
    </span>
  );
}
