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
    build: {
      rollupOptions: {
        output: {
          /*
           * Split the heavy, rarely-changing dependencies out of the app chunk.
           * three/drei is only needed by the hero decoration and is lazy-loaded,
           * so keeping it in its own chunk stops it blocking initial render.
           */
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
            i18n: ['i18next', 'react-i18next'],
          },
        },
      },
    },
  };
});
