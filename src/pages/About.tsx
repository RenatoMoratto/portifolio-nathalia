import { useTranslation } from 'react-i18next';
import { SectionHeading, Card } from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';
import { Experience } from '../sections';

export function About() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollAnimation<HTMLDivElement>();
  const [eduRef, eduVisible] = useScrollAnimation<HTMLDivElement>();
  const [beyondRef, beyondVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Intro */}
      <section
        ref={introRef}
        className={cn(
          'mb-20',
          'transition-all duration-700 ease-out-expo',
          introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <SectionHeading title={t('about.title')} subtitle="" />
        <div
          ref={introRef}
          className={cn(
            'max-w-3xl mx-auto mb-16 transition-all duration-700',
            introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div
            className="text-slate-600 dark:text-slate-400 leading-relaxed text-center space-y-4"
            dangerouslySetInnerHTML={{
              __html: t('about.mainText').replace(/\n\n/g, '</p><p class="mt-4">'),
            }}
          />
        </div>
      </section>

      <Experience />

      {/* Formation */}
      <section
        ref={eduRef}
        className="mb-20 grid grid-cols-2 max-md:grid-cols-1 gap-6 lg:gap-8 max-w-5xl mx-auto"
      >
        <Card
          className={cn(
            'p-6',
            'transition-all duration-700 delay-100',
            eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          <h3
            className={cn(
              'heading-3 mb-8 text-slate-900 dark:text-white',
              'transition-all duration-700',
              eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            {t('about.education.title')}
          </h3>
          <ul className="space-y-4">
            {['item1', 'item2', 'item3'].map((item, idx) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0',
                    'transition-all duration-500',
                    eduVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                  )}
                  style={{
                    transitionDelay: eduVisible ? `${(idx + 1) * 100}ms` : '0ms',
                  }}
                />
                <span
                  dangerouslySetInnerHTML={{ __html: t(`about.education.${item}`) }}
                  className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card
          className={cn(
            'p-6',
            'transition-all duration-700 delay-300',
            eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          <h3
            className={cn(
              'heading-3 mb-8 text-slate-900 dark:text-white',
              'transition-all duration-700',
              eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            {t('about.courses.title')}
          </h3>
          <ul className="space-y-3">
            {['item1', 'item2', 'item3'].map((item, idx) => (
              <li key={item} className="flex items-start gap-3">
                <span
                  className={cn(
                    'mt-2 w-1.5 h-1.5 rounded-full bg-primary-500 shrink-0',
                    'transition-all duration-500',
                    eduVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0',
                  )}
                  style={{
                    transitionDelay: eduVisible ? `${(idx + 4) * 100}ms` : '0ms',
                  }}
                />
                <span
                  dangerouslySetInnerHTML={{ __html: t(`about.courses.${item}`) }}
                  className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                />
              </li>
            ))}
          </ul>
        </Card>
      </section>

      {/* Beyond Work */}
      <section
        ref={beyondRef}
        className={cn(
          'transition-all duration-700',
          beyondVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <h2 className="heading-2 mb-8 text-slate-900 dark:text-white">
          {t('about.beyondWork.title')}
        </h2>
        <Card className="p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: t('about.beyondWork.text') }} />
          </div>
        </Card>
      </section>
    </div>
  );
}
