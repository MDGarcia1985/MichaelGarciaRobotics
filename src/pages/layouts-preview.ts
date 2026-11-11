/**
 * File: src/pages/layouts-preview.ts — inspect all five desktop patterns and the mobile stack.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import { getPost, getProject } from '../content/catalog';
import { LAYOUT_PATTERNS } from '../layouts/patterns';
import { createPostLayout } from '../layouts/post-layout';

export interface PreviewDeps {
  siteHeader: (showBrand?: boolean) => HTMLElement;
  siteFooter: () => HTMLElement;
  websiteName: string;
}

const SAMPLE_POST_ID = 'sample-post-featured';
const SAMPLE_PROJECT_ID = 'sample-layout-demo';

/**
 * Purpose: Show the same SAMPLE post in every desktop pattern plus the mobile stack and CMS field map.
 * Design: Uses fixture content only; does not invent portfolio achievements.
 * Workflow: Route #/layouts-preview for design/CMS verification.
 * Data Handoff: Appends the preview page.
 */
export function renderLayoutsPreviewPage(app: HTMLElement, deps: PreviewDeps): void {
  const post = getPost(SAMPLE_POST_ID);
  const project = getProject(SAMPLE_PROJECT_ID);

  const page = document.createElement('main');
  page.className = 'page layouts-preview-page';
  page.style.background = '#120A07';

  const content = document.createElement('section');
  content.className = 'publishing-content';

  const title = document.createElement('h1');
  title.textContent = 'Layout patterns preview';

  const intro = document.createElement('p');
  intro.className = 'project-subtitle';
  intro.textContent = 'Same SAMPLE post rendered in each desktop pattern. Narrow the viewport to confirm the Cover → Text → Second image → Third image stack.';

  content.append(title, intro, createFieldMap());

  if (!post || !project) {
    const missing = document.createElement('p');
    missing.className = 'publishing-empty';
    missing.textContent = 'SAMPLE fixtures are missing from content/projects and content/posts.';
    content.append(missing);
  } else {
    const mobile = document.createElement('section');
    mobile.className = 'layout-preview-block';
    const mobileTitle = document.createElement('h2');
    mobileTitle.textContent = 'Mobile stack (forced)';
    const mobileNote = document.createElement('p');
    mobileNote.textContent = 'Forced single-column order independent of pattern selection.';
    const mobileLayout = createPostLayout({
      post,
      layout: 'pattern_a',
      textMode: 'excerpt',
      projectHref: `#/project/${project.id}`,
      projectName: project.name,
      className: 'post-layout--force-stack',
    });
    mobile.append(mobileTitle, mobileNote, mobileLayout);
    content.append(mobile);

    for (const pattern of LAYOUT_PATTERNS) {
      const block = document.createElement('section');
      block.className = 'layout-preview-block';
      block.id = pattern.id;
      const heading = document.createElement('h2');
      heading.textContent = `${pattern.id} — ${pattern.label}`;
      const description = document.createElement('p');
      description.textContent = pattern.description;
      const layout = createPostLayout({
        post,
        layout: pattern.id,
        textMode: 'excerpt',
        projectHref: `#/project/${project.id}`,
        projectName: project.name,
      });
      block.append(heading, description, layout);
      content.append(block);
    }
  }

  page.append(deps.siteHeader(), content, deps.siteFooter());
  app.append(page);
  document.title = `Layouts preview — ${deps.websiteName}`;
}

/**
 * Purpose: Document how CMS fields map onto visible panels.
 * Design: Static legend next to live previews for editor onboarding.
 * Workflow: Rendered once at the top of the preview page.
 * Data Handoff: Returns a definition list element.
 */
function createFieldMap(): HTMLElement {
  const box = document.createElement('section');
  box.className = 'cms-field-map';
  const heading = document.createElement('h2');
  heading.textContent = 'CMS fields → visible elements';
  const list = document.createElement('dl');
  const rows: [string, string][] = [
    ['cover_image', 'First panel — intentional crop (fit: cover) with focal point'],
    ['title + excerpt / body', 'Text panel — excerpt on discipline pages; full body on project and post pages'],
    ['image_2', 'Second image panel — complete technical frame by default (fit: contain)'],
    ['image_3', 'Third image panel — collapses when empty'],
    ['related_projects', 'Associates the post with project pages and featured-post eligibility'],
    ['discipline_layout', 'Selects one of five desktop patterns on the project’s discipline presentation'],
    ['featured_post', 'Chooses which published post represents the project on discipline pages'],
    ['draft', 'When true, excluded from blog, discipline featured selection, and project lists'],
  ];
  for (const [term, detail] of rows) {
    const dt = document.createElement('dt');
    dt.textContent = term;
    const dd = document.createElement('dd');
    dd.textContent = detail;
    list.append(dt, dd);
  }
  box.append(heading, list);
  return box;
}
