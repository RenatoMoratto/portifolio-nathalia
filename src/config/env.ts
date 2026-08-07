/**
 * Centralized, validated access to build-time configuration.
 *
 * Vite inlines `import.meta.env.VITE_*` at build time and substitutes
 * `undefined` for anything missing - with no warning. Reading those values
 * directly inside a component meant a build with no `.env` produced a bundle
 * containing `publicKey: void 0` and a contact form that failed on every
 * submission, surfacing only as a runtime alert.
 *
 * `vite.config.ts` now fails `vite build` outright when these are missing. This
 * module is the second line of defence: in dev, or if a host injects an empty
 * value, `emailConfig` is `null` and the UI degrades to an explicit
 * "unavailable" state instead of pretending to send.
 */

export interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

function readEmailConfig(): EmailConfig | null {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    const missing = [
      !serviceId && 'VITE_EMAILJS_SERVICE_ID',
      !templateId && 'VITE_EMAILJS_TEMPLATE_ID',
      !publicKey && 'VITE_EMAILJS_PUBLIC_KEY',
    ].filter(Boolean);

    console.error(
      `[config] Contact form disabled - missing env var(s): ${missing.join(', ')}. ` +
        'Copy .env.example to .env and fill in your EmailJS credentials.',
    );
    return null;
  }

  return { serviceId, templateId, publicKey };
}

export const emailConfig: EmailConfig | null = readEmailConfig();

/** Whether the contact form can actually submit. */
export const isContactFormEnabled = emailConfig !== null;
