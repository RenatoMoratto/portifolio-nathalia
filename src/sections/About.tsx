import { useTranslation } from 'react-i18next';
import { SectionHeading, Card } from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

export function About() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <section id="about" className="section-padding bg-white dark:bg-dark-bg">
      <div className="section-container">
        {/* 2-Column Grid */}
        <div
          className={cn(
            'grid grid-cols-2 max-md:grid-cols-1 gap-6 lg:gap-8 max-w-5xl mx-auto',
            'transition-all duration-700 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          {/* Column 1: Formação profissional */}
          <Card variant="glass" className="h-full">
            <h3 className="heading-3 text-slate-900 dark:text-white mb-6">
              {t('about.education.title')}
            </h3>
            <ul className="space-y-4 text-slate-600 dark:text-slate-400 text-sm">
              <li
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.education.item1') }}
              />
              <li
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.education.item2') }}
              />
              <li
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.education.item3') }}
              />
            </ul>
          </Card>

          {/* Column 2: Complementary courses */}
          <Card variant="glass" className="h-full">
            <h3 className="heading-3 text-slate-900 dark:text-white mb-6">
              {t('about.courses.title')}
            </h3>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm">
              <li
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.courses.item1') }}
              />
              <li
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('about.courses.item2') }}
              />
            </ul>
          </Card>
        </div>

        {/* Beyond Work section */}
        <div
          className={cn(
            'max-w-3xl mx-auto mt-16 transition-all duration-700 delay-300',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <Card variant="glass">
            <h3 className="heading-3 text-slate-900 dark:text-white mb-4">
              {t('about.beyondWork.title')}
            </h3>
            <div
              className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{
                __html: t('about.beyondWork.text').replace(
                  /\n\n/g,
                  '</p><p class="mt-4">',
                ),
              }}
            />
          </Card>
        </div>
      </div>
    </section>
  );
}
