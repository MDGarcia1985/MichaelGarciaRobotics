/**
 * File: src/pages/blog.ts — published posts index, newest first.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import { getProject, publishedPosts } from '../content/catalog';
import { createPostLayout } from '../layouts/post-layout';
import type { Dict } from '../types';

export interface BlogPageDeps {
  color: (name: string) => string;
  siteHeader: (showBrand?: boolean) => HTMLElement;
  siteFooter: () => HTMLElement;
  websiteName: string;
}

/**
 * Purpose: Render the blog from shared published post records.
 * Design: Newest first; drafts excluded; each entry links to its stable post URL.
 * Workflow: Route #/blog.
 * Data Handoff: Appends page and sets title.
 */
export function renderBlogPage(app: HTMLElement, spec: Dict, deps: BlogPageDeps): void {
  const page = document.createElement('main');
  page.className = 'page simple-page blog-page';
  page.style.background = deps.color(spec.background?.color ?? 'plum');

  const content = document.createElement('section');
  content.className = 'publishing-content';

  const title = document.createElement('h1');
  title.textContent = spec.title?.value ?? 'BLOG';
  title.style.color = deps.color(spec.title?.color ?? 'burnt_auburn');

  const intro = document.createElement('p');
  intro.className = 'project-subtitle';
  intro.textContent = 'Published posts across robotics, software, and design.';

  const list = document.createElement('div');
  list.className = 'blog-post-list';

  const posts = publishedPosts();
  if (!posts.length) {
    const empty = document.createElement('p');
    empty.className = 'publishing-empty';
    empty.textContent = 'Published posts will appear here.';
    list.append(empty);
  }

  for (const post of posts) {
    const related = post.related_projects
      .map((id) => getProject(id))
      .filter(Boolean);
    const defaultLayout = related[0]?.discipline_layout ?? 'pattern_a';
    const card = document.createElement('article');
    card.className = 'blog-post-card';
    const layout = createPostLayout({
      post,
      layout: defaultLayout,
      textMode: 'excerpt',
      showTitle: true,
      headingLevel: 2,
    });
    const link = document.createElement('a');
    link.className = 'blog-post-link';
    link.href = `#/post/${post.id}`;
    link.textContent = 'Read post';
    card.append(layout, link);
    list.append(card);
  }

  content.append(title, intro, list);
  page.append(deps.siteHeader(), content, deps.siteFooter());
  app.append(page);
  document.title = `BLOG — ${deps.websiteName}`;
}
