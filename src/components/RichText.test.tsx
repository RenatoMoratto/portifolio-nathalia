import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RichText } from './RichText';

describe('RichText inline markup', () => {
  it('renders allowed tags as real elements', () => {
    const { container } = render(<RichText text="I am a <strong>Designer</strong>." />);
    expect(container.querySelector('strong')).toHaveTextContent('Designer');
    expect(container.textContent).toBe('I am a Designer.');
  });

  it('supports emphasis', () => {
    const { container } = render(<RichText text="PUCRS — <em>Ongoing</em>" />);
    expect(container.querySelector('em')).toHaveTextContent('Ongoing');
  });

  it('handles multiple and adjacent tags', () => {
    const { container } = render(
      <RichText text="<strong>a</strong> and <strong>b</strong>" />,
    );
    expect(container.querySelectorAll('strong')).toHaveLength(2);
    expect(container.textContent).toBe('a and b');
  });

  it('renders plain text unchanged', () => {
    render(<RichText text="no markup here" />);
    expect(screen.getByText('no markup here')).toBeInTheDocument();
  });
});

describe('RichText does not execute untrusted markup', () => {
  it('does not create script elements', () => {
    const { container } = render(
      <RichText text={'before <script>window.__pwned = true</script> after'} />,
    );
    expect(container.querySelector('script')).toBeNull();
    expect(container.textContent).toContain('<script>');
  });

  it('does not create elements with event handler attributes', () => {
    const { container } = render(
      <RichText text={'<img src=x onerror="window.__pwned = true">'} />,
    );
    expect(container.querySelector('img')).toBeNull();
    expect(container.textContent).toContain('onerror');
  });

  it('does not honour attributes on allowed tags', () => {
    const { container } = render(
      <RichText text={'<strong onclick="alert(1)">hi</strong>'} />,
    );
    expect(container.querySelector('strong')).toBeNull();
    expect(container.textContent).toContain('onclick');
  });
});

describe('RichText paragraph mode', () => {
  it('splits on blank lines into real <p> elements', () => {
    const { container } = render(
      <RichText text={'First para.\n\nSecond para.'} as="paragraphs" />,
    );
    const paragraphs = container.querySelectorAll('p');
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0]).toHaveTextContent('First para.');
    expect(paragraphs[1]).toHaveTextContent('Second para.');
  });

  it('wraps the first and last block too', () => {
    const { container } = render(<RichText text={'only block'} as="paragraphs" />);
    expect(container.querySelectorAll('p')).toHaveLength(1);
  });

  it('keeps inline markup inside paragraphs', () => {
    const { container } = render(
      <RichText text={'I am a <strong>Designer</strong>.\n\nSecond.'} as="paragraphs" />,
    );
    expect(container.querySelectorAll('p')).toHaveLength(2);
    expect(container.querySelector('p strong')).toHaveTextContent('Designer');
  });

  it('ignores blank blocks from trailing newlines', () => {
    const { container } = render(<RichText text={'a\n\n\n\nb\n\n'} as="paragraphs" />);
    expect(container.querySelectorAll('p')).toHaveLength(2);
  });
});
