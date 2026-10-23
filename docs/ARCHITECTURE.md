# Current implementation architecture

Updated October 23, 2026. This document describes the checked-in source and local build workflow. External hosting, DNS, and GitHub account configuration were not inspected. The [migration review](ARCHITECTURE_ALIGNMENT_REVIEW.md) describes a proposed future architecture.

## Runtime and build boundaries

The application is a client-rendered, framework-free TypeScript single-page application. Vite bundles its source and CSS. `npm run build` runs `tsc` for strict type checking with no TypeScript emission, then Vite creates the production files in `dist/`. `npm run dev` starts Vite's development server; `npm run preview` serves the existing production output.

```text
specs/*.yaml -- Vite ?raw imports --> src/specs.ts / js-yaml
                                        |
                                mainSpec + pageSpecs
                                        |
index.html / #app --> src/main.ts --> rendered DOM
                         |                 |
                 src/navigation.ts   src/styles.css
                         |
               location hash + browser history
```

YAML is bundled as text and parsed in the browser, not validated and expanded into separate HTML pages at build time. `index.html` supplies the empty app root, global description, viewport metadata, and module entry. JavaScript is required to display page content. Page titles change at runtime; route-specific static metadata, canonical URLs, sitemap, and RSS output do not exist.

There is no backend API, database, visitor authentication, CMS, or content-fetching service. The only application persistence is the engagement choice in `sessionStorage`. Imported specification contents are included in the client bundle; YAML is not a private-content store.

## Files and responsibilities

| File | Responsibility |
|---|---|
| [specs/main.yaml](../specs/main.yaml) | Global palette, typography, utility navigation, header/footer, page registry, and architecture intent |
| [specs/homepage.yaml](../specs/homepage.yaml) | Hero and discipline labels, routes, hover settings, engagement timing/copy/targets |
| Subject YAML files in [specs](../specs) | Subject heading, subtitle, placeholder project cards |
| About, Contact, and BLOG YAML files | Simple heading and paragraph arrays |
| [src/specs.ts](../src/specs.ts) | Eight explicit raw imports: one global specification and seven page specifications; parses them and exports page-key lookup |
| [src/types.ts](../src/types.ts) | Partial TypeScript contracts; flexible `Dict` values remain |
| [src/main.ts](../src/main.ts) | Token lookup, route dispatch, DOM rendering, shared header/footer, navigation actions, engagement interaction |
| [src/navigation.ts](../src/navigation.ts) | Menu disclosure, native hash links, keyboard/outside-click behavior, listener cleanup |
| [src/styles.css](../src/styles.css) | Shared visual treatment, responsive geometry, focus styles, reduced-motion handling |
| [scripts/check-navigation.cjs](../scripts/check-navigation.cjs) | Local production-build browser regression and evidence capture |

The `website.pages` registry and `pageSpecs` map are maintained separately. The loader does not discover files from `website.pages[*].source`. The `architecture.plugin_interfacing: json` value expresses intent; there is no implemented plugin interface. Likewise, not every declarative positioning or typography field is consumed: actual layout comes from the renderer and stylesheet.

## Routes and rendering

| Page key | Hash URL | Renderer |
|---|---|---|
| `homepage` | `#/` (an empty hash also opens Home) | Hero and discipline navigation |
| `robotics_projects` | `#/robotics_projects` | Subject heading, subtitle, and cards |
| `software_projects` | `#/software_projects` | Subject heading, subtitle, and cards |
| `design_projects` | `#/design_projects` | Subject heading, subtitle, and cards |
| `blog` | `#/blog` | Simple heading and paragraphs |
| `about` | `#/about` | Simple heading and paragraphs |
| `contact` | `#/contact` | Simple heading and paragraphs |

`currentRoute()` reads the hash; `render()` looks it up in `pageSpecs`. Unknown keys navigate Home rather than rendering a 404. Keys ending in `_projects` select the subject renderer; the remaining non-Home pages use the simple renderer. There is no nested project/article route resolution.

Menu anchors update the hash natively. Hero buttons, interior header Home buttons, and engagement choices call `navigate()`, which writes a history entry and renders the destination. Both `hashchange` and `popstate` trigger rendering. Refreshes work with hash URLs because the server receives the same application-shell path.

Rendering replaces the app's children, disposes the prior menu's document listeners through its `AbortController`, and removes any engagement overlay. The menu's public contract returns a header and a disposer; the renderer owns calling the disposer before replacement.

## Shared presentation and interaction

Every page receives one navigation disclosure containing Home, Robotics, Software, Design, BLOG, About, and Contact. Its icon uses three CSS rectangles derived from the original Figma geometry; it is not an SVG asset. YAML controls icon size, color, background, and shadow visibility/color. CSS controls bar proportions and shadow geometry.

The menu opens on click, Enter, Space, or ArrowDown; ArrowDown focuses the first link. Escape closes it and restores trigger focus. Clicking or focusing outside closes it. Links keep normal Tab semantics. Interior pages add the 20px “Michael Garcia” native button that navigates Home; Home omits that header name. The shared copyright is 10px and stays in normal document flow at the bottom left.

| Viewport | Composition |
|---|---|
| Below 768px | Left-aligned single column; stacked discipline buttons with two decorative 1px rules; adaptive 16–24px gutters; naturally wrapping titles; stacked cards/dialog choices |
| 768–1099px | Horizontal discipline branding; fluid title sizing; adaptive project grid; two-column dialog choices |
| 1100px and wider | Configured desktop title size (currently 150px), centered Home composition, 80px header/footer, 40px menu icon |

Below 1100px the menu target is at least 44px; the interior header name button and menu links also have 44px minimum heights. CSS custom properties bridge YAML desktop sizes to responsive `clamp()` values. Safe-area padding and `viewport-fit=cover` support device insets. Menus and dialogs can scroll internally in short viewports. Reduced-motion preferences disable discipline hover transitions. Shared image/video sizing is proportional, but no current content renderer emits image/video embeds.

CSS owns presentation mechanics and contains some literal colors and geometry, so YAML is not yet the sole source of every visual value. The specified font stack is Roboto, Arial, sans-serif; no font file is bundled or fetched by the application.

## Engagement lifecycle

When Home renders with engagement enabled and no completion value, a timeout is scheduled using `delay_ms` (currently 6000). At timeout, the renderer checks that the current route is still Home and the choice remains unanswered. This is a per-render timer, not a first-visit account or cookie system.

The four choices come from YAML. Robotics, Software, and Design targets are `robotics_projects`, `software_projects`, and `design_projects`. Selecting one stores its choice key, removes the overlay, navigates, and focuses the destination heading using `tabindex="-1"`. `target: none` dismisses the prompt, stays Home, and focuses the menu trigger.

The completion key is `mgr-engagement-complete` in `sessionStorage`, scoped to the browser's page session. Reloading or returning Home after a selection suppresses the prompt. No choice is submitted to a server. Menu keyboard behavior and engagement routing are tested; the engagement dialog does not currently implement a focus trap or Escape-to-dismiss handler. Pending timers are guarded by route/session checks rather than explicitly cancelled on navigation.

## Editing specifications and adding pages

For existing pages, edit their YAML copy and settings. Use existing palette/typography token names; unknown tokens requested through `token()` throw. Engagement targets must match real page keys, with `none` reserved for dismissal. Utilities use `destination`, while engagement choices use `target`.

To add a page in the current architecture:

1. Add its YAML file with a root key matching the intended page key.
2. Register it in `website.pages` in the global specification.
3. Add its explicit import and parsed root to `pageSpecs` in `src/specs.ts`.
4. Use an existing renderer's schema or implement an explicit rendering branch. Adding only a registry entry is insufficient.
5. Add intended navigation links and extend route/heading expectations in the browser regression.
6. Run the build and relevant checks, then record the result under the engineering standards.

TypeScript assertions around parsed YAML are not runtime schema validation. Malformed YAML can fail parsing; missing fields and invalid references are not comprehensively checked in advance. Simple text uses DOM text APIs, while project cards interpolate local YAML strings into `innerHTML`. A future richer-content pipeline needs an explicit escaping/media-validation contract; no Markdown or arbitrary remote-content authoring workflow is implemented today.

## Verification and engineering records

[README verification instructions](../README.md#verification) describe the existing runner and external Chrome/Playwright prerequisites. Playwright is not in `package.json`; there is no `npm test` or lint script. The runner uses five shared helpers, seven named verification functions, one context, and `finally` teardown. It serves `dist/` through a temporary localhost server and writes replaceable artifacts into [verification](verification).

Coverage includes seven routes at 320×568, 375×667, 390×844, 430×932, 667×375, 768×1024, 1024×768, and 1440×900; overflow and shared geometry; stacked branding/cards; menu keyboard interaction; interior Home actions; history/refresh; all engagement destinations and session suppression. Touch emulation is used for the engagement flow. It does not establish real iOS/Android behavior, external player playback, hosted routing, or deployment correctness.

[DEVNOTES.md](../DEVNOTES.md) and [TEST_LOG.md](../TEST_LOG.md) are append-only historical records. Update this document and README for current behavior; append new journal entries instead of rewriting prior decisions/results. Apply the [annotation](ANNOTATION_STANDARDS.md), [decision](DEVNOTES_STANDARDS.md), and [test](TEST_LOG_STANDARDS.md) standards when implementing changes.

## Repository and deployment status

This checkout has Git metadata, a configured remote named `origin`, a package lockfile, and ignore rules for dependencies, builds, caches, environment files, and logs. Remote connectivity and publication state were not verified in this review. There are no checked-in GitHub Actions workflows, Cloudflare deployment configuration, or runtime-version pin.

The intended division is Squarespace for registration, GitHub for source/content/history/CI, and Cloudflare Pages for hosting. Those services are not verified by a successful local build. Astro, static per-page HTML, Markdown content collections, project/article media, feeds, schema checks, and optional Decap authoring remain future work described in the [migration proposal](ARCHITECTURE_ALIGNMENT_REVIEW.md). There is no `content/` tree or CMS implementation in the current checkout.
