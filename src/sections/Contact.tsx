import { useState, useRef } from 'react';
import type { FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import { SectionHeading, Button, Card, ScrollReveal, FormField } from '../components';
import { personalInfo } from '../data/portfolio';
import { cn } from '../utils/cn';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

import { useTranslation } from 'react-i18next';

export function Contact() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t('contact.form.name.error.required');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('contact.form.email.error.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.form.email.error.invalid');
    }

    if (!formData.message.trim()) {
      newErrors.message = t('contact.form.message.error.required');
    } else if (formData.message.trim().length < 10) {
      newErrors.message = t('contact.form.message.error.min');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current!,
        {
          publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        },
      );

      setIsSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error('FAILED...', error);
      alert(t('contact.form.failed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-light-surface dark:bg-dark-surface"
    >
      <div className="section-container">
        <ScrollReveal>
          <SectionHeading title={t('contact.title')} subtitle={t('contact.subtitle')} />
        </ScrollReveal>

        <ScrollReveal className="max-w-xl mx-auto">
          <Card>
            {isSubmitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center animate-scale-in">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
                <p className="text-slate-600 dark:text-slate-400">
                  {t('contact.success.message')}
                </p>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <FormField
                  label={t('contact.form.name.label')}
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  placeholder={t('contact.form.name.placeholder')}
                />

                <FormField
                  label={t('contact.form.email.label')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  placeholder={t('contact.form.email.placeholder')}
                />

                <FormField
                  label={t('contact.form.message.label')}
                  name="message"
                  type="textarea"
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  error={errors.message}
                  placeholder={t('contact.form.message.placeholder')}
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  isLoading={isSubmitting}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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

                {/* LinkedIn link */}
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
                      'transition-all duration-300 font-medium text-sm',
                    )}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </form>
            )}
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
