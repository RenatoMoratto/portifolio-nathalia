import { describe, expect, it } from 'vitest';
import { formatMonthYear, formatPeriod } from './date';

/**
 * Regression cover for the timezone bug: `new Date('2023-12')` parses as UTC
 * midnight, so formatting it in a timezone behind UTC used to render November.
 * Every assertion below would fail against the old local-timezone formatter
 * when run in `America/Sao_Paulo`.
 */
describe('formatMonthYear', () => {
  it('keeps the authored month for a YYYY-MM value', () => {
    expect(formatMonthYear('2023-12', 'en')).toBe('Dec 2023');
  });

  it('does not shift the month in a timezone behind UTC', () => {
    // The bug: this returned "nov. de 2023" for viewers in Brazil.
    expect(formatMonthYear('2023-12', 'pt')).toMatch(/dez/i);
    expect(formatMonthYear('2023-12', 'pt')).toContain('2023');
  });

  it('does not shift the month in a timezone ahead of UTC', () => {
    expect(formatMonthYear('2024-01', 'en')).toBe('Jan 2024');
  });

  it('handles a year boundary without rolling back a year', () => {
    expect(formatMonthYear('2025-01', 'en')).toBe('Jan 2025');
  });

  it('returns the raw value for an unparseable date rather than "Invalid Date"', () => {
    expect(formatMonthYear('not-a-date', 'en')).toBe('not-a-date');
  });
});

describe('formatPeriod', () => {
  it('renders a closed period', () => {
    expect(formatPeriod('2024-01', '2024-12', 'en', 'Present')).toBe(
      'Jan 2024 – Dec 2024',
    );
  });

  it('uses the present label when there is no end date', () => {
    expect(formatPeriod('2023-12', undefined, 'en', 'Present')).toBe(
      'Dec 2023 – Present',
    );
  });

  it('localizes the present label', () => {
    expect(formatPeriod('2023-12', undefined, 'pt', 'Atual')).toContain('Atual');
  });
});
