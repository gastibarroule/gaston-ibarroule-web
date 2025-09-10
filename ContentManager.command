#!/bin/zsh

# Double-clickable launcher for the Content Manager
# Works from any location; navigates to this repo and starts the CLI

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR/webapp"

echo "[Content Manager] Using repo at: $SCRIPT_DIR"
echo "[Content Manager] Working dir: $(pwd)"

if [ ! -d node_modules ]; then
  echo "[Content Manager] Installing dependencies (first run)..."
  npm install --no-audit --no-fund
fi

echo "[Content Manager] Starting interactive editor..."
npm run content || {
  echo "[Content Manager] The content tool exited with an error.";
  echo "[Content Manager] You can run it manually: cd '$SCRIPT_DIR/webapp' && npm run content";
  read "?Press Enter to close..."
  exit 1
}

echo "[Content Manager] Done."
read "?Press Enter to close..."


