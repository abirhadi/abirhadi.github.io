# Abir Mohammad Hadi — Academic research portfolio

A complete static React + TypeScript SPA, designed for GitHub Pages and `https://abirhadi.phd/`. Vite, Tailwind CSS, Lucide icons, locally bundled Manrope and DM Serif Display fonts. No backend, API key, account, or runtime network request is required.

For the `abirhadi/abirhadi.github.io` repository and ready-to-upload package, see [GITHUB_PAGES.md](GITHUB_PAGES.md). Run `npm run build:pages` to create the clean `github-pages/` upload folder with no custom-domain CNAME by default.

## Local development

Use Node.js **22.13 or later** (Node 22 LTS recommended) and npm 11 or later. The system's older Node 16 cannot run this project.

```sh
npm ci
npm run dev
```

Open the printed local URL, normally `http://127.0.0.1:5173/`. Production:

```sh
npm run lint
npm test
npm run build
node scripts/verify-dist.mjs
npm run test:smoke
npm run preview
```

`npm run build` includes TypeScript validation, compiles the client, temporarily renders the same React application at build time, and writes the complete page, SEO metadata, JSON-LD, social PNG, robots.txt, and sitemap.xml into `dist/`. `.prerender/` is temporary build output. There is no server to deploy. Vite development serves the client application; complete SEO metadata and prerendering are in the production build.

## Content editing

All academic content is in strongly typed files under `src/content/`:

| File                       | Edit here                                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `profile.ts`               | Identity, affiliation, biography, research vision, teaching philosophy, canonical URL, portrait, CV         |
| `research.ts`              | Three research directions, descriptions, keywords, guiding questions                                        |
| `publications.ts`          | Papers, ordered as displayed, authors, type, year, venue, DOI, PDF, topics, verification status, provenance |
| `publicationCategories.ts` | Google Scholar profile URL, research-interest filter labels, publication types, date checked                |
| `projects.ts`              | Research themes, descriptions, methods, status, related publication IDs, optional links                     |
| `teaching.ts`              | Course codes, titles, descriptions, optional confirmed semester labels                                      |
| `experience.ts`            | Academic and industry timeline; unspecified dates remain “Previously”                                       |
| `news.ts`                  | Verified news only; the whole section stays hidden when empty                                               |
| `links.ts`                 | Confirmed public professional profiles                                                                      |

The interface, layout headings, and generic interface text live in reusable components. Changing facts does not require editing JSX. Identity and metadata share `profile.ts`.

### Add a publication

Add a `Publication` object in `publications.ts`. Use a stable unique `id` and one of the research IDs `autonomous`, `efficient`, `perception` for project relationships. Assign one or more `categories` from `publicationCategories.ts`. These labels match the confirmed Google Scholar interests; membership of individual works is an editorial classification by subject. Record actual public sources in `sources`, and use `scholarWork(citationId, paper)` for a Scholar entry. Use `metadata: 'incomplete'` until authors, title, year, venue, and type have been checked; citation controls stay hidden for incomplete records. Supported types are journal article, conference paper, book chapter, doctoral dissertation, and poster, each with the appropriate BibTeX entry type. Use `articleNumber` for article identifiers and `pages` for page ranges. Verified works get a citation dialog with copy and .bib download. Paper, repository, and PDF controls render when configured. Local PDF paths are relative to `public/` (for example `papers/paper.pdf`); a confirmed full HTTPS URL is also supported. Do not link a publisher landing page as a PDF.

Research-interest filters appear only for categories represented by the data. Year and publication-type options are derived automatically. The filters combine, with a working empty-state reset. Related project links reset all publication filters. The Scholar import is a checked content snapshot, not a runtime scraper or automatic synchronization.

### Add a project or update research

Edit `projects.ts` or `research.ts`. Research projects use native keyboard-operable `<details>` panels. Use `publicationIds` to connect real publication entries. Add a confirmed external link as `{ label, url }`. Current entries are explicitly research themes, without invented funding or outcomes. Keep long-term ambitions distinct from completed work.

### Add news

Add `{ id, date: 'YYYY-MM-DD', title, url? }` to `news.ts`. Dates must be valid calendar dates. Entries render newest first. Use only confirmed announcements; no example news is published.

### Add your portrait

Put your optimized image in `public/images/portrait.webp`. In `profile.ts`, set:

```ts
portrait: { path: 'images/portrait.webp', alt: 'Portrait of Abir Mohammad Hadi', width: 800, height: 800 },
```

The About section displays a reserved-size circular portrait, with lazy loading. Without one, the intentional typographic monogram remains. No substitute person's photo is used.

### Add your CV

Place the actual PDF at `public/abir-hadi-cv.pdf` and set `cvPath: 'abir-hadi-cv.pdf'` in `profile.ts`. Download links appear automatically in the introduction and contact links. They are currently omitted.

### Add professional links

NKU, the supplied LinkedIn profile, and the user-confirmed Google Scholar profile are configured. Add verified GitHub, ORCID, or ResearchGate URLs in `links.ts`. The contact area and Person schema update together. No unconfirmed profile is inferred from your name.

## GitHub Pages deployment

The target repository is `abirhadi/abirhadi.github.io`. The included workflow builds, lints, and tests pull requests, then deploys pushes to `main` and manual workflow runs through the `github-pages` environment. It builds the `github-pages/` folder using `npm run build:pages` and checks the generated site before uploading. It uses GitHub's official checkout, Node setup, Pages artifact upload, and Pages deployment actions. Commit `package-lock.json` for repeatable installation. No DNS change is required to use `https://abirhadi.github.io/`.

1. Use the public repository `abirhadi/abirhadi.github.io` for the confirmed user site.
2. Push this code to its `main` branch. Do not commit `node_modules`, `.tools`, `.npm-cache`, `.prerender`, `dist`, `github-pages`, or `artifacts`.
3. In **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source. Ensure Actions can run in the repository and the `github-pages` environment permits `main`. If your organization requires deployment approval, approve the workflow in that environment.
4. Use the pre-migration configuration below to validate before directing your domain to GitHub.
5. Inspect the Actions result and the deployment URL. Build and deployment are separate jobs; pull requests run checks without publishing.

### Validate before switching the domain

In **Settings → Secrets and variables → Actions → Variables**, add these repository variables:

| Deployment                 | `SITE_BASE_PATH`    | `SITE_PREVIEW` | Pages custom-domain setting |
| -------------------------- | ------------------- | -------------- | --------------------------- |
| User repository preview    | `/`                 | `true`         | Leave blank                 |
| Project repository preview | `/repository-name/` | `true`         | Leave blank                 |
| Production custom domain   | `/`                 | `false`        | `abirhadi.phd`              |

`SITE_PREVIEW=true` removes `CNAME` from the deployed artifact, while preserving the production domain in canonical, sharing, and sitemap metadata. This is the default for the Pages workflow and `build:pages`; the original `npm run build` still defaults to the production-domain `dist/` artifact. It does **not** change the Pages custom-domain setting; keep that blank during preview. A previously configured Pages custom domain may redirect the preview URL until cleared in repository settings.

Run the workflow manually after changing repository variables. Visit `https://<username>.github.io/` or `https://<username>.github.io/<repository-name>/`. Confirm fonts, favicon, mobile menu, theme toggle, anchor links, project expansions, citation copy/download, and publication filters. The preview uses the same content and static build as production.

To reproduce project preview locally:

```sh
# macOS/Linux
SITE_BASE_PATH=/repository-name/ SITE_PREVIEW=true npm run build
SITE_BASE_PATH=/repository-name/ SITE_PREVIEW=true node scripts/verify-dist.mjs
SITE_BASE_PATH=/repository-name/ npm run preview
```

```powershell
# PowerShell
$env:SITE_BASE_PATH = '/repository-name/'
$env:SITE_PREVIEW = 'true'
npm run build
node scripts/verify-dist.mjs
npm run preview
```

Open the printed URL with `/repository-name/` appended. Clear these environment variables or set `/` and `false` before the production build.

### Custom-domain migration and HTTPS

The production artifact includes `CNAME` containing exactly `abirhadi.phd`. With an Actions publishing workflow, also configure the custom domain explicitly in **Settings → Pages**; the source CNAME file alone does not set the repository's custom domain.

1. Save a copy of the existing DNS configuration and note the Google Sites destination for rollback. Leave the old Google Site available during migration.
2. Follow [GitHub's domain verification instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) to verify ownership. Verification records are distinct from the website's address records.
3. Set `SITE_BASE_PATH=/` and `SITE_PREVIEW=false`, deploy, and enter `abirhadi.phd` in Pages settings.
4. In your DNS provider, change only the apex website records needed for Pages. Use the current values in [GitHub's official custom-domain guide](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site), rather than stale copied IP addresses. Add `www` only if you intend to migrate that hostname too. Preserve unrelated MX, TXT, verification, mail, and other subdomain records. This code does not modify DNS.
5. Allow DNS propagation and certificate provisioning, then enable **Enforce HTTPS** in Pages settings. Verify `https://abirhadi.phd/`, favicon, `/social-preview.png`, `/robots.txt`, `/sitemap.xml`, and any configured CV/image assets. Check that plain HTTP redirects to HTTPS. Verify the `www` hostname separately if migrated.
6. Confirm the canonical URL remains `https://abirhadi.phd/`. No route rewrite is needed because all internal navigation uses anchors.

### Rollback

For a code regression, revert the relevant commit on `main` and let Actions rebuild and deploy, or restore a known-good source revision in a new commit. Do not rely on an old artifact remaining available indefinitely. For a failed domain migration, restore the saved apex/`www` records to the prior Google Sites destination, retaining unrelated records, and remove the GitHub Pages custom domain if appropriate. Restore preview variables to test before trying again.

## Accessibility and performance

Semantic landmarks and headings, skip link, active navigation, native project disclosures, labeled filters with announced counts, native modal focus management, Escape dismissal, visible focus styles, persisted themes, and reduced-motion support are included. Theme initialization runs before rendering to avoid a flash; blocked storage falls back gracefully. The hero globe automatically rotates in three dimensions and responds to mouse dragging. Reduced-motion preferences slow its rotation and reduce the pitch excursion and pointer movement. Rotation suspends when the diagram leaves the viewport or the page is hidden. Other animations are brief entrance transitions. Fonts are self-hosted and no image downloads occur on initial load.

The small hero SVG is an explicitly labeled conceptual research illustration. It is not presented as experimental data. Prerendering makes the identity, research, teaching, and publications present in the initial HTML and useful without JavaScript. Filters, theme changes, and dialogs are progressively interactive.

To control the globe, click and drag horizontally: faster movement increases spin speed, slower movement reduces it, and dragging in the opposite direction can reverse the spin. Drag vertically to tilt. Release to retain momentum, or hold still briefly before releasing to stop. The diagram has no visible control buttons, speed readout, hints, or legends.

Unit/integration tests exercise filters, empty-state recovery, verified citation export and clipboard, theme persistence, menu Escape/focus restoration, internal anchors, optional content omissions, and filter reset. `verify-dist.mjs` checks the actual production HTML and asset paths. `npm run test:smoke` briefly starts an owned preview server on port 4173, checks HTTP responses for the page and all generated assets and fonts, and stops it. DOM and HTTP tests do not replace real-browser layout and accessibility checks. See `VERIFICATION.md` for the actual checks executed and limits; no Lighthouse score or WCAG certification is claimed. Use `npm run format` or `npm run format:check` to format or check source formatting.

## Remaining personal assets and content

- No portrait or CV has been supplied; both have intentional fallbacks.
- No author-hosted publication PDFs or confirmed GitHub/ORCID/ResearchGate profiles have been supplied. A verified publisher PDF is linked where available.
- No verified news, project funding, project repositories, or exact earlier employment dates are published.
- Semester labels are unset. Course descriptions are editorial summaries of the supplied instructional areas, not official syllabus excerpts.
- The October 18, 2026 Scholar snapshot contains 12 records representing 11 unique works. Duplicate dissertation listings were merged. Bibliographic details were cross-checked against publisher-deposited Crossref records, the institutional dissertation repository, and the author-uploaded poster; provenance is recorded in `CONTENT_SOURCES.md` and the content data.
- The existing personal website linked the same Google Scholar profile that the user subsequently confirmed.

Fonts: Manrope and DM Serif Display are distributed under their bundled SIL Open Font Licenses in their respective npm packages. Icons: Lucide, ISC license. The production build copies their notices to `dist/licenses/`. Keep these notices when redistributing font/icon assets.
