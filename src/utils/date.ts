/** Pins calendar-only dates to UTC so their month cannot shift by viewer timezone. */

/** Reuses the relatively expensive formatter per language. */
const monthYearFormatters = new Map<string, Intl.DateTimeFormat>();

function getMonthYearFormatter(language: string): Intl.DateTimeFormat {
  let formatter = monthYearFormatters.get(language);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(language, {
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    });
    monthYearFormatters.set(language, formatter);
  }
  return formatter;
}

export function formatMonthYear(date: string, language: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return getMonthYearFormatter(language).format(parsed);
}

export function formatPeriod(
  startDate: string,
  endDate: string | undefined,
  language: string,
  presentText: string,
): string {
  const start = formatMonthYear(startDate, language);
  const end = endDate ? formatMonthYear(endDate, language) : presentText;
  return `${start} – ${end}`;
}
