import { motion } from 'framer-motion';
import type { HowIWorkStep } from '../../data/howIWorkSteps';
import { useFlipCard } from '../../hooks/useFlipCard';
import { cn } from '../../utils/cn';
import { HowIWorkStepFront } from './HowIWorkStepFront';
import { HowIWorkStepBack } from './HowIWorkStepBack';

interface HowIWorkStepCardProps {
  step: HowIWorkStep;
  index: number;
  className?: string; // Allow passing layout classes
}

export function HowIWorkStepCard({ step, index, className }: HowIWorkStepCardProps) {
  const {
    isFlipped,
    handleMouseEnter,
    handleMouseLeave,
    handleFocus,
    handleBlur,
    handleClick,
    handleKeyDown,
  } = useFlipCard();

  return (
    <div
      className={cn('relative w-full perspective-1000 group', className)} // Removed fixed height
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-expanded={isFlipped}
      aria-label={`Step ${index + 1}: ${step.translationKey}`} // Adjust label appropriately
    >
      <motion.div
        className={cn(
          'w-full relative preserve-3d transition-shadow duration-300',
          'grid grid-cols-1 grid-rows-1', // Create stacking context
        )}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }} // Cubic bezier for premium feel
      >
        <HowIWorkStepFront step={step} index={index} />
        <HowIWorkStepBack step={step} />
      </motion.div>
    </div>
  );
}
