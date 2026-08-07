import type { Easing } from 'framer-motion';

/**
 * Premium easing function for smooth, natural animations.
 * Based on an easeOutExpo curve - fast start, smooth deceleration.
 *
 * Mirrors the `--ease-out-expo` design token in `styles/index.css` so that
 * Framer Motion transitions and CSS transitions share the same curve.
 */
export const premiumEasing: Easing = [0.22, 1, 0.36, 1];

/**
 * Calculate stagger delay for manual animation delays.
 * Useful when not using Framer Motion variants.
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
