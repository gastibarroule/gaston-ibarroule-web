#!/bin/zsh

# Double-click to run the Next.js webapp locally
# Prefers port 3000; falls back to 3001 if 3000 is busy

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR/webapp"

echo "[Webapp] Using repo at: $SCRIPT_DIR"
echo "[Webapp] Working dir: $(pwd)"

if [ ! -d node_modules ]; then
  echo "[Webapp] Installing dependencies (first run)..."
  npm install --no-audit --no-fund
fi

PORT=3000
if lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "[Webapp] Port ${PORT} is busy. Using 3001 instead."
  PORT=3001
fi

echo "[Webapp] Starting dev server on http://localhost:${PORT}"
open "http://localhost:${PORT}" >/dev/null 2>&1 || true

npm run dev -- -p ${PORT} || {
  echo "[Webapp] Failed to start on port ${PORT}.";
  read "?Press Enter to close..."
  exit 1
}

read "?Press Enter to close..."


