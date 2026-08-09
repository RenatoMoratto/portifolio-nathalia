import { Fragment } from 'react';
import type { ReactNode } from 'react';

const ALLOWED_TAGS = ['strong', 'em'] as const;
type AllowedTag = (typeof ALLOWED_TAGS)[number];

const INLINE_TAG = new RegExp(`<(${ALLOWED_TAGS.join('|')})>([\\s\\S]*?)</\\1>`, 'g');

interface RichTextProps {
  /** Text that may contain `<strong>` / `<em>` and `\n\n` paragraph breaks. */
  text: string;
  /** Render each `\n\n`-separated block as its own `<p>`. */
  as?: 'inline' | 'paragraphs';
  paragraphClassName?: string;
}

/** Parses allowlisted tags and renders everything else as text. */
function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(INLINE_TAG)) {
    const start = match.index;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));

    const tag = match[1] as AllowedTag;
    const Tag = tag;
    nodes.push(<Tag key={key++}>{match[2]}</Tag>);

    lastIndex = start + match[0].length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

export function RichText({ text, as = 'inline', paragraphClassName }: RichTextProps) {
  if (as === 'paragraphs') {
    const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
    return (
      <>
        {paragraphs.map((paragraph, idx) => (
          <p key={idx} className={paragraphClassName}>
            {renderInline(paragraph)}
          </p>
        ))}
      </>
    );
  }

  return <Fragment>{renderInline(text)}</Fragment>;
}
