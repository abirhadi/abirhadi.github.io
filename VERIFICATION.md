# Verification record

Executed October 18, 2026 in the supplied Windows workspace, using a workspace-local Node.js 22.23.3 runtime. The runtime was downloaded from nodejs.org and its ZIP was checked against the official SHA-256 manifest. The system's original default Node 16 was not changed.

## Passed

- Dependency installation completed and `package-lock.json` is included. npm 10's initial dependency resolver failed; retry with the installed npm 11 succeeded. An unsupported ESLint 9 warning was resolved by moving to ESLint 10 and compatible hook tooling.
- TypeScript validation: `tsc --noEmit`, including in production builds.
- ESLint: all application, test, configuration, and build scripts.
- Six Vitest + Testing Library integration tests: publication area/year filters and empty-state reset; real citation dialog and clipboard copy; theme persistence and menu Escape/focus restoration; prerendered essential content, valid anchors and optional omissions; incomplete-metadata citation suppression; related-publication filter reset.
- Root-domain production build, including build-time React rendering, JSON-LD and metadata, sitemap, robots, generated 1200 × 630 social PNG, CNAME, favicon, and font/icon license notices.
- Project-repository build using `/portfolio-preview/` and `SITE_PREVIEW=true`: asset prefixes resolve and CNAME is omitted from that artifact.
- Static artifact checks for prerendered identity and research, one h1, four publication entries, internal anchors, parseable JSON-LD, canonical URL, required assets, correct root/subpath prefixes, and custom-domain mode.
- HTTP smoke checks for both `/` and `/portfolio-preview/`: the actual built page, JavaScript, CSS, font URLs referenced by CSS, favicon, social PNG, sitemap, and robots return successful responses. The temporary preview servers were stopped after checking.
- Visual inspection of the generated social sharing PNG: text and conceptual network graphic render without clipping. Font cache handling was adjusted for restricted Windows environments.
- Publication metadata retrieved directly from publisher-deposited Crossref records for all four supplied DOIs. NKU affiliation and public email checked against the institutional faculty profile. See `CONTENT_SOURCES.md`.

The final output in `dist/` is configured for the production domain root. Client JavaScript is approximately 82 KB gzip and CSS approximately 11 KB gzip; these are build measurements, not Lighthouse scores. Font files are served locally.

## Verification limits

The browser runtime initialized, but reported no available browser; its browser discovery list was empty. As a result, real-browser desktop/mobile screenshots, visual review of light/dark layouts, native browser modal focus trapping, full keyboard walkthroughs, screen-reader behavior, and Lighthouse audits were not executed. DOM tests check state and events; they do not prove visual layout or native browser behavior. Responsive breakpoints, both theme palettes, visible focus states, native disclosure/dialog controls, and reduced-motion behavior are implemented and should receive a final real-browser review before domain migration.

No GitHub repository/remote was supplied or connected for this empty workspace. The GitHub Actions workflow is configured but has not run on GitHub. No deployment, GitHub repository setting, DNS record, or HTTPS certificate was changed. Test the GitHub Pages preview URL and finish domain/HTTPS checks using the README before production migration.

No portrait, CV, author-hosted PDFs, semester assignments, or news were fabricated. During the later publication update, the existing Google Sites page was retrieved via normal HTTP and its Scholar link was confirmed by the user.

## Follow-up: GitHub Pages upload package

Added `npm run build:pages`, which creates a clean `github-pages/` artifact for `https://abirhadi.github.io/` without a custom-domain CNAME. Build support, artifact verification, social-image generation, and HTTP smoke checks accept the chosen output directory. The GitHub workflow now builds and verifies this package, then deploys it through GitHub Pages. The original production-domain `dist/` build remains available. Generated folders and ZIP archives are excluded from Git and linting.

The Pages build, TypeScript validation, ESLint, all **13 tests**, static artifact verification, and HTTP smoke check passed locally. The ZIP `artifacts/abirhadi.github.io.zip` contains 20 entries at its root, including `index.html`, `.nojekyll`, fonts, assets, and license notices; it contains no CNAME. `GITHUB_PAGES.md` explains source deployment and manual upload of the extracted artifact. No DNS changes were made. The authenticated target repository was confirmed to be public, empty, and writable before upload; GitHub execution results must be checked separately from these local results.

## Follow-up: Google Scholar publications and categories

The user-confirmed Scholar profile was retrieved on October 18, 2026, together with individual records. Twelve records map to eleven unique works after merging the duplicate dissertation. Publisher-deposited Crossref metadata, the SDSU repository, and the author-uploaded poster were used to verify the seven added works. The four publication category labels match Scholar's research interests; per-work category membership is editorial. Provenance and duplicate handling are recorded in `CONTENT_SOURCES.md`.

All **13 tests passed**, including combined research-interest/year/type filtering and empty-state recovery, citation copying, filter reset, and correct citation fields for chapters, dissertations, posters, and article identifiers. The existing globe gesture tests remain passing. TypeScript and ESLint passed. The production client and SSR builds, prerendered artifact checks, and HTTP smoke checks passed for the domain root. Artifact verification now derives its publication count and IDs from the content rather than assuming four entries. The local build used the existing Windows locked-directory workaround described below. No connected-browser visual review was available.

## Follow-up: interactive hero diagram

Current UI refinement: removed the drag hint, speed readout and buttons, pause/start button, diagram labels, and figure legends. The 3D autoplay, pointer-following globe and center, drag-controlled speed/direction/tilt, momentum, and hold-to-stop behavior remain. Removed unused control state and styles; existing gesture tests now measure rendered angular velocity rather than a deleted readout. Earlier control references below record previous iterations.

Mouse-speed refinement: direct dragging controls yaw, pitch, and angular velocity. Release retains the selected momentum; holding still before release stops it. Pointer capture and window-level release/cancel handlers prevent stuck gestures when releasing outside the SVG. Slower/faster buttons and a rate readout provide an accessible alternative. All twelve tests passed, including acceleration, deceleration, reversal, release momentum, holding to stop, and button-based speed adjustment. TypeScript, ESLint, production rendering, artifact validation, and HTTP smoke checks passed. Connected-browser gesture playback remains unverified.

Current 3D spin: the original ring radii and spacing define 3D coordinates, which rotate around the Y and X axes and are projected with perspective. Near and far path segments receive different line opacity. Autoplay starts immediately without pointer input, with a 40-second yaw revolution; reduced-motion preferences slow the revolution to 80 seconds and reduce pitch. Pause/resume retains the pose. Rendering suspends offscreen or while the document is hidden. Pointer-follow and center/spoke motion are independent of this loop.

All ten interaction tests, TypeScript, ESLint, production rendering, artifact validation, and HTTP smoke checks passed. The spin test verifies actual SVG geometry changes without pointer input, freezes during pause, resumes afterward, and preserves the globe and center pointer transforms. Three distinct 3D poses were rasterized from the generated SVG and visually inspected. Connected-browser playback remains unverified; the earlier CSS clockwise animation has been removed.

The later center-motion refinement uses native SVG transforms normalized to the diagram's own bounds. Both the globe and central point translate toward the pointer; the center has additional movement within the globe and its three connecting spokes update to remain attached. Labels stay fixed for readability. Reduced-motion mode uses a smaller, immediate response without rotation or animated interpolation. Regression tests now assert actual SVG transforms and spoke geometry rather than CSS variable changes. All nine tests, TypeScript, ESLint, production rendering, artifact validation, and HTTP smoke checks passed for this refinement.

The existing SVG now follows mouse and pen movement across the hero with eased, layered parallax. Guides, orbital geometry, and the node network move at different depths; node halos respond subtly. The layout, colors, labels, and original SVG geometry are preserved. Leaving the hero returns it to its original pose. Touch gestures are ignored, reduced-motion changes reset the pose, and animation frames stop when settled or unmounted.

TypeScript and ESLint passed. All **nine** tests passed, including three new checks covering pointer following and recentering, touch/reduced-motion handling, and animation/listener cleanup. The updated client and prerendered production builds, artifact validation, and HTTP smoke checks passed.

Windows denied access to the existing generated `dist/assets` directory, including during the standard build's cleanup step. The successful local build used `vite build --emptyOutDir false --assetsDir assets-interactive`, followed by the SSR build with `--emptyOutDir false` and the normal prerender, artifact, and smoke scripts. The current `dist/index.html` references the newly generated assets correctly. Build configuration and GitHub deployment commands are unchanged; a clean checkout uses the normal `npm run build`. Real-browser visual validation remains unavailable as described above.
