import type { HowIWorkStep } from '../../content';
import { cn } from '../../utils/cn';

interface HowIWorkStepBackProps {
  step: HowIWorkStep;
}

export function HowIWorkStepBack({ step }: HowIWorkStepBackProps) {
  const { tools, process } = step;

  return (
    <div
      className={cn(
        'w-full h-full backface-hidden rotate-y-180', // Removed absolute inset-0
        'col-start-1 row-start-1', // Stack in grid
        'flex flex-col p-6 md:p-8',
        'bg-slate-900 dark:bg-primary-950', // Darker background for contrast
        'border border-slate-800 dark:border-primary-900',
        'rounded-2xl shadow-xl',
        'text-white',
      )}
    >
      <div className="space-y-6 h-full flex flex-col justify-center">
        {/* Tools Section */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-primary-400 mb-3">
            Tools
          </h4>
          <div className="flex flex-wrap gap-2">
            {tools.map((tool, i) => (
              <span
                key={i}
                className="px-2 py-1 rounded-md bg-white/10 text-xs text-slate-200 border border-white/5"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Process Section */}
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-primary-400 mb-3">
            Process
          </h4>
          <ul className="space-y-2">
            {process.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-500 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
