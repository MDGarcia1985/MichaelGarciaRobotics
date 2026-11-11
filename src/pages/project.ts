/**
 * File: src/pages/project.ts — project detail of associated published posts.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import { getProject, publishedPostsForProject } from '../content/catalog';
import { createPostLayout } from '../layouts/post-layout';

export interface ShellDeps {
  color: (name: string) => string;
  siteHeader: (showBrand?: boolean) => HTMLElement;
  siteFooter: () => HTMLElement;
  websiteName: string;
  navigateHome: () => void;
}

/**
 * Purpose: Render one project page with its published posts, newest first.
 * Design: Reuse the project's discipline_layout; separate posts with horizontal rules and spacing.
 * Workflow: Route #/project/<id>.
 * Data Handoff: Appends page or signals missing project via false return.
 */
export function renderProjectDetailPage(
  app: HTMLElement,
  projectId: string,
  deps: ShellDeps,
): boolean {
  const project = getProject(projectId);
  if (!project) return false;

  const page = document.createElement('main');
  page.className = 'page project-detail-page';
  page.style.background = '#120A07';

  const content = document.createElement('section');
  content.className = 'publishing-content';

  const title = document.createElement('h1');
  title.textContent = project.sample ? `SAMPLE · ${project.name}` : project.name;

  const meta = document.createElement('p');
  meta.className = 'project-detail-meta';
  meta.textContent = `Disciplines: ${project.disciplines.join(', ')}`;

  const posts = publishedPostsForProject(project.id);
  const list = document.createElement('div');
  list.className = 'project-post-list';

  if (!posts.length) {
    const empty = document.createElement('p');
    empty.className = 'publishing-empty';
    empty.textContent = 'Published posts for this project will appear here.';
    list.append(empty);
  }

  posts.forEach((post, index) => {
    if (index > 0) {
      const rule = document.createElement('hr');
      rule.className = 'project-post-rule';
      list.append(rule);
    }
    const layout = createPostLayout({
      post,
      layout: project.discipline_layout,
      textMode: 'body',
      showTitle: true,
      headingLevel: 2,
    });
    const direct = document.createElement('p');
    direct.className = 'post-direct-link';
    const anchor = document.createElement('a');
    anchor.href = `#/post/${post.id}`;
    anchor.textContent = 'Open post page';
    direct.append(anchor);
    const block = document.createElement('section');
    block.className = 'project-post-block';
    block.append(layout, direct);
    list.append(block);
  });

  content.append(title, meta, list);
  page.append(deps.siteHeader(), content, deps.siteFooter());
  app.append(page);
  document.title = `${project.name} — ${deps.websiteName}`;
  return true;
}
