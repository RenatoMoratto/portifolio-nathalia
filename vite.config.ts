import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Env vars the production bundle cannot function without.
 *
 * Vite silently inlines `undefined` for missing `VITE_*` values, so a build with
 * no `.env` used to succeed and ship a contact form that failed on every
 * submission. Failing the build is far cheaper than discovering it in
 * production.
 */
const REQUIRED_BUILD_ENV = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY',
];

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_');
    const missing = REQUIRED_BUILD_ENV.filter((key) => !env[key]);
    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variable(s): ${missing.join(', ')}.\n` +
          'Copy .env.example to .env and fill in your EmailJS credentials, ' +
          'or set them in your deployment environment.',
      );
    }
  }

  return {
    plugins: [react()],
  };
});
