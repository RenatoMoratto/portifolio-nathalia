import { useCallback, useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { sendContactForm, type ContactFailureReason } from '../services/contact';

const SUCCESS_RESET_MS = 5000;
const MIN_MESSAGE_LENGTH = 10;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactFormValues, string>>;

/**
 * Submission state as an explicit union.
 *
 * The previous `isSubmitting` / `isSubmitted` boolean pair allowed impossible
 * combinations (both true) and had no representation for "failed" at all -
 * failures went to `alert()`.
 */
export type ContactStatus =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; reason: ContactFailureReason };

const EMPTY_VALUES: ContactFormValues = { name: '', email: '', message: '' };

export function useContactForm() {
  const { t } = useTranslation();
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [status, setStatus] = useState<ContactStatus>({ kind: 'idle' });

  // Auto-dismiss the success panel, but never outlive the component.
  useEffect(() => {
    if (status.kind !== 'success') return;
    const timeoutId = window.setTimeout(
      () => setStatus({ kind: 'idle' }),
      SUCCESS_RESET_MS,
    );
    return () => window.clearTimeout(timeoutId);
  }, [status.kind]);

  const setField = useCallback((field: keyof ContactFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as soon as the user edits it.
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const validate = useCallback((): ContactFieldErrors => {
    const next: ContactFieldErrors = {};

    if (!values.name.trim()) {
      next.name = t('contact.form.name.error.required');
    }

    if (!values.email.trim()) {
      next.email = t('contact.form.email.error.required');
    } else if (!EMAIL_PATTERN.test(values.email)) {
      next.email = t('contact.form.email.error.invalid');
    }

    if (!values.message.trim()) {
      next.message = t('contact.form.message.error.required');
    } else if (values.message.trim().length < MIN_MESSAGE_LENGTH) {
      next.message = t('contact.form.message.error.min');
    }

    return next;
  }, [values, t]);

  const handleSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (status.kind === 'submitting') return; // guard against double submits

      const nextErrors = validate();
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) return;

      const form = formRef.current;
      if (!form) return;

      setStatus({ kind: 'submitting' });
      const result = await sendContactForm(form);

      if (result.ok) {
        setValues(EMPTY_VALUES);
        setStatus({ kind: 'success' });
      } else {
        setStatus({ kind: 'error', reason: result.reason });
      }
    },
    [status.kind, validate],
  );

  return { formRef, values, errors, status, setField, handleSubmit };
}
