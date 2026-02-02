import { SocialIcons } from '../components';
import { personalInfo } from '../data/portfolio';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center md:text-left">
            © {currentYear} {personalInfo.name}. All rights reserved.
          </p>

          <SocialIcons size="sm" />

          <p className="text-slate-500 dark:text-slate-500 text-sm">
            Built with React, TypeScript & Three.js
          </p>
        </div>
      </div>
    </footer>
  );
}
