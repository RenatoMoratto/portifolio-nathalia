import { SocialIcons } from '../components';
import { personalInfo } from '../data/portfolio';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 bg-slate-50/80 dark:bg-slate-900/30 border-t border-slate-200/80 dark:border-slate-800/50">
      <div className="section-container">
        <div className="flex flex-col items-center justify-between gap-2">
          <SocialIcons size="sm" />
          <p className="text-slate-500 dark:text-slate-500 text-sm text-center">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
