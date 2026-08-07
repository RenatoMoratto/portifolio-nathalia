/**
 * Turn a section heading into a DOM id / anchor fragment.
 *
 * Shared by the project page (which renders the ids) and the section nav (which
 * looks them up with `getElementById`). These must stay byte-identical, so the
 * rule lives in exactly one place.
 *
 * Accents are transliterated rather than dropped: NFD splits "Ç" into "C" plus a
 * combining mark, and `\p{M}` strips the mark. Without this, "PROTOTIPAÇÃO E
 * TESTES" collapsed to the lossy `prototipao-e-testes`.
 */
export function slugifyHeading(heading: string): string {
  return heading
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
