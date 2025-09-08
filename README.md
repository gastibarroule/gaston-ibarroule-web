# Gaston Ibarroule – Web Portfolio (Next.js + GitHub Pages)

This repo is structured for a clean GitHub Pages workflow:
- `webapp/` — Next.js 15 App Router source for local development and edits
- `docs/` — Generated static output that GitHub Pages serves (keep `docs/CNAME`)

GitHub Pages should be configured to deploy from: Branch `main`, Folder `/docs`.

## Run locally

- Static export (what production serves):
```bash
npx http-server docs -p 3000 -e html -c-1
# http://localhost:3000
```

- Editable source app (Next.js dev server):
```bash
cd webapp
npm install
npm run dev -- -p 3001
# http://localhost:3001
```

## Edit content

- Projects: `webapp/src/data/projects.json`
- Site info (about/contact): `webapp/src/data/site.json`
- Gallery/poster images: `webapp/public/galleries/**` and `webapp/public/posters/**`

Optional: regenerate data by parsing the existing static export
```bash
cd webapp
npm run extract
```

## Build and export to `docs/`

1) Build + export the Next.js app
```bash
cd webapp
npm run build && npx next export
# (or) npm run export if configured
```

2) Sync the export to `docs/` (preserve custom domain)
```bash
# from repo root
rsync -av --delete --exclude CNAME webapp/out/ docs/
```

3) (Recommended) backup current state before overwriting `docs/`
```bash
./scripts/backup.sh
```
Backups appear under `backups/` as tar.gz archives (both `docs/` and full `webapp/`).

## Deploy (GitHub Pages)

- Repo Settings → Pages
  - Source: Deploy from a branch
  - Branch: `main`
  - Folder: `/docs`
- Custom domain: set to `www.gastibarroule.com` (must match `docs/CNAME`)

## File map (where to look)

- `webapp/src/app/layout.tsx` — Root layout and header/footer
- `webapp/src/app/page.tsx` — Home
- `webapp/src/app/about/page.tsx`, `webapp/src/app/contact/page.tsx`
- `webapp/src/app/projects/page.tsx` — Projects listing page
- `webapp/src/app/projects/ProjectsBrowser.tsx` — Year-grouped row scrollers
- `webapp/src/app/projects/[slug]/page.tsx` — Single project page
- `webapp/src/app/projects/ProjectGallery.tsx` — Horizontal gallery (desktop)
- `webapp/src/app/projects/ProjectGalleryStack.tsx` — Stacked gallery (mobile)
- `webapp/src/app/globals.css` — Global styles (Tailwind utilities + custom)

## Scrolling UX (projects)

- Native horizontal scroll with CSS snap (`snap-x snap-proximity`)
- Trackpad: vertical scroll passes to page; horizontal swipes move the row
- Mouse: vertical wheel converts to horizontal when hovering a row that can scroll (page vertical is blocked only then)

## Conventions / gotchas

- Favicon: keep only `webapp/public/favicon.ico` (do not create `webapp/src/app/favicon.ico`)
- Do not remove/rename `docs/` or `docs/CNAME`
- Next.js 15 App Router params: await `params` in server components
```ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // ...
}
```

## Scripts

- Backup (run at repo root):
```bash
./scripts/backup.sh
```
Creates `backups/site-<ts>.tar.gz` and `backups/webapp-full-<ts>.tar.gz`.

## Typical workflow

1) Edit data or components under `webapp/`
2) Preview at `http://localhost:3001`
3) Export and sync to `docs/`
4) Push to `main`; Pages updates after a short delay

---

Editing in Cursor? Jump to these files:
- `webapp/src/app/projects/ProjectsBrowser.tsx`
- `webapp/src/app/projects/[slug]/page.tsx`
- `webapp/src/data/projects.json`
- `webapp/src/data/site.json`
- `webapp/src/app/globals.css`
