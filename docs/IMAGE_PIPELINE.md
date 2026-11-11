# Image pipeline and format limits

Updated 2026-11-11.

## Goals

- Preserve phone-photo originals in Git under `content/media/originals/`.
- Publish optimized derivatives under `public/media/` during `npm run build`.
- Strip GPS and camera EXIF from public files.
- Support intentional cover crops and full-frame technical images.

## Supported upload formats

| Format | Pages CMS upload | Public pipeline |
|---|---|---|
| JPEG / JPG | Yes | Yes |
| PNG | Yes | Yes (emitted primarily as JPEG/WebP derivatives) |
| WebP | Yes | Yes |
| GIF | Yes | Yes (still-frame friendly; prefer JPEG/WebP for photos) |
| HEIC / HEIF | No | Refused — convert on the phone or Mac Photos to JPEG before upload |

iPhone photos often default to HEIC. Before uploading in Pages CMS, export or convert to JPEG. Validation fails if content references `.heic` / `.heif`.

## Authoring fields

Each image object may include:

- `src` — public path written by Pages CMS (`/media/<file>.jpg`)
- `alt` — required
- `caption` — optional
- `fit` — `cover` (crop) or `contain` (full frame)
- `focal_x` / `focal_y` — 0–100 percentages for `object-position`

Defaults in the layout renderer: `cover_image` uses `cover`; `image_2` and `image_3` use `contain`.

## Build steps

```bash
npm run optimize-images   # originals → public/media
npm run validate-content  # schema + references
npm run build             # optimize + validate + tsc + vite
```

GitHub Pages deploy runs `npm run build`, so CMS saves that reach `master` regenerate derivatives before publish.
