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

### TEST-2026-10-15-011 — Shared header/footer static validation

**Date:** 2026-10-15  
**Time:** 21:54 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** PASS

#### Scope

Shared page header/footer implementation and global specification contract.

#### Files Under Validation

src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs.

#### Objective

Compile and bundle the changes; validate regression-script syntax.

#### Preconditions

Existing installed dependencies; Windows; Vite 7.3.6.

#### Procedure

Run npm run build and node --check scripts/check-navigation.cjs; wait for command completion.

#### Expected Result

Both commands succeed without errors.

#### Actual Result

TypeScript and Vite succeeded; 14 modules transformed; script syntax check succeeded.

#### Evidence

Build completed in 359ms; dist/assets/index-S7VFUM3L.css and index-Dw6r8Y-Y.js.

#### Failures / Observations

None. Static result only.

#### Related DEVNOTES

DEV-2026-10-15-004.

#### Related Tests

TEST-2026-10-15-009.

#### Disposition

Static validation complete; verify browser behavior.

### TEST-2026-10-15-012 — All-page header/footer geometry and navigation regression

**Date:** 2026-10-15  
**Time:** 21:54 America/New_York  
**Tester:** Codex /root  
**Level:** T3  
**Result:** PASS

#### Scope

T1 shared header/footer rendering, T2 global YAML integration, and T3 existing site behavior.

#### Files Under Validation

src/main.ts; src/types.ts; src/styles.css; specs/main.yaml; specs/homepage.yaml; scripts/check-navigation.cjs.

#### Objective

Verify every page matches homepage menu geometry and displays the requested name/copyright without navigation regressions.

#### Preconditions

Production build; installed Chrome and bundled Playwright; temporary local test server.

#### Procedure

Run node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright. Check all six routes at 1440px and 390px widths. Inspect docs/verification/shared-header-about.png. Existing script also checks menu interactions, routes, history/refresh, title at three widths, and session-only engagement.

#### Expected Result

Menu coordinates match Home; name is adjacent and vertically centered; 10px copyright sits bottom left; existing interactions succeed.

#### Actual Result

All six pages at both widths have a 40x40 menu at (14,20), Michael Garcia centered beside it with a 12px gap, and © Michael Garcia at 10px with 10px left/bottom inset. All navigation, icon appearance, title, and engagement assertions passed with no page errors. Visual review confirmed the About layout.

#### Evidence

docs/verification/navigation-report.json; docs/verification/shared-header-about.png; navigation-desktop.png; navigation-narrow.png; script console output.

#### Failures / Observations

None. Narrow-screen horizontal scrolling for the unchanged 150px homepage title remains intentional.

#### Related DEVNOTES

DEV-2026-10-15-004.

#### Related Tests

TEST-2026-10-15-011; TEST-2026-10-15-010.

#### Disposition

Requested changes verified and ready for review.

### TEST-2026-10-16-001 — Refactored navigation script static validation

**Date:** 2026-10-16  
**Time:** 13:37 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** PASS

#### Scope

Navigation test-script syntax and application build prerequisite.

#### Files Under Validation

scripts/check-navigation.cjs; existing application build inputs.

#### Objective

Confirm valid JavaScript and a successful production build for the browser checks.

#### Preconditions

Installed dependencies; Windows; Vite 7.3.6.

#### Procedure

Run node --check scripts/check-navigation.cjs, then npm run build.

#### Expected Result

Syntax check and production build succeed.

#### Actual Result

Both commands succeeded. Vite transformed 14 modules and built in 429ms.

#### Evidence

Build output retained index-S7VFUM3L.css and index-Dw6r8Y-Y.js. Application implementation was not modified by this refactor.

#### Failures / Observations

None. Static checks alone do not establish runtime behavior.

#### Related DEVNOTES

DEV-2026-10-16-001.

#### Related Tests

TEST-2026-10-15-011.

#### Disposition

Proceed to browser and cleanup validation.

### TEST-2026-10-16-002 — Refactored suite regression and cleanup paths

**Date:** 2026-10-16  
**Time:** 13:37 America/New_York  
**Tester:** Codex /root  
**Level:** T3  
**Result:** PASS

#### Scope

All seven named verifications, retained T1/T2 integration coverage, and exceptional resource cleanup.

#### Files Under Validation

scripts/check-navigation.cjs.

#### Objective

Confirm the refactor preserves checks and releases resources after success or failure.

#### Preconditions

Production build; installed Chrome and bundled Playwright; permitted temporary localhost server/browser.

#### Procedure

1. Run node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright.
2. Evaluate the script in node:vm with its CLI invocation removed, stub setup resources, and replace the first verification with an intentional rejection. Assert main rejects and cleanup calls occur in order.
3. Repeat the injected case with setup throwing after server acquisition; expect server close only.
4. Repeat with browser.close throwing; expect browser close attempt followed by server close despite the rejection.

#### Expected Result

All existing browser assertions pass; every injected failure rejects while still releasing acquired resources.

#### Actual Result

All seven browser verifications passed with no page errors. Colors, geometry, six-page routes, keyboard/pointer controls, title widths, history/refresh, and engagement behavior were preserved. Cleanup injection passed for partial setup, verification failure, and browser teardown failure. The server was closed in all three cases.

#### Evidence

docs/verification/navigation-report.json and existing screenshots. Console reported PASS cleanup: partial setup; PASS cleanup: verification failure; PASS cleanup: browser teardown failure. Real browser run also exited successfully through finally teardown.

#### Failures / Observations

None. Injected failures were expected test inputs; exceptional cleanup was checked using controlled resource doubles rather than inducing a real browser crash.

#### Related DEVNOTES

DEV-2026-10-16-001.

#### Related Tests

TEST-2026-10-16-001; TEST-2026-10-15-012.

#### Disposition

Refactor verified; existing browser coverage retained and cleanup paths exercised.

### TEST-2026-10-23-001 — Expanded utility navigation static validation

**Date:** 2026-10-23  
**Time:** 09:41 America/New_York  
**Tester:** Codex /root  
**Level:** T0  
**Result:** PASS

#### Scope

Blog registration and expanded menu regression.

#### Files Under Validation

specs/main.yaml; specs/blog.yaml; src/specs.ts; scripts/check-navigation.cjs.

#### Objective

Verify compilation, bundling, and script syntax.

#### Preconditions

Existing dependencies; Windows; Vite 7.3.6.

#### Procedure

Run npm run build and node --check scripts/check-navigation.cjs; await completion.

#### Expected Result

Both commands succeed.

#### Actual Result

TypeScript, Vite, and syntax validation succeeded. Vite transformed 15 modules in 827ms.

#### Evidence

Build generated dist/assets/index-BkR0x38h.js with the blog specification.

#### Failures / Observations

None. Runtime validation follows.

#### Related DEVNOTES

DEV-2026-10-23-001.

#### Related Tests

TEST-2026-10-16-001.

#### Disposition

Proceed to browser verification.

### TEST-2026-10-23-002 — Seven-destination navigation regression

**Date:** 2026-10-23  
**Time:** 09:41 America/New_York  
**Tester:** Codex /root  
**Level:** T3  
**Result:** PASS

#### Scope

T1 expanded dropdown, T2 destination integration, and T3 existing navigation/layout behavior.

#### Files Under Validation

specs/main.yaml; specs/blog.yaml; src/specs.ts; scripts/check-navigation.cjs.

#### Objective

Confirm every utility link reaches its intended page with the shared layout intact.

#### Preconditions

Successful build; installed Chrome and bundled Playwright; permitted local browser/server execution.

#### Procedure

Run node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright. Follow all seven menu links and assert headings, then exercise existing keyboard, layout, title, history, and engagement checks.

#### Expected Result

Home, Robotics, Software, Design, BLOG, About, and Contact navigate correctly; expanded menu remains keyboard-operable; existing behavior passes.

#### Actual Result

All seven destinations and headings passed. Seven pages retained menu position and copyright at both 1440px and 390px widths. Keyboard interactions, title layout, history/refresh, and session-only engagement passed with no page errors.

#### Evidence

docs/verification/navigation-report.json and updated screenshots; browser regression console output.

#### Failures / Observations

None. BLOG is a placeholder page; article publishing was not introduced.

#### Related DEVNOTES

DEV-2026-10-23-001.

#### Related Tests

TEST-2026-10-23-001; TEST-2026-10-16-002.

#### Disposition

Requested menu links verified.

### TEST-2026-10-23-003 � Responsive source validation

**Date:** 2026-10-23
**Time:** 13:05 America/New_York
**Tester:** Codex /root
**Level:** T0
**Result:** PASS

#### Scope

Responsive presentation and typography integration.

#### Files Under Validation

src/styles.css; src/main.ts; index.html; scripts/check-navigation.cjs.

#### Objective

Verify the requested mobile reflow while preserving desktop appearance and navigation behavior.

#### Preconditions

Installed project dependencies, Chrome, and bundled Playwright. Browser suite uses a production build and isolated temporary localhost server.

#### Procedure

Run npm run build and node --check scripts/check-navigation.cjs; inspect source diff and git diff --check.

#### Expected Result

Validation completes successfully; responsive layout fits tested viewports and existing navigation remains operational.

#### Actual Result

TypeScript compilation, Vite production build, and script syntax passed. Diff check identified only intentional Markdown hard-break spaces in the appended DEV entry.

#### Evidence

Production build output: 15 modules transformed; CSS 8.09 kB, JavaScript 59.74 kB.

#### Failures / Observations

Python timestamp helper initially lacked tzdata; no file was written. Used Windows time-zone conversion instead. Git also reported normal LF/CRLF conversion notices.

#### Related DEVNOTES

DEV-2026-10-23-002.

#### Related Tests

TEST-2026-10-23-002.

#### Disposition

Proceed to runtime verification.

### TEST-2026-10-23-004 � Portrait and desktop browser regression

**Date:** 2026-10-23
**Time:** 13:05 America/New_York
**Tester:** Codex /root
**Level:** T3
**Result:** PASS

#### Scope

T1 controls, T2 route/layout integration, T3 navigation and session regression.

#### Files Under Validation

src/styles.css; src/main.ts; index.html; scripts/check-navigation.cjs.

#### Objective

Verify the requested mobile reflow while preserving desktop appearance and navigation behavior.

#### Preconditions

Installed project dependencies, Chrome, and bundled Playwright. Browser suite uses a production build and isolated temporary localhost server.

#### Procedure

Run node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright after the final build. Inspect generated screenshots.

#### Expected Result

Validation completes successfully; responsive layout fits tested viewports and existing navigation remains operational.

#### Actual Result

Passed all seven routes at 320x568, 375x667, 390x844, 430x932, 667x375, 768x1024, 1024x768, and 1440x900. No horizontal overflow. Phone titles align with shared gutters; cards stack; discipline rules are 1px. Menu targets are 44px on mobile, 40px desktop; link targets are at least 44px. Desktop title remains 150px. Keyboard, routes, history, refresh, and session suppression passed with no page errors. Touch-emulated welcome prompt dismissed in landscape. Reviewed mobile home, project, menu, welcome prompt, and desktop screenshots.

#### Evidence

docs/verification/navigation-report.json; responsive-home-320.png; responsive-home-390.png; responsive-home-1440.png; responsive-project-390.png; responsive-engagement-320.png; navigation-narrow.png.

#### Failures / Observations

Chrome viewport/touch emulation, not physical iOS/Android verification. No project media exists to exercise real image/video assets; proportional sizing rules were inspected.

#### Related DEVNOTES

DEV-2026-10-23-002.

#### Related Tests

TEST-2026-10-23-002; TEST-2026-10-23-003.

#### Disposition

Implementation verified; physical-device safe-area review remains an optional follow-up.

### TEST-2026-10-23-005 — Home-only header name removal

**Date:** 2026-10-23
**Time:** 13:13 America/New_York
**Tester:** Codex /root
**Level:** T3
**Result:** PASS

#### Scope

Home-only header branding adjustment, including T0 compilation and existing responsive/navigation regression.

#### Files Under Validation

src/main.ts; scripts/check-navigation.cjs.

#### Objective

Omit the header name on Home while preserving it on all six interior pages, as clarified by the user.

#### Preconditions

Installed dependencies, Chrome, and bundled Playwright; final production build available.

#### Procedure

Run node --check scripts/check-navigation.cjs, npm run build, and node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright.

#### Expected Result

Home header contains only the menu; all other pages retain their adjacent name. Hero name, copyright, responsive layouts, and navigation remain functional.

#### Actual Result

Build and syntax passed. All seven routes passed at all eight existing viewports. Home has no header branding element; interior branding text and position passed. Menu, hero, copyright, keyboard/history, and session checks passed with no page errors.

#### Evidence

docs/verification/navigation-report.json and refreshed navigation/responsive screenshots; successful build and browser command output.

#### Failures / Observations

None. Initial all-page removal was narrowed to Home following user clarification before final verification.

#### Related DEVNOTES

DEV-2026-10-23-002.

#### Related Tests

TEST-2026-10-23-004.

#### Disposition

Home-only change verified.

### TEST-2026-10-23-006 � Header navigation initial regression

**Date:** 2026-10-23
**Time:** 13:50 America/New_York
**Tester:** Codex /root
**Level:** T3
**Result:** FAIL

#### Scope

Header Home actions and engagement routes.

#### Files Under Validation

src/main.ts; src/styles.css; specs/homepage.yaml; scripts/check-navigation.cjs.

#### Objective

Verify confirmed header and engagement navigation changes.

#### Preconditions

Successful production build and script syntax check; Chrome/Playwright installed.

#### Procedure

Run npm run build, node --check scripts/check-navigation.cjs, then the browser regression with bundled Playwright.

#### Expected Result

Header name returns Home on every interior page; engagement choices reach configured pages.

#### Actual Result

Build and syntax passed. Layout/menu checks passed. Immediate URL assertion after Space activation on About observed the old route. Engagement verification was not reached.

#### Evidence

Browser assertion at verifyNavigationHistory: expected /#/, actual /#/about.

#### Failures / Observations

The new keyboard test read the URL immediately after key release. Add the same explicit navigation wait used by existing link tests, then rerun to determine whether activation completes.

#### Related DEVNOTES

DEV-2026-10-23-003.

#### Related Tests

TEST-2026-10-23-005.

#### Disposition

Block progression pending corrected test and successful rerun.

### TEST-2026-10-23-007 — Header and engagement destination regression

**Date:** 2026-10-23
**Time:** 13:53 America/New_York
**Tester:** Codex /root
**Level:** T3
**Result:** PASS

#### Scope

T1 header/button controls, T2 YAML engagement routing and focus, T3 responsive navigation and session behavior.

#### Files Under Validation

src/main.ts; src/styles.css; specs/homepage.yaml; scripts/check-navigation.cjs; README.md.

#### Objective

Verify interior header Home buttons and direct engagement page navigation without repeat prompts in the same session.

#### Preconditions

Production build from TEST-2026-10-23-006; Chrome and bundled Playwright installed. Keyboard assertion now waits for navigation.

#### Procedure

Run node --check scripts/check-navigation.cjs and node scripts/check-navigation.cjs C:/Users/micha/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright. Inspect header screenshot and source diff for stale emphasis references.

#### Expected Result

Every interior header button opens Home; three engagement subjects open their pages; Just looking stays Home; returning/reloading does not reopen the prompt.

#### Actual Result

All six interior header buttons passed keyboard activation, including Space on About. Touch-emulated choices reached Robotics, Software, and Design with heading focus and correct session values. Just looking stayed Home. All four choices suppressed the prompt after return/reload. Existing responsive checks across eight viewports, menu keyboard controls, routes/history, and copyright passed without page errors. Header screenshot retains established appearance.

#### Evidence

docs/verification/navigation-report.json; docs/verification/shared-header-about.png; docs/verification/responsive-engagement-320.png. Syntax and source whitespace checks passed.

#### Failures / Observations

Explicitly waiting for the route resolved the initial keyboard-test timing failure. Physical-device testing was not performed.

#### Related DEVNOTES

DEV-2026-10-23-003.

#### Related Tests

TEST-2026-10-23-006; TEST-2026-10-23-005.

#### Disposition

Confirmed changes verified; no remaining implementation work.

### TEST-2026-10-23-008 — Architecture documentation validation

**Date:** 2026-10-23
**Time:** 13:59 America/New_York
**Tester:** Codex /root
**Level:** T0
**Result:** FAIL

#### Scope

Documentation consistency and local references only.

#### Files Under Validation

README.md; docs/ARCHITECTURE.md; docs/ARCHITECTURE_ALIGNMENT_REVIEW.md; docs/PORTFOLIO_CONTENT_PLAN.md.

#### Objective

Describe the implemented architecture accurately and distinguish it from migration proposals.

#### Preconditions

Local source, specifications, package manifest, and repository inventory available.

#### Procedure

Compare documentation against src/, specs/, package.json, tsconfig.json, and scripts/check-navigation.cjs. Run an ad hoc Python UTF-8/local-link scan and repository existence assertions. Run git diff --check on documentation changes.

#### Expected Result

Current documentation matches local implementation, resolves local references, and marks proposals and unverified external setup explicitly.

#### Actual Result

The initial local-link scan flagged relative-path in the migration review, an illustrative inline Markdown image example rather than a document link.

#### Evidence

Local inspection and Python scan output; git diff --check output. Successful scan reports four documents and 44 resolved local prose links/anchors.

#### Failures / Observations

The ad hoc scanner excluded fenced code but not inline code. Documentation writing also initially encountered Windows default text encoding; all four final documents were normalized/read explicitly as UTF-8.

#### Related DEVNOTES

DEV-2026-10-23-001; DEV-2026-10-23-002; DEV-2026-10-23-003.

#### Related Tests

TEST-2026-10-23-007.

#### Disposition

Correct the scanner to exclude inline code and repeat static validation.

### TEST-2026-10-23-009 — Architecture documentation validation

**Date:** 2026-10-23
**Time:** 13:59 America/New_York
**Tester:** Codex /root
**Level:** T0
**Result:** PASS

#### Scope

Documentation consistency and local references only.

#### Files Under Validation

README.md; docs/ARCHITECTURE.md; docs/ARCHITECTURE_ALIGNMENT_REVIEW.md; docs/PORTFOLIO_CONTENT_PLAN.md.

#### Objective

Describe the implemented architecture accurately and distinguish it from migration proposals.

#### Preconditions

Local source, specifications, package manifest, and repository inventory available.

#### Procedure

Compare documentation against src/, specs/, package.json, tsconfig.json, and scripts/check-navigation.cjs. Run an ad hoc Python UTF-8/local-link scan and repository existence assertions. Run git diff --check on documentation changes.

#### Expected Result

Current documentation matches local implementation, resolves local references, and marks proposals and unverified external setup explicitly.

#### Actual Result

All four documents decode as UTF-8; 44 local prose links and applicable anchors resolve. Repository inventory matches documented absence of content/ and CI workflows and presence of Git metadata. Documentation whitespace checks passed.

#### Evidence

Local inspection and Python scan output; git diff --check output. Successful scan reports four documents and 44 resolved local prose links/anchors.

#### Failures / Observations

Reviewed routes, raw YAML imports, menu/header behavior, engagement target/session/focus handling, CSS breakpoints, package scripts, and browser-test prerequisites against source. No runtime changes; no build/browser rerun needed. External service status and historical platform guidance were not revalidated.

#### Related DEVNOTES

DEV-2026-10-23-001; DEV-2026-10-23-002; DEV-2026-10-23-003.

#### Related Tests

TEST-2026-10-23-008; TEST-2026-10-23-007.

#### Disposition

Current documentation aligned with inspected implementation; historical plans and append-only engineering records retained.

### TEST-2026-10-29-001 — Proprietary license consistency and static verification

**Date:** 2026-10-29
**Time:** 10:42 America/New_York
**Tester:** Codex /root
**Level:** T0
**Result:** PASS

#### Scope

License documentation, package metadata, and source-header consistency.

#### Files Under Validation

LICENSE; README.md; package.json; package-lock.json; index.html; src/main.ts; src/navigation.ts; src/specs.ts; src/styles.css; src/types.ts; scripts/check-navigation.cjs; DEVNOTES.md.

#### Objective

Provide explicit proprietary terms, preserve third-party terms and lawful uses, and resolve pending source-license annotations without changing runtime behavior.

#### Preconditions

Existing dependencies installed; clean working tree before this task.

#### Procedure

Inspect license scope and exceptions. Parse both package JSON files with Node and assert matching UNLICENSED values and root LICENSE existence. Inspect git diff and scan active headers for pending license text. Run npm.cmd run build, node --check scripts/check-navigation.cjs, and git diff --check.

#### Expected Result

License and package metadata agree; active headers reference the root license; static checks pass.

#### Actual Result

Root license and package metadata assertions passed. Build compiled TypeScript and bundled 15 modules successfully. Navigation script syntax and whitespace checks passed. Active source headers no longer contain pending license metadata.

#### Evidence

Terminal output: License file and package metadata checks passed; Vite build completed successfully. Syntax and whitespace checks exit successfully.

#### Failures / Observations

Comment and metadata changes only; browser regression was not required. Validation establishes repository consistency and buildability, not legal enforceability.

#### Related DEVNOTES

DEV-2026-10-29-001.

#### Related Tests

None.

#### Disposition

Complete.
### TEST-2026-10-29-002 — Initial license audit assertions

**Date:** 2026-10-29
**Time:** 10:48 America/New_York
**Tester:** Codex /root
**Level:** T0
**Result:** FAIL

#### Scope

Static licensing audit and journal preservation assertion.

#### Files Under Validation

Eight authored source files; license guidance; package metadata; DEVNOTES.md; TEST_LOG.md.

#### Objective

Verify consistent license references and preserved historical records.

#### Preconditions

Git HEAD and working tree available.

#### Procedure

Use Node assertions for source headers, documentation links, package metadata, unchanged third-party lock entries, and a raw string prefix comparison of journals against git show HEAD.

#### Expected Result

All assertions pass.

#### Actual Result

Header, documentation, package, and dependency checks passed. DEVNOTES.md prefix comparison failed because Git stores LF while the Windows checkout includes CRLF.

#### Evidence

Node exit 1: AssertionError [ERR_ASSERTION]: DEVNOTES.md.

#### Failures / Observations

The comparison failed to account for checkout line endings; the journal content was not rewritten. This is a validation-script issue.

#### Related DEVNOTES

DEV-2026-10-29-002.

#### Related Tests

TEST-2026-10-29-001.

#### Disposition

Normalize line endings for textual history comparison and repeat validation.

### TEST-2026-10-29-003 — License audit and corrected history validation

**Date:** 2026-10-29
**Time:** 10:49 America/New_York
**Tester:** Codex /root
**Level:** T0
**Result:** PASS

#### Scope

Repository licensing consistency and static build validation.

#### Files Under Validation

LICENSE; README.md; docs/ANNOTATION_STANDARDS.md; docs/PORTFOLIO_CONTENT_PLAN.md; index.html; vite.config.ts; src/; scripts/check-navigation.cjs; package.json; package-lock.json; engineering journals.

#### Objective

Confirm current references consistently identify the proprietary root license while preserving dependency terms and historical evidence.

#### Preconditions

Dependencies installed; previous failed comparison identified as a line-ending mismatch.

#### Procedure

Search all authored repository text, including hidden configuration, excluding .git, node_modules, and generated dist. Inspect every licensing result. Repeat Node assertions from TEST-2026-10-29-002 with CRLF normalized to LF for journal comparison. Run npm.cmd run build, node --check scripts/check-navigation.cjs, and git diff --check.

#### Expected Result

Every authored source header references LICENSE; current guidance has no conflicting license example or license deferral; metadata agrees; third-party terms and historical records remain intact; static checks pass.

#### Actual Result

All eight source headers, both updated guidance documents, matching UNLICENSED package metadata, unchanged third-party lock entries, and normalized historical-prefix checks passed. Build transformed 15 modules successfully. Script syntax and whitespace checks passed. Historical licensing deferrals are explicitly closed by DEV-2026-10-29-002.

#### Evidence

Node output: PASS: 8 source headers, current license guidance, package metadata, unchanged third-party lock entries, and preserved journal history (normalized line endings). Vite build succeeded.

#### Failures / Observations

No runtime behavior changed; browser regression is unnecessary. Historical statements remain in append-only records with an explicit current disposition. The generic Pending confirmation placeholder remains only for unknown ownership/contact details.

#### Related DEVNOTES

DEV-2026-10-29-001; DEV-2026-10-29-002.

#### Related Tests

TEST-2026-10-29-002.

#### Disposition

Complete; no current licensing deferral remains.