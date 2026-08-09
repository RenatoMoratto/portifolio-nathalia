import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { normalizeLanguage } from '../content';

/** Keeps the document language accurate for screen readers and crawlers. */
export function DocumentLanguage() {
  const { i18n } = useTranslation();
  const language = normalizeLanguage(i18n.language);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return null;
}
