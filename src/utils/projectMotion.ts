export function getProjectSharedLayoutIds(
  slug: string,
  options?: {
    hasCoverImage?: boolean;
    reduceMotion?: boolean;
  },
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
