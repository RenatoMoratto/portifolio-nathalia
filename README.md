# Portfolio — Nathália Moratto Caldeira

Bilingual (pt/en) portfolio site for a Product Designer. React 19 + TypeScript +
Vite 7 + Tailwind 4, with a Framer Motion animation layer and a lazy-loaded
react-three-fiber hero backdrop.

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your EmailJS credentials
npm run dev
```

### Environment variables

The contact form posts through [EmailJS](https://www.emailjs.com/). All three
values are required:

| Variable                   | Where to find it             |
| -------------------------- | ---------------------------- |
| `VITE_EMAILJS_SERVICE_ID`  | EmailJS → Email Services     |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS → Email Templates    |
| `VITE_EMAILJS_PUBLIC_KEY`  | EmailJS → Account → API Keys |

`npm run build` **fails** if any are missing. This is deliberate: Vite inlines
`undefined` for absent `VITE_*` values, which previously produced a build that
succeeded and shipped a contact form that failed on every submission.

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
| `npm run format:check` | Prettier check (CI gate)           |

## Deployment

Pushing to `main` builds and publishes to GitHub Pages via
`.github/workflows/deploy.yml`, which can also be run by hand from the Actions
tab. It depends on two repository settings:

- **Settings → Pages → Source: GitHub Actions**
- **Settings → Secrets and variables → Actions**: the three `VITE_EMAILJS_*`
  values. The deploy build fails without them rather than publishing a contact
  form that silently drops every message.

Live at <https://renatomoratto.github.io/portifolio-nathalia/>.

### Base path

Pages serves a project site from `/<repository>/`, so the bundle needs that
prefix. `VITE_BASE_PATH` carries it, and the workflow reads it from the Pages
API via `actions/configure-pages` instead of hardcoding it — so neither a
repository rename nor a custom domain needs a code change. `DEFAULT_BASE_PATH`
in `vite.config.ts` is only the fallback for local `npm run build` and
`npm run preview`.

Everything else derives from that one value: Vite rewrites asset URLs itself,
and `import.meta.env.BASE_URL` feeds the router `basename` and the resume
links. The repository name appears nowhere outside `vite.config.ts`.

`npm run dev` is unaffected — the dev server still serves from `/`.

### Client-side routing

Pages has no SPA rewrite rule, so a direct request for `/about` matches no file
on disk. The build copies `index.html` to `404.html` (the `spa-404-fallback`
plugin in `vite.config.ts`), which Pages serves for unmatched paths; the router
then resolves the route from the URL the browser already has. Deep links and
refreshes keep their real paths — no hash URLs and no redirect hop. The
trade-off is that those responses carry a 404 status.

### Moving to a custom domain

1. Point DNS at GitHub Pages and set the domain under **Settings → Pages →
   Custom domain** (a committed `public/CNAME` works too).
2. `actions/configure-pages` then reports `/` as the base path, so the deploy
   needs no change. Set `DEFAULT_BASE_PATH` in `vite.config.ts` to `'/'` so
   local builds match.
3. Make `og:image` / `twitter:image` in `index.html` absolute — see Known gaps.

## Architecture

```text
src/
  config/      Validated build-time configuration (env access lives here only)
  content/     Domain content: projects, work history, process steps
  services/    External I/O (EmailJS). Components never call it directly
  providers/   React context providers, split from their hooks
  hooks/       Reusable behaviour
  components/  Presentational and composite UI
  sections/    Page sections
  pages/       Route components
  locales/     UI strings only
  utils/       Pure helpers (cn, date, slug, animations)
  styles/      Tailwind theme tokens and global utilities
```

### Content vs. translations

Domain content lives in `src/content/`, **not** in the i18n bundle. Two reasons:

1. `t(key, { returnObjects: true })` returns a new array reference on every
   call, which silently defeats `useMemo` and re-fires effects each render.
2. Reading entities out of i18n required unchecked `as Project[]` casts.

Identity fields (a project's `slug`, an experience's `startDate`) are declared
once and shared across languages, so they cannot drift; only prose is localized.
`src/locales/` keeps what i18n is good at: labels, aria text, and messages.

Add a project by appending to `PROJECTS` in `src/content/projects.ts` with an
entry under both `locales.pt` and `locales.en`. The test suite fails if either
is missing.

### Dates

Content dates are calendar months (`YYYY-MM`). `new Date('2023-12')` parses as
UTC midnight, so all formatting goes through `src/utils/date.ts`, which pins
`timeZone: 'UTC'`. Formatting in local time renders the previous month for
anyone west of UTC.

## Testing

Vitest + Testing Library, jsdom environment. The suite deliberately covers the
things that fail silently: locale parity, date timezone handling, section-id
generation, contact-form validation, and that `RichText` never parses untrusted
markup.

## Known gaps

- `public/resume-en.pdf` and `public/resume-pt.pdf` are currently the same file;
  the English resume still needs to be supplied.
- `og:image` in `index.html` is base-prefixed, so it resolves in a browser, but
  it is still a relative path. Make it absolute once the production domain is
  known — LinkedIn and several other crawlers will not resolve a relative URL.
