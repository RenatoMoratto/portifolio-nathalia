import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { HowIWorkStep } from '../../content';
import { useFlipCard } from '../../hooks/useFlipCard';
import { cn } from '../../utils/cn';
import { HowIWorkStepFront } from './HowIWorkStepFront';
import { HowIWorkStepBack } from './HowIWorkStepBack';

interface HowIWorkStepCardProps {
  step: HowIWorkStep;
  index: number;
  /** Allow the timeline to pass layout classes. */
  className?: string;
}

/**
 * A step rendered as a flip card.
 *
 * The interactive element is a real `<button>` rather than a `div[role=button]`,
 * so it is focusable, announces its pressed state, and handles Enter/Space
 * natively. The face that is rotated away is marked `inert` + `aria-hidden`,
 * because a CSS backface transform does not remove content from the
 * accessibility tree - without it both faces are announced at once.
 */
export function HowIWorkStepCard({ step, index, className }: HowIWorkStepCardProps) {
  const { t } = useTranslation();
  const { isFlipped, handleMouseEnter, handleMouseLeave, toggle, handleKeyDown } =
    useFlipCard();

  return (
    <div
      className={cn('relative w-full perspective-1000 group', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        type="button"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-pressed={isFlipped}
        aria-label={t('howIWork.card.aria', {
          number: index + 1,
          title: step.title,
        })}
        className={cn(
          'w-full text-left rounded-2xl preserve-3d',
          'grid grid-cols-1 grid-rows-1',
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
    </div>
  );
}
