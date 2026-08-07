import emailjs from '@emailjs/browser';
import { emailConfig } from '../config/env';

/** Why a send failed, so the UI can say something specific. */
export type ContactFailureReason = 'unconfigured' | 'send-failed';

export type SendContactResult =
  { ok: true } | { ok: false; reason: ContactFailureReason };

/**
 * Send the contact form through EmailJS.
 *
 * Components do not talk to EmailJS directly: keeping the call here means the
 * credential handling, the failure taxonomy and the logging live in one place,
 * and the form component stays about rendering.
 */
export async function sendContactForm(form: HTMLFormElement): Promise<SendContactResult> {
  if (!emailConfig) {
    return { ok: false, reason: 'unconfigured' };
  }

  try {
    await emailjs.sendForm(emailConfig.serviceId, emailConfig.templateId, form, {
      publicKey: emailConfig.publicKey,
    });
    return { ok: true };
  } catch (error) {
    // Never swallow: the reason is surfaced to the user *and* logged for us.
    console.error('[contact] EmailJS sendForm failed', error);
    return { ok: false, reason: 'send-failed' };
  }
}
