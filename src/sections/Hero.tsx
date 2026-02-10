import { useTranslation } from 'react-i18next';
import { OrganicOrbs } from '../components/OrganicOrbs';
import { useTypewriter } from '../hooks/useTypewriter';

export function Hero() {
  const { t } = useTranslation();
  const roles = t('hero.roles', { returnObjects: true }) as string[];
  const typedRole = useTypewriter(roles);

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-slate-50 dark:bg-dark-bg transition-colors duration-500"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-light-bg/30 to-light-bg dark:via-dark-bg/30 dark:to-dark-bg pointer-events-none" />

      {/* 3D Organic Orbs Background */}
      <OrganicOrbs />

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          {/* Name */}
          <h1
            className="heading-1 mb-6 text-slate-900 dark:text-white opacity-0 animate-fade-slide-up"
            style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}
          >
            {t('title')}
          </h1>

          {/* Role/Headline */}
          <p
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-400 mb-14 max-w-2xl opacity-0 animate-fade-slide-up"
            style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
          >
            {t('hero.rolePrefix')} <span className="text-primary-500">|</span> {typedRole}
            <span className="animate-blink ml-0.5 inline-block w-0.5 h-6 align-middle bg-primary-500"></span>
          </p>

          {/* Manifest */}
          <div
            className="opacity-0 animate-fade-slide-up"
            style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}
          >
            <blockquote className="relative max-w-xl mx-auto">
              {/* Decorative quote mark */}
              <span
                className="absolute -top-4 -left-2 text-6xl text-primary-200 dark:text-primary-800/50 font-serif leading-none select-none"
                aria-hidden="true"
              >
                "
              </span>
              <div className="text-lg md:text-xl font-medium text-primary-600 dark:text-primary-400 leading-relaxed pl-4">
                {t('manifest')
                  .split('\n')
                  .map((line, i) => (
                    <span key={i} className="block">
                      {i === 0 ? (
                        <span className="font-semibold">{line}</span>
                      ) : (
                        <span className="text-base md:text-lg text-primary-500/80 dark:text-primary-400/80 block mt-3">
                          {line}
                        </span>
                      )}
                    </span>
                  ))}
              </div>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
