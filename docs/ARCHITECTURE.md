# Current implementation architecture

Updated November 11, 2026. This document describes the checked-in source and local build workflow. External hosting, DNS, and GitHub account configuration were not inspected beyond the checked-in Pages deploy workflow. The [migration review](ARCHITECTURE_ALIGNMENT_REVIEW.md) still describes a longer-term Astro/path-route proposal.

## Runtime and build boundaries

The application is a client-rendered, framework-free TypeScript single-page application. Vite bundles its source and CSS. `npm run build` runs `tsc` for strict type checking with no TypeScript emission, then Vite creates the production files in `dist/`. `npm run dev` starts Vite's development server; `npm run preview` serves the existing production output.

```text
specs/*.yaml ---------------> src/specs.ts / js-yaml ----+
content/projects|posts/*.yaml -> src/content/catalog.ts -+--> src/main.ts --> DOM
content/media/originals ----> scripts/optimize-images --> public/media
                          \-> scripts/validate-content (prebuild)
.pages.yml --> Pages CMS (GitHub commits) --> push master --> deploy-pages.yml
```

Page shell YAML and content collections are bundled as text and parsed in the browser. Build-time scripts validate content integrity and emit public image derivatives before Vite bundles. `index.html` supplies the empty app root; JavaScript is required. Page titles change at runtime; sitemap/RSS are not implemented.

There is no backend API, database, or visitor authentication. Editorial auth is GitHub + Pages CMS. The only browser persistence is the engagement choice in `sessionStorage`. Draft flags exclude posts from public indexes; treat drafts as unpublished rather than secret.

## Files and responsibilities

| File | Responsibility |
|---|---|
| [specs/main.yaml](../specs/main.yaml) | Global palette, typography, utility navigation, header/footer, page registry, and architecture intent |
| [specs/homepage.yaml](../specs/homepage.yaml) | Hero and discipline labels, routes, hover settings, engagement timing/copy/targets |
| Subject YAML files in [specs](../specs) | Subject heading, subtitle, placeholder project cards |
| About, Contact, and BLOG YAML files | Simple heading and paragraph arrays |
| [src/specs.ts](../src/specs.ts) | Eight explicit raw imports: one global specification and seven page specifications; parses them and exports page-key lookup |
| [src/types.ts](../src/types.ts) | Partial TypeScript contracts; flexible `Dict` values remain |
| [src/main.ts](../src/main.ts) | Token lookup, route dispatch (including project/post/layouts-preview), shared chrome, engagement |
| [src/content/](../src/content/) | Project/post types and catalog queries (discipline filter, featured post, draft exclusion) |
| [src/layouts/](../src/layouts/) | Five desktop patterns and four-panel post composition |
| [src/pages/](../src/pages/) | Discipline, project, blog, post, and layouts-preview renderers |
| [src/navigation.ts](../src/navigation.ts) | Menu disclosure, native hash links, keyboard/outside-click behavior, listener cleanup |
| [src/styles.css](../src/styles.css) | Shared visual treatment, responsive geometry, publishing layouts |
| [scripts/validate-content.mjs](../scripts/validate-content.mjs) | Unique IDs, references, featured-post ownership, HEIC rejection |
| [scripts/optimize-images.mjs](../scripts/optimize-images.mjs) | Orientation, resize, compression, EXIF/GPS strip → `public/media` |
| [scripts/check-publishing.mjs](../scripts/check-publishing.mjs) | Static publishing rule checks |
| [scripts/check-navigation.cjs](../scripts/check-navigation.cjs) | Local production-build browser regression and evidence capture |
| [.pages.yml](../.pages.yml) | Pages CMS collections, media, and relationship fields |

The `website.pages` registry and `pageSpecs` map are maintained separately. The loader does not discover files from `website.pages[*].source`. The `architecture.plugin_interfacing: json` value expresses intent; there is no implemented plugin interface. Likewise, not every declarative positioning or typography field is consumed: actual layout comes from the renderer and stylesheet.

## Routes and rendering

| Page key / pattern | Hash URL | Renderer |
|---|---|---|
| `homepage` | `#/` | Hero + Robotics/Software/Design/Blog |
| `robotics_projects` etc. | `#/robotics_projects` | Discipline index from shared projects |
| `blog` | `#/blog` | Published posts, newest first |
| `about` / `contact` | `#/about`, `#/contact` | Simple paragraphs |
| `project/<id>` | `#/project/<id>` | Project detail + associated posts |
| `post/<id>` | `#/post/<id>` | Stable post URL |
| `layouts-preview` | `#/layouts-preview` | All five patterns + CMS field map |

`currentRoute()` reads the hash. Nested `project/` and `post/` routes resolve before `pageSpecs` lookup. Unknown keys navigate Home.

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

Build-time `validate-content` enforces unique IDs, references, featured-post ownership, and image rules. Client loaders still trust validated YAML shape. Post bodies use a limited escaped Markdown subset (`src/lib/markdown.ts`); raw HTML is not passed through. Pages CMS is the authoring UI; there is no custom auth or page builder.

## Verification and engineering records

[README verification instructions](../README.md#verification) describe the existing runner and external Chrome/Playwright prerequisites. Playwright is not in `package.json`; there is no `npm test` or lint script. The runner uses five shared helpers, seven named verification functions, one context, and `finally` teardown. It serves `dist/` through a temporary localhost server and writes replaceable artifacts into [verification](verification).

Coverage includes seven routes at 320×568, 375×667, 390×844, 430×932, 667×375, 768×1024, 1024×768, and 1440×900; overflow and shared geometry; stacked branding/cards; menu keyboard interaction; interior Home actions; history/refresh; all engagement destinations and session suppression. Touch emulation is used for the engagement flow. It does not establish real iOS/Android behavior, external player playback, hosted routing, or deployment correctness.

[DEVNOTES.md](../DEVNOTES.md) and [TEST_LOG.md](../TEST_LOG.md) are append-only historical records. Update this document and README for current behavior; append new journal entries instead of rewriting prior decisions/results. Apply the [annotation](ANNOTATION_STANDARDS.md), [decision](DEVNOTES_STANDARDS.md), and [test](TEST_LOG_STANDARDS.md) standards when implementing changes.

## Repository and deployment status

This checkout has Git metadata, a configured remote named `origin`, a package lockfile, and ignore rules for dependencies, builds, caches, environment files, and logs. Remote connectivity and publication state were not verified in this review. GitHub Pages deploy is configured in [.github/workflows/deploy-pages.yml](../.github/workflows/deploy-pages.yml) on pushes to `master`. Pages CMS writes content through `.pages.yml`; image guidance is in [IMAGE_PIPELINE.md](IMAGE_PIPELINE.md). Astro/path-based HTML and feeds remain optional future work in the [migration proposal](ARCHITECTURE_ALIGNMENT_REVIEW.md).
