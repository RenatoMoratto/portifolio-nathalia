/**
 * Date formatting helpers.
 *
 * All dates in the content layer are *calendar* values with no time component
 * (`YYYY-MM` or `YYYY-MM-DD`). `new Date('2023-12')` is parsed by ECMAScript as
 * UTC midnight, so formatting it in the viewer's local timezone shifts it back a
 * month for anyone west of UTC (e.g. `America/Sao_Paulo` renders "nov 2023").
 *
 * Every formatter here therefore pins `timeZone: 'UTC'` to keep the rendered
 * month equal to the authored month regardless of where the viewer is.
 */

/** Formatters are relatively expensive to construct, so reuse them per language. */
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

/** Format a calendar month as e.g. "dez. de 2023" / "Dec 2023". */
export function formatMonthYear(date: string, language: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return getMonthYearFormatter(language).format(parsed);
}

/**
 * Format an employment period as "start – end", falling back to `presentText`
 * when there is no end date.
 */
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
