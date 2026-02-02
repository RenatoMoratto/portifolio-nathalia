import { useTranslation } from 'react-i18next';
import { SectionHeading, Card } from '../components';

export function About() {
  const { t } = useTranslation();

  return (
    <div className="pt-20 pb-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Main Intro */}
      <section className="mb-20">
        <SectionHeading title={t('about.title')} subtitle="" />
        <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
          <p dangerouslySetInnerHTML={{ __html: t('about.mainText') }} />
        </div>
      </section>

      {/* Formation */}
      <section className="mb-20">
        <h2 className="heading-2 mb-8 text-slate-900 dark:text-white">
          {t('about.education.title')}
        </h2>
        <div className="space-y-6">
          <Card className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <span
                  dangerouslySetInnerHTML={{ __html: t('about.education.item1') }}
                  className="text-lg text-slate-700 dark:text-slate-300"
                />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <span
                  dangerouslySetInnerHTML={{ __html: t('about.education.item2') }}
                  className="text-lg text-slate-700 dark:text-slate-300"
                />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <span
                  dangerouslySetInnerHTML={{ __html: t('about.education.item3') }}
                  className="text-lg text-slate-700 dark:text-slate-300"
                />
              </li>
            </ul>
          </Card>

          <h3 className="heading-3 mb-4 mt-8 text-slate-900 dark:text-white">
            {t('about.courses.title')}
          </h3>
          <Card className="p-6">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <span
                  dangerouslySetInnerHTML={{ __html: t('about.courses.item1') }}
                  className="text-lg text-slate-700 dark:text-slate-300"
                />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <span
                  dangerouslySetInnerHTML={{ __html: t('about.courses.item2') }}
                  className="text-lg text-slate-700 dark:text-slate-300"
                />
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-primary-500 shrink-0" />
                <span
                  dangerouslySetInnerHTML={{ __html: t('about.courses.item3') }}
                  className="text-lg text-slate-700 dark:text-slate-300"
                />
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Tools */}
      <section className="mb-20">
        <h2 className="heading-2 mb-8 text-slate-900 dark:text-white">
          {t('about.tools.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-primary-500 mb-2">
              {t('about.tools.research')}
            </h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
              <li>Google Forms</li>
              <li>Hotjar</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-primary-500 mb-2">
              {t('about.tools.collaboration')}
            </h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
              <li>Miro</li>
              <li>Whimsical</li>
              <li>Google Meet</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-primary-500 mb-2">
              {t('about.tools.management')}
            </h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
              <li>Notion</li>
              <li>ClickUp</li>
              <li>Draw.io</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-primary-500 mb-2">{t('about.tools.design')}</h3>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-1">
              <li>Figma</li>
              <li>Balsamiq</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Competencies */}
      <section className="mb-20">
        <h2 className="heading-2 mb-8 text-slate-900 dark:text-white">
          {t('about.competencies.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="heading-3 mb-4 text-slate-800 dark:text-slate-200">
              {t('about.competencies.productOrUx')}
            </h3>
            <Card className="p-6 h-full">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>{t('about.competencies.items.research')}</li>
                <li>{t('about.competencies.items.definition')}</li>
                <li>{t('about.competencies.items.ia')}</li>
                <li>{t('about.competencies.items.prototyping')}</li>
                <li>{t('about.competencies.items.collaboration')}</li>
              </ul>
            </Card>
          </div>
          <div>
            <h3 className="heading-3 mb-4 text-slate-800 dark:text-slate-200">
              {t('about.competencies.process')}
            </h3>
            <Card className="p-6 h-full">
              <ul className="space-y-2 text-slate-700 dark:text-slate-300">
                <li>{t('about.competencies.items.data')}</li>
                <li>{t('about.competencies.items.empathy')}</li>
                <li>{t('about.competencies.items.planning')}</li>
                <li>{t('about.competencies.items.delivery')}</li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Beyond Work */}
      <section>
        <h2 className="heading-2 mb-8 text-slate-900 dark:text-white">
          {t('about.beyondWork.title')}
        </h2>
        <Card className="p-8">
          <div className="prose prose-lg dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
            <p dangerouslySetInnerHTML={{ __html: t('about.beyondWork.text') }} />
          </div>
        </Card>
      </section>
    </div>
  );
}
