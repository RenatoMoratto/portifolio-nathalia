import type { Easing } from 'framer-motion';

/** Matches the CSS `--ease-out-expo` token. */
export const premiumEasing: Easing = [0.22, 1, 0.36, 1];

export function getStaggerDelay(
  index: number,
  baseDelay: number = 0,
  staggerDelay: number = 100,
): number {
  return baseDelay + index * staggerDelay;
}
