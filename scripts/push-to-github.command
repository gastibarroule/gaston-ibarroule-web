#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DOCS_DIR="$REPO_ROOT/docs"
WEBAPP_DIR="$REPO_ROOT/webapp"
OUT_DIR="$WEBAPP_DIR/out"

log() { echo "==> $*"; }

log "Push to GitHub workflow started"
cd "$REPO_ROOT"

# Build and static export
if [ -d "$WEBAPP_DIR" ]; then
  log "Building/exporting Next.js app (webapp)"
  cd "$WEBAPP_DIR"

  if [ ! -d "node_modules" ]; then
    log "Installing dependencies (node_modules missing)"
    npm install
  else
    log "Dependencies present (webapp/node_modules)"
  fi

  log "Running: npm run build"
  if ! npm run build; then
    echo "Error: npm run build failed." >&2
    exit 1
  fi

  # With next.config.ts output: 'export', Next should emit webapp/out after build.
  if [ ! -d "$OUT_DIR" ]; then
    log "webapp/out not found after build; trying 'npm run export' (configured export script)"
    if ! npm run export; then
      log "Trying 'npx next export' fallback"
      if ! npx next export; then
        echo "Error: Static export failed; no 'webapp/out' produced." >&2
        exit 1
      fi
    fi
  fi
else
  echo "Warning: '$WEBAPP_DIR' not found; skipping build/export." >&2
fi

# Ensure docs dir
mkdir -p "$DOCS_DIR"

# Preserve CNAME (and restore after sync)
CNAME_SRC=""
if [ -f "$DOCS_DIR/CNAME" ]; then
  CNAME_SRC="$DOCS_DIR/CNAME"
elif [ -f "$REPO_ROOT/CNAME" ]; then
  CNAME_SRC="$REPO_ROOT/CNAME"
fi

# Rsync export to docs, preserving CNAME and .nojekyll
if [ -d "$OUT_DIR" ]; then
  log "Syncing webapp/out -> docs (preserve CNAME and .nojekyll)"
  rsync -av --delete \
    --exclude 'CNAME' \
    --exclude '.nojekyll' \
    "$OUT_DIR/" "$DOCS_DIR/"
else
  echo "Warning: '$OUT_DIR' does not exist; skipping sync to docs." >&2
fi

# Restore/ensure CNAME (avoid copying onto itself)
if [ -n "${CNAME_SRC:-}" ] && [ -f "$CNAME_SRC" ]; then
  if [ ! -f "$DOCS_DIR/CNAME" ] || ! cmp -s "$CNAME_SRC" "$DOCS_DIR/CNAME"; then
    cp "$CNAME_SRC" "$DOCS_DIR/CNAME"
  fi
fi

# Ensure .nojekyll exists as required for Pages
touch "$DOCS_DIR/.nojekyll"

# Mandatory backup before push (run non-interactively)
log "Running mandatory backup before push"
cd "$REPO_ROOT"
if [ -f "$REPO_ROOT/scripts/backup.sh" ]; then
  bash "$REPO_ROOT/scripts/backup.sh"
else
  echo "Error: scripts/backup.sh not found under scripts/. Aborting." >&2
  exit 1
fi

# Commit and push
log "Committing and pushing to GitHub"
cd "$REPO_ROOT"
git add -A

if git diff --cached --quiet; then
  log "No changes to commit"
else
  TS="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
  git commit -m "build: export static site to docs (backup completed) [$TS]"
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"
log "Pushing to origin/$current_branch"
git push origin "$current_branch"

log "Done."

echo ""
echo "Local verification tips:"
echo "  - Serve static build: npx http-server docs -p 3000 -e html -c-1"
echo "  - Dev server: cd webapp && npm run dev:3001"
