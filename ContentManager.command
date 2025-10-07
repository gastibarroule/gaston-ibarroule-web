#!/bin/zsh

# Double-clickable launcher for the Content Manager
# Works from any location; navigates to this repo and starts the CLI

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR/webapp"

echo "[Content Manager] Using repo at: $SCRIPT_DIR"
echo "[Content Manager] Working dir: $(pwd)"
echo "[Content Manager] Tip: You can now import local video files into the site."
echo "[Content Manager] In the menu, choose: 'Import video to a project' to copy a file into webapp/public/videos and update projects.json."
echo "[Content Manager] Example source:"
echo "[Content Manager]   /Volumes/Macbook Pro_Work/05_WEB/source/Zalando English Videos/Zalando_Boards_Consumption_34s.mp4"
echo "[Content Manager] New: You can also paste full EMBED HTML (e.g., Instagram blockquote) for a project's Featured media."
echo "[Content Manager] In 'Add project': when prompted for Featured media, choose 'Embed HTML (paste)'."
echo "[Content Manager] In 'Edit project': Featured media → 'Replace with Embed HTML (paste)'."

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
