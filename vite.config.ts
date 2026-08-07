import { copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
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

/**
 * Public path used by local production builds (`npm run build`, `npm run
 * preview`).
 *
 * GitHub Pages serves a project site from `/<repository>/`, so every asset and
 * router URL needs that prefix. The deploy workflow overrides it with the path
 * GitHub reports for the Pages site itself, which means pointing a custom
 * domain at the site changes the deployed base with no code change; only this
 * local default has to follow, becoming `/`.
 */
const DEFAULT_BASE_PATH = '/portifolio-nathalia/';

/** Vite expects a base with both a leading and a trailing slash. */
function normalizeBasePath(value: string): string {
  const withLeadingSlash = value.startsWith('/') ? value : `/${value}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash : `${withLeadingSlash}/`;
}

/**
 * Copies the built `index.html` to `404.html`.
 *
 * GitHub Pages has no SPA rewrite rule: a request for `/about` matches no file
 * on disk, so Pages serves `404.html` instead. Making that file the app shell
 * lets the client router read the route off the URL the browser already has, so
 * deep links and refreshes resolve without moving the app onto hash URLs or
 * bouncing through a redirect.
 */
function spaFallback(): Plugin {
  let outDir = '';

  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      copyFileSync(resolve(outDir, 'index.html'), resolve(outDir, '404.html'));
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ command, mode, isPreview }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');

  if (command === 'build') {
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
    /*
     * The dev server stays at the root so `npm run dev` is unchanged; `vite
     * preview` takes the deployed path so the built output is exercised the way
     * Pages will actually serve it.
     */
    base:
      command === 'build' || isPreview
        ? normalizeBasePath(env.VITE_BASE_PATH || DEFAULT_BASE_PATH)
        : '/',
    plugins: [react(), spaFallback()],
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
