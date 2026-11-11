/**
 * File: src/layouts/post-layout.ts — four-panel editorial layout for posts and featured cards.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Missing optional images collapse; text height grows with content; no fixed clipping boxes.
 * Related decisions: DEV-2026-11-11-001.
 */
import type { ContentImage, DisciplineLayout, Post } from '../content/types';
import { publicImageSrc } from '../content/catalog';
import { renderMarkdown } from '../lib/markdown';
import { resolveLayout } from './patterns';

export type TextMode = 'excerpt' | 'body';

export interface PostLayoutOptions {
  post: Post;
  layout: DisciplineLayout | string;
  textMode: TextMode;
  /** When set, the whole composition is a link to the project page. */
  projectHref?: string;
  projectName?: string;
  showTitle?: boolean;
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

/**
 * Purpose: Build one editorial composition from cover, text, and optional images.
 * Design: Desktop pattern class varies; CSS enforces the mobile Cover→Text→Image2→Image3 stack.
 * Workflow: Discipline featured cards, project page posts, post detail, and layouts preview.
 * Data Handoff: Returns an article element ready to append.
 */
export function createPostLayout(options: PostLayoutOptions): HTMLElement {
  const layout = resolveLayout(options.layout);
  const article = document.createElement(options.projectHref ? 'a' : 'article');
  article.className = `post-layout post-layout--${layout}${options.className ? ` ${options.className}` : ''}`;
  if (options.projectHref) {
    const link = article as HTMLAnchorElement;
    link.href = options.projectHref;
    link.setAttribute('aria-label', `Open project ${options.projectName ?? ''}`.trim());
  } else {
    article.setAttribute('aria-labelledby', `post-title-${options.post.id}`);
  }

  const cover = createImagePanel('cover_image', options.post.cover_image, 'cover');
  const text = createTextPanel(options);
  const image2 = createImagePanel('image_2', options.post.image_2, 'contain');
  const image3 = createImagePanel('image_3', options.post.image_3, 'contain');

  // DOM order matches the required mobile stack regardless of desktop grid placement.
  for (const panel of [cover, text, image2, image3]) {
    if (panel) article.append(panel);
  }

  return article;
}

/**
 * Purpose: Render one image panel or omit it when the asset is absent.
 * Design: object-fit and object-position come from fit/focal fields; images never stretch.
 * Workflow: Called for each optional image slot.
 * Data Handoff: Figure element or null when missing.
 */
function createImagePanel(
  slot: 'cover_image' | 'image_2' | 'image_3',
  image: ContentImage | undefined,
  defaultFit: 'cover' | 'contain',
): HTMLElement | null {
  if (!image?.src) return null;
  const src = publicImageSrc(image.src);
  if (!src) return null;

  const figure = document.createElement('figure');
  figure.className = `post-panel post-panel--${slot}`;
  figure.dataset.slot = slot;

  const img = document.createElement('img');
  img.src = src;
  img.alt = image.alt || '';
  img.loading = 'lazy';
  img.decoding = 'async';
  const fit = image.fit ?? defaultFit;
  const fx = clampPercent(image.focal_x, 50);
  const fy = clampPercent(image.focal_y, 50);
  img.style.objectFit = fit;
  img.style.objectPosition = `${fx}% ${fy}%`;
  figure.append(img);

  if (image.caption) {
    const caption = document.createElement('figcaption');
    caption.textContent = image.caption;
    figure.append(caption);
  }
  return figure;
}

/**
 * Purpose: Render the text panel with excerpt or full body.
 * Design: No max-height clipping; container grows with content for long posts.
 * Workflow: Discipline pages use excerpts; project/post pages use full bodies.
 * Data Handoff: Section element containing title, meta, body/excerpt, and links.
 */
function createTextPanel(options: PostLayoutOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'post-panel post-panel--text';
  section.dataset.slot = 'text';

  if (options.showTitle !== false) {
    const heading = document.createElement(`h${options.headingLevel ?? 2}`);
    heading.id = `post-title-${options.post.id}`;
    heading.textContent = options.post.title;
    section.append(heading);
  }

  const meta = document.createElement('p');
  meta.className = 'post-meta';
  meta.textContent = formatDate(options.post.date);
  section.append(meta);

  if (options.projectName && options.projectHref) {
    const projectLine = document.createElement('p');
    projectLine.className = 'post-project-line';
    projectLine.textContent = options.projectName;
    section.append(projectLine);
  }

  const body = document.createElement('div');
  body.className = 'post-body';
  if (options.textMode === 'excerpt') {
    const excerpt = document.createElement('p');
    excerpt.textContent = options.post.excerpt;
    body.append(excerpt);
  } else {
    body.innerHTML = renderMarkdown(options.post.body);
  }
  section.append(body);

  if (options.textMode === 'body' && options.post.links?.length) {
    const list = document.createElement('ul');
    list.className = 'post-links';
    for (const link of options.post.links) {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.textContent = link.label;
      anchor.rel = 'noopener noreferrer';
      if (/^https?:\/\//.test(link.url)) anchor.target = '_blank';
      item.append(anchor);
      list.append(item);
    }
    section.append(list);
  }

  return section;
}

function clampPercent(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.min(100, Math.max(0, value));
}

function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return value;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
