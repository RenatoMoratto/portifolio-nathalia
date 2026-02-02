import { useTranslation } from 'react-i18next';
import { SectionHeading } from '../components';

export function HowIWork() {
  const { t } = useTranslation();

  const steps = [
    'howIWork.step1',
    'howIWork.step2',
    'howIWork.step3',
    'howIWork.step4',
    'howIWork.step5',
    'howIWork.step6',
  ];

  return (
    <section className="section-padding bg-white dark:bg-slate-900/50">
      <div className="section-container">
        <SectionHeading
          title={t('howIWork.title', 'Como eu trabalho')}
          subtitle=""
          className="mb-12"
        />

        <div className="max-w-4xl mx-auto">
          <ul className="space-y-6">
            {steps.map((stepKey, index) => (
              <li
                key={index}
                className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 font-bold">
                  {index + 1}
                </span>
                <p className="text-lg text-slate-700 dark:text-slate-300">
                  {/* Using a helper to parse translation which might contain bold markdown-like syntax? 
                        The requirement says "Começo entendendo o **problema e o contexto**".
                        I'll assume I can render HTML or just simple text for now. 
                        Let's put the content in i18n directly.
                    */}
                  <span dangerouslySetInnerHTML={{ __html: t(stepKey) }} />
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
