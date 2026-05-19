#!/bin/zsh

# Double-clickable launcher for the Content Manager Web UI
# Opens a visual admin panel at http://localhost:4000

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P)"
cd "$SCRIPT_DIR/cms"

echo ""
echo "  ✦  Content Manager Web UI"
echo "     Repo: $SCRIPT_DIR"
echo ""

if [ ! -d node_modules ]; then
  echo "  → Installing dependencies (first run)..."
  npm install --no-audit --no-fund
  echo ""
fi

# Check if port 4000 is already in use
PORT=4000
if lsof -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  echo "  ⚠  Port ${PORT} is already in use."
  echo "     Kill the existing process or set CMS_PORT to use a different port."
  read "?Press Enter to close..."
  exit 1
fi

echo "  → Starting server on http://localhost:${PORT}"
echo "  → Opening browser..."
echo ""

# Open browser after a short delay
(sleep 1 && open "http://localhost:${PORT}") &

# Run the server (blocks until Ctrl+C)
node server.js || {
  echo ""
  echo "  ✗  Server exited with an error."
  read "?Press Enter to close..."
  exit 1
}

read "?Press Enter to close..."
