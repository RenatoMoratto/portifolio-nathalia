import { useTranslation } from 'react-i18next';
import { SectionHeading, Card } from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

export function About() {
  const { t } = useTranslation();
  const [introRef, introVisible] = useScrollAnimation<HTMLDivElement>();
  const [eduRef, eduVisible] = useScrollAnimation<HTMLDivElement>();
  const [toolsRef, toolsVisible] = useScrollAnimation<HTMLDivElement>();
  const [compRef, compVisible] = useScrollAnimation<HTMLDivElement>();
  const [beyondRef, beyondVisible] = useScrollAnimation<HTMLDivElement>();

  return (
    <div className="pt-24 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Intro */}
      <section
        ref={introRef}
        className={cn(
          'mb-20',
          'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
          introVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        )}
      >
        <SectionHeading title={t('about.title')} subtitle="" />
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300 leading-relaxed">
          <p dangerouslySetInnerHTML={{ __html: t('about.mainText') }} />
        </div>
      </section>

      {/* Formation */}
      <section ref={eduRef} className="mb-20">
        <h2
          className={cn(
            'heading-2 mb-8 text-slate-900 dark:text-white',
            'transition-all duration-700',
            eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          {t('about.education.title')}
        </h2>
        <div className="space-y-6">
          <Card
            className={cn(
              'p-6',
              'transition-all duration-700 delay-100',
              eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
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

          <h3
            className={cn(
              'heading-3 mb-4 mt-10 text-slate-900 dark:text-white',
              'transition-all duration-700 delay-200',
              eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            {t('about.courses.title')}
          </h3>
          <Card
            className={cn(
              'p-6',
              'transition-all duration-700 delay-300',
              eduVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
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
        </div>
      </section>

      {/* Tools */}
      <section ref={toolsRef} className="mb-20">
        <h2
          className={cn(
            'heading-2 mb-8 text-slate-900 dark:text-white',
            'transition-all duration-700',
            toolsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          {t('about.tools.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { key: 'research', tools: ['Google Forms', 'Hotjar'] },
            { key: 'collaboration', tools: ['Miro', 'Whimsical', 'Google Meet'] },
            { key: 'management', tools: ['Notion', 'ClickUp', 'Draw.io'] },
            { key: 'design', tools: ['Figma', 'Balsamiq'] },
          ].map((category, idx) => (
            <Card
              key={category.key}
              className={cn(
                'p-5',
                'transition-all duration-700',
                toolsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
              )}
              style={{ transitionDelay: toolsVisible ? `${idx * 75}ms` : '0ms' }}
            >
              <h3 className="font-semibold text-primary-500 mb-3 text-sm uppercase tracking-wide">
                {t(`about.tools.${category.key}`)}
              </h3>
              <ul className="space-y-1.5">
                {category.tools.map((tool) => (
                  <li key={tool} className="text-slate-700 dark:text-slate-300 text-sm">
                    {tool}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </section>

      {/* Competencies */}
      <section ref={compRef} className="mb-20">
        <h2
          className={cn(
            'heading-2 mb-8 text-slate-900 dark:text-white',
            'transition-all duration-700',
            compVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
          )}
        >
          {t('about.competencies.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className={cn(
              'transition-all duration-700 delay-100',
              compVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            <h3 className="heading-3 mb-4 text-slate-800 dark:text-slate-200">
              {t('about.competencies.productOrUx')}
            </h3>
            <Card className="p-5 h-full">
              <ul className="space-y-2.5">
                {['research', 'definition', 'ia', 'prototyping', 'collaboration'].map(
                  (item) => (
                    <li
                      key={item}
                      className="text-slate-700 dark:text-slate-300 flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-primary-400" />
                      {t(`about.competencies.items.${item}`)}
                    </li>
                  ),
                )}
              </ul>
            </Card>
          </div>
          <div
            className={cn(
              'transition-all duration-700 delay-200',
              compVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
            )}
          >
            <h3 className="heading-3 mb-4 text-slate-800 dark:text-slate-200">
              {t('about.competencies.process')}
            </h3>
            <Card className="p-5 h-full">
              <ul className="space-y-2.5">
                {['data', 'empathy', 'planning', 'delivery'].map((item) => (
                  <li
                    key={item}
                    className="text-slate-700 dark:text-slate-300 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-400" />
                    {t(`about.competencies.items.${item}`)}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
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
