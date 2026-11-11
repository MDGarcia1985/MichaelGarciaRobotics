/**
 * File: scripts/validate-content.mjs — build-time project/post integrity checks.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Related decisions: DEV-2026-11-11-001.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const projectsDir = path.join(root, 'content/projects');
const postsDir = path.join(root, 'content/posts');

const DISCIPLINES = new Set(['robotics', 'software', 'design']);
const LAYOUTS = new Set(['pattern_a', 'pattern_b', 'pattern_c', 'pattern_d', 'pattern_e']);
const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];

function loadYamlDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith('.yaml') || name.endsWith('.yml'))
    .map((name) => {
      const filePath = path.join(dir, name);
      const data = yaml.load(fs.readFileSync(filePath, 'utf8'));
      return { filePath, name, data };
    });
}

function requireString(value, label, filePath) {
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${filePath}: missing ${label}`);
    return false;
  }
  return true;
}

/** js-yaml may parse bare YYYY-MM-DD values as Date objects. */
function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.valueOf())) {
    return value.toISOString().slice(0, 10);
  }
  if (typeof value === 'string') return value.trim();
  return value;
}

const projectFiles = loadYamlDir(projectsDir);
const postFiles = loadYamlDir(postsDir);
const projectsById = new Map();
const postsById = new Map();

for (const entry of projectFiles) {
  const project = entry.data ?? {};
  if (!requireString(project.id, 'id', entry.filePath)) continue;
  if (!ID_PATTERN.test(project.id)) errors.push(`${entry.filePath}: id must be kebab-case`);
  if (projectsById.has(project.id)) errors.push(`${entry.filePath}: duplicate project id ${project.id}`);
  projectsById.set(project.id, project);
  if (!requireString(project.name, 'name', entry.filePath)) continue;
  if (!Array.isArray(project.disciplines) || !project.disciplines.length) {
    errors.push(`${entry.filePath}: disciplines must be a non-empty list`);
  } else {
    for (const discipline of project.disciplines) {
      if (!DISCIPLINES.has(discipline)) {
        errors.push(`${entry.filePath}: invalid discipline ${discipline}`);
      }
    }
  }
  if (typeof project.display_order !== 'number') {
    errors.push(`${entry.filePath}: display_order must be a number`);
  }
  if (!LAYOUTS.has(project.discipline_layout)) {
    errors.push(`${entry.filePath}: discipline_layout must be one of ${[...LAYOUTS].join(', ')}`);
  }
}

for (const entry of postFiles) {
  const post = entry.data ?? {};
  if (!requireString(post.id, 'id', entry.filePath)) continue;
  if (!ID_PATTERN.test(post.id)) errors.push(`${entry.filePath}: id must be kebab-case`);
  if (postsById.has(post.id)) errors.push(`${entry.filePath}: duplicate post id ${post.id}`);
  postsById.set(post.id, post);
  requireString(post.title, 'title', entry.filePath);
  requireString(post.excerpt, 'excerpt', entry.filePath);
  requireString(post.body, 'body', entry.filePath);
  post.date = normalizeDate(post.date);
  requireString(post.date, 'date', entry.filePath);
  if (post.date && !/^\d{4}-\d{2}-\d{2}$/.test(post.date)) {
    errors.push(`${entry.filePath}: date must be YYYY-MM-DD`);
  }
  if (typeof post.draft !== 'boolean') {
    errors.push(`${entry.filePath}: draft must be boolean`);
  }
  if (!Array.isArray(post.related_projects)) {
    errors.push(`${entry.filePath}: related_projects must be a list`);
  } else {
    for (const projectId of post.related_projects) {
      if (!projectsById.has(projectId)) {
        errors.push(`${entry.filePath}: related_projects references unknown project ${projectId}`);
      }
    }
  }
  for (const field of ['cover_image', 'image_2', 'image_3']) {
    const image = post[field];
    if (image == null) continue;
    if (typeof image !== 'object') {
      errors.push(`${entry.filePath}: ${field} must be an object`);
      continue;
    }
    if (!requireString(image.src, `${field}.src`, entry.filePath)) continue;
    if (!requireString(image.alt, `${field}.alt`, entry.filePath)) continue;
    if (/\.heic$/i.test(image.src) || /\.heif$/i.test(image.src)) {
      errors.push(`${entry.filePath}: ${field} uses HEIC/HEIF — convert to JPEG/PNG/WebP before publish`);
    }
    if (image.fit && !['cover', 'contain'].includes(image.fit)) {
      errors.push(`${entry.filePath}: ${field}.fit must be cover or contain`);
    }
    for (const axis of ['focal_x', 'focal_y']) {
      if (image[axis] == null) continue;
      if (typeof image[axis] !== 'number' || image[axis] < 0 || image[axis] > 100) {
        errors.push(`${entry.filePath}: ${field}.${axis} must be 0–100`);
      }
    }
  }
}

for (const [projectId, project] of projectsById) {
  if (!project.featured_post) continue;
  const featured = postsById.get(project.featured_post);
  if (!featured) {
    errors.push(`project ${projectId}: featured_post ${project.featured_post} does not exist`);
    continue;
  }
  if (!Array.isArray(featured.related_projects) || !featured.related_projects.includes(projectId)) {
    errors.push(`project ${projectId}: featured_post ${project.featured_post} must list this project in related_projects`);
  }
}

if (errors.length) {
  console.error('Content validation failed:');
  for (const error of errors) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`Validated ${projectsById.size} projects and ${postsById.size} posts.`);
