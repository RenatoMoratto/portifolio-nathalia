import { useTranslation } from 'react-i18next';

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-light-bg dark:bg-dark-bg transition-colors duration-300"
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-light-bg/50 to-light-bg dark:via-dark-bg/50 dark:to-dark-bg pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 section-container text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {/* Title */}
          <h1 className="heading-1 mb-4 animate-slide-up text-slate-900 dark:text-white">
            {t('title')}
          </h1>

          {/* Headline */}
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 animate-slide-up animate-delay-100 max-w-2xl">
            {t('role')}
          </p>

          {/* Manifest */}
          <div className="mb-12 animate-slide-up animate-delay-200">
            <blockquote className="text-lg md:text-xl font-medium text-primary-600 dark:text-primary-400 leading-relaxed">
              {t('manifest')
                .split('\n')
                .map((line, i) => (
                  <span key={i} className="block">
                    {i === 0 ? (
                      <strong className="font-semibold">{line}</strong>
                    ) : (
                      <span className="text-base md:text-lg opacity-90 block mt-2">
                        {line}
                      </span>
                    )}
                  </span>
                ))}
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
