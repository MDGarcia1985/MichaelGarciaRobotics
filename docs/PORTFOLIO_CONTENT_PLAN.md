# Portfolio content and About-page plan

Status: proposed; prepared September 24, 2026. This document plans content and implementation; it does not change the live site or establish that any project has passed testing.

October 15 architecture follow-up: [Architecture alignment review](ARCHITECTURE_ALIGNMENT_REVIEW.md) proposes static HTML routes and project Markdown with YAML frontmatter for the requested GitHub/Cloudflare/blog direction. Its routing and content-storage recommendations replace the hash-route and hand-maintained project-catalog proposals below. The editorial selection, evidence criteria, and About layout remain applicable.

## 1. Direction and source of truth

Build toward **3 Robotics, 3 Software, and 2 Design case studies**, with the tracked utility vehicle presented separately as an **in-development preview**. This is eight substantive case studies plus one preview, conditional on collecting adequate evidence. Do not add a third Design project simply to make the grids symmetrical.

The About page should explain the connection among these disciplines: Michael develops physical products, the software that operates or supports them, and the engineering processes that make them buildable and maintainable. Project pages supply the detailed evidence for that story.

Reviewed sources:

- [README](../README.md), followed by all seven files in `specs/` and the loader, renderer, types, and stylesheet in `src/`.
- [Resume](<MICHAEL GARCIA - Resume Fall 2026 v2.txt>) for career, education, leadership, certifications, and engineering workflow experience.
- [Selected engineering projects](<SELECTED ENGINEERING PROJECTS.txt>) for project descriptions and stated technical details.
- [Decision journal standards](DEVNOTES_STANDARDS.md), [test standards](TEST_LOG_STANDARDS.md), and [annotation standards](ANNOTATION_STANDARDS.md).

The YAML specs contain composition, navigation, and intentional content placeholders. They do **not** contain a separate academic rubric or a required project count. The criteria below are proposed completion criteria derived from those gaps. `docs/ARCHITECTURE.md`, referenced by the README, is missing.

## 2. Missing criteria and how to fill them

| Area | Current evidence or gap | Proposed completion criterion |
|---|---|---|
| About | Two placeholder paragraphs; renderer supports plain paragraphs only | A concise professional introduction, three linked capability summaries, a compact career/credentials section, and resume/contact actions |
| Subject pages | Two placeholder cards per subject | Named, source-supported projects with individual role, actual status, a clear problem, thumbnail or useful diagram, and a working case-study link |
| Case studies | No detail pages or detail routing; cards are non-interactive articles | One canonical URL per project, a repeatable case-study structure, and direct-load/back-navigation support |
| Evidence | Resume/project bullets without supporting assets in the supplied documents | Collect an artifact, a meaningful decision, and an honest result or limitation for every published case study |
| Project identity | Soft Robotics, Captain's Log, and YSL appear only in placeholder specs | Keep these as unpublished candidates until source material supports them; do not equate YSL with the enterprise platform |
| Contact and resume | Contact is a placeholder; resume exists as TXT | A working email action and a reviewed public resume asset; recommend email rather than introducing a form backend |
| Architecture | README links to a missing document; global page registry and loader are maintained separately | Document the actual YAML → TypeScript → CSS flow, route resolution, project schema, and how new pages are registered |
| Engineering record | Standards exist; no project DEVNOTES or TEST_LOG was present at review | Record material decisions and executed checks using the supplied formats; retain failures and later corrections |
| Source annotations | Source files lack the required opening headers; substantial renderer functions lack contract documentation | Add compliant headers and purpose/design/workflow/data-handoff documentation as implementation files are changed; audit remaining authored source before release |
| Usability | New content, real links, and longer layouts are not implemented | Verify mobile reading, keyboard navigation, visible focus, meaningful link names, image alternatives, and route behavior in the browser |

## 3. Project selection and recommended counts

Counts refer to primary case studies, not tags or repeated appearances of the same project.

| Subject | Recommended target | Proposed projects and order | Why this selection works |
|---|---:|---|---|
| Robotics | 3 + 1 separate preview | Wildlife Deterrence Sentry; Smart Locket; Medication Delivery Training Device. Below the main set: Autonomous Tracked Utility Vehicle, in development | Demonstrates autonomy, connected embedded products, and sensing/feedback. The medication trainer belongs here under the existing embedded-systems scope, with its actual product type made clear |
| Software | 3, or 2 if the Viking work is one inseparable case | Yggdrasil Systems enterprise platform; Engineering Change & PDM Workflow Automation; Approval-Agency Data & Reporting | Shows architecture, workflow/data governance, and reconciliation/reporting. The last two are proposed case-study titles derived from separate resume responsibilities, not supplied product names |
| Design | 2 | Spinal Curvature Correction Surgical Trainer; Cervical Spine Surgical Trainer | Two concrete examples of materials, anatomy, consumability, and fabrication; each must tell a distinct engineering story |

The Software count is conditional: separate the Viking work only if each case has its own problem, implementation contribution, artifact, and result. Otherwise publish one combined engineering workflow case and launch with two Software projects. A smaller credible portfolio is preferable to padding the count.

For the first implementation milestone, finish one case per subject: Sentry, the best-evidenced Viking software case, and the spinal curvature trainer. Substitute the medication trainer for Sentry if it has substantially better artifacts. Then expand to the target set. Project status and case-study readiness are separate: a well-documented prototype can be publishable without being a finished product.

Give each project one primary subject and optional secondary tags. For example, Smart Locket can have Software and Product Design tags while its full case lives under Robotics. Secondary subject pages may include a small “Related work” link to that same case, but should not count it as an additional unique project or duplicate its write-up.

### Evidence needed for each candidate

| Candidate | Supported by the supplied text | Gather or clarify before writing the full case |
|---|---|---|
| Wildlife Sentry | Autonomous patrolling, edge AI recognition, integrated deterrence mechanisms | Michael's role and project stage; system/block diagram; photos or demonstration; observed recognition/navigation results and limits. Keep the case centered on integration and evaluation |
| Smart Locket | ESP32-S3, 1.28-inch OLED, prototype, mobile connectivity and curated uploads | Prototype images, connectivity/data-flow diagram, individual app/firmware responsibility, and an observed upload-to-display walkthrough |
| Medication Trainer | Hall-effect sensing, magnets, visual feedback, simple 9V PCB | Sensor/PCB artifact, feedback state diagram, depth/proximity demonstration and limitations; do not infer clinical validation |
| Tracked Vehicle | Explicitly in development; propane-hybrid concept, modular drivetrain and attachments | Current dated CAD or architecture artifact, what has actually been built, next validation milestone; no operational or autonomy claims without evidence |
| Yggdrasil Systems | Architected enterprise suite spanning ERP/PDM/IDE/EDA; intended single-user-to-enterprise scaling | Architecture diagrams, implemented modules versus proposed modules, data/version-control model, runnable demonstration if available. Intended scale is not demonstrated scale |
| Engineering Change & PDM Automation | ECR/prototype/legacy migration workflows; approximately 60,000 parts/assemblies, six facilities, permissions across three continents | Before/after workflow, individual ownership, an example revision/approval transition, and evidence for scope. Do not invent a percentage reduction in errors or processing time |
| Approval-Agency Reporting | PDM, Power Automate, Power BI, Excel; reconciliation of certification and product revisions | Data lineage, representative report, discrepancy example, reconciliation rules and an observed outcome; establish whether this is distinct enough for a separate case |
| Spinal Curvature Trainer | Up to 30° curvature, foam formulation, consumables, reported several-dollars-to-pennies material cost change | Prototype images, material/iteration evidence, basis of cost comparison and scope of the 30° claim. Do not turn the qualitative cost statement into an invented percentage |
| Cervical Trainer | Layered anatomy, silicone/flexible polymers/variable density, consumable skin wrap | Layer section or exploded view, fabrication process, resistance/handling evaluation and replacement demonstration; differentiate this from the thoracic cost/consumability story |

For all cases, collect dates, team versus individual contribution, status, and the source of each outcome. Confirm employer/client associations for named projects; the selected-project file does not explicitly assign each project to an employer. Use shareable artifacts or clearly labeled recreated diagrams where originals cannot be published.

## 4. Keep each page's job distinct

| Page | Main question answered | Content budget and ownership |
|---|---|---|
| About | Who is Michael, how does he work, and where is the proof? | Approximately 450–650 words; professional through-line, selective career context, short linked examples |
| Subject index | Which example should I examine? | Roughly 35–60 words per card: problem, contribution, distinguishing result/status; filters are unnecessary for this initial count |
| Project detail | What did Michael do, why, and what demonstrates it? | Start around 600–1,000 words where evidence supports it; diagrams, decisions, trade-offs, evaluation, and limitations |
| Resume | What are the roles, dates, credentials, and qualifications? | Chronological professional record available through one resume action on About |

Do not paste resume bullets into About and then again into every case. Use the resume as factual source material and write each page for its own purpose. Keep the detailed 60,000-part scope, component lists, material recipes, and measured results on the appropriate project pages. About can refer to their significance without repeating the details.

## 5. About-page layout and exact link placement

Desktop: centered content, approximately 960px maximum width, with a readable text measure around 65–75 characters. Use the existing plum/auburn identity. On mobile, stack all content in its reading order and allow link labels to wrap. No repeated project-card grid on About.

```text
HEADER: Home                         Robotics | Software | Design | About

ABOUT MICHAEL GARCIA
Engineering across machines, software, and product development
60–90 word professional introduction
[View resume]     [Contact Michael]

HOW I WORK — THREE CONNECTED DISCIPLINES

Robotics & embedded systems     2–3 sentence capability statement
                               Wildlife Deterrence Sentry →  [primary]
                               Other examples: Smart Locket · Medication Trainer

Software & engineering systems  2–3 sentence capability statement
                               Yggdrasil Systems →          [primary]
                               Other examples: PDM Automation · Approval Reporting

Design & fabrication            2–3 sentence capability statement
                               Spinal Curvature Trainer →   [primary]
                               Other example: Cervical Spine Trainer

EXPERIENCE & WORKING PRACTICE
Brief dated role list + one short paragraph on requirements,
interfaces, prototyping, documentation, and validation

EDUCATION & RECOGNITION
Two programs; confirmed degree status; PDM credentials; leadership award

FOOTER: Contact
```

The three capability rows become single-column sections on mobile. Each has one prominent text link and one small related-examples line. This gives eight direct project links without turning About into another project index. Use project names as anchor text, not repeated “Learn more” labels. Each project appears only once in the About body; shared header/footer navigation is allowed to repeat.

### Link map

The routes below are **proposed**, not currently implemented. Use actual HTML anchors so links support copying, opening in another tab, and normal browser navigation.

| About location | Visible link label | Proposed destination |
|---|---|---|
| Header | Robotics | Existing `#/robotics_projects` |
| Header | Software | Existing `#/software_projects` |
| Header | Design | Existing `#/design_projects` |
| Introduction actions | View resume | Proposed `/assets/michael-garcia-resume.pdf`, only after the asset exists and has been reviewed |
| Introduction actions | Contact Michael | Existing `#/contact`, after its content is completed |
| Robotics row, primary | Wildlife Deterrence Sentry | `#/projects/wildlife-deterrence-sentry` |
| Robotics row, related examples | Smart Locket | `#/projects/smart-locket` |
| Robotics row, related examples | Medication Delivery Training Device | `#/projects/medication-delivery-trainer` |
| Software row, primary | Yggdrasil Systems | `#/projects/yggdrasil-systems` |
| Software row, related examples | Engineering Change & PDM Automation | `#/projects/engineering-workflow-automation` |
| Software row, related examples | Approval-Agency Reporting | `#/projects/approval-agency-reporting` |
| Design row, primary | Spinal Curvature Correction Trainer | `#/projects/spinal-curvature-trainer` |
| Design row, related example | Cervical Spine Trainer | `#/projects/cervical-spine-trainer` |

The tracked vehicle is discoverable through the Robotics header link and the Robotics page's in-development section. It does not need another About link. If the Viking cases are combined, use one link and omit the separate reporting link. If a case is not ready, omit its About link until a substantive destination exists.

### Draft introduction and capability copy

Introduction, grounded in the resume:

> I’m Michael Garcia, an engineering and product-development leader based in West Michigan. For more than a decade, I’ve worked across electromechanical systems, robotics, prototypes, and manufacturing-ready products. My work connects mechanical design, embedded electronics, software, and fabrication, alongside the engineering workflows that help teams take ideas through requirements, prototyping, validation, and manufacturing transition.

Robotics row:

> I bring sensing, controls, electronics, and mechanical assemblies together around a physical task. My projects span autonomous platforms, connected wearables, and training devices with immediate feedback.

Software row:

> My software work connects engineering information to the people and processes that use it. It spans enterprise platform architecture, revision workflows, and reporting that reconciles product data with approval records.

Design row:

> I work from functional requirements through materials, prototypes, and fabrication. Medical training models show how realistic handling, replaceable components, and repeatable manufacture can shape the same design.

Place the mapped links immediately after each paragraph. Keep technologies, metrics, and technical explanations at the linked destinations.

For the career section, use compact entries for M&E Design (2015–present), Viking (2023–2025), Encoris (2021–2023), and Army service (2014–present), as stated in the resume. Present overlapping roles without implying they were sequential. Summarize the Army contribution in leadership, logistics, accountability, and after-action learning. Confirm that “present” remains current before publishing.

The education source lists two bachelor's programs without completion dates or explicit completion status. Confirm whether each is awarded or in progress before choosing public wording. The supplied certification dates and May 2026 Leadership Award can support a compact credentials block. Remove the resume's editorial footnote `[a]` from public copy.

## 6. Project-page acceptance checklist

Every substantive case should contain:

1. **Identity:** title, primary discipline, secondary tags, date range, actual project status, and Michael's role.
2. **Problem and constraints:** the user need and the conditions that shaped the solution.
3. **Contribution:** what Michael personally designed, implemented, led, or integrated; distinguish team output.
4. **Architecture or design:** at least one useful visual with caption and alternative text.
5. **Decision:** an important choice, credible alternative, and reason for the trade-off.
6. **Evaluation:** what was actually demonstrated or tested, under what conditions, and what the result supports. Label untested objectives and limitations clearly.
7. **Outcome:** measured result where supported, otherwise a precise qualitative result; next milestone for ongoing work.
8. **Navigation:** back to the primary subject, About, and optionally one or two related canonical cases.

These are portfolio editorial criteria. They do not imply that historical projects followed this website repository's current journal format. Never reconstruct old PASS records from resume claims. Existing project evidence can be cited honestly without inventing retrospective test execution.

## 7. Implementation sequence and verification gates

### Phase 1 — Content inventory and evidence

Create an inventory with stable project IDs, source references, role, dates, status, primary subject, assets available, claims needing evidence, and publication readiness. Resolve the Viking split, Yggdrasil maturity, employer attribution, education status, and public resume wording. Select one demonstrable case per subject for the first vertical slice.

Completion: every proposed case is either ready to draft or has specific missing evidence recorded. Unsupported placeholder projects remain in the planning backlog.

### Phase 2 — Structured content and canonical routes

- Add a canonical project catalog, proposed `specs/projects.yaml`; keep subject files as ordered lists of project IDs rather than duplicate project bodies.
- Extend `specs/about.yaml` with ordered sections, paragraph/link data, and actions. Retain plain-text body support for simple pages if useful.
- Add explicit project, About-section, and route types in `src/types.ts`; validate parsed YAML fields and references in `src/specs.ts`. A TypeScript cast alone does not validate YAML content.
- Add explicit detail-route resolution in `src/main.ts`. The current exact `pageSpecs[route]` lookup cannot resolve `projects/<id>`; support those routes before relying on the proposed URLs.
- Render text with DOM text APIs and links with separate anchor elements; avoid embedding biography HTML in YAML or expanding the current `innerHTML` card interpolation.
- Add a readable unknown-project state and navigation back to the subject index; decide and document invalid-route behavior explicitly.

**T0:** after each material file change, run the applicable compile/build or YAML/static checks. `npm run build` exists; no lint or test script currently exists. Check required fields, unique IDs, valid subject references, and valid About project references. **T1:** render a representative project and structured About section, including optional/missing content and invalid project IDs. **T2:** verify YAML → parsed data → rendered link → correct project in the browser, including direct URL, refresh, Back, and Forward.

### Phase 3 — First usable portfolio slice

Publish the first three case drafts into the local implementation, complete About with only working destinations, create the reviewed resume asset, and fill Contact with the resume's email address. Add responsive styles and reusable subject/detail navigation. A `mailto:` action must address the intended email; do not claim delivery based on opening a mail client.

**T0:** validate each changed file and asset reference. **T1:** inspect About, each subject, one detail page, resume, and Contact at desktop and mobile widths. **T2:** follow every About link and return path; check resume loading and email target. **T3:** exercise the full critical path and existing homepage behavior before treating the slice as review-ready.

### Phase 4 — Expand evidence and finish documentation

Expand to the target selection as artifacts become available. Add the separate tracked-vehicle preview with a dated stage and next milestone. Write `docs/ARCHITECTURE.md` and update README startup/content-authoring instructions to reflect the implemented system. Complete the authored-source annotation audit.

**T3 release checklist:** all registered pages and published project links; no public placeholders; unknown routes; direct entry and history navigation; resume/contact; narrow mobile layout; keyboard order and focus; meaningful link labels and image alternatives; legible color contrast; reduced-motion behavior where animation is used; and the homepage's 12-second, once-per-session engagement behavior. Include dialog keyboard/focus handling and session-storage behavior in that regression review. These are planned checks, not findings of runtime failure.

## 8. Engineering records and completion boundary

Use root `DEVNOTES.md` for material schema/routing/rendering decisions and meaningful deferred issues. Use unique `DEV-YYYY-MM-DD-NNN` IDs, all required sections, and the required double-divider separation. This plan is associated with `DEV-2026-09-24-001`, status PROPOSED. Later disposition changes belong in new entries.

When implementation starts, create root `TEST_LOG.md` and append actual T0–T3 evidence with unique TEST IDs, commands or repeatable manual steps, environment, expected and observed results, related DEV IDs, and explicit disposition. Preserve failures and record retests separately. Failed T1–T3 checks block implementation progression except for investigation/repair or an authorized, recorded limitation. Build success alone does not establish runtime correctness.

Source headers must identify file, purpose, owner/contributors, contact, license, material constraints, and governing DEV IDs where relevant. Use `Pending confirmation` for genuinely unknown required metadata; do not infer a license. Document substantial functions/types with purpose, design, workflow, and data handoff. Use traceable TODO/FIXME notes for material deferred work. Data files have the exemption described in the annotation standard.

This planning change modifies Markdown only. Behavioral tests are not required by the supplied standards for this change, and none are claimed. Website implementation, browser verification, final project status confirmation, and evidence collection remain future work.
