import { Contact as ContactSection } from '../sections';

/**
 * No wrapper padding: `Layout`'s `main` already clears the fixed navbar with
 * `pt-16`, and the section carries the gap above its own title. Stacking a
 * `pt-24` here on top of both was what left 256px of empty header above the
 * title on a phone.
 */
export function Contact() {
  return <ContactSection />;
}
