---
description: How to deploy (push) the website to GitHub Pages
---

# Deploy to GitHub Pages

**IMPORTANT**: Never use raw `git add/commit/push` to deploy this project. The site is served from the `docs/` directory, which must be rebuilt from the Next.js static export before each push.

## Steps

// turbo-all

1. Stop the dev server if running (port 3000 must be free for the build)

2. Run the deploy script:
```bash
bash "/Volumes/Macbook Pro_Work/05_WEB/gaston-ibarroule-portfolio/scripts/push-to-github.command"
```

This script automatically:
- Builds the Next.js app (`npm run build`)
- Syncs the static export (`webapp/out/`) into `docs/`
- Preserves `CNAME` and `.nojekyll` files
- Runs `scripts/backup.sh` (mandatory backup before push)
- Commits with a timestamped message
- Pushes to `origin/main`

## Notes

- GitHub Pages serves from the `docs/` folder on `main` branch
- The hidden `.push_to_github.command` in the repo root is a legacy script — do NOT use it
- If you need to commit source changes separately (without deploying), use a regular `git commit` but do NOT `git push` — the push must always go through the deploy script to keep `docs/` in sync
