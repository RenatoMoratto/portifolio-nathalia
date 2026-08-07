import { describe, expect, it } from 'vitest';
import { slugifyHeading } from './slug';

/**
 * Section ids are produced here and looked up with `getElementById` by the
 * project nav. If the two ever disagree the nav silently stops scrolling, so
 * the rule is pinned by tests.
 */
describe('slugifyHeading', () => {
  it('lowercases and hyphenates', () => {
    expect(slugifyHeading('MY ROLE')).toBe('my-role');
  });

  it('transliterates accents instead of dropping them', () => {
    // Previously produced the lossy 'prototipao-e-testes'.
    expect(slugifyHeading('PROTOTIPAÇÃO E TESTES')).toBe('prototipacao-e-testes');
    expect(slugifyHeading('SOLUÇÃO')).toBe('solucao');
    expect(slugifyHeading('IDEAÇÃO')).toBe('ideacao');
    expect(slugifyHeading('JORNADA DO USUÁRIO')).toBe('jornada-do-usuario');
    expect(slugifyHeading('SÍNTESE E PRIORIZAÇÃO')).toBe('sintese-e-priorizacao');
  });

  it('keeps accented headings distinct from one another', () => {
    expect(slugifyHeading('SOLUÇÃO')).not.toBe(slugifyHeading('SESSÃO'));
  });

  it('collapses whitespace and trims', () => {
    expect(slugifyHeading('  spaced   out  ')).toBe('spaced-out');
  });

  it('strips punctuation without leaving stray hyphens', () => {
    expect(slugifyHeading('Results & Learnings!')).toBe('results-learnings');
  });

  it('produces a valid fragment for an empty heading', () => {
    expect(slugifyHeading('')).toBe('');
  });

  it('is idempotent', () => {
    const once = slugifyHeading('PROTOTIPAÇÃO E TESTES');
    expect(slugifyHeading(once)).toBe(once);
  });
});
