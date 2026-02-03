import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

export function LanguageToggle() {
  const { i18n } = useTranslation();

  return (
    <div
      className={cn(
        'flex items-center bg-slate-100 dark:bg-slate-800 rounded-full p-1 border border-slate-200 dark:border-slate-700',
        'transition-colors duration-300',
      )}
    >
      <button
        onClick={() => i18n.changeLanguage('pt')}
        className={cn(
          'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300',
          i18n.language === 'pt'
            ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        )}
        aria-label="Português"
        aria-pressed={i18n.language === 'pt'}
      >
        PT
      </button>
      <button
        onClick={() => i18n.changeLanguage('en')}
        className={cn(
          'px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300',
          i18n.language === 'en'
            ? 'bg-white dark:bg-slate-700 text-primary-600 dark:text-primary-400 shadow-sm'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200',
        )}
        aria-label="English"
        aria-pressed={i18n.language === 'en'}
      >
        EN
      </button>
    </div>
  );
}
