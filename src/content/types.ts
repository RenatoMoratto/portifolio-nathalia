/**
 * Content layer contracts.
 *
 * Domain content (projects, work history, process steps) lives here rather than
 * in the i18n resource bundle. Two reasons:
 *
 * 1. `t(key, { returnObjects: true })` returns a *new array reference on every
 *    call*, which silently defeats `useMemo` and re-fires effects on every
 *    render. Module-level constants are referentially stable.
 * 2. Reading entities out of i18n required unchecked `as Project[]` casts.
 *    Declaring them here means the compiler actually checks their shape.
 *
 * The i18n bundle keeps what it is good at: UI strings, labels and aria text.
 */

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

/**
 * Map an i18next language tag onto a supported language.
 * Handles regional tags (`pt-BR`, `en-US`) and unknown values.
 */
export function normalizeLanguage(language: string | undefined): Language {
  const base = language?.split('-')[0]?.toLowerCase();
  return LANGUAGES.includes(base as Language) ? (base as Language) : DEFAULT_LANGUAGE;
}

/**
 * Pick the language the app boots in from the visitor's browser preferences.
 *
 * `navigator.languages` is ordered by preference, so the first entry that maps
 * onto a supported language wins - a visitor with `['fr', 'pt-BR', 'en']` gets
 * Portuguese, not English. Anything unsupported falls through to
 * `DEFAULT_LANGUAGE`. The argument exists so tests can supply their own list.
 */
export function detectLanguage(
  preferred: readonly string[] = typeof navigator === 'undefined'
    ? []
    : (navigator.languages ?? [navigator.language]),
): Language {
  for (const tag of preferred) {
    const base = tag?.split('-')[0]?.toLowerCase();
    if (LANGUAGES.includes(base as Language)) {
      return base as Language;
    }
  }
  return DEFAULT_LANGUAGE;
}

/** One heading plus its paragraphs. */
export interface ProjectSection {
  heading: string;
  content: string[];
}

/** Project fields that identify it and must be identical across languages. */
export interface ProjectBase {
  slug: string;
  coverImage?: string;
  /** Role(s), e.g. UX design, UI design, UX Research, QA */
  role?: string;
  /** Platform(s), e.g. iOS and Android */
  platform?: string;
  /** Design tools used, e.g. Figma, Balsamiq, paper */
  designTools?: string;
}

/** Localized prose for a project. */
export interface ProjectContent {
  title: string;
  /** Card summary, drawn from the fast lane intro. */
  shortDescription: string;
  fastLane: ProjectSection[];
  slowLane: ProjectSection[];
}

/** How a project is authored. */
export interface ProjectEntry extends ProjectBase {
  locales: Record<Language, ProjectContent>;
}

/** How a project is consumed, once resolved for one language. */
export interface Project extends ProjectBase, ProjectContent {}

/** Experience fields shared across languages. */
export interface ExperienceBase {
  id: number;
  company: string;
  /** Calendar month, `YYYY-MM`. */
  startDate: string;
  /** Calendar month, `YYYY-MM`. Absent means "present". */
  endDate?: string;
}

/** Localized prose for one role. */
export interface ExperienceContent {
  role: string;
  description: string;
  highlights: string[];
}

export interface ExperienceEntry extends ExperienceBase {
  locales: Record<Language, ExperienceContent>;
}

export interface Experience extends ExperienceBase, ExperienceContent {}

export interface HowIWorkStepBase {
  id: number;
}

export interface HowIWorkStepContent {
  title: string;
  description: string;
  tools: string[];
  /**
   * What the practice looks like day to day. Deliberately *not* named `process`:
   * these are things done in this practice, not ordered stages of a pipeline.
   */
  practices: string[];
}

export interface HowIWorkStepEntry extends HowIWorkStepBase {
  locales: Record<Language, HowIWorkStepContent>;
}

export interface HowIWorkStep extends HowIWorkStepBase, HowIWorkStepContent {}
