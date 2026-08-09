import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';

interface ResumeButtonProps {
  className?: string;
}

export function ResumeButton({ className }: ResumeButtonProps) {
  const { t, i18n } = useTranslation();

  const handleResumeClick = () => {
    // Include Vite's base for subdirectory deployments.
    const resumeFile = i18n.language === 'pt' ? 'resume-pt.pdf' : 'resume-en.pdf';
    window.open(`${import.meta.env.BASE_URL}${resumeFile}`, '_blank');
  };

  return (
    <button
      onClick={handleResumeClick}
      className={cn(
        'px-4 py-2 rounded-full font-medium text-sm transition-all duration-300',
        'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white',
        'hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500',
        'border border-slate-200 dark:border-slate-700',
        className,
      )}
      aria-label={t('nav.resume', 'Resume')}
    >
      CV
    </button>
  );
}
