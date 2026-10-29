/**
 * File: src/navigation.ts — shared click-operated navigation disclosure.
 * Owner: Michael Garcia; contributor: Codex.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Native links use the existing hash router; no new routing system.
 * Related decisions: DEV-2026-10-15-002, DEV-2026-10-15-003.
 */
import type { NavigationSpec } from './types';

/**
 * Purpose: Render one reusable header with a Figma-derived navigation button.
 * Design: A disclosure of native links retains ordinary Tab/link semantics.
 * Workflow: Called once per page render with the global navigation spec and
 * palette resolver; invalid color names follow the resolver's error contract.
 * Data Handoff: Returns the header and a disposer for document event listeners;
 * the page renderer must call dispose before replacing the page.
 */
export function createNavigationHeader(spec: NavigationSpec, resolveColor: (name: string) => string) {
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const header = document.createElement('header');
  header.className = 'site-header';

  const disclosure = document.createElement('div');
  disclosure.className = 'site-navigation';
  const trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'navigation-trigger';
  trigger.style.width = `${spec.size_px}px`;
  trigger.style.height = `${spec.size_px}px`;
  trigger.style.color = resolveColor(spec.color);
  trigger.style.backgroundColor = resolveColor(spec.background.color);
  // Shadow geometry is presentation; YAML owns visibility and palette selection.
  trigger.style.boxShadow = spec.drop_shadow.visible
    ? `0 2px 6px ${resolveColor(spec.drop_shadow.color)}`
    : 'none';
  trigger.setAttribute('aria-label', spec.label);
  trigger.setAttribute('aria-expanded', 'false');
  trigger.setAttribute('aria-controls', 'site-navigation-links');

  // Figma 1:2 contains CSS rectangles, not exported image/SVG assets.
  for (let index = 0; index < 3; index++) {
    const bar = document.createElement('span');
    bar.className = 'navigation-icon-bar';
    bar.setAttribute('aria-hidden', 'true');
    trigger.append(bar);
  }

  const links = document.createElement('nav');
  links.id = 'site-navigation-links';
  links.className = 'navigation-dropdown';
  links.setAttribute('aria-label', 'Site');
  links.hidden = true;
  for (const item of spec.items) {
    const link = document.createElement('a');
    link.textContent = item.label;
    link.href = item.destination === 'homepage' ? '#/' : `#/${item.destination}`;
    links.append(link);
  }

  /**
   * Purpose: Keep visibility and accessible expansion state synchronized.
   * Design: Returning focus is explicit so outside clicks retain their target.
   * Workflow: Used by click, keyboard, focus, and navigation handlers below.
   * Data Handoff: Updates the DOM and optionally focuses the trigger.
   */
  function setOpen(open: boolean, returnFocus = false) {
    links.hidden = !open;
    trigger.setAttribute('aria-expanded', String(open));
    if (returnFocus) trigger.focus();
  }

  trigger.addEventListener('click', () => setOpen(links.hidden), options);
  trigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      links.querySelector('a')?.focus();
    }
  }, options);
  disclosure.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !links.hidden) {
      event.preventDefault();
      setOpen(false, true);
    }
  }, options);
  links.addEventListener('click', (event) => {
    if (event.target instanceof Element && event.target.closest('a')) setOpen(false);
  }, options);
  document.addEventListener('pointerdown', (event) => {
    if (event.target instanceof Node && !disclosure.contains(event.target)) setOpen(false);
  }, options);
  document.addEventListener('focusin', (event) => {
    if (event.target instanceof Node && !disclosure.contains(event.target)) setOpen(false);
  }, options);

  disclosure.append(trigger, links);
  header.append(disclosure);
  return { header, dispose: () => controller.abort() };
}
