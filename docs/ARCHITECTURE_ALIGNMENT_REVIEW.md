# Architecture alignment review and migration plan

Reviewed: October 15, 2026. Scope: local code inspection, production build, and current official platform documentation. This is an assessment and proposed implementation plan, not an implemented migration or deployment.

## Assessment

The proposed stack fits this portfolio well. The current TypeScript/Vite starter provides a useful design and navigation prototype, but does not yet provide a publishing system. Retain its YAML specifications, TypeScript behavior, colors, and CSS foundations. Add build-time content processing and generate an HTML page for each project and blog post.

**Recommendation: adopt Astro in static-output mode as the build and page-rendering layer.** Application logic remains TypeScript, site specifications remain YAML, and long-form content becomes Markdown. No public authentication, application database, or request-time application server is needed. Astro introduces a template/build framework; it is a deliberate migration, not a configuration switch in the existing renderer. Its content collections support local Markdown, schemas, and build-time loading. [Astro content collections](https://docs.astro.build/en/guides/content-collections/)

Interpret the user's final architecture list as authoritative: GitHub owns source, content, history, and CI; Cloudflare Pages owns production hosting/CDN. GitHub Pages is unnecessary.

One current platform consideration: Cloudflare's Pages overview now recommends Workers for new projects. Pages remains a documented deployment option. This plan honors the requested Pages target and produces portable static files, leaving a later hosting change manageable. Do not silently substitute Workers or add backend services. [Cloudflare Pages overview](https://developers.cloudflare.com/pages/)

## 1. Alignment findings

| Area | Assessment | Local evidence and consequence |
|---|---|---|
| TypeScript | Aligned | `src/main.ts` handles behavior; `tsconfig.json` enables strict checking. Keep TypeScript for schemas, transforms, and small browser interactions |
| YAML site specification | Partially aligned | `src/specs.ts:1–22` imports seven files and parses them in the browser. Keep YAML, but move parsing/validation to the build |
| Content validation | Missing | `src/types.ts:1` uses `Record<string, any>`; `src/specs.ts:11` casts the parser result. Neither checks required fields, token references, or project links at runtime/build time |
| Markdown publishing | Missing | No `content/` tree, Markdown renderer, frontmatter schema, post discovery, draft filtering, or article routes exists |
| Project detail pages | Missing | `src/main.ts:168–203` renders subject indexes with text cards, no case-study destination or media |
| Images/video | Missing | No shared figure, gallery, or video-embed component; no content asset directory or media contract |
| Routes and generated HTML | Main architectural mismatch | `src/main.ts:29–37` uses hash routes. `index.html:10` contains an empty app root; the built HTML contains no article body. There are no distinct HTML documents or metadata for individual projects/posts |
| Navigation | Needs migration | Navigation uses buttons and `pushState`; replace page navigation with real anchors to generated paths. Keep buttons for actions such as loading a video |
| Content rendering boundary | Needs explicit design | `src/main.ts:195` interpolates YAML strings into `innerHTML`. Current inputs are local files, but this is not an appropriate general Markdown/media rendering contract |
| GitHub source/history | Not established in this folder | No `.git` metadata exists; `git status --short` and `git remote -v` report “not a git repository.” This does not prove that no remote copy exists |
| CI/deployment | Missing locally | No `.github/workflows/`, `.gitignore`, deployment configuration, or declared build-runtime pin was found |
| No public auth/database | Aligned | No user accounts, server APIs, or application database. Existing `sessionStorage` is a homepage UI preference, not a database |
| Documentation/verification | Partial | Standards and the prior proposed content plan exist. README still references a missing `docs/ARCHITECTURE.md`; authored source lacks the required headers and material function documentation |

The baseline `npm run build` completed successfully with Node 22.19.0, npm 11.10.0, and installed Vite 7.3.6. It produced one HTML shell, one CSS bundle, and one JS bundle. This establishes build health only; no browser, remote GitHub, domain, or Cloudflare configuration was verified. A clean `npm ci` was not performed. Evidence is recorded in `TEST-2026-10-15-001`.

## 2. Architecture and ownership

| Responsibility | Owner | Implementation boundary |
|---|---|---|
| Domain registration/renewal | Squarespace | Remains the registrar |
| Authoritative DNS | Recommend Cloudflare for an apex Pages domain | Distinct from registration; preserve existing mail and verification records during cutover |
| Source and content | GitHub repository | TypeScript, YAML, Markdown, optimized source images, and engineering records |
| Quality checks | GitHub Actions | Schema/content checks, type checks, build, output checks, and browser smoke tests |
| Deployment | Cloudflare Pages Git integration | Preview builds from branches; production from the protected production branch |
| HTML generation | Astro static build + TypeScript | Read local files at build time; emit static HTML/CSS/JS and processed media |
| Site composition | YAML | Navigation, theme tokens, About composition, featured project IDs, and blog category labels/order |
| Long-form content | Markdown with YAML frontmatter | Project narratives and blog posts; shared prose/media renderer |
| Video bytes/player | External video provider | Store links and optional local posters in Git, not large video files |
| Authoring | GitHub editor or local editor initially | Changes enter the same branch/PR/build workflow |

Proposed delivery flow:

```text
Editor → GitHub branch/PR → CI checks + Pages preview
                            ↓ merge after checks
                      production branch
                            ↓ checked build
                      Cloudflare Pages → visitor

Squarespace registration → DNS delegation → Cloudflare domain/HTTPS
```

Pages Git integration supports repository-triggered deployment and preview links. GitHub Actions should validate; do not also add a second automatic deployment job that races Pages. Required PR checks/branch rules guard merges; Pages does not inherently wait for an unrelated Actions workflow. Run content/static validation within the Pages build command as well. [Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)

### Why static generation

Build complete HTML documents with their own title, description, canonical URL, social image, headings, and article content. Article reading and ordinary navigation should work without JavaScript. JavaScript remains useful for the existing engagement interaction and optional click-to-load players.

Two viable implementation choices:

| Choice | Benefit | Cost | Recommendation |
|---|---|---|---|
| Astro static pages | Established content/routing/layout tooling; reusable TS and CSS; Markdown support | Replace the DOM page renderer with templates and add a framework dependency | Preferred while the starter is still small |
| Custom TypeScript/Vite generator | Keeps a framework-free application | Must implement route enumeration, HTML templates, metadata, Markdown/media pipeline, feeds, and validation | Valid fallback if avoiding Astro is a firm preference |

Extending the existing hash SPA with browser-side Markdown is the smallest first edit, but leaves article metadata and initial HTML unresolved. Avoid building that intermediate system and then migrating it again.

## 3. Proposed repository layout

```text
content/
├── blog/
│   ├── lab/
│   │   ├── filament-manifold.md
│   │   ├── esp32-display-test.md
│   │   └── assets/filament-manifold/assembled.webp
│   ├── ideas/
│   │   └── ysl-machine-language.md
│   └── learning/
│       └── rust-memory-model.md
└── projects/
    ├── smart-locket.md
    ├── spinal-curvature-trainer.md
    └── assets/smart-locket/prototype.webp
specs/
├── main.yaml
├── homepage.yaml
├── about.yaml
├── blog.yaml
└── [existing subject and contact specifications]
src/
├── content.config.ts
├── lib/                  # YAML schemas, content checks, media transforms
├── components/           # navigation, project cards, figures, video frames
├── layouts/              # shared page and article templates
├── pages/                # home, About, subjects, projects, blog, 404, feed
├── scripts/              # small optional browser behaviors
└── styles.css
public/                   # resume, icons, _headers, _redirects as needed
.github/workflows/ci.yml
astro.config.mjs
DEVNOTES.md
TEST_LOG.md
```

This preserves the user's three blog folders. The sample filenames are proposed content entries, not proof that those projects/posts are complete. Load only Markdown entries from `content/blog/**/*.md` and `content/projects/*.md`; adjacent assets are not posts.

Use one canonical source for project metadata: project Markdown frontmatter. Subject YAML should reference project IDs and control presentation order. Do not repeat titles, summaries, statuses, and narratives in a separate `projects.yaml` catalog. A generated catalog is fine; a second hand-maintained copy is not needed.

This revises the earlier proposal for a YAML project catalog and hash-based detail URLs in `PORTFOLIO_CONTENT_PLAN.md`. Its project selections, evidence requirements, and About structure remain useful.

## 4. Content contract and URLs

Common frontmatter fields: stable `id`, `title`, `summary`, `draft`, optional `updated`, `tags`, and optional `cover` with `src` and `alt`.

Blog adds `published` and optional `related_projects`. Derive category from the containing folder (`lab`, `ideas`, `learning`) rather than requiring authors to maintain a duplicate category field. Initially derive the URL slug from the filename; document that renaming/moving a published file requires a redirect. Projects add `primary_subject`, optional secondary subjects, `role`, and project `status`. Project status and publication draft status are separate.

Illustrative post, not proposed factual article copy:

```markdown
---
id: filament-manifold
title: "Filament manifold: first prototype"
summary: "Notes on the prototype and the next bench checks."
published: "2026-10-15"
draft: true
tags: [fabrication, prototyping]
cover:
  src: "./assets/filament-manifold/assembled.webp"
  alt: "Assembled manifold showing the filament inlet paths"
related_projects: []
---

## What I am testing

Write the purpose, observations, and limitations here.

![Assembled manifold showing the inlet paths](./assets/filament-manifold/assembled.webp)

[Watch the bench demonstration](https://www.youtube.com/watch?v=VIDEO_ID "video")
```

Proposed public URLs:

- `/about/`, `/contact/`, `/robotics/`, `/software/`, `/design/`
- `/projects/smart-locket/`
- `/blog/`, `/blog/lab/`, `/blog/ideas/`, `/blog/learning/`
- `/blog/lab/filament-manifold/`

Generate each published detail page at build time. Use one publication predicate for routes, indexes, related links, feed, and sitemap. Default new files to drafts; omit drafts and future-dated posts from production output. Date-only publication values follow a documented America/New_York calendar rule. Scheduled dates require a new build to become visible; omit automated scheduling initially.

Draft filtering must remove content from generated HTML and client bundles, not simply hide cards. Git repository visibility is a separate decision: a draft in a public repository is readable there. Keep draft-enabled previews local initially; ordinary hosted previews use the public-content filter unless a separate private author-preview workflow is introduced.

Validate duplicate IDs/routes, missing fields, date formats, subject/category values, local asset paths, related project IDs, and links to unpublished destinations. Generate an RSS feed and sitemap from the same published collection. New content should require a Markdown file and media, without a new source import or renderer edit.

### Portfolio and blog relationship

Keep projects as curated case studies and posts as dated lab notes, ideas, or learning records. Connect a post to a project through `related_projects`; derive the project's “Related lab notes” list from those references. Avoid duplicating the relationship in both files.

Retain the earlier About plan: capability statements link to a few representative canonical projects. Add “Blog” as utility navigation and optionally one “From the lab” link at the end of About. Do not turn every recent experiment into another featured portfolio project. Lab, Ideas, and Learning describe the kind of writing; Robotics, Software, and Design describe project disciplines.

## 5. Images and embedded videos

Use the **same article and media pipeline for projects and blog posts**.

### Images

- Authors use normal Markdown `![alt](relative-path)` for inline images. Store web-sized images alongside their content and retain useful source filenames.
- Resolve local images at build time; fail on missing paths and require meaningful alternative text for informative images. Use explicit decorative treatment only where appropriate.
- Implement responsive width, intrinsic dimensions/aspect ratio, and lazy loading below the first screen. Use a shared figure treatment for captions; add a gallery only when actual content needs it.
- Use Astro's asset pipeline where applicable and explicit responsive variants for covers/shared image components. Standard `.md` images are supported, but `.astro` image components cannot be written directly in `.md`; validate the exact inline-image output rather than assuming all cover behavior applies automatically. [Astro images](https://docs.astro.build/en/guides/images/)
- Keep original CAD files, raw camera archives, and large videos out of the web-image workflow. This does not require adding object storage initially.

### Video links

Adopt an explicit plain-Markdown convention: a standalone link with the title `"video"` requests an embed. In GitHub it remains a usable watch link. In the site, a small build-time transform produces the shared video presentation. This convention is custom work to implement and test, not native Markdown behavior.

Start with YouTube. Parse supported normal watch/short URLs, validate the exact hostname and video identifier, and generate the provider embed URL. Use a provider adapter interface so Vimeo can be added when needed; other links stay ordinary links. YouTube embeds use a player URL distinct from the watch URL. [YouTube embedded players](https://developers.google.com/youtube/player_parameters)

The rendered block needs a descriptive title, responsive frame, optional local poster/caption, fullscreen support, and a persistent “Watch on YouTube” fallback. Default to click-to-load with no autoplay. With JavaScript disabled, the fallback link still works. Do not auto-embed every YouTube reference in a paragraph.

Keep arbitrary author-supplied HTML/iframes disabled or rejected. Escape text, validate URL schemes, and allow only supported provider frames in the content pipeline and hosting policy. Test this boundary with malformed and unsupported URLs. This directly replaces the current raw-string `innerHTML` pattern when richer content is introduced.

Provider embedding restrictions can still prevent playback even for valid URLs. Test an actual permitted video and a fallback case before publishing. The reader should always retain the external watch link. The homepage's current statement about its session-only preference should remain scoped to that interaction; embedded third-party media has separate behavior.

## 6. GitHub, Pages, and domain setup

1. **Establish the repository.** Locate the intended GitHub repository first. If it exists, connect the correct checkout/history rather than initializing unrelated history. Otherwise initialize this folder and create the intended remote as a later implementation step. Add ignore rules for dependencies, generated output, framework caches, local environment files, and credentials. Keep the lockfile and publishable source assets tracked.
2. **Pin a supported build runtime.** Choose a Node version supported by the selected Astro release and set the same version locally, in Actions, and in Pages. Do not treat the observed local version as the migration's final pin without checking compatibility.
3. **Create CI.** On pull requests and production-branch changes, use `npm ci`, type/schema checks, targeted tests, a production build, generated-link/draft checks, and browser smoke tests. Save useful failure artifacts. Add the required check to branch rules where the repository supports it.
4. **Connect Pages once the site builds.** Use repository root, output `dist`, and a proposed `npm run build:checked` command that includes static/content checks and build-output validation. This script does not exist yet. Configure branch previews and the intended production branch. [Pages build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
5. **Inspect the hosted preview.** Verify real HTML routes, refreshes, media, metadata, 404 status, and asset paths. Generate a top-level `404.html`; Pages otherwise defaults to SPA-style fallback for missing paths. [Pages routing behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
6. **Attach the domain after preview verification.** Keep registration at Squarespace. For an apex Pages domain, add the zone to Cloudflare and delegate its nameservers there. A subdomain-only deployment can use a CNAME while keeping external DNS. Add the domain in Pages before treating DNS as complete. [Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
7. **Complete DNS carefully.** Inventory existing records, copy required mail/verification records, coordinate DNSSEC if enabled, then verify HTTPS, mail-related records, and a single canonical apex-or-www hostname. Squarespace supports custom nameservers. [Squarespace nameservers](https://support.squarespace.com/hc/en-us/articles/4404183898125-Review-change-or-reset-your-domain-s-nameservers)

Old hash URLs cannot be recovered by a server redirect because URL fragments are not sent to the server. Add a small homepage compatibility script mapping known legacy hashes to the new routes. Normal new links use clean paths. Preserve intentional article heading fragments.

If later requirements make GitHub Actions the deployment executor as well as CI, use one explicitly chosen Wrangler deployment workflow and disable competing automatic deployments. Pages project deployment modes have setup implications, so choose the model before creating the hosting project. [Pages setup](https://developers.cloudflare.com/pages/get-started/git-integration/)

## 7. Delivery phases and acceptance gates

| Phase | Work | Done when |
|---|---|---|
| 1 — Foundation | Repository/history setup, ignore rules, runtime pin, static generator, shared layout; retain visual tokens | Existing pages render as HTML; production build succeeds; normal navigation works without JS |
| 2 — Content and media slice | Blog/project schemas, collection discovery, one example of each, shared images/video, metadata, real routes/404 | Both page types show an image and a permitted embedded video; fallback works; adding another valid Markdown file requires no TS edit |
| 3 — Publishing workflow | Category indexes, draft/date filtering, RSS/sitemap, project/post cross-links, About integration, authoring guide | Production excludes drafts everywhere; broken references fail validation; all published pages are reachable |
| 4 — CI and hosting preview | Actions checks, branch rules, Pages checked build, preview deployment, legacy links | Preview passes navigation/media checks; failed checks prevent the intended production path; no duplicate deployment pipeline |
| 5 — Domain and launch | DNS/custom domain, canonical redirects, HTTPS, final content/evidence review | Public routes and media work on the domain; 404 behavior and email DNS remain correct; release regression recorded |
| Later — Decap | Map fields and media to the existing Markdown files; configure author login and previews | Editing produces the same validated Git changes and publishing results |

Per the repository standards:

- **T0:** validate each changed implementation file before proceeding substantially beyond it; type checks, YAML/frontmatter/schema parsing, and build checks as applicable.
- **T1:** exercise the loader, article renderer, and video URL parser. Cover valid and invalid metadata, duplicate routes, missing images, malformed/unsupported video URLs, and draft/date behavior with meaningful tests.
- **T2:** trace Markdown/YAML → generated HTML → browser. Verify direct requests, refresh, navigation/history, metadata, media/fallbacks, and project/post links. Inspect production output for draft content leakage.
- **T3:** run milestone regression for homepage behavior, About/contact/resume, subject indexes, projects, blog indexes/articles, keyboard/mobile use, focus, and reduced motion. Hosted DNS/HTTPS and player playback require their own observed checks.

Append actual outcomes to `TEST_LOG.md`; never describe build success as browser success. Failed T1–T3 checks block progression except investigation/repair or a properly authorized and recorded limitation. Add source headers and function/type contracts as required by `ANNOTATION_STANDARDS.md`, with relevant DEV references. Preserve earlier journal entries and issue new IDs for corrections or changed decisions.

Write `docs/ARCHITECTURE.md` to describe the implemented architecture during migration, and `docs/CONTENT_AUTHORING.md` for file creation, assets, video links, drafts, related projects, previews, and publishing. Update README commands at the same time. Do not document proposed commands as if they already work.

## 8. Later Decap and remaining decisions

Decap is an optional authoring interface over the same Git-backed files. It does not require visitor accounts or an application database. It **does** need author authentication and a supported GitHub OAuth/auth service; adding an admin HTML page alone is insufficient. Defer that service until browser-based authoring is needed. Plan explicit mappings for the three category folders and media paths, and a preview representation for the custom video-link convention. [Decap GitHub backend](https://decapcms.org/docs/github-backend/)

Before external setup, resolve the intended GitHub repository/visibility, Cloudflare project/account, domain/canonical hostname, and first video provider/content. These details do not block local architecture work. Astro remains a recommendation in this review; Pages is retained as the requested target with its current platform trade-off recorded.

Recommended first implementation milestone: **one project and one lab post, each with an image and a working video embed/fallback, generated as static HTML and validated locally.** Establish that complete path before bulk content entry, CMS integration, or DNS changes.
