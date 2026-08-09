import { useTranslation } from 'react-i18next';
import { SectionHeading, Button, Card, ScrollReveal, FormField } from '../components';
import { useContactForm } from '../hooks/useContactForm';
import { isContactFormEnabled } from '../config/env';
import { personalInfo } from '../content';
import { cn } from '../utils/cn';

function SuccessPanel() {
  const { t } = useTranslation();
  return (
    <div className="text-center py-12" role="status">
      <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scale-in">
        <svg
          className="w-8 h-8 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
      <h3 className="heading-3 text-slate-900 dark:text-white mb-2">
        {t('contact.success.title')}
      </h3>
      <p className="text-slate-600 dark:text-slate-400">{t('contact.success.message')}</p>
    </div>
  );
}

function LinkedInLink() {
  const { t } = useTranslation();
  return (
    <div className="pt-6 mt-4 border-t border-light-border dark:border-dark-border text-center">
      <p className="text-sm text-slate-500 dark:text-slate-500 mb-3">
        {t('contact.social')}
      </p>
      <a
        href={personalInfo.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'inline-flex items-center gap-2 px-5 py-2.5 rounded-xl',
          'bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300',
          'hover:bg-primary-500 hover:text-white',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'transition-all duration-300 font-medium text-sm',
        )}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </a>
    </div>
  );
}

export function Contact() {
  const { t } = useTranslation();
  const { formRef, values, errors, status, setField, handleSubmit } = useContactForm();

  const errorMessage =
    status.kind === 'error'
      ? status.reason === 'unconfigured'
        ? t('contact.form.unavailable')
        : t('contact.form.failed')
      : null;

  // Use route-specific spacing and fill the height to the footer.
  return (
    <section
      id="contact"
      className="grow pt-10 md:pt-16 pb-24 md:pb-32 lg:pb-40 bg-light-surface dark:bg-dark-surface"
    >
      <div className="section-container">
        <ScrollReveal>
          <SectionHeading title={t('contact.title')} subtitle={t('contact.subtitle')} />
        </ScrollReveal>

        <ScrollReveal className="max-w-xl mx-auto">
          <Card>
            {status.kind === 'success' ? (
              <SuccessPanel />
            ) : (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
                <FormField
                  label={t('contact.form.name.label')}
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={(e) => setField('name', e.target.value)}
                  error={errors.name}
                  placeholder={t('contact.form.name.placeholder')}
                />

                <FormField
                  label={t('contact.form.email.label')}
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={(e) => setField('email', e.target.value)}
                  error={errors.email}
                  placeholder={t('contact.form.email.placeholder')}
                />

                <FormField
                  label={t('contact.form.message.label')}
                  name="message"
                  type="textarea"
                  rows={5}
                  value={values.message}
                  onChange={(e) => setField('message', e.target.value)}
                  error={errors.message}
                  placeholder={t('contact.form.message.placeholder')}
                />

                {errorMessage && (
                  <p
                    role="alert"
                    className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 rounded-xl px-4 py-3"
                  >
                    {errorMessage}
                  </p>
                )}

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={status.kind === 'submitting'}
                  disabled={!isContactFormEnabled}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  {t('contact.form.submit')}
                </Button>

                {!isContactFormEnabled && (
                  <p className="text-sm text-center text-slate-500 dark:text-slate-400">
                    {t('contact.form.unavailable')}
                  </p>
                )}

                <LinkedInLink />
              </form>
            )}
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
