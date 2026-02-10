import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { ResumeButton } from './ResumeButton';
import { cn } from '../utils/cn';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t } = useTranslation();
  const location = useLocation();

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

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'transition-all duration-500 ease-out-quart',
        isScrolled
          ? 'bg-white/70 dark:bg-dark-bg/70 backdrop-blur-xl shadow-sm shadow-slate-900/5 dark:shadow-black/10'
          : 'bg-transparent',
      )}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className={cn(
              'text-lg font-semibold tracking-tight',
              'text-slate-900 dark:text-white',
              'hover:text-primary-500 dark:hover:text-primary-400',
              'transition-colors duration-300',
            )}
          >
            Nathália Moratto Caldeira
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'relative py-1 font-medium',
                  'transition-colors duration-300',
                  location.pathname === link.href
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white',
                )}
              >
                {link.label}
                {/* Active indicator */}
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
            <div className="flex items-center gap-2 border-l border-slate-200/80 dark:border-slate-700/50 pl-4 ml-2">
              <ThemeToggle />
              <LanguageToggle />
              <ResumeButton className="ml-2" />
            </div>
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <LanguageToggle />
            <ResumeButton className="hidden sm:block" />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'p-2 rounded-lg',
                'text-slate-600 dark:text-slate-400',
                'hover:text-slate-900 dark:hover:text-white',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                'transition-colors duration-200',
              )}
              aria-label={t('navbar.aria.toggleMenu')}
              aria-expanded={isMobileMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden',
            'transition-all duration-400 ease-out-quart',
            isMobileMenuOpen ? 'max-h-64 pb-4 opacity-100' : 'max-h-0 opacity-0',
          )}
        >
          <div className="flex flex-col gap-1 pt-2">
            {links.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'px-3 py-2.5 rounded-lg font-medium',
                  'transition-colors duration-200',
                  location.pathname === link.href
                    ? 'text-primary-500 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
