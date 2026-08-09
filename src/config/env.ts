/** Missing EmailJS credentials disable the form instead of failing at submission. */

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

export const isContactFormEnabled = emailConfig !== null;
