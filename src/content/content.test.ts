import { describe, expect, it, vi } from 'vitest';
import { detectLanguage, LANGUAGES, normalizeLanguage } from './types';
import { PROJECTS } from './projects';
import { EXPERIENCES } from './experience';
import { HOW_I_WORK_STEPS } from './howIWork';
import { getValidSections } from './index';
import { slugifyHeading } from '../utils/slug';

describe('normalizeLanguage', () => {
  it('accepts the supported languages', () => {
    expect(normalizeLanguage('pt')).toBe('pt');
    expect(normalizeLanguage('en')).toBe('en');
  });

  it('maps regional tags onto their base language', () => {
    expect(normalizeLanguage('pt-BR')).toBe('pt');
    expect(normalizeLanguage('en-US')).toBe('en');
  });

  it('falls back to English for unknown or missing values', () => {
    expect(normalizeLanguage('fr')).toBe('en');
    expect(normalizeLanguage(undefined)).toBe('en');
    expect(normalizeLanguage('')).toBe('en');
  });
});

describe('detectLanguage', () => {
  it('honours the visitor first preference', () => {
    expect(detectLanguage(['pt-BR', 'en-US'])).toBe('pt');
    expect(detectLanguage(['en-US', 'pt-BR'])).toBe('en');
  });

  it('skips unsupported languages instead of giving up on the list', () => {
    expect(detectLanguage(['fr', 'es', 'pt-BR'])).toBe('pt');
  });

  it('ignores tag casing', () => {
    expect(detectLanguage(['PT-br'])).toBe('pt');
  });

  it('falls back to English when nothing matches', () => {
    expect(detectLanguage(['fr', 'de'])).toBe('en');
    expect(detectLanguage([])).toBe('en');
  });

  it('reads navigator.languages when no list is passed', () => {
    const languages = vi.spyOn(navigator, 'languages', 'get');

    languages.mockReturnValue(['pt-BR', 'en-US']);
    expect(detectLanguage()).toBe('pt');

    languages.mockReturnValue(['en-GB']);
    expect(detectLanguage()).toBe('en');

    languages.mockRestore();
  });
});

describe('content completeness', () => {
  it.each(LANGUAGES)('every project has %s prose', (language) => {
    for (const project of PROJECTS) {
      const content = project.locales[language];
      expect(content, `${project.slug} is missing ${language}`).toBeDefined();
      expect(content.title.trim()).not.toBe('');
      expect(content.shortDescription.trim()).not.toBe('');
      expect(content.fastLane.length).toBeGreaterThan(0);
      expect(content.slowLane.length).toBeGreaterThan(0);
    }
  });

  it.each(LANGUAGES)('every experience has %s prose', (language) => {
    for (const experience of EXPERIENCES) {
      const content = experience.locales[language];
      expect(content, `experience ${experience.id} missing ${language}`).toBeDefined();
      expect(content.role.trim()).not.toBe('');
      expect(content.highlights.length).toBeGreaterThan(0);
    }
  });

  it.each(LANGUAGES)('every practice has %s prose', (language) => {
    for (const step of HOW_I_WORK_STEPS) {
      const content = step.locales[language];
      expect(content).toBeDefined();
      expect(content.tools.length).toBeGreaterThan(0);
      expect(content.practices.length).toBeGreaterThan(0);
    }
  });
});

describe('project identity', () => {
  it('has unique slugs', () => {
    const slugs = PROJECTS.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('has URL-safe slugs', () => {
    for (const project of PROJECTS) {
      expect(project.slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  // IDs only need to be unique within the mounted lane.
  it.each(LANGUAGES)('generates unique section ids per lane in %s', (language) => {
    for (const project of PROJECTS) {
      for (const lane of ['fastLane', 'slowLane'] as const) {
        const sections = getValidSections(project.locales[language][lane]);
        const ids = sections.map((s) => slugifyHeading(s.heading));
        expect(
          new Set(ids).size,
          `${project.slug}/${language}/${lane} has duplicate ids: ${ids.join(', ')}`,
        ).toBe(ids.length);
        for (const id of ids) expect(id).not.toBe('');
      }
    }
  });
});

describe('experience identity', () => {
  it('has unique ids', () => {
    const ids = EXPERIENCES.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('uses YYYY-MM dates that parse', () => {
    for (const experience of EXPERIENCES) {
      expect(experience.startDate).toMatch(/^\d{4}-\d{2}$/);
      expect(Number.isNaN(new Date(experience.startDate).getTime())).toBe(false);
      if (experience.endDate) {
        expect(experience.endDate).toMatch(/^\d{4}-\d{2}$/);
        expect(new Date(experience.endDate) >= new Date(experience.startDate)).toBe(true);
      }
    }
  });

  it('has at most one ongoing role', () => {
    const ongoing = EXPERIENCES.filter((e) => !e.endDate);
    expect(ongoing.length).toBeLessThanOrEqual(1);
  });
});

describe('getValidSections', () => {
  it('drops sections with no paragraphs', () => {
    const sections = getValidSections([
      { heading: 'KEEP', content: ['text'] },
      { heading: 'DROP', content: [] },
    ]);
    expect(sections.map((s) => s.heading)).toEqual(['KEEP']);
  });

  it('returns an empty array for empty input', () => {
    expect(getValidSections([])).toEqual([]);
  });
});
