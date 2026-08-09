import { describe, expect, it } from 'vitest';
import { en } from './en';
import { pt } from './pt';

/** Catches locale drift that i18next would otherwise render as raw keys. */
function flatten(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [prefix];
  }
  return Object.entries(value as Record<string, unknown>).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key),
  );
}

const enKeys = flatten(en.translation).sort();
const ptKeys = flatten(pt.translation).sort();

describe('locale parity', () => {
  it('defines exactly the same keys in both languages', () => {
    expect(ptKeys).toEqual(enKeys);
  });

  it('has no empty translation values', () => {
    for (const [name, bundle] of [
      ['en', en.translation],
      ['pt', pt.translation],
    ] as const) {
      const empties = flatten(bundle).filter((key) => {
        const value = key
          .split('.')
          .reduce<unknown>(
            (acc, part) => (acc as Record<string, unknown> | undefined)?.[part],
            bundle,
          );
        return typeof value === 'string' && value.trim() === '';
      });
      expect(empties, `${name} has empty values`).toEqual([]);
    }
  });
});

describe('locale key shapes the code depends on', () => {
  it.each(['en', 'pt'])('%s exposes nested field error messages', (lang) => {
    const bundle = lang === 'en' ? en.translation : pt.translation;
    expect(typeof bundle.contact.form.name.error.required).toBe('string');
    expect(typeof bundle.contact.form.email.error.required).toBe('string');
    expect(typeof bundle.contact.form.email.error.invalid).toBe('string');
    expect(typeof bundle.contact.form.message.error.required).toBe('string');
    expect(typeof bundle.contact.form.message.error.min).toBe('string');
  });

  it.each(['en', 'pt'])('%s keeps interpolation placeholders intact', (lang) => {
    const bundle = lang === 'en' ? en.translation : pt.translation;
    expect(bundle.projects.coverAlt).toContain('{{title}}');
    expect(bundle.howIWork.card.aria).toContain('{{number}}');
    expect(bundle.howIWork.card.aria).toContain('{{title}}');
    expect(bundle.projects.laneToggle.liveRegion).toContain('{{lane}}');
  });
});
