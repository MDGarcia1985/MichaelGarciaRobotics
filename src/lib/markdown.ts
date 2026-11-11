/**
 * File: src/lib/markdown.ts — small safe Markdown-to-DOM helper for post bodies.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Escape HTML first; support only a limited Markdown subset (no raw HTML pass-through).
 * Related decisions: DEV-2026-11-11-001.
 */

/**
 * Purpose: Escape untrusted text before injecting markup.
 * Design: Replace the five HTML-significant characters.
 * Workflow: Called before Markdown substitution.
 * Data Handoff: Returns a string safe for text nodes or controlled innerHTML.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Purpose: Convert a limited Markdown subset into escaped HTML paragraphs.
 * Design: Supports headings, paragraphs, bold/italic, inline code, and links; rejects raw HTML.
 * Workflow: Used by post and project body renderers.
 * Data Handoff: Returns HTML for assignment to a content container.
 */
export function renderMarkdown(source: string): string {
  const normalized = source.replace(/\r\n/g, '\n').trim();
  if (!normalized) return '';

  const blocks = normalized.split(/\n{2,}/);
  return blocks.map((block) => {
    const lines = block.split('\n').map((line) => line.trimEnd());
    const joined = lines.join('\n');
    const heading = joined.match(/^(#{1,3})\s+(.+)$/);
    if (heading && lines.length === 1) {
      const level = heading[1].length;
      return `<h${level}>${inlineMarkdown(heading[2])}</h${level}>`;
    }
    if (lines.every((line) => /^[-*]\s+/.test(line))) {
      const items = lines
        .map((line) => `<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ''))}</li>`)
        .join('');
      return `<ul>${items}</ul>`;
    }
    return `<p>${inlineMarkdown(lines.join('<br>'))}</p>`;
  }).join('');
}

/**
 * Purpose: Apply inline Markdown after HTML escaping.
 * Design: Order matters so nested emphasis does not reopen tags incorrectly.
 * Workflow: Used by block rendering.
 * Data Handoff: Returns inline HTML fragments.
 */
function inlineMarkdown(source: string): string {
  let text = escapeHtml(source);
  text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" rel="noopener noreferrer">$1</a>');
  text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text;
}
