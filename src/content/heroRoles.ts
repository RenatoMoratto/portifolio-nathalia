/**
 * Rotating role titles for the hero typewriter.
 *
 * These are identical in every locale (they are industry job titles that are
 * not translated), so they are declared once here rather than duplicated in
 * each locale file. Being a module constant also gives `useTypewriter` a
 * referentially stable input - it previously received a fresh array on every
 * render and restarted its timer.
 */
export const HERO_ROLES: readonly string[] = [
  'UX Designer',
  'UX Researcher',
  'Quality Assurance',
  'Information Architect',
];
