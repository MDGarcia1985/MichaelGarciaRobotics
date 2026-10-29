# Engineering Decision Journal

### DEV-2026-09-24-001 — Proposed portfolio content structure and project routing

**Date:** 2026-09-24  
**Time:** 21:41 America/New_York  
**Engineer:** Codex /root  
**Status:** PROPOSED  
**Type:** DECISION

#### Problem

The website specs contain intentional About, project, and Contact placeholders. The user requested a source-grounded plan for completing the missing content, selecting project counts, and connecting About to project evidence without duplication.

#### Context and Constraints

The resume and selected-project TXT files in docs/ supply factual inputs, but do not supply complete case-study evidence or an external assessment rubric. The current renderer has only exact page lookup, non-interactive project cards, and paragraph-only simple pages. The README references a missing docs/ARCHITECTURE.md. The supplied engineering standards govern subsequent implementation.

#### Solutions Considered

- Repeat full project summaries on About and subject pages.
- Keep all project evidence behind subject indexes with no direct About links.
- Use concise capability statements on About with direct links to canonical project cases, plus subject navigation for browsing.

#### Trade-offs

Direct canonical links make professional claims easier to inspect and avoid multiple versions of a case study. They require a project schema, route handling, and a richer About renderer. Eight body links give broad coverage but need clear grouping. The proposed Software count depends on whether the two Viking responsibilities support independently meaningful cases.

#### Final Outcome

Propose three Robotics, three Software, and two Design cases, with a separate tracked-vehicle preview. Reduce Software to two if the Viking material belongs in one case. Use three About capability sections with one primary project link and smaller related-example links. This is a planning recommendation, not an accepted or implemented runtime contract. See docs/PORTFOLIO_CONTENT_PLAN.md for the selection, evidence gaps, link map, and staged work.

#### Implementation Impact

Future work affects specs/about.yaml, the subject specs, a proposed specs/projects.yaml catalog, src/types.ts, src/specs.ts, src/main.ts, src/styles.css, public assets, README.md, and docs/ARCHITECTURE.md. This change creates planning documentation only.

#### Verification Required

No behavioral test is required for this non-executable Markdown change. Subsequent implementation requires T0 file/schema/build checks, T1 rendered-feature smoke tests, T2 content/routing integration checks, and T3 critical navigation and homepage regression checks. Verification pending; no runtime success is asserted.

#### Related Records

- DEVNOTES: None
- Tests: Pending for future implementation
- Source: docs/PORTFOLIO_CONTENT_PLAN.md; README.md; specs/; src/; docs/ source TXT files and engineering standards

#### Next Steps

Collect the named project artifacts and missing status/role information, then implement and validate the staged portfolio slice when implementation is requested. Record any accepted or revised architecture in a new DEV entry and actual verification in TEST_LOG.md.

#### Deferred Decisions

Whether Viking work supports two distinct case studies; exact Yggdrasil implementation status; project dates and employer attribution; education completion status; final public resume asset; and source licensing metadata. Resolve each using project evidence or owner-provided information before making the corresponding public claim.

---

---

### DEV-2026-10-15-001 — Proposed static publishing architecture and shared media contract

**Date:** 2026-10-15  
**Time:** 13:29 America/New_York  
**Engineer:** Codex /root  
**Status:** PROPOSED  
**Type:** DECISION

#### Problem

The user requested alignment review and a plan for Squarespace domain registration, GitHub source/content/CI, Cloudflare Pages hosting, TypeScript, YAML site specs, Markdown projects/blog, images/video embeds, and no initial public authentication or database.

#### Context and Constraints

The starter builds but generates one empty HTML shell with browser-side YAML parsing and hash navigation. Markdown publishing, media, real detail routes, Git metadata, and CI configuration are absent locally. Current Cloudflare documentation recommends Workers for new projects; this review retains the explicitly requested Pages target and records that trade-off. No remote account or domain state was verified.

#### Solutions Considered

- Extend the current browser-rendered hash SPA with Markdown loading.
- Build a custom TypeScript/Vite static generator.
- Adopt Astro static generation while retaining TypeScript, YAML intent, CSS, and Git-backed Markdown.

#### Trade-offs

Static generation provides distinct HTML documents and metadata with no application server. Astro reduces custom publishing infrastructure but introduces a framework and template migration. Shared plain-Markdown media keeps authoring portable; explicit embed handling requires a small custom transform and tests. Native Pages Git deployment plus GitHub CI minimizes deployment plumbing but requires branch checks and a checked hosting build rather than assuming independent workflows wait for each other.

#### Final Outcome

Propose Astro static pages, canonical project metadata in Markdown frontmatter, YAML references for composition, real path routes, and a common image/video pipeline for projects and blog posts. GitHub owns source/content/CI; Pages owns delivery. Public auth and database remain absent. Decap is deferred and would need author authentication.

Supersedes: the proposed hash detail routes and separate hand-maintained YAML project catalog in DEV-2026-09-24-001 and its linked plan, at the recommendation level only.
Reason: the new Markdown/blog/static-hosting requirements favor one content source and build-time HTML. The prior editorial project selection and About layout remain applicable. No migration is implemented by this entry.

#### Implementation Impact

Future migration affects src/main.ts, src/specs.ts, src/types.ts, styles, specs, package/build configuration, and documentation; adds content/, static page templates, media transforms, CI, and hosting support. This review creates docs/ARCHITECTURE_ALIGNMENT_REVIEW.md, adds a follow-up pointer to the earlier plan, and records baseline build evidence only.

#### Verification Required

T0 type/schema/build validation for changed files; T1 content/media smoke tests; T2 generated-page/routing/media integration; T3 public navigation, homepage behavior, publishing, and hosted-domain regression. Runtime verification pending. The existing production build completed; that does not validate the proposed architecture.

#### Related Records

- DEVNOTES: DEV-2026-09-24-001
- Tests: TEST-2026-10-15-001 (existing starter, static baseline only)
- Source: docs/ARCHITECTURE_ALIGNMENT_REVIEW.md; docs/PORTFOLIO_CONTENT_PLAN.md; src/main.ts; src/specs.ts; src/types.ts; index.html; package.json; specs/

#### Next Steps

Implement a local static slice containing one project and one lab post with images and video embeds/fallbacks when implementation is requested. Establish repository ownership/history before remote setup. Record accepted or revised implementation choices in a new entry and executed checks in TEST_LOG.md.

#### Deferred Decisions

Astro adoption; intended GitHub remote and visibility; Cloudflare project/account; canonical hostname and existing DNS records; final supported runtime pin; initial real media; optional future Decap auth provider. Pages remains the user's requested hosting target.

---

---

### DEV-2026-10-15-002 — Shared Figma navigation and fixed-size single-line title

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Engineer:** Codex /root  
**Status:** IMPLEMENTED  
**Type:** DECISION

#### Problem

The user requested replacing the home icon with a 40x40 Figma-derived click dropdown containing Home, About, and Contact; removing standalone About/Contact header/footer links; and keeping Michael Garcia on one line at its current size.

#### Context and Constraints

The current YAML hero font is 150px, not the earlier starter's 75px. Existing .hero width was capped at 900px, narrower than the approximately 993px title. Preserve the user's current 80px homepage header/footer spacing, six-second engagement setting, copy, and other design tokens. Figma page 0:1 contains frame 1:2: a white 250px square with three gray rounded rectangles. High-fidelity design context and screenshot were retrieved for 1:2; no external image/SVG assets were supplied or needed.

#### Solutions Considered

Use duplicated page-specific menus or one shared disclosure. Reduce the font on narrow screens or retain its configured size with intrinsic width and no wrapping. Render Figma's provided CSS rectangles as native spans, scaled from 250px to the requested 40px.

#### Trade-offs

Shared navigation avoids inconsistent menus and disposes document listeners on page replacement. Native links retain browser link/Tab behavior. Keeping 150px on one line means narrow screens scroll horizontally, as required by the simultaneous size and no-wrap constraints. An initial visual check exposed the root background beyond the narrow homepage; the homepage now expands behind its content.

#### Final Outcome

Implemented global YAML navigation labels/dimensions, a shared accessible click disclosure, and the scaled Figma icon on every page. About and Contact now appear only inside the navigation dropdown. Removed the 900px hero width cap, retained 150px, and set white-space: nowrap. Added a reusable browser regression script. The earlier static-site migration remains proposed and was not included in this cleanup.

#### Implementation Impact

src/navigation.ts, src/main.ts, src/types.ts, src/styles.css, specs/main.yaml, specs/homepage.yaml, scripts/check-navigation.cjs; verification artifacts under docs/verification/.

#### Verification Required

T0 compilation/bundle and YAML contract checks; T1 click/keyboard/disclosure checks; T2 navigation across all six routes; T3 title geometry, history/refresh, discipline links, visual review, and existing session-only engagement. Executed evidence is recorded in TEST-2026-10-15-002 through TEST-2026-10-15-008, including blocked browser attempts and the corrected narrow-screen visual failure.

#### Related Records

- DEVNOTES: DEV-2026-10-15-001 (migration remains deferred)
- Tests: TEST-2026-10-15-002 through TEST-2026-10-15-008
- Source: src/navigation.ts; src/styles.css; specs/main.yaml; scripts/check-navigation.cjs

#### Next Steps

None for the requested cleanup. Retain the regression script for future navigation changes.

#### Deferred Decisions

Future responsive font scaling would require relaxing the user's current-size requirement. Source license remains Pending confirmation.

---

---

### DEV-2026-10-15-003 — YAML-controlled navigation icon colors and shadow

**Date:** 2026-10-15  
**Time:** 15:47 America/New_York  
**Engineer:** Codex /root  
**Status:** IMPLEMENTED  
**Type:** DECISION

#### Problem

The user requested color, background.color, and drop_shadow.visible/color directly under utility_navigation.size_px.

#### Context and Constraints

Named palette tokens already exist. The request supersedes the original Figma gray/white appearance while retaining icon geometry and behavior. YAML indentation uses spaces.

#### Solutions Considered

Store unused specification fields, or connect them to the shared navigation renderer using the existing palette resolver. Implemented the latter.

#### Trade-offs

YAML owns icon foreground/background/shadow color and visibility. Shadow geometry remains a presentation default of 0px horizontal, 2px vertical, 6px blur. This avoids expanding the requested schema with additional settings.

#### Final Outcome

Added the requested fields and TypeScript contract. The trigger resolves burnt_auburn, plum, and burgundy through the existing color resolver; bars inherit currentColor. A false visible setting selects box-shadow: none. The dropdown panel's own styling is unchanged.

#### Implementation Impact

specs/main.yaml; src/types.ts; src/main.ts; src/navigation.ts; src/styles.css; scripts/check-navigation.cjs.

#### Verification Required

T0 build and script syntax; T1/T2 computed appearance and navigation integration; T3 existing navigation/title/engagement regression. Executed records: TEST-2026-10-15-009 and TEST-2026-10-15-010.

#### Related Records

- DEVNOTES: DEV-2026-10-15-002
- Tests: TEST-2026-10-15-009; TEST-2026-10-15-010
- Source: specs/main.yaml utility_navigation; src/navigation.ts createNavigationHeader

#### Next Steps

None.

#### Deferred Decisions

None.

---

---

### DEV-2026-10-15-004 — Consistent page header and copyright footer

**Date:** 2026-10-15  
**Time:** 21:54 America/New_York  
**Engineer:** Codex /root  
**Status:** IMPLEMENTED  
**Type:** DECISION

#### Problem

Menu position differed between Home and other pages. The user requested matching Home, adding Michael Garcia beside every menu, and a bottom-left copyright at ten pixels.

#### Context and Constraints

Only Home specified an 80px header; other routes used the CSS minimum. Home also had an empty 80px footer while other pages had none. Retain the 40px menu, existing appearance, dropdown behavior, and 150px homepage title.

#### Solutions Considered

Duplicate per-page dimensions or move common header/footer settings into the global specification. Selected global settings and shared rendering helpers.

#### Trade-offs

A single specification avoids position drift. The footer stays in normal page flow so it follows longer content rather than covering it. Interpret ten pixels as font size and also use a 10px bottom/left inset. The adjacent header name uses 20px type and a 12px gap.

#### Final Outcome

All pages now use the same 80px header and footer. Menu is at x=14px, y=20px. Michael Garcia appears beside it; the footer reads © Michael Garcia at 10px. Settings live in website.header and website.footer in specs/main.yaml; removed duplicate homepage height settings.

#### Implementation Impact

specs/main.yaml; specs/homepage.yaml; src/main.ts; src/types.ts; src/styles.css; scripts/check-navigation.cjs; docs/verification/.

#### Verification Required

T0 compilation/bundle and script syntax; T1/T2 shared header/footer rendering and spec integration; T3 all-page desktop/narrow geometry and existing navigation/title/engagement regression. Recorded in TEST-2026-10-15-011 and TEST-2026-10-15-012.

#### Related Records

- DEVNOTES: DEV-2026-10-15-002; DEV-2026-10-15-003
- Tests: TEST-2026-10-15-011; TEST-2026-10-15-012
- Source: src/main.ts siteHeader/siteFooter; specs/main.yaml header/footer

#### Next Steps

None.

#### Deferred Decisions

None.

---

---

### DEV-2026-10-16-001 — Navigation regression script structure

**Date:** 2026-10-16  
**Time:** 13:37 America/New_York  
**Engineer:** Codex /root  
**Status:** IMPLEMENTED  
**Type:** DECISION

#### Problem

The user requested top-level constants, 3–5 small helpers, 5–7 named verification functions, a short main, finally-based teardown, and consideration of one shared context instead of repeated parameters.

#### Context and Constraints

Preserve existing browser coverage, CLI invocation, screenshots, and JSON report shape. Existing unrelated site/header/footer changes remain in the working tree.

#### Solutions Considered

Pass individual page/browser/locator/result arguments to every function, or share a context populated by setup. Selected one context, with optional local arguments only for route/viewport and screenshot filename. The HTTP callback retains Node's required request/response signature.

#### Trade-offs

A shared context keeps orchestration compact while making resource ownership explicit. Each verification establishes its own page state to reduce ordering dependencies. Named constants collect routes, viewport sizes, expected styles/geometry, timing, and output paths. Splitting coverage adds function documentation but makes individual checks easier to locate.

#### Final Outcome

Five helpers: serve, setup, visit, screenshot, teardown. Seven verifications: icon appearance, menu interactions, menu routes, shared header/footer, title layout, navigation history, and engagement. main passes one context and executes teardown in finally. Setup is inside the protected scope; server teardown runs even if browser.close fails. The fresh engagement context also closes in finally and now reports its page errors.

#### Implementation Impact

scripts/check-navigation.cjs; regenerated docs/verification/navigation-report.json. Existing screenshot filenames and report object structure retained; final T3 messages are split by verification responsibility. No application behavior changed in this refactor.

#### Verification Required

T0 script syntax/build, browser regression covering retained T1/T2/T3 behavior, and fault-injection checks for partial setup, verification failure, and browser-close failure. See TEST-2026-10-16-001 and TEST-2026-10-16-002.

#### Related Records

- DEVNOTES: DEV-2026-10-15-004
- Tests: TEST-2026-10-16-001; TEST-2026-10-16-002
- Source: scripts/check-navigation.cjs

#### Next Steps

None.

#### Deferred Decisions

None.

---

---

### DEV-2026-10-23-001 — Add discipline and BLOG utility links

**Date:** 2026-10-23  
**Time:** 09:41 America/New_York  
**Engineer:** Codex /root  
**Status:** IMPLEMENTED  
**Type:** DECISION

#### Problem

The user requested Robotics, Software, Design, and BLOG links in utility_navigation.

#### Context and Constraints

The discipline routes exist; BLOG had no page or loader registration. Keep the existing hash router, shared header/footer, and menu styling.

#### Solutions Considered

Add a nonfunctional BLOG link or register a minimal simple page. Selected a real placeholder destination without implementing the separately proposed blogging platform.

#### Trade-offs

A minimal BLOG page supplies working navigation now; article publishing remains future work. New items follow Home and precede About/Contact.

#### Final Outcome

Menu order is Home, Robotics, Software, Design, BLOG, About, Contact. BLOG routes to #/blog and displays a posts-coming-soon message. Added its YAML specification, global registry entry, and loader import. Extended existing regression checks for all seven destinations and their headings.

#### Implementation Impact

specs/main.yaml; specs/blog.yaml; src/specs.ts; scripts/check-navigation.cjs; regenerated verification artifacts.

#### Verification Required

T0 compilation/bundle and script syntax; T1 menu interactions, T2 each destination, and T3 shared layout and existing regression. See TEST-2026-10-23-001 and TEST-2026-10-23-002.

#### Related Records

- DEVNOTES: DEV-2026-10-16-001; DEV-2026-10-15-001
- Tests: TEST-2026-10-23-001; TEST-2026-10-23-002
- Source: specs/main.yaml utility_navigation; specs/blog.yaml; src/specs.ts

#### Next Steps

None for this request.

#### Deferred Decisions

Blog article publishing remains part of the earlier architecture proposal.

---

---
### DEV-2026-10-23-002 — Portrait-first responsive presentation

**Date:** 2026-10-23  
**Time:** 13:03 America/New_York  
**Engineer:** Codex /root  
**Status:** IMPLEMENTED  
**Type:** DECISION

#### Problem

Fixed-size titles and horizontal discipline branding overflow smartphones. The user requests a portrait layout while preserving desktop identity.

#### Context and Constraints

Preserve shared YAML content, palette, fonts, and hash routes. Supersedes the narrow-screen overflow policy in DEV-2026-10-15-002 and related fixed-title checks in DEV-2026-10-15-004.

#### Solutions Considered

Duplicate mobile pages, shrink desktop composition, or reflow shared components with CSS. Selected shared responsive CSS to avoid content drift and additional dependencies.

#### Trade-offs

Mobile titles wrap and the menu grows from 40px to 44px. Phone margins adapt between 16 and 24px. Desktop retains its header/footer insets and typography. Tablet sizes interpolate before desktop sizes resume at 1100px.

#### Final Outcome

Below 768px, discipline buttons form one left-aligned navigation group with decorative rules; cards and dialog choices stack. Clamp typography, safe-area padding, and bounded scrolling support portrait and landscape. Reduced-motion preferences disable emphasis animation. Desktop retains horizontal branding. No content duplication or runtime dependencies added.

#### Implementation Impact

src/styles.css; src/main.ts; index.html; scripts/check-navigation.cjs. Regression script retains five helpers, seven verifications, a context object, and finally teardown.

#### Verification Required

T0 build and syntax. T1 controls, T2 all seven routes across eight viewports, T3 history/session/keyboard regression and visual inspection.

#### Related Records

- DEVNOTES: DEV-2026-10-15-002; DEV-2026-10-15-004; DEV-2026-10-16-001
- Tests: TEST-2026-10-23-003; TEST-2026-10-23-004
- Source: src/styles.css; src/main.ts; index.html; scripts/check-navigation.cjs

#### Next Steps

None for implementation; record final verification in TEST_LOG.md.

#### Deferred Decisions

Physical iOS/Android safe-area validation requires real devices. Tests use Chrome viewport/touch emulation. Project media content is not added by this change; shared image/video sizing is proportional.

---

---

### DEV-2026-10-23-003 — Header Home action and engagement destinations

**Date:** 2026-10-23
**Time:** 13:49 America/New_York
**Engineer:** Codex /root
**Status:** IMPLEMENTED
**Type:** DECISION

#### Problem

The user confirmed that interior header branding should return Home and engagement choices should open project pages rather than emphasize navigation items.

#### Context and Constraints

Retain the Home-only omission of header branding, existing visual styling, hash router, and session-only completion state.

#### Solutions Considered

Map old discipline keys to routes in TypeScript or configure actual page targets in YAML. Selected explicit YAML page targets to keep content behavior in the specification. Use a native button for the requested header action.

#### Trade-offs

Header branding now participates in keyboard navigation and has a 44px target. Engagement choices navigate immediately, replacing the previous emphasis animation. Project headings receive focus after navigation; dismissal returns focus to the menu.

#### Final Outcome

Interior header buttons return Home. Robotics, Software, and Design engagement targets are their existing project routes; Just looking dismisses without navigation. Session suppression remains unchanged. Removed unused emphasis CSS and updated explanatory copy and README.

#### Implementation Impact

src/main.ts; src/styles.css; specs/homepage.yaml; README.md; scripts/check-navigation.cjs.

#### Verification Required

T0 build/script syntax; T1 header and modal actions; T2 all target routes and focus transfer; T3 responsive/navigation/session regression.

#### Related Records

- DEVNOTES: DEV-2026-10-23-002
- Tests: Pending
- Source: src/main.ts siteHeader and scheduleEngagement; specs/homepage.yaml engagement

#### Next Steps

Complete browser regression and record results in TEST_LOG.md.

#### Deferred Decisions

None.

---

---

### DEV-2026-10-29-001 — Proprietary website and repository license

**Date:** 2026-10-29
**Time:** 10:42 America/New_York
**Engineer:** Codex /root
**Status:** IMPLEMENTED
**Type:** DECISION

#### Problem

The owner requested a proprietary root license preserving rights in the website, with implementation novelty not a priority.

#### Context and Constraints

Existing source headers identify Michael Garcia as owner but leave licensing pending. Third-party dependencies retain their own terms. Historical journal entries remain immutable.

#### Solutions Considered

A proprietary license covering owner-authored website material and source; or a separate permissive source license. Selected proprietary terms to match the request without granting unrequested reuse rights.

#### Trade-offs

Normal public website viewing and browser caching are permitted. Other reuse of protected material requires written permission unless allowed by law or a separate agreement. General ideas and functional concepts are excluded from exclusive claims. Third-party terms and hosting-platform rights remain unaffected.

#### Final Outcome

Added LICENSE naming Michael Garcia and reserving rights in original content, design, documentation, source, and branding as applicable. Supersedes the pending source-license disposition in DEV-2026-10-15-004. The npm license field is UNLICENSED; README and active file headers point to LICENSE.

#### Implementation Impact

LICENSE; README.md; package.json; package-lock.json root package metadata; license comments in index.html, src/, and scripts/check-navigation.cjs. No runtime logic changes.

#### Verification Required

T0 metadata consistency, license/header inspection, build, script syntax, and whitespace validation. No runtime behavior changes requiring browser regression.

#### Related Records

- DEVNOTES: DEV-2026-10-15-004
- Tests: TEST-2026-10-29-001
- Source: LICENSE; README.md; package.json; package-lock.json; index.html; src/; scripts/check-navigation.cjs

#### Next Steps

None.

#### Deferred Decisions

None.

---

---
### DEV-2026-10-29-002 — Resolve current licensing guidance and historical deferrals

**Date:** 2026-10-29
**Time:** 10:49 America/New_York
**Engineer:** Codex /root
**Status:** IMPLEMENTED
**Type:** DECISION

#### Problem

The owner requested a codebase-wide review and replacement of ambiguous licensing references and unresolved license statements.

#### Context and Constraints

LICENSE is authoritative. Engineering journals are append-only; earlier statements describe their original dates, not the current license. Third-party terms remain separate.

#### Solutions Considered

Correct current guidance and append a historical disposition, or rewrite earlier journal entries. Selected the documented append-only correction workflow.

#### Trade-offs

Historical wording remains available as evidence; this entry explicitly closes every historical source-license deferral found in the audit.

#### Final Outcome

Project-owned files are proprietary under root LICENSE. Replaced the MPL-2.0 header example, restricted unknown-metadata placeholders to ownership/contact information, aligned the portfolio plan, explained npm UNLICENSED metadata in README, and added the missing Vite config license header.

Supersedes: the source-licensing deferrals in DEV-2026-09-24-001 and DEV-2026-10-15-002. Both are resolved by LICENSE and DEV-2026-10-29-001; no project license decision remains open.

Correction to DEV-2026-10-29-001: the historical source-license deferral is in DEV-2026-10-15-002, not DEV-2026-10-15-004. The earlier entry's description of source headers concerns their state before LICENSE was added.

#### Implementation Impact

README.md; docs/ANNOTATION_STANDARDS.md; docs/PORTFOLIO_CONTENT_PLAN.md; vite.config.ts. Existing source headers and package metadata were reviewed. Dependency licenses were preserved.

#### Verification Required

T0 source/header and documentation audit, metadata consistency, unchanged dependency terms, journal preservation, build, script syntax, and whitespace checks.

#### Related Records

- DEVNOTES: DEV-2026-09-24-001; DEV-2026-10-15-002; DEV-2026-10-29-001
- Tests: TEST-2026-10-29-002; TEST-2026-10-29-003
- Source: LICENSE; README.md; docs/ANNOTATION_STANDARDS.md; docs/PORTFOLIO_CONTENT_PLAN.md; vite.config.ts

#### Next Steps

None.

#### Deferred Decisions

None for licensing.

---

---