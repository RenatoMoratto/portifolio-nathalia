import { useTranslation } from 'react-i18next';
import { SectionHeading, Card, ScrollReveal, ListBullet } from '../components';
import { useScrollAnimation } from '../hooks';
import { getStaggerDelay } from '../utils/animations';
import { Experience } from '../sections';

export function About() {
  const { t } = useTranslation();
  const [eduRef, eduVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Intro */}
      <ScrollReveal as="section" className="mb-20">
        <SectionHeading title={t('about.title')} subtitle="" />
        <div className="max-w-3xl mx-auto mb-16">
          <div
            className="text-slate-600 dark:text-slate-400 leading-relaxed text-center space-y-4"
            dangerouslySetInnerHTML={{
              __html: t('about.mainText').replace(/\n\n/g, '</p><p class="mt-4">'),
            }}
          />
        </div>
      </ScrollReveal>

      <Experience />

      {/* Formation */}
      <section
        ref={eduRef}
        className="mb-20 grid grid-cols-2 max-md:grid-cols-1 gap-6 lg:gap-8 max-w-5xl mx-auto"
      >
        <ScrollReveal as="div" delay={100}>
          <Card className="p-6">
            <h3 className="heading-3 mb-8 text-slate-900 dark:text-white">
              {t('about.education.title')}
            </h3>
            <ul className="space-y-4">
              {['item1', 'item2', 'item3'].map((item, idx) => (
                <li key={item} className="flex items-start gap-3">
                  <ListBullet
                    className="mt-2"
                    animated
                    isVisible={eduVisible}
                    delay={getStaggerDelay(idx, 100)}
                  />
                  <span
                    dangerouslySetInnerHTML={{ __html: t(`about.education.${item}`) }}
                    className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </ScrollReveal>

        <ScrollReveal as="div" delay={300}>
          <Card className="p-6">
            <h3 className="heading-3 mb-8 text-slate-900 dark:text-white">
              {t('about.courses.title')}
            </h3>
            <ul className="space-y-3">
              {['item1', 'item2', 'item3'].map((item, idx) => (
                <li key={item} className="flex items-start gap-3">
                  <ListBullet
                    className="mt-2"
                    animated
                    isVisible={eduVisible}
                    delay={getStaggerDelay(idx, 400)}
                  />
                  <span
                    dangerouslySetInnerHTML={{ __html: t(`about.courses.${item}`) }}
                    className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed"
                  />
                </li>
              ))}
            </ul>
          </Card>
        </ScrollReveal>
      </section>

      {/* Beyond Work */}
      <ScrollReveal as="section">
        <h2 className="heading-2 mb-8 text-slate-900 dark:text-white">
          {t('about.beyondWork.title')}
        </h2>
        <Card className="p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
            <p dangerouslySetInnerHTML={{ __html: t('about.beyondWork.text') }} />
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
