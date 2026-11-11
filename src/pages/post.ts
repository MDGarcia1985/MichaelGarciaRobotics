/**
 * File: src/pages/post.ts — stable individual post URL renderer.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import { getPost, getProject } from '../content/catalog';
import { createPostLayout } from '../layouts/post-layout';

export interface PostPageDeps {
  siteHeader: (showBrand?: boolean) => HTMLElement;
  siteFooter: () => HTMLElement;
  websiteName: string;
}

/**
 * Purpose: Render one post at a stable direct URL.
 * Design: Uses the first related project's layout as default; drafts show a banner but remain reachable by ID.
 * Workflow: Route #/post/<id>.
 * Data Handoff: Appends page or returns false when missing.
 */
export function renderPostDetailPage(
  app: HTMLElement,
  postId: string,
  deps: PostPageDeps,
): boolean {
  const post = getPost(postId);
  if (!post) return false;

  const relatedProjects = post.related_projects
    .map((id) => getProject(id))
    .filter((project): project is NonNullable<typeof project> => Boolean(project));
  const layout = relatedProjects[0]?.discipline_layout ?? 'pattern_a';

  const page = document.createElement('main');
  page.className = 'page post-detail-page';
  page.style.background = '#120A07';

  const content = document.createElement('section');
  content.className = 'publishing-content';

  if (post.draft) {
    const banner = document.createElement('p');
    banner.className = 'draft-banner';
    banner.textContent = 'Draft — excluded from public indexes.';
    content.append(banner);
  }

  if (post.sample) {
    const sample = document.createElement('p');
    sample.className = 'sample-banner';
    sample.textContent = 'SAMPLE fixture — for layout and CMS mapping preview.';
    content.append(sample);
  }

  const composition = createPostLayout({
    post,
    layout,
    textMode: 'body',
    showTitle: true,
    headingLevel: 1,
  });
  content.append(composition);

  if (relatedProjects.length) {
    const related = document.createElement('nav');
    related.className = 'post-related-projects';
    related.setAttribute('aria-label', 'Related projects');
    const heading = document.createElement('h2');
    heading.textContent = 'Projects';
    related.append(heading);
    const list = document.createElement('ul');
    for (const project of relatedProjects) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = `#/project/${project.id}`;
      link.textContent = project.name;
      item.append(link);
      list.append(item);
    }
    related.append(list);
    content.append(related);
  }

  page.append(deps.siteHeader(), content, deps.siteFooter());
  app.append(page);
  document.title = `${post.title} — ${deps.websiteName}`;
  return true;
}
