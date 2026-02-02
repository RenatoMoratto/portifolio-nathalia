import { useTranslation } from 'react-i18next';
import { SectionHeading, Card } from '../components';
import { useScrollAnimation } from '../hooks';
import { cn } from '../utils/cn';

export function About() {
  const { t } = useTranslation();
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>();

  // Tool items data
  const tools = {
    research: ['Maze', 'Typeform', 'Google Forms', 'Hotjar'],
    collaboration: ['FigJam', 'Miro'],
    management: ['Jira', 'Notion', 'Confluence'],
    design: ['Figma'],
  };

  // Competency items
  const productCompetencies = [
    'about.competencies.items.research',
    'about.competencies.items.definition',
    'about.competencies.items.ia',
    'about.competencies.items.prototyping',
    'about.competencies.items.collaboration',
  ];

  const processCompetencies = [
    'about.competencies.items.data',
    'about.competencies.items.empathy',
    'about.competencies.items.planning',
    'about.competencies.items.delivery',
  ];

  return (
    <section id="about" className="section-padding bg-white dark:bg-dark-bg">
      <div className="section-container">
        <SectionHeading title={t('about.title')} subtitle="" />

        {/* Main intro text */}
        <div
          ref={ref}
          className={cn(
            'max-w-3xl mx-auto mb-16 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
          )}
        >
          <div
            className="text-slate-600 dark:text-slate-400 leading-relaxed text-center space-y-4"
            dangerouslySetInnerHTML={{
              __html: t('about.mainText').replace(/\n\n/g, '</p><p class="mt-4">'),
            }}
          />
        </div>

        {/* 3-Column Grid */}
        <div
          className={cn(
            'grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto',
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

            {/* Complementary courses */}
            <div className="mt-6 pt-6 border-t border-light-border dark:border-dark-border">
              <h4 className="text-sm font-medium text-slate-500 dark:text-slate-500 mb-4">
                {t('about.courses.title')}
              </h4>
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
            </div>
          </Card>

          {/* Column 2: Ferramentas */}
          <Card variant="glass" className="h-full">
            <h3 className="heading-3 text-slate-900 dark:text-white mb-6">
              {t('about.tools.title')}
            </h3>

            <div className="space-y-5">
              {/* Research & Validation */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {t('about.tools.research')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tools.research.map((tool) => (
                    <span key={tool} className="skill-badge text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Collaboration & Ideation */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {t('about.tools.collaboration')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tools.collaboration.map((tool) => (
                    <span key={tool} className="skill-badge text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Management & Documentation */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {t('about.tools.management')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tools.management.map((tool) => (
                    <span key={tool} className="skill-badge text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Design & Prototyping */}
              <div>
                <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-2">
                  {t('about.tools.design')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {tools.design.map((tool) => (
                    <span key={tool} className="skill-badge text-xs">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Column 3: Competências */}
          <Card variant="glass" className="h-full">
            <h3 className="heading-3 text-slate-900 dark:text-white mb-6">
              {t('about.competencies.title')}
            </h3>

            {/* Product & UX */}
            <div className="mb-6">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3">
                {t('about.competencies.productOrUx')}
              </h4>
              <ul className="space-y-2">
                {productCompetencies.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 dark:bg-primary-500" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Process */}
            <div className="pt-5 border-t border-light-border dark:border-dark-border">
              <h4 className="text-xs font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider mb-3">
                {t('about.competencies.process')}
              </h4>
              <ul className="space-y-2">
                {processCompetencies.map((key) => (
                  <li
                    key={key}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-400 dark:bg-accent-500" />
                    {t(key)}
                  </li>
                ))}
              </ul>
            </div>
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
