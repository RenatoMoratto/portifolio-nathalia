import type { Variant, Transition, Easing } from 'framer-motion';

/**
 * Premium easing function for smooth, natural animations
 * Based on easeOutExpo curve - fast start, smooth deceleration
 */
export const premiumEasing: Easing = [0.22, 1, 0.36, 1];

/**
 * Standard easing for most UI transitions
 * Quartic curve - balanced acceleration/deceleration
 */
export const easeOutQuart: Easing = [0.25, 1, 0.5, 1];

/**
 * Default transition for most animations
 * Uses premium easing with moderate duration
 */
export const defaultTransition: Transition = {
  duration: 0.7,
  ease: premiumEasing,
};

/**
 * Fast transition for subtle interactions
 */
export const fastTransition: Transition = {
  duration: 0.3,
  ease: easeOutQuart,
};

// ============================================================================
// SCROLL REVEAL VARIANTS
// ============================================================================

/**
 * Fade in from bottom - most common scroll reveal pattern
 * Usage: <motion.div variants={fadeInUp} initial="hidden" animate="visible" />
 */
export const fadeInUp: { hidden: Variant; visible: Variant } = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Subtle fade in from bottom - smaller movement
 * Good for list items and smaller elements
 */
export const fadeInUpSubtle: { hidden: Variant; visible: Variant } = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: defaultTransition,
  },
};

/**
 * Simple fade in without movement
 */
export const fadeIn: { hidden: Variant; visible: Variant } = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: defaultTransition,
  },
};

/**
 * Scale in animation - used for icons, badges, etc.
 */
export const scaleIn: { hidden: Variant; visible: Variant } = {
  hidden: {
    opacity: 0,
    scale: 0,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: premiumEasing,
    },
  },
};

// ============================================================================
// CONTAINER VARIANTS FOR STAGGER ANIMATIONS
// ============================================================================

/**
 * Container variant for staggered children animations
 * Usage:
 * <motion.ul variants={staggerContainer} initial="hidden" animate="visible">
 *   <motion.li variants={fadeInUp}>Item 1</motion.li>
 *   <motion.li variants={fadeInUp}>Item 2</motion.li>
 * </motion.ul>
 */
export const staggerContainer: { hidden: Variant; visible: Variant } = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Fast stagger container - for shorter lists
 */
export const staggerContainerFast: { hidden: Variant; visible: Variant } = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0,
    },
  },
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Calculate stagger delay for manual animation delays
 * Useful when not using Framer Motion variants
 *
 * @param index - Index of the item (0-based)
 * @param baseDelay - Base delay before first item (ms)
 * @param staggerDelay - Delay between each item (ms)
 * @returns Total delay in milliseconds
 *
 * @example
 * style={{ transitionDelay: `${getStaggerDelay(index)}ms` }}
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = 0,
  staggerDelay: number = 100,
): number {
  return baseDelay + index * staggerDelay;
}

/**
 * Common CSS transition class string for scroll animations
 * Matches our default animation duration and easing
 */
export const scrollRevealTransition = 'transition-all duration-700 ease-out-expo';
