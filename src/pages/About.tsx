import { useTranslation } from 'react-i18next';
import { SectionHeading, Card, ScrollReveal, ListBullet } from '../components';
import { useScrollAnimation } from '../hooks';
import { getStaggerDelay } from '../utils/animations';
import { Experience } from '../sections';
import aboutImage from '../assets/images/about.jpg';

export function About() {
  const { t } = useTranslation();
  const [eduRef, eduVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section with Image */}
      <section className="mb-20 mx-auto">
        {/* Centered Title */}
        <ScrollReveal className="mb-12 text-center" delay={0}>
          <SectionHeading title={t('about.title')} subtitle="" />
        </ScrollReveal>

        {/* Split Layout: Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <ScrollReveal
            className="relative flex justify-center lg:justify-end"
            delay={100}
          >
            {/* Decorative gradient blob */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-72 h-72 sm:w-80 sm:h-80 rounded-full opacity-20 blur-3xl"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(223, 80, 104, 0.4) 0%, rgba(192, 122, 128, 0.3) 50%, rgba(232, 180, 184, 0.2) 100%)',
                }}
              />
            </div>

            {/* Framed image */}
            <div className="relative z-10">
              <div className="relative w-100 h-100 sm:w-110 sm:h-110">
                <img
                  src={aboutImage}
                  alt={t('about.imageAlt', 'Nathália Moratto Caldeira')}
                  className="w-full h-full object-cover rounded-2xl shadow-xl ring-1 ring-slate-200/50 dark:ring-slate-700/50"
                />
                {/* Subtle gradient overlay on image */}
                <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary-400/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </ScrollReveal>

          {/* Text Side */}
          <ScrollReveal className="text-center lg:text-left" delay={250}>
            <div className="max-w-xl mx-auto lg:mx-0">
              <div
                className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{
                  __html: t('about.mainText').replace(/\n\n/g, '</p><p class="mt-4">'),
                }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

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
