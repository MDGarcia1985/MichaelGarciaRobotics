/**
 * File: src/main.ts — render YAML-defined pages and homepage interactions.
 * Owner: Michael Garcia; contributor: Codex.
 * Contact: michael@mandedesign.studio. License: Pending confirmation.
 * Constraint: Preserve existing hash routes and session-only engagement state.
 * Related decisions: DEV-2026-10-23-002, DEV-2026-10-23-003.
 */
import './styles.css';
import { createNavigationHeader } from './navigation';
import { mainSpec, pageSpecs } from './specs';
import type { Dict } from './types';

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Missing #app root');

const website = mainSpec.website;
const tokens = website.design_tokens;
let disposeNavigation = () => {};

/** Purpose: Resolve a design token. Design: Fail on unknown names.
 * Workflow: Used by styling helpers. Data Handoff: Returns the YAML value or throws. */
function token(group: string, name: string) {
  const value = tokens?.[group]?.[name];
  if (value === undefined) throw new Error(`Unknown ${group} token: ${name}`);
  return value;
}

/** Purpose: Resolve palette names. Design: Delegate missing-token handling.
 * Workflow: Used by renderers. Data Handoff: Returns a CSS color. */
function color(name: string) {
  return token('colors', name);
}

/** Purpose: Apply named typography. Design: YAML supplies desktop sizes; CSS adapts smaller viewports.
 * Workflow: Called during rendering. Data Handoff: Mutates element styles. */
function applyTypography(element: HTMLElement, styleName: string) {
  const style = token('typography', styleName);
  element.style.fontFamily = style.font_family;
  element.style.setProperty('--specified-font-size', `${style.font_size_px}px`);
  element.style.fontSize = 'var(--responsive-font-size, var(--specified-font-size))';
  element.style.fontWeight = String(style.font_weight ?? 400);
  element.style.fontStyle = style.italic ? 'italic' : 'normal';
}

/** Purpose: Navigate between existing routes. Design: Preserve browser history.
 * Workflow: Used by discipline actions. Data Handoff: Updates URL and renders. */
function navigate(destination: string) {
  const route = destination === 'homepage' ? '' : destination;
  history.pushState({}, '', route ? `#/${route}` : '#/');
  render();
}

/** Purpose: Read the active route. Design: Empty hashes represent Home.
 * Workflow: Used during rendering/engagement. Data Handoff: Returns a spec key. */
function currentRoute() {
  const route = location.hash.replace(/^#\/?/, '');
  return route || 'homepage';
}

/** Purpose: Install shared navigation. Design: YAML supplies desktop geometry; CSS adapts mobile spacing.
 * Workflow: Called by each page renderer. Data Handoff: Returns header, registers cleanup. */
function siteHeader(showBrand = true) {
  const navigation = createNavigationHeader(website.utility_navigation, color);
  navigation.header.style.setProperty('--header-height', `${website.header.height_px}px`);
  // Home already displays the name in its hero; interior pages retain header branding.
  if (showBrand) {
    const brand = document.createElement('button');
    brand.type = 'button';
    brand.addEventListener('click', () => navigate('homepage'));
    brand.className = 'site-brand';
    brand.textContent = website.header.brand.value;
    brand.style.fontSize = `${website.header.brand.font_size_px}px`;
    brand.style.color = color(website.header.brand.color);
    navigation.header.append(brand);
  }
  disposeNavigation = navigation.dispose;
  return navigation.header;
}

/** Purpose: Render the shared copyright footer. Design: Normal flow avoids content overlap.
 * Workflow: Called for every page. Data Handoff: Returns a YAML-styled footer element. */
function siteFooter() {
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.style.setProperty('--footer-height', `${website.footer.height_px}px`);
  const copyright = document.createElement('small');
  copyright.className = 'site-copyright';
  copyright.textContent = website.footer.copyright.value;
  copyright.style.fontSize = `${website.footer.copyright.font_size_px}px`;
  copyright.style.color = color(website.footer.copyright.color);
  footer.append(copyright);
  return footer;
}

/** Purpose: Render the landing page. Design: YAML controls content and tokens.
 * Workflow: Called on Home. Data Handoff: Appends page and schedules engagement. */
function renderHomepage(spec: Dict) {
  const page = document.createElement('main');
  page.className = 'page homepage';
  page.style.background = color(spec.background.color);

  const header = siteHeader(false);

  const hero = document.createElement('section');
  hero.className = 'hero';

  const title = document.createElement('h1');
  title.textContent = spec.hero.title.value;
  title.style.color = color(spec.hero.title.color);
  applyTypography(title, spec.hero.title.style);

  const nav = document.createElement('nav');
  nav.className = 'hero-nav';
  nav.setAttribute('aria-label', 'Explore disciplines');
  applyTypography(nav, spec.navigation.style);
  nav.style.color = color(spec.navigation.color);

  const items = Object.entries(spec.navigation.items) as [string, Dict][];
  items.forEach(([key, item], index) => {
    const navItem = document.createElement('button');
    navItem.className = 'hero-nav-item';
    navItem.dataset.navKey = key;
    navItem.textContent = item.value;
    navItem.style.setProperty('--item-padding', `${spec.navigation.clickable_area.padding_px}px`);
    navItem.addEventListener('click', () => navigate(item.destination));
    nav.append(navItem);

    if (index < items.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'separator';
      separator.setAttribute('aria-hidden', 'true');
      separator.textContent = spec.navigation.separator.value;
      nav.append(separator);
    }
  });

  const hover = token('interaction', spec.navigation.hover_style);
  page.style.setProperty('--nav-hover-scale', String(hover.magnify));
  page.style.setProperty('--nav-hover-duration', `${hover.duration_ms}ms`);

  hero.append(title, nav);

  const footer = siteFooter();

  page.append(header, hero, footer);
  app!.append(page);

  scheduleEngagement(spec.engagement);
}

/** Purpose: Offer a session-scoped discipline choice. Design: Read existing YAML timing.
 * Workflow: Scheduled from Home. Data Handoff: Updates sessionStorage and navigates to the selected page. */
function scheduleEngagement(spec: Dict) {
  if (!spec?.enabled) return;
  const storageKey = 'mgr-engagement-complete';
  if (spec.once_per_session && sessionStorage.getItem(storageKey)) return;

  window.setTimeout(() => {
    if (currentRoute() !== 'homepage') return;
    if (spec.once_per_session && sessionStorage.getItem(storageKey)) return;

    const overlay = document.createElement('div');
    overlay.className = 'engagement-overlay';

    const panel = document.createElement('section');
    panel.className = 'engagement-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-labelledby', 'engagement-title');

    const title = document.createElement('h2');
    title.id = 'engagement-title';
    title.textContent = spec.title;

    const prompt = document.createElement('p');
    prompt.className = 'engagement-prompt';
    prompt.textContent = spec.prompt;

    const explanation = document.createElement('p');
    explanation.className = 'engagement-explanation';
    explanation.textContent = spec.explanation;

    const choices = document.createElement('div');
    choices.className = 'engagement-choices';

    Object.entries(spec.choices).forEach(([choiceKey, choiceValue]) => {
      const choice = choiceValue as Dict;
      const el = document.createElement('button');
      el.textContent = choice.label;
      el.addEventListener('click', () => {
        sessionStorage.setItem(storageKey, choiceKey);
        overlay.remove();
        if (choice.target && choice.target !== 'none') {
          navigate(choice.target);
          // Place keyboard focus in the new page after replacing the dialog.
          const heading = app!.querySelector<HTMLElement>('h1');
          heading?.setAttribute('tabindex', '-1');
          heading?.focus();
        } else {
          app!.querySelector<HTMLButtonElement>('.navigation-trigger')?.focus();
        }
      });
      choices.append(el);
    });

    panel.append(title, prompt, choices, explanation);
    overlay.append(panel);
    document.body.append(overlay);
    panel.querySelector<HTMLButtonElement>('button')?.focus();
  }, spec.delay_ms);
}

/** Purpose: Render a subject index. Design: Keep the existing placeholder card schema.
 * Workflow: Called for subject routes. Data Handoff: Appends content and sets title. */
function renderProjectPage(name: string, spec: Dict) {
  const page = document.createElement('main');
  page.className = 'page project-page';
  page.style.background = color(spec.background.color);

  const top = siteHeader();

  const content = document.createElement('section');
  content.className = 'project-content';

  const title = document.createElement('h1');
  title.textContent = spec.hero.title.value;
  title.style.color = color(spec.hero.title.color);
  applyTypography(title, spec.hero.title.style);

  const subtitle = document.createElement('p');
  subtitle.className = 'project-subtitle';
  subtitle.textContent = spec.hero.subtitle?.value ?? '';
  subtitle.style.color = color(spec.hero.subtitle?.color ?? spec.hero.title.color);

  const grid = document.createElement('div');
  grid.className = 'project-grid';
  (spec.projects ?? []).forEach((project: Dict) => {
    const card = document.createElement('article');
    card.className = 'project-card';
    card.innerHTML = `<p class="project-kicker">${project.status}</p><h2>${project.title}</h2><p>${project.description}</p>`;
    grid.append(card);
  });

  content.append(title, subtitle, grid);
  page.append(top, content, siteFooter());
  app!.append(page);
  document.title = `${spec.hero.title.value} — ${website.name}`;
}

/** Purpose: Render About/Contact. Design: Preserve plain paragraph content.
 * Workflow: Called for simple routes. Data Handoff: Appends page and sets title. */
function renderSimplePage(name: string, spec: Dict) {
  const page = document.createElement('main');
  page.className = 'page simple-page';
  page.style.background = color(spec.background.color);
  const top = siteHeader();
  const content = document.createElement('section');
  content.className = 'simple-content';
  const title = document.createElement('h1');
  title.textContent = spec.title.value;
  title.style.color = color(spec.title.color);
  (spec.body ?? []).forEach((line: string) => {
    const p = document.createElement('p');
    p.textContent = line;
    content.append(p);
  });
  content.prepend(title);
  page.append(top, content, siteFooter());
  app!.append(page);
  document.title = `${spec.title.value} — ${website.name}`;
}

/** Purpose: Dispatch the active page. Design: Dispose global listeners before replacement.
 * Workflow: Called on startup/history changes. Data Handoff: Replaces app content. */
function render() {
  disposeNavigation();
  app!.replaceChildren();
  document.querySelector('.engagement-overlay')?.remove();
  const route = currentRoute();
  const spec = pageSpecs[route];

  if (!spec) {
    navigate('homepage');
    return;
  }

  if (route === 'homepage') {
    document.title = website.name;
    renderHomepage(spec);
  } else if (route.endsWith('_projects')) {
    renderProjectPage(route, spec);
  } else {
    renderSimplePage(route, spec);
  }
}

window.addEventListener('popstate', render);
window.addEventListener('hashchange', render);
render();
