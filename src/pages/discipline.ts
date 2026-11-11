/**
 * File: src/pages/discipline.ts — discipline index of projects via featured posts.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import { featuredPostForProject, projectsForDiscipline } from '../content/catalog';
import type { Discipline } from '../content/types';
import { createPostLayout } from '../layouts/post-layout';
import type { Dict } from '../types';

export interface DisciplinePageDeps {
  color: (name: string) => string;
  applyTypography: (element: HTMLElement, styleName: string) => void;
  siteHeader: (showBrand?: boolean) => HTMLElement;
  siteFooter: () => HTMLElement;
  websiteName: string;
}

/**
 * Purpose: Render Robotics/Software/Design indexes from shared project records.
 * Design: Each project uses its selected layout and featured published post; click opens the project.
 * Workflow: Called for *_projects routes.
 * Data Handoff: Appends the page into #app and sets document.title.
 */
export function renderDisciplinePage(
  app: HTMLElement,
  discipline: Discipline,
  spec: Dict,
  deps: DisciplinePageDeps,
): void {
  const page = document.createElement('main');
  page.className = 'page project-page discipline-page';
  page.style.background = deps.color(spec.background.color);

  const content = document.createElement('section');
  content.className = 'project-content publishing-content';

  const title = document.createElement('h1');
  title.textContent = spec.hero.title.value;
  title.style.color = deps.color(spec.hero.title.color);
  deps.applyTypography(title, spec.hero.title.style);

  const subtitle = document.createElement('p');
  subtitle.className = 'project-subtitle';
  subtitle.textContent = spec.hero.subtitle?.value ?? '';
  subtitle.style.color = deps.color(spec.hero.subtitle?.color ?? spec.hero.title.color);

  const list = document.createElement('div');
  list.className = 'discipline-project-list';

  const projects = projectsForDiscipline(discipline);
  if (!projects.length) {
    const empty = document.createElement('p');
    empty.className = 'publishing-empty';
    empty.textContent = 'Projects for this discipline will appear here when published.';
    list.append(empty);
  }

  for (const project of projects) {
    const wrapper = document.createElement('section');
    wrapper.className = 'discipline-project';
    wrapper.id = `project-${project.id}`;

    const label = document.createElement('p');
    label.className = 'discipline-project-label';
    label.textContent = project.sample ? `SAMPLE · ${project.name}` : project.name;

    const featured = featuredPostForProject(project);
    if (featured) {
      const layout = createPostLayout({
        post: featured,
        layout: project.discipline_layout,
        textMode: 'excerpt',
        projectHref: `#/project/${project.id}`,
        projectName: project.name,
        showTitle: true,
        headingLevel: 2,
      });
      wrapper.append(label, layout);
    } else {
      const fallback = document.createElement('a');
      fallback.className = 'discipline-project-fallback';
      fallback.href = `#/project/${project.id}`;
      fallback.innerHTML = `<h2>${escapeText(project.name)}</h2><p>No published featured post yet. Open the project page for updates.</p>`;
      wrapper.append(label, fallback);
    }
    list.append(wrapper);
  }

  content.append(title, subtitle, list);
  page.append(deps.siteHeader(), content, deps.siteFooter());
  app.append(page);
  document.title = `${spec.hero.title.value} — ${deps.websiteName}`;
}

function escapeText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
