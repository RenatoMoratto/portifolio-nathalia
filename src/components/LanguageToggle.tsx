import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'pt' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className={cn(
        'p-2 rounded-full transition-colors',
        'text-slate-600 dark:text-slate-400 hover:text-primary-500 dark:hover:text-primary-400',
        'font-medium text-sm flex items-center gap-1',
      )}
      aria-label="Toggle language"
    >
      <span
        className={cn(
          i18n.language === 'pt'
            ? 'font-bold text-primary-600 dark:text-primary-400'
            : 'opacity-70',
        )}
      >
        PT
      </span>
      <span className="opacity-30">|</span>
      <span
        className={cn(
          i18n.language === 'en'
            ? 'font-bold text-primary-600 dark:text-primary-400'
            : 'opacity-70',
        )}
      >
        EN
      </span>
    </button>
  );
}
