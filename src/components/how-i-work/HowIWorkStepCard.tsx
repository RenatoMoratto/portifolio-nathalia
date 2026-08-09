import { AnimatePresence, motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { HowIWorkStep } from '../../content';
import { useFlipCard } from '../../hooks/useFlipCard';
import { cn } from '../../utils/cn';
import { HowIWorkStepFront } from './HowIWorkStepFront';
import { HowIWorkStepBack } from './HowIWorkStepBack';

interface HowIWorkStepCardProps {
  step: HowIWorkStep;
  index: number;
  className?: string;
}

/** Prevents hidden faces from being announced and avoids nested buttons. */
export function HowIWorkStepCard({ step, index, className }: HowIWorkStepCardProps) {
  const { t } = useTranslation();
  const {
    isFlipped,
    isPinned,
    handleMouseEnter,
    handleMouseLeave,
    handlePointerDown,
    handleClick,
    handleKeyDown,
    unpin,
  } = useFlipCard();

  return (
    <div
      className={cn('relative w-full perspective-1000 group', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        type="button"
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        aria-pressed={isFlipped}
        aria-label={t('howIWork.card.aria', {
          number: index + 1,
          title: step.title,
        })}
        className={cn(
          'w-full text-left rounded-2xl preserve-3d',
          'grid grid-cols-1 grid-rows-1',
          'select-text',
          'transition-shadow duration-300',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
          'focus-visible:ring-offset-2 dark:focus-visible:ring-offset-dark-bg',
        )}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <HowIWorkStepFront step={step} index={index} hidden={isFlipped} />
        <HowIWorkStepBack step={step} hidden={!isFlipped} />
      </motion.button>

      <AnimatePresence>
        {isPinned && (
          <motion.button
            type="button"
            onClick={unpin}
            aria-label={t('howIWork.card.unpin')}
            className={cn(
              'group/pin absolute -top-2 -right-2 z-30',
              'flex items-center justify-center w-8 h-8 rounded-full',
              'bg-white dark:bg-dark-surface-elevated',
              'border border-light-border dark:border-dark-border',
              'text-primary-600 dark:text-primary-400',
              'ring-4 ring-slate-50 dark:ring-dark-surface shadow-sm',
              'transition-colors duration-200',
              'hover:bg-primary-50 dark:hover:bg-primary-900/30',
            )}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />

            {/* Hide duplicate tooltip text from assistive technology. */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute bottom-full right-0 mb-2',
                'w-max max-w-56 px-3 py-2 rounded-lg',
                'bg-slate-900 dark:bg-primary-950 text-white',
                'border border-slate-800 dark:border-primary-900 shadow-xl',
                'text-xs font-medium text-left leading-snug whitespace-normal',
                'opacity-0 translate-y-1',
                'transition duration-200 ease-out-quart',
                'group-hover/pin:opacity-100 group-hover/pin:translate-y-0',
                'group-focus-visible/pin:opacity-100',
                'group-focus-visible/pin:translate-y-0',
              )}
            >
              {t('howIWork.card.unpin')}
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
