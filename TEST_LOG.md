# Verification Log

### TEST-2026-10-15-001 — Existing starter production-build baseline

**Date:** 2026-10-15  
**Time:** 13:29 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** STATIC_ONLY

#### Scope

Existing TypeScript/Vite starter before the proposed static publishing migration.

#### Files Under Validation

- package.json
- tsconfig.json
- index.html
- src/main.ts
- src/specs.ts
- src/types.ts
- src/styles.css
- specs/main.yaml
- specs/homepage.yaml
- specs/robotics_projects.yaml
- specs/software_projects.yaml
- specs/design_projects.yaml
- specs/about.yaml
- specs/contact.yaml

#### Objective

Determine whether the current application type-checks and bundles successfully and identify its generated HTML structure.

#### Preconditions

Windows PowerShell in C:/Users/micha/Repos/MichaelGarciaRobotics with existing node_modules. Node v22.19.0; npm 11.10.0. No clean dependency installation was performed.

#### Procedure

1. Read the source, specs, package manifest, and TypeScript configuration.
2. Run node --version and npm --version.
3. Run npm run build (tsc && vite build). Repeated once to capture a compact build result after the combined inspection output was truncated.
4. Read dist/index.html and enumerate generated output file sizes.

#### Expected Result

TypeScript and Vite complete without build errors; the output structure can be inspected for alignment with static article publishing.

#### Actual Result

The captured build completed successfully using Vite 7.3.6 and transformed 13 modules. Output contains one HTML document with an empty div#app, one CSS bundle, and one JavaScript bundle. There are no generated project/blog detail HTML files. This is the current starter's architecture, not a failed claim of implemented blog support.

#### Evidence

- Command: npm run build
- Output: tsc && vite build; Vite 7.3.6; 13 modules transformed; built in 232ms on the captured run.
- dist/index.html: 497 bytes; body contains `<div id="app"></div>`.
- dist/assets/index-D71At7_7.css: 2,830 bytes.
- dist/assets/index-D6jr-G7F.js: 56,921 bytes.

#### Failures / Observations

No compiler/bundler error was reported. No browser runtime, Markdown/media implementation, clean-install reproducibility, CI execution, GitHub remote, DNS, or hosting deployment was verified. YAML files are bundled as raw text; this build does not establish schema validation of their contents. Separately, Git status/remote inspection reported that the local folder is not a Git repository. An inspection search using a Windows wildcard path failed and was corrected using rg's glob option; it did not affect the build.

#### Related DEVNOTES

DEV-2026-10-15-001.

#### Related Tests

None.

#### Disposition

Static baseline supports continuing architecture planning. Runtime correctness is not established. Implemented migration work must receive its own T0–T3 checks; hosted-domain and video-playback verification remain pending for the relevant milestones.

### TEST-2026-10-15-002 — Navigation implementation static validation

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** PASS

#### Scope

Compile and bundle changed implementation; validate YAML navigation and retained font size.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Compile and bundle changed implementation; validate YAML navigation and retained font size.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Run npm run build and a Node/js-yaml assertion for 40px, ordered Home/About/Contact, 150px hero, and removed standalone YAML actions.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

TypeScript and Vite succeeded, 14 modules transformed; YAML assertions passed.

#### Evidence

Build: 250ms; CSS index-BWLO4fl4.css and JS index-B-gBLrL2.js. Console: YAML contracts verified; hero remains 150px.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

Static checks only; browser verification follows.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

None

#### Disposition

Proceed to browser smoke tests.

### TEST-2026-10-15-003 — Initial local browser launch attempts

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T1  
**Result:** BLOCKED

#### Scope

Reach local preview for navigation smoke testing.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Reach local preview for navigation smoke testing.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Attempt headless Edge in the sandbox; try Chrome against the sandbox Vite preview; retry Chrome outside the sandbox.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

Edge exited during launch; sandbox Chrome reported ERR_NETWORK_ACCESS_DENIED; external Chrome could not reach the sandbox preview and reported ERR_CONNECTION_TIMED_OUT.

#### Evidence

Tool execution browser logs; no application assertion ran during these attempts.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

Environment prevented reaching the app. No application failure established.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

TEST-2026-10-15-002

#### Disposition

Retry with a temporary server and isolated browser in the same permitted execution environment; do not infer runtime success.

### TEST-2026-10-15-004 — Navigation disclosure interaction

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T1  
**Result:** PASS

#### Scope

Click and keyboard operation of the shared dropdown.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Click and keyboard operation of the shared dropdown.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Run scripts/check-navigation.cjs with bundled Playwright and headless Chrome against its temporary production-file server. Check button geometry, hover, click, Enter, Space, Tab, ArrowDown, Escape, and outside click.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

Button measured 40x40; hover did not open it; all opening/closing checks passed; Escape restored focus; labels were Home, About, Contact.

#### Evidence

docs/verification/navigation-report.json; docs/verification/navigation-desktop.png; script console T1 results.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

Browser and server ran outside the restricted sandbox after the blocked attempts.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

TEST-2026-10-15-003

#### Disposition

Disclosure behavior verified; proceed to route integration.

### TEST-2026-10-15-005 — Shared navigation and YAML integration

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T2  
**Result:** PASS

#### Scope

Navigation across Home, three subject pages, About, and Contact.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Navigation across Home, three subject pages, About, and Contact.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Use the same browser script to follow each dropdown destination and load all six routes; assert exactly one trigger, matching labels, closed state after navigation, and no standalone legacy actions.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

All six pages exposed the same dropdown; links reached the correct pages; old standalone header/footer actions were absent.

#### Evidence

docs/verification/navigation-report.json; script console T2 results; src/navigation.ts hash-link integration.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

Existing hash routing retained.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

TEST-2026-10-15-004

#### Disposition

Integration verified; complete visual/regression review.

### TEST-2026-10-15-006 — Initial title and navigation visual regression

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T3  
**Result:** FAIL

#### Scope

Single-line title and consistent page rendering at narrow widths.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Single-line title and consistent page rendering at narrow widths.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Run the browser regression at 1440, 1024, and 390px; visually inspect desktop and narrow full-page screenshots.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

Automated title, history, route, and engagement assertions passed, but narrow-screen visual inspection showed a background seam at the viewport edge behind the overflowing title.

#### Evidence

docs/verification/navigation-narrow-initial.png preserves the failed visual result.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

The fixed-size title extended beyond the homepage background onto the differently colored root background.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

TEST-2026-10-15-005

#### Disposition

Block completion until the background spans the title and the regression is rerun. Corrective decision: DEV-2026-10-15-002.

### TEST-2026-10-15-007 — Narrow-screen correction static validation

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** PASS

#### Scope

Homepage intrinsic width and regression assertion.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Homepage intrinsic width and regression assertion.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Set homepage min-width to max-content; add a browser assertion that its background width covers document scroll width; run npm run build and node --check scripts/check-navigation.cjs.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

Compilation, bundling, and test-script syntax validation succeeded; Vite transformed 14 modules.

#### Evidence

Build completed in 243ms; CSS index-BryM8Sp8.css; JS index-G6otd5Po.js.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

No static failures; runtime retest required.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

TEST-2026-10-15-006

#### Disposition

Proceed to targeted regression retest.

### TEST-2026-10-15-008 — Final navigation and title regression

**Date:** 2026-10-15  
**Time:** 14:57 America/New_York  
**Tester:** Codex /root  
**Level:** T3  
**Result:** PASS

#### Scope

Requested cleanup across viewport widths and existing critical navigation.

#### Files Under Validation

src/navigation.ts; src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs (where applicable).

#### Objective

Requested cleanup across viewport widths and existing critical navigation.

#### Preconditions

Existing dependencies; Windows; Node 22.19.0; Vite 7.3.6. Browser checks use installed Google Chrome and Playwright from the bundled runtime. Timestamp is the record-entry time following the checks.

#### Procedure

Rerun scripts/check-navigation.cjs with bundled Playwright. Review final desktop/narrow screenshots against Figma 1:2. Exercise all earlier disclosure/route checks, title at 1440/1024/390px, page background width, discipline buttons, Back/Forward/refresh, six-second engagement, and no repeat after session choice.

#### Expected Result

The scoped behavior completes without errors and satisfies the requested navigation, geometry, and preserved behavior.

#### Actual Result

All assertions passed with no page errors. Title remained 150px, one line, width 992.734375px, with reachable left edge at every width. Narrow-page background now covers the full title. Icon is 40x40 with the three proportionally scaled gray bars on white.

#### Evidence

docs/verification/navigation-report.json; navigation-desktop.png and navigation-narrow.png in the same directory; retained scripts/check-navigation.cjs.

Reproduction for browser checks: node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright (after npm run build; requires local browser/server access).

#### Failures / Observations

Horizontal scrolling at narrow widths is intentional to retain 150px and one line. No Figma image assets were used; its returned rectangles are CSS geometry.

#### Related DEVNOTES

DEV-2026-10-15-002.

#### Related Tests

TEST-2026-10-15-004; TEST-2026-10-15-005; TEST-2026-10-15-006; TEST-2026-10-15-007

#### Disposition

Requested cleanup verified; prior visual failure corrected. No deployment performed.

### TEST-2026-10-15-009 — Icon appearance configuration static checks

**Date:** 2026-10-15  
**Time:** 15:47 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** PASS

#### Scope

Typed navigation appearance contract and production bundle.

#### Files Under Validation

specs/main.yaml; src/types.ts; src/main.ts; src/navigation.ts; src/styles.css; scripts/check-navigation.cjs.

#### Objective

Verify compilation, bundling, and regression-script syntax after wiring the new YAML fields.

#### Preconditions

Existing installed dependencies; Windows; Node 22.19.0; Vite 7.3.6.

#### Procedure

Run npm run build and node --check scripts/check-navigation.cjs.

#### Expected Result

Both commands complete without errors.

#### Actual Result

TypeScript and Vite succeeded; 14 modules transformed, build completed in 246ms. Test-script syntax check succeeded.

#### Evidence

dist/assets/index-CQBdQMT7.css; dist/assets/index-DVL-IDpe.js; command output.

#### Failures / Observations

None. Static build success does not establish runtime behavior.

#### Related DEVNOTES

DEV-2026-10-15-003.

#### Related Tests

TEST-2026-10-15-008.

#### Disposition

Proceed to browser verification.

### TEST-2026-10-15-010 — YAML icon appearance and navigation regression

**Date:** 2026-10-15  
**Time:** 15:47 America/New_York  
**Tester:** Codex /root  
**Level:** T3  
**Result:** PASS

#### Scope

T1 icon appearance, T2 YAML-to-renderer integration, and T3 existing navigation regression.

#### Files Under Validation

specs/main.yaml; src/types.ts; src/main.ts; src/navigation.ts; src/styles.css; scripts/check-navigation.cjs.

#### Objective

Verify the requested colors/shadow reach the browser while preserving menu and title behavior.

#### Preconditions

Successful production build; installed Chrome; bundled Playwright; browser and temporary local server permitted in the same execution environment.

#### Procedure

Run node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright. Inspect the generated desktop screenshot.

#### Expected Result

40x40 icon has burnt_auburn bars, plum background, and visible burgundy shadow. Existing click/keyboard/route/history/title/engagement checks continue to succeed.

#### Actual Result

Computed bar color rgb(232, 168, 11), background rgb(18, 10, 7), shadow rgb(86, 22, 29) 0px 2px 6px 0px. All prior behavioral assertions passed with no page errors. Visual inspection confirmed the updated icon. The title remains one line at 150px at 1440, 1024, and 390px viewport widths.

#### Evidence

docs/verification/navigation-report.json; docs/verification/navigation-desktop.png; docs/verification/navigation-narrow.png; script console output.

#### Failures / Observations

None. This browser run verifies the requested visible:true configuration; the visible:false branch was inspected but not separately exercised.

#### Related DEVNOTES

DEV-2026-10-15-003.

#### Related Tests

TEST-2026-10-15-009; TEST-2026-10-15-008.

#### Disposition

Requested appearance configuration implemented and verified.
