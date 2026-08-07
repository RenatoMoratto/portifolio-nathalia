import { useTranslation } from 'react-i18next';
import { LANGUAGES, normalizeLanguage } from './types';
import type {
  Experience,
  HowIWorkStep,
  Language,
  Project,
  ProjectSection,
} from './types';
import { PROJECTS } from './projects';
import { EXPERIENCES } from './experience';
import { HOW_I_WORK_STEPS } from './howIWork';

export type {
  Experience,
  HowIWorkStep,
  Language,
  Project,
  ProjectSection,
} from './types';
export { normalizeLanguage, LANGUAGES, DEFAULT_LANGUAGE } from './types';
export { HERO_ROLES } from './heroRoles';
export { personalInfo } from './personalInfo';

/**
 * Resolve every entry for every language exactly once, at module load.
 *
 * This is the whole point of the content layer: each hook below returns a value
 * that is `===` stable for the lifetime of the language, so `useMemo` works and
 * effects depending on these arrays fire only when the language actually
 * changes. Resolving inside a hook would hand out a fresh array per render.
 */
function byLanguage<TEntry extends { locales: Record<Language, object> }, TOut>(
  entries: readonly TEntry[],
  resolve: (entry: TEntry, language: Language) => TOut,
): Record<Language, TOut[]> {
  return Object.fromEntries(
    LANGUAGES.map((language) => [
      language,
      entries.map((entry) => resolve(entry, language)),
    ]),
  ) as Record<Language, TOut[]>;
}

const PROJECTS_BY_LANGUAGE = byLanguage(PROJECTS, ({ locales, ...base }, language) => ({
  ...base,
  ...locales[language],
})) as Record<Language, Project[]>;

/** Work history, ordered oldest first so the timeline reads left to right. */
const EXPERIENCES_BY_LANGUAGE = byLanguage(
  EXPERIENCES,
  ({ locales, ...base }, language) => ({ ...base, ...locales[language] }),
) as Record<Language, Experience[]>;

for (const language of LANGUAGES) {
  EXPERIENCES_BY_LANGUAGE[language].sort((a, b) => {
    const aEnd = a.endDate ? new Date(a.endDate).getTime() : Infinity;
    const bEnd = b.endDate ? new Date(b.endDate).getTime() : Infinity;
    return aEnd - bEnd;
  });
}

const HOW_I_WORK_BY_LANGUAGE = byLanguage(
  HOW_I_WORK_STEPS,
  ({ locales, ...base }, language) => ({ ...base, ...locales[language] }),
) as Record<Language, HowIWorkStep[]>;

/** The currently active content language. */
export function useContentLanguage(): Language {
  const { i18n } = useTranslation();
  return normalizeLanguage(i18n.language);
}

/** All projects, in authoring order. Referentially stable per language. */
export function useProjects(): Project[] {
  return PROJECTS_BY_LANGUAGE[useContentLanguage()];
}

/** A single project by slug, or `undefined` when the slug is unknown. */
export function useProject(slug: string | undefined): Project | undefined {
  const projects = useProjects();
  return slug === undefined ? undefined : projects.find((p) => p.slug === slug);
}

/** Work history, oldest first. Referentially stable per language. */
export function useExperiences(): Experience[] {
  return EXPERIENCES_BY_LANGUAGE[useContentLanguage()];
}

/** Design practices. Referentially stable per language. */
export function useHowIWorkSteps(): HowIWorkStep[] {
  return HOW_I_WORK_BY_LANGUAGE[useContentLanguage()];
}

/** Sections that actually have content. Shared by the page and its nav. */
export function getValidSections(sections: ProjectSection[]): ProjectSection[] {
  return sections.filter((section) => section.content && section.content.length > 0);
}
