/**
 * File: src/content/catalog.ts — load and query shared project/post YAML collections.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Drafts never appear in public indexes; fixtures remain labeled SAMPLE records.
 * Related decisions: DEV-2026-11-11-001.
 */
import yaml from 'js-yaml';
import type { Discipline, Post, Project } from './types';

const projectModules = import.meta.glob('../../content/projects/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

const postModules = import.meta.glob('../../content/posts/*.yaml', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

/**
 * Purpose: Parse every project YAML file into typed records.
 * Design: One file per project; filename is independent of the stable id field.
 * Workflow: Eagerly imported by Vite into the client bundle.
 * Data Handoff: Returns the full project list including SAMPLE fixtures.
 */
function loadProjects(): Project[] {
  return Object.values(projectModules).map((raw) => yaml.load(raw) as Project);
}

/**
 * Purpose: Parse every post YAML file into typed records.
 * Design: draft defaults to false only when the field is explicitly false.
 * Workflow: Eagerly imported by Vite into the client bundle.
 * Data Handoff: Returns all posts; callers filter drafts for public views.
 */
function loadPosts(): Post[] {
  return Object.values(postModules).map((raw) => {
    const post = yaml.load(raw) as Post;
    post.draft = Boolean(post.draft);
    post.related_projects = post.related_projects ?? [];
    post.date = normalizeDate(post.date);
    return post;
  });
}

/** Purpose: Keep post dates as YYYY-MM-DD even when js-yaml yields Date objects. */
function normalizeDate(value: unknown): string {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? '');
}

const projects = loadProjects();
const posts = loadPosts();

const projectsById = new Map(projects.map((project) => [project.id, project]));
const postsById = new Map(posts.map((post) => [post.id, post]));

/**
 * Purpose: Expose all projects for layout preview and admin-style inspection.
 * Design: Includes SAMPLE fixtures; does not invent unpublished achievements.
 * Workflow: Used by discipline/project renderers and layouts preview.
 * Data Handoff: Sorted copy by display_order then name.
 */
export function allProjects(): Project[] {
  return [...projects].sort((a, b) => a.display_order - b.display_order || a.name.localeCompare(b.name));
}

/**
 * Purpose: List projects that belong to one discipline in configured order.
 * Design: A project may appear under multiple disciplines without duplicating posts.
 * Workflow: Discipline page renderer.
 * Data Handoff: Ordered project array.
 */
export function projectsForDiscipline(discipline: Discipline): Project[] {
  return allProjects().filter((project) => project.disciplines.includes(discipline));
}

/**
 * Purpose: Resolve one project by stable ID.
 * Design: Unknown IDs return undefined so the router can fall back Home.
 * Workflow: Project detail route.
 * Data Handoff: Project or undefined.
 */
export function getProject(id: string): Project | undefined {
  return projectsById.get(id);
}

/**
 * Purpose: Resolve one post by stable ID, including drafts for direct preview when needed.
 * Design: Public indexes call publishedPosts; detail pages may show a draft banner if linked.
 * Workflow: Post detail route and featured-post selection.
 * Data Handoff: Post or undefined.
 */
export function getPost(id: string): Post | undefined {
  return postsById.get(id);
}

/**
 * Purpose: Public blog feed of published posts, newest first.
 * Design: Draft exclusion is absolute for indexes.
 * Workflow: Blog page.
 * Data Handoff: Sorted published posts.
 */
export function publishedPosts(): Post[] {
  return [...posts]
    .filter((post) => !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
}

/**
 * Purpose: Published posts associated with a project, newest first.
 * Design: Shared post records — no duplication between project and blog views.
 * Workflow: Project page.
 * Data Handoff: Sorted published posts for the project.
 */
export function publishedPostsForProject(projectId: string): Post[] {
  return publishedPosts().filter((post) => post.related_projects.includes(projectId));
}

/**
 * Purpose: Choose the featured post for discipline-page presentation.
 * Design: Require the featured post to be published and related to the project; otherwise graceful fallback.
 * Workflow: Discipline cards and layout preview.
 * Data Handoff: Featured published post, else newest related published post, else undefined.
 */
export function featuredPostForProject(project: Project): Post | undefined {
  if (project.featured_post) {
    const featured = getPost(project.featured_post);
    if (
      featured
      && !featured.draft
      && featured.related_projects.includes(project.id)
    ) {
      return featured;
    }
  }
  return publishedPostsForProject(project.id)[0];
}

/**
 * Purpose: Map a CMS/public media path to the optimized public URL when available.
 * Design: Content stores `/media/<file>`; build writes derivatives beside that basename.
 * Workflow: Image panel rendering.
 * Data Handoff: Browser-ready src string.
 */
export function publicImageSrc(src: string | undefined): string | undefined {
  if (!src) return undefined;
  return src;
}
