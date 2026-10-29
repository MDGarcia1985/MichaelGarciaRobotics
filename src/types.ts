/**
 * File: src/types.ts — shared YAML specification contracts.
 * Owner: Michael Garcia; contributor: Codex.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decision: DEV-2026-10-15-002.
 */
export type Dict = Record<string, any>;

/**
 * Purpose: Define the shared navigation disclosure supplied by YAML.
 * Design: Button dimensions are CSS pixels; destinations use existing route keys.
 * Workflow: Loaded with the global spec and consumed by createNavigationHeader.
 * Data Handoff: Supplies accessible trigger text and ordered navigation links.
 */
export interface NavigationSpec {
  label: string;
  size_px: number;
  color: string;
  background: { color: string };
  drop_shadow: { visible: boolean; color: string };
  items: { label: string; destination: string }[];
}

export interface SiteSpec {
  website: {
    name: string;
    design_tokens: Dict;
    pages: Dict;
    architecture: Dict;
    utility_navigation: NavigationSpec;
    header: {
      height_px: number;
      brand: { value: string; font_size_px: number; color: string };
    };
    footer: {
      height_px: number;
      copyright: { value: string; font_size_px: number; color: string };
    };
  };
}
