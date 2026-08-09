import emailjs from '@emailjs/browser';
import { emailConfig } from '../config/env';

export type ContactFailureReason = 'unconfigured' | 'send-failed';

export type SendContactResult =
  { ok: true } | { ok: false; reason: ContactFailureReason };

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
    console.error('[contact] EmailJS sendForm failed', error);
    return { ok: false, reason: 'send-failed' };
  }
}
