/**
 * File: scripts/check-publishing.mjs — static checks for publishing rules.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  return String(value ?? '');
}

function loadDir(dir) {
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.yaml'))
    .map((name) => {
      const data = yaml.load(fs.readFileSync(path.join(dir, name), 'utf8'));
      if (data && typeof data === 'object' && 'date' in data) {
        data.date = normalizeDate(data.date);
      }
      return data;
    });
}

const validate = spawnSync(process.execPath, [path.join(root, 'scripts/validate-content.mjs')], {
  encoding: 'utf8',
});
if (validate.status !== 0) {
  console.error(validate.stdout || validate.stderr);
  process.exit(1);
}

const projects = loadDir(path.join(root, 'content/projects'));
const posts = loadDir(path.join(root, 'content/posts'));
const published = posts.filter((post) => !post.draft);

const sample = projects.find((project) => project.id === 'sample-layout-demo');
if (!sample) errors.push('missing sample-layout-demo project');
if (sample && !sample.disciplines.includes('robotics')) errors.push('SAMPLE project must appear under robotics');

const draft = posts.find((post) => post.id === 'sample-post-draft');
if (!draft?.draft) errors.push('sample-post-draft must be draft: true');
if (published.some((post) => post.id === 'sample-post-draft')) {
  errors.push('draft leaked into published set');
}

const featured = published.find((post) => post.id === sample?.featured_post);
if (!featured) errors.push('featured SAMPLE post must be published');
if (featured && !featured.related_projects.includes('sample-layout-demo')) {
  errors.push('featured post must relate to SAMPLE project');
}

const projectPosts = published
  .filter((post) => post.related_projects.includes('sample-layout-demo'))
  .sort((a, b) => b.date.localeCompare(a.date));
if (projectPosts.length < 2) errors.push('expected at least two published SAMPLE posts');
if (projectPosts[0]?.id !== 'sample-post-featured') {
  errors.push('newest SAMPLE post should be sample-post-featured');
}

const pagesYml = fs.readFileSync(path.join(root, '.pages.yml'), 'utf8');
for (const token of ['type: collection', 'name: projects', 'name: posts', 'discipline_layout', 'related_projects', 'featured_post']) {
  if (!pagesYml.includes(token)) errors.push(`.pages.yml missing ${token}`);
}

const media = path.join(root, 'public/media');
if (!fs.existsSync(path.join(media, 'sample-cover.jpg'))) {
  errors.push('public/media/sample-cover.jpg missing — run npm run optimize-images');
}
if (!fs.existsSync(path.join(media, 'manifest.json'))) {
  errors.push('public/media/manifest.json missing');
}

const layouts = ['pattern_a', 'pattern_b', 'pattern_c', 'pattern_d', 'pattern_e'];
const css = fs.readFileSync(path.join(root, 'src/styles.css'), 'utf8');
for (const layout of layouts) {
  if (!css.includes(`.post-layout--${layout}`)) errors.push(`styles missing ${layout}`);
}

if (errors.length) {
  console.error('Publishing checks failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log('Publishing checks passed:', {
  projects: projects.length,
  posts: posts.length,
  published: published.length,
  sample_project_posts: projectPosts.map((post) => post.id),
});
