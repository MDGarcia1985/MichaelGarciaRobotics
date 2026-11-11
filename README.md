# Michael Garcia Robotics

A responsive portfolio site built with TypeScript, Vite, YAML specifications, and CSS. Hash-routed pages cover Home, discipline indexes, project/post detail URLs, Blog, About, and Contact. Shared Projects and Posts collections are edited through Pages CMS (`.pages.yml`) and published via GitHub Pages.

## License

Copyright (c) 2026 Michael Garcia. All rights reserved. The website's original content, design, branding, and repository source are proprietary; see [LICENSE](LICENSE) for terms and permission requests. Third-party materials retain their respective licenses.

The npm `license` field is `UNLICENSED` to identify this as a proprietary package. The root LICENSE supplies the terms for project-owned files, including configuration and documentation; source headers reference it.

## Run locally

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. To type-check and build the production bundle, then serve it locally:

```bash
npm run build
npm run preview
```

`npm run build` optimizes images from `content/media/originals/` into `public/media/`, validates project/post YAML, type-checks, and writes `dist/`. Preview serves that build; rerun after source or content changes. See [docs/IMAGE_PIPELINE.md](docs/IMAGE_PIPELINE.md) for formats (HEIC is not accepted). The repository includes a lockfile but does not pin a Node runtime. Recent recorded checks used Node 22; see [TEST_LOG.md](TEST_LOG.md).

## Where to start

1. [Current architecture](docs/ARCHITECTURE.md) — implemented components, routes, data flow, and publishing.
2. [Global specification](specs/main.yaml) — palette, desktop typography, menu items, header/footer settings, and page registry.
3. [Pages CMS config](.pages.yml) and content under `content/projects`, `content/posts`.
4. [Specification loader](src/specs.ts), [content catalog](src/content/catalog.ts), [renderer](src/main.ts), and [styles](src/styles.css).

## Current behavior

- Routes: Home (`#/`), Robotics / Software / Design (`#/robotics_projects` etc.), Blog (`#/blog`), About, Contact, project detail (`#/project/<id>`), post detail (`#/post/<id>`), and layouts preview (`#/layouts-preview`).
- Home links to Robotics, Software, Design, and Blog. Discipline pages list matching projects in `display_order` using each project’s featured published post and `discipline_layout`.
- Project pages list associated published posts newest first. Blog lists all published posts newest first. Drafts are excluded from public indexes. Shared YAML records are not duplicated between views.
- Editorial layouts use four panels (cover, text, image_2, image_3). Desktop has five asymmetric patterns; mobile always stacks Cover → Text → Second image → Third image.
- Every page has the shared click-operated navigation menu and copyright footer. Engagement prompt behavior on Home is unchanged (`mgr-engagement-complete` in `sessionStorage`).
- Pages CMS configuration is root `.pages.yml`. SAMPLE fixtures under `content/` are labeled for layout/CMS preview and are separate from real portfolio claims.

About and Contact remain simple paragraph pages. There is no contact form, video pipeline, or custom auth.

## Verification

The existing browser regression requires a production build, an installed Chrome browser, and an available Playwright module. Playwright is **not** a declared project dependency. If it is available through normal Node resolution:

```bash
npm run build
npm run check:publishing
node --check scripts/check-navigation.cjs
node scripts/check-navigation.cjs
```

Alternatively pass the absolute path to an existing Playwright module:

```bash
node scripts/check-navigation.cjs /absolute/path/to/node_modules/playwright
```

The script creates a temporary localhost server and isolated headless Chrome contexts, then closes them in `finally`. It checks all seven routes at phone, landscape, tablet, and desktop sizes, plus menu keyboard controls, header Home actions, engagement destinations, and session suppression. It writes screenshots and `navigation-report.json` to [docs/verification](docs/verification). These are current-run artifacts; the append-only [test log](TEST_LOG.md) preserves historical outcomes. Browser checks require local server/process permissions and are not evidence of physical-device or hosted-site verification.

Follow the [test standards](docs/TEST_LOG_STANDARDS.md), [annotation standards](docs/ANNOTATION_STANDARDS.md), and [decision-journal standards](docs/DEVNOTES_STANDARDS.md). Record material decisions in [DEVNOTES.md](DEVNOTES.md) and executed checks in [TEST_LOG.md](TEST_LOG.md).

## Publishing and CMS

1. Add or edit YAML under `content/projects/` and `content/posts/` (or use Pages CMS after authorizing the repo).
2. Upload photo originals to `content/media/originals/` (JPEG/PNG/WebP/GIF — not HEIC).
3. Commit to the branch that deploys (workflow: `.github/workflows/deploy-pages.yml` on `master`).
4. Build generates public derivatives and validates IDs/references/featured-post ownership.

Inspect all five desktop patterns with the SAMPLE post at `#/layouts-preview`. Image rules: [docs/IMAGE_PIPELINE.md](docs/IMAGE_PIPELINE.md). Longer editorial selection notes remain in [docs/PORTFOLIO_CONTENT_PLAN.md](docs/PORTFOLIO_CONTENT_PLAN.md). Path-based Astro migration ideas in [docs/ARCHITECTURE_ALIGNMENT_REVIEW.md](docs/ARCHITECTURE_ALIGNMENT_REVIEW.md) are still future work.
