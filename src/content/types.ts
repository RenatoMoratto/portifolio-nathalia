/** Keeps domain content typed and referentially stable outside i18n. */

export const LANGUAGES = ['pt', 'en'] as const;
export type Language = (typeof LANGUAGES)[number];

export const DEFAULT_LANGUAGE: Language = 'en';

export function normalizeLanguage(language: string | undefined): Language {
  const base = language?.split('-')[0]?.toLowerCase();
  return LANGUAGES.includes(base as Language) ? (base as Language) : DEFAULT_LANGUAGE;
}

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

export interface ProjectSection {
  heading: string;
  content: string[];
}

/** Project identity shared across locales. */
export interface ProjectBase {
  slug: string;
  coverImage?: string;
  role?: string;
  platform?: string;
  designTools?: string;
}

export interface ProjectContent {
  title: string;
  /** Card summary, drawn from the fast lane intro. */
  shortDescription: string;
  fastLane: ProjectSection[];
  slowLane: ProjectSection[];
}

export interface ProjectEntry extends ProjectBase {
  locales: Record<Language, ProjectContent>;
}

export interface Project extends ProjectBase, ProjectContent {}

export interface ExperienceBase {
  id: number;
  company: string;
  /** Calendar month, `YYYY-MM`. */
  startDate: string;
  /** Calendar month, `YYYY-MM`. Absent means "present". */
  endDate?: string;
}

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
  /** Day-to-day activities, not ordered stages. */
  practices: string[];
}

export interface HowIWorkStepEntry extends HowIWorkStepBase {
  locales: Record<Language, HowIWorkStepContent>;
}

export interface HowIWorkStep extends HowIWorkStepBase, HowIWorkStepContent {}
