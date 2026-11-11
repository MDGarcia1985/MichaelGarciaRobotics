/**
 * File: src/content/types.ts — shared project and post content contracts.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Stable string IDs are the public contract between CMS YAML and routes.
 * Related decisions: DEV-2026-11-11-001.
 */

/** Supported discipline keys used by route filters and CMS select values. */
export type Discipline = 'robotics' | 'software' | 'design';

/** Named desktop asymmetric layouts; mobile always uses the fixed stack. */
export type DisciplineLayout =
  | 'pattern_a'
  | 'pattern_b'
  | 'pattern_c'
  | 'pattern_d'
  | 'pattern_e';

/** Cover crops intentionally; contain preserves complete technical frames. */
export type ImageFit = 'cover' | 'contain';

/**
 * Purpose: Describe one publishable image with accessibility and crop controls.
 * Design: Focal points are percentages so CSS object-position stays resolution-independent.
 * Workflow: Authored in Pages CMS; resolved to public derivatives at render time.
 * Data Handoff: Consumed by layout panels and image optimization.
 */
export interface ContentImage {
  src: string;
  alt: string;
  caption?: string;
  /** Horizontal focal point 0–100; defaults to 50 when omitted. */
  focal_x?: number;
  /** Vertical focal point 0–100; defaults to 50 when omitted. */
  focal_y?: number;
  /** Defaults: cover_image uses cover; image_2/image_3 use contain. */
  fit?: ImageFit;
}

/**
 * Purpose: One reusable project record shared across disciplines and pages.
 * Design: featured_post must reference a post that lists this project.
 * Workflow: Loaded from content/projects/*.yaml; filtered by discipline and draft rules on posts.
 * Data Handoff: Supplies ordering, layout choice, and project-page composition.
 */
export interface Project {
  id: string;
  name: string;
  disciplines: Discipline[];
  display_order: number;
  featured_post?: string;
  discipline_layout: DisciplineLayout;
  /** When true, content is a labeled SAMPLE fixture, not production portfolio. */
  sample?: boolean;
}

/**
 * Purpose: One editorial post that can appear on blog, project, and discipline views.
 * Design: Shared record only — views reference the same ID; drafts stay out of public indexes.
 * Workflow: Loaded from content/posts/*.yaml; associated via related_projects.
 * Data Handoff: Supplies panels, excerpt/body text, links, and dating for newest-first sorts.
 */
export interface Post {
  id: string;
  title: string;
  related_projects: string[];
  cover_image?: ContentImage;
  image_2?: ContentImage;
  image_3?: ContentImage;
  excerpt: string;
  date: string;
  draft: boolean;
  body: string;
  links?: { label: string; url: string }[];
  sample?: boolean;
}

export const DISCIPLINES: Discipline[] = ['robotics', 'software', 'design'];

export const DISCIPLINE_LAYOUTS: DisciplineLayout[] = [
  'pattern_a',
  'pattern_b',
  'pattern_c',
  'pattern_d',
  'pattern_e',
];

export const DISCIPLINE_ROUTE: Record<Discipline, string> = {
  robotics: 'robotics_projects',
  software: 'software_projects',
  design: 'design_projects',
};

export const ROUTE_DISCIPLINE: Record<string, Discipline> = {
  robotics_projects: 'robotics',
  software_projects: 'software',
  design_projects: 'design',
};
