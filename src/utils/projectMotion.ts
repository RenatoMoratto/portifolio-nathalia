import type { Easing } from 'framer-motion';

export function getProjectSharedLayoutIds(
  slug: string,
  options?: {
    hasCoverImage?: boolean;
    reduceMotion?: boolean;
  }
) {
  const reduceMotion = options?.reduceMotion ?? false;
  const hasCoverImage = options?.hasCoverImage ?? true;

  if (reduceMotion) {
    return {
      imageLayoutId: undefined as string | undefined,
      titleLayoutId: undefined as string | undefined,
    };
  }

  return {
    imageLayoutId: hasCoverImage ? `project-${slug}-image` : undefined,
    titleLayoutId: `project-${slug}-title`,
  };
}

export const premiumEasing: Easing = [0.22, 1, 0.36, 1]; // easeOutExpo-ish
