/**
 * File: src/layouts/patterns.ts — named desktop panel patterns for posts/projects.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Desktop uses one of five asymmetric grids; mobile always stacks Cover→Text→Image2→Image3.
 * Related decisions: DEV-2026-11-11-001.
 */
import type { DisciplineLayout } from '../content/types';

export interface LayoutPatternMeta {
  id: DisciplineLayout;
  label: string;
  description: string;
}

/** Human-readable pattern catalog exposed in CMS labels and the layouts preview. */
export const LAYOUT_PATTERNS: LayoutPatternMeta[] = [
  {
    id: 'pattern_a',
    label: 'Cover lead, text rail',
    description: 'Large cover on the left, text on the right; secondary images share a lower row.',
  },
  {
    id: 'pattern_b',
    label: 'Text lead, cover rail',
    description: 'Readable text column first, cover on the right; supporting images beneath.',
  },
  {
    id: 'pattern_c',
    label: 'Cover banner',
    description: 'Full-width cover, then text beside the second image, third image below.',
  },
  {
    id: 'pattern_d',
    label: 'Triptych focus',
    description: 'Second image, cover, and text across the top; third image as a wide closer.',
  },
  {
    id: 'pattern_e',
    label: 'Gallery over essay',
    description: 'Cover and second image paired above a wide text measure; third image accents the side.',
  },
];

/**
 * Purpose: Resolve a layout id to a known pattern, defaulting safely.
 * Design: Unknown values fall back to pattern_a so CMS typos do not break pages.
 * Workflow: Used whenever a project supplies discipline_layout.
 * Data Handoff: Returns a valid DisciplineLayout.
 */
export function resolveLayout(layout: string | undefined): DisciplineLayout {
  const match = LAYOUT_PATTERNS.find((pattern) => pattern.id === layout);
  return match?.id ?? 'pattern_a';
}
