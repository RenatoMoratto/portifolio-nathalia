// Section = one heading + one or more content blocks (paragraphs / lists)
export type ProjectSection = { heading: string; content: string[] };

export type Project = {
  slug: string;
  title: string;
  shortDescription: string; // For card: from Fast Lane / right column intro
  coverImage?: string; // Optional; placeholder if missing
  /** Role(s), e.g. UX design, UI design, UX Research, QA */
  role?: string;
  /** Platform(s), e.g. iOS and Android */
  platform?: string;
  /** Design tools used, e.g. Figma, Balsamiq, paper */
  designTools?: string;
  fastLane: ProjectSection[]; // Right column only
  slowLane: ProjectSection[]; // Left column only
};
