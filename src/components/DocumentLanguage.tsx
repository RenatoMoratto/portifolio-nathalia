import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../content';

/**
 * Keeps `<html lang>` in sync with the active i18n language.
 *
 * `index.html` can only ship one static value, but the app defaults to
 * Portuguese and switches at runtime. A stale `lang` makes screen readers apply
 * the wrong pronunciation rules and misreports the page language to crawlers.
 */
export function DocumentLanguage() {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
