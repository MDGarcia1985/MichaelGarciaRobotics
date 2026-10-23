# Michael Garcia Robotics

A responsive portfolio prototype built with TypeScript, Vite, YAML specifications, and CSS. The browser renders seven hash-routed pages from local YAML. Project case studies and blog publishing are not implemented yet.

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

The build writes `dist/`. Preview serves that build; rerun the build after source changes. The repository includes a lockfile but does not pin a Node runtime. Recent recorded checks used Node 22.19.0 and npm 11.10.0; see [TEST_LOG.md](TEST_LOG.md) for verification history.

## Where to start

1. [Current architecture](docs/ARCHITECTURE.md) — implemented components, routes, data flow, and limitations.
2. [Global specification](specs/main.yaml) — palette, desktop typography, menu items, header/footer settings, and page registry.
3. [Home specification](specs/homepage.yaml) — hero, discipline navigation, and engagement choices.
4. [Specification loader](src/specs.ts) — explicit YAML imports and page-key mapping.
5. [Renderer](src/main.ts), [navigation component](src/navigation.ts), and [styles](src/styles.css) — behavior and responsive presentation.

## Current behavior

- Routes: Home, Robotics, Software, Design, BLOG, About, and Contact. Home uses `#/`; other routes use keys such as `#/robotics_projects` and `#/blog`.
- Every page has the shared click-operated navigation menu. Interior pages also show a “Michael Garcia” button that returns Home; Home displays the name only in its hero.
- Mobile layouts stack Robotics / Software / Design with horizontal rules and use left-aligned, single-column content. Tablet and desktop restore horizontal discipline branding. Desktop retains the configured 150px hero title; smaller screens use CSS `clamp()` sizing.
- Every page has the 10px copyright footer. The menu is 40px on desktop and at least 44px below the desktop breakpoint.
- Six seconds after Home renders, an unanswered engagement prompt offers Robotics, Software, Design, or Just looking. Subject choices open the corresponding project page and focus its heading. Just looking dismisses the prompt, stays Home, and focuses the menu button.
- A completed engagement choice is stored under `mgr-engagement-complete` in `sessionStorage`. It suppresses subsequent prompts in that tab's page session. This interaction sends no form submission or analytics event.

Subject pages contain placeholder text cards; BLOG, About, and Contact contain placeholder paragraphs. There is no contact form, Markdown article loader, project-detail renderer, image gallery, or video embed pipeline. Shared CSS constrains media dimensions, but does not create a publishing system.

## Verification

The existing browser regression requires a production build, an installed Chrome browser, and an available Playwright module. Playwright is **not** a declared project dependency. If it is available through normal Node resolution:

```bash
npm run build
node --check scripts/check-navigation.cjs
node scripts/check-navigation.cjs
```

Alternatively pass the absolute path to an existing Playwright module:

```bash
node scripts/check-navigation.cjs /absolute/path/to/node_modules/playwright
```

The script creates a temporary localhost server and isolated headless Chrome contexts, then closes them in `finally`. It checks all seven routes at phone, landscape, tablet, and desktop sizes, plus menu keyboard controls, header Home actions, engagement destinations, and session suppression. It writes screenshots and `navigation-report.json` to [docs/verification](docs/verification). These are current-run artifacts; the append-only [test log](TEST_LOG.md) preserves historical outcomes. Browser checks require local server/process permissions and are not evidence of physical-device or hosted-site verification.

Follow the [test standards](docs/TEST_LOG_STANDARDS.md), [annotation standards](docs/ANNOTATION_STANDARDS.md), and [decision-journal standards](docs/DEVNOTES_STANDARDS.md). Record material decisions in [DEVNOTES.md](DEVNOTES.md) and executed checks in [TEST_LOG.md](TEST_LOG.md).

## Planned publishing architecture

The intended direction is Squarespace registration, GitHub source/content/history/CI, and Cloudflare Pages hosting. Astro static generation, Markdown projects/posts, image/video processing, and optional later Decap CMS remain proposals. No application database or public authentication exists.

Read the dated [architecture migration proposal](docs/ARCHITECTURE_ALIGNMENT_REVIEW.md) and [portfolio content plan](docs/PORTFOLIO_CONTENT_PLAN.md) for future work. They are not descriptions of deployed functionality. The local checkout has Git metadata and an `origin` remote; this documentation review did not verify remote access, CI, DNS, or hosting configuration.
