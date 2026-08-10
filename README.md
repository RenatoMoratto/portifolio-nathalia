# Portfolio — Nathália Moratto Caldeira

Bilingual (pt/en) portfolio site for a Product Designer. React 19 + TypeScript +
Vite 7 + Tailwind 4, with a Framer Motion animation layer and a lazy-loaded
react-three-fiber hero backdrop.

Live at <https://nathaliacaldeira.com/>.

## Getting started

```bash
npm install
npm run dev
```

`npm run dev` works without any configuration — the contact form disables itself
and logs why. To exercise the form locally, add credentials:

```bash
cp .env.example .env   # then fill in your EmailJS credentials
```

### Environment variables

The contact form posts through [EmailJS](https://www.emailjs.com/). All three
values are required:

| Variable                   | Where to find it             |
| -------------------------- | ---------------------------- |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS → Email Services     |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates    |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS → Account → API Keys |

Missing values are handled at two layers, deliberately:

- **`npm run build` fails.** `REQUIRED_BUILD_ENV` in `vite.config.ts` throws
  before Vite starts. Vite inlines `undefined` for absent `VITE_*` values, which
  previously produced a build that succeeded and shipped a contact form that
  failed on every submission.
- **At runtime the form degrades.** `src/config/env.ts` resolves the config once
  and exports `null` plus `isContactFormEnabled: false` when anything is absent,
  so the UI disables the form and logs the missing keys instead of failing at
  submit. This is the path `npm run dev` takes with no `.env`.

> These values are compiled into the client bundle and are therefore public by
> design. Protect the endpoint in the EmailJS dashboard — enable the domain
> allowlist and rate limiting — rather than by trying to keep the keys secret.

## Scripts

| Script                 | Purpose                            |
| ---------------------- | ---------------------------------- |
| `npm run dev`          | Dev server with HMR                |
| `npm run build`        | Typecheck + production build       |
| `npm run preview`      | Serve the production build locally |
| `npm run typecheck`    | `tsc -b`                           |
| `npm run lint`         | ESLint                             |
| `npm test`             | Vitest (single run)                |
| `npm run test:watch`   | Vitest in watch mode               |
| `npm run format`       | Prettier write                     |
| `npm run format:check` | Prettier check                     |

## Continuous integration

`.github/workflows/ci.yml` runs on every pull request and every push to `main`:
typecheck → lint → format check → test → build. The build step substitutes
`ci-placeholder` for any missing `VITE_EMAILJS_*` secret, since it only needs
non-empty values to satisfy the build-time guard.

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`, which can also be run by hand from the Actions
tab. Two jobs:

- **build** — `npm ci`, `npm run build`, then `upload-pages-artifact`. Holds only
  `contents: read`.
- **deploy** — `deploy-pages` against that artifact. Holds `pages: write` and
  `id-token: write`, since the action authenticates with an OIDC token.

The workflow-level default is `permissions: {}` and each job opts back in to the
minimum it needs, so the job that executes project code and third-party
dependencies has no write access to Pages.

It depends on two repository settings:

- **Settings → Pages → Source: GitHub Actions**, with the custom domain
  `nathaliacaldeira.com` configured there (there is no committed `public/CNAME`).
- **Settings → Secrets and variables → Actions**: the three `VITE_EMAILJS_*`
  values. The deploy build fails without them rather than publishing a contact
  form that silently drops every message.

### Base path

The site serves from the root of a custom domain, so `vite.config.ts` sets
`base: '/'` and assets need no prefix.

Nothing else hardcodes that. `import.meta.env.BASE_URL` — which Vite derives from
`base` — feeds the router `basename` in `src/App.tsx` and the resume links in
`src/components/ResumeButton.tsx`. The deploy workflow injects nothing here; it
passes only the EmailJS secrets. So `vite.config.ts` is the single place the base
path is decided, and changing `base` is enough to move the app under a prefix
again — a GitHub Pages _project_ site, for instance, serves from `/<repository>/`
and would need `base` set to match, or every asset request 404s.

The one thing `base` does not reach is the absolute social image URLs in
`index.html` — see Known gaps.

### Client-side routing

Routes are `/`, `/about`, `/contact`, and `/projects/:slug`. `Home` is eager;
the other three are `React.lazy` chunks behind a `Suspense` fallback that holds
the layout height.

Pages has no SPA rewrite rule, so a direct request for `/about` matches no file
on disk. The build copies `index.html` to `404.html` (the `spa-404-fallback`
plugin in `vite.config.ts`), which Pages serves for unmatched paths; the router
then resolves the route from the URL the browser already has. Deep links and
refreshes keep their real paths — no hash URLs and no redirect hop. The
trade-off is that those responses carry a 404 status.

## Architecture

```text
src/
  config/      Build-time configuration; app env vars are read only here
  content/     Domain content: projects, experience, process steps, hero roles
  services/    External I/O (EmailJS). Components never call it directly
  providers/   React context providers, split from their hooks
  hooks/       Reusable behaviour
  components/  Presentational and composite UI (plus how-i-work/, project/)
  sections/    Page sections
  pages/       Route components
  locales/     UI strings only
  utils/       Pure helpers (cn, date, slug, animations, projectMotion, orbPhysics)
  styles/      Tailwind theme tokens, keyframes, and global utilities
  assets/      Images imported by components
  test/        Vitest setup
```

`import.meta.env.BASE_URL` is the one exception to the `config/` rule: it is a
Vite built-in rather than app configuration, and is read directly in `App.tsx`
and `ResumeButton.tsx`.

### Content vs. translations

Domain content lives in `src/content/`, **not** in the i18n bundle. Two reasons:

1. `t(key, { returnObjects: true })` returns a new array reference on every
   call, which silently defeats `useMemo` and re-fires effects each render.
2. Reading entities out of i18n required unchecked `as Project[]` casts.

Each entry splits into a shared base and a `locales` record. Identity fields (a
project's `slug`, an experience's `startDate`) are declared once and shared
across languages, so they cannot drift; only prose is localized. `src/content/`
flattens base and locale into one object per language **at module load**, so
`useProjects()`, `useExperiences()`, and `useHowIWorkSteps()` return the same
array reference for the lifetime of the language. `src/locales/` keeps what i18n
is good at: labels, aria text, and messages.

Experiences are sorted oldest first so the timeline reads left to right; an
entry with no `endDate` means "present" and sorts last.

Add a project by appending to `PROJECTS` in `src/content/projects.ts` with an
entry under both `locales.pt` and `locales.en`. The test suite fails if either
is missing.

### Project lanes

Every project carries two independent narratives: `fastLane` (the skimmable
version) and `slowLane` (the full case study), toggled by `LaneToggle`. Section
anchors are generated from headings via `slugifyHeading`, so ids only need to be
unique within the mounted lane — the test suite enforces that per lane, per
language.

### Dates

Content dates are calendar months (`YYYY-MM`). `new Date('2023-12')` parses as
UTC midnight, so all formatting goes through `src/utils/date.ts`, which pins
`timeZone: 'UTC'`. Formatting in local time renders the previous month for
anyone west of UTC.

### Motion

Framer Motion's `useReducedMotion` gates the expensive and the distracting:
`OrbsBackdrop` skips WebGL entirely under a reduced-motion preference and renders
blurred CSS circles instead, and it also pauses the Three.js scene when scrolled
off-screen. The Three.js bundle is a lazy chunk, so routes without the hero never
download it. `src/styles/index.css` carries a matching
`@media (prefers-reduced-motion: reduce)` block for the CSS keyframes.

## Testing

Vitest + Testing Library, jsdom environment. 12 files, 121 tests. The suite
deliberately covers the things that fail silently rather than chasing coverage:

- **Locale parity** — both bundles define exactly the same keys, with no empty
  values, and the key shapes the code indexes into still exist.
- **Content integrity** — every project, experience, and process step has prose
  in both languages; slugs are unique and URL-safe; section ids are unique per
  lane; `YYYY-MM` dates parse and stay ordered; at most one ongoing role.
- **Language negotiation** — `normalizeLanguage` and `detectLanguage` across
  regional tags, unsupported tags, casing, and empty preference lists.
- **Dates** — `formatMonthYear` / `formatPeriod` timezone handling.
- **`RichText`** — allowlisted inline markup only; never parses untrusted
  markup.
- **Behaviour hooks** — contact-form validation and submission, flip card,
  mobile menu, typewriter, theme provider (boot, device preference, applying).
- **Orb physics** — the pure `OrbField` simulation, independent of WebGL.
- **`ProjectPage`** — routing, lane switching, and language changes.

## Known gaps

- `public/resume-en.pdf` and `public/resume-pt.pdf` are currently byte-identical;
  the English resume still needs to be supplied. `ResumeButton` already picks the
  file by language, so dropping the real PDF in place is the whole fix.
- `og:image` and `twitter:image` in `index.html` hardcode
  `https://nathaliacaldeira.com`, because Open Graph requires absolute URLs and a
  static HTML file has nowhere to read the domain from. A domain change means
  editing those two tags.
