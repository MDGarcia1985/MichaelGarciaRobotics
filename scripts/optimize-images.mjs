/**
 * File: scripts/optimize-images.mjs — preserve originals and emit public derivatives.
 * Owner: Michael Garcia; contributor: Cursor agent.
 * Contact: michael@mandedesign.studio. License: Proprietary; see LICENSE at the repository root.
 * Constraint: Strip metadata (including GPS); refuse HEIC in the public pipeline.
 * Related decisions: DEV-2026-11-11-001.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const originalsDir = path.join(root, 'content/media/originals');
const publicDir = path.join(root, 'public/media');
const widths = [480, 800, 1200, 1600];
const allowed = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

fs.mkdirSync(publicDir, { recursive: true });
fs.mkdirSync(originalsDir, { recursive: true });

/**
 * Purpose: Walk originals and write orientation-corrected, compressed public derivatives.
 * Design: Originals stay untouched under content/media/originals; public files omit EXIF/GPS.
 * Workflow: Runs during npm run build before Vite copies public/ into dist/.
 * Data Handoff: Writes public/media/* and public/media/manifest.json.
 */
async function main() {
  const files = fs.existsSync(originalsDir)
    ? fs.readdirSync(originalsDir).filter((name) => !name.startsWith('.'))
    : [];
  const manifest = { generated_at: new Date().toISOString(), images: {} };

  for (const name of files) {
    const ext = path.extname(name).toLowerCase();
    const sourcePath = path.join(originalsDir, name);
    if (!fs.statSync(sourcePath).isFile()) continue;

    if (ext === '.heic' || ext === '.heif') {
      console.warn(`Skipping HEIC/HEIF ${name}: convert to JPEG/PNG/WebP before publish.`);
      continue;
    }
    if (!allowed.has(ext)) {
      console.warn(`Skipping unsupported ${name}. Allowed: JPEG, PNG, WebP, GIF.`);
      continue;
    }

    const base = path.basename(name, path.extname(name));
    const pipeline = sharp(sourcePath, { failOn: 'none' }).rotate();
    const meta = await pipeline.metadata();
    const variants = [];

    // CMS stores output paths like /media/<filename>; emit that basename as optimized JPEG.
    const cmsPublicName = `${base}.jpg`;
    const cmsPublicPath = path.join(publicDir, cmsPublicName);
    await pipeline
      .clone()
      .resize({ width: Math.min(1600, meta.width || 1600), withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(cmsPublicPath);
    // sharp strips metadata by default when not calling withMetadata().
    variants.push({ path: `/media/${cmsPublicName}`, width: 'primary', format: 'jpeg' });

    // If the uploaded filename used another extension, also publish under that name for exact CMS paths.
    const exactName = name.replace(/\.jpeg$/i, '.jpg');
    if (exactName.toLowerCase() !== cmsPublicName.toLowerCase()) {
      const exactPath = path.join(publicDir, exactName);
      await pipeline
        .clone()
        .resize({ width: Math.min(1600, meta.width || 1600), withoutEnlargement: true })
        .jpeg({ quality: 78, mozjpeg: true })
        .toFile(exactPath.replace(/\.[^.]+$/, '.jpg'));
      // Keep a same-extension alias only for png/webp/gif references by converting to jpeg basename in content.
    }

    for (const width of widths) {
      if (meta.width && width > meta.width) continue;
      const outName = `${base}-w${width}.webp`;
      await pipeline
        .clone()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(path.join(publicDir, outName));
      variants.push({ path: `/media/${outName}`, width, format: 'webp' });
    }

    manifest.images[name] = {
      original: `content/media/originals/${name}`,
      public: `/media/${cmsPublicName}`,
      width: meta.width ?? null,
      height: meta.height ?? null,
      variants,
      note: 'GPS/EXIF stripped from public derivatives; originals preserved in content/media/originals.',
    };
    console.log(`Optimized ${name} → /media/${cmsPublicName}`);
  }

  fs.writeFileSync(path.join(publicDir, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${Object.keys(manifest.images).length} optimized image set(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
