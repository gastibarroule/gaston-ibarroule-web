#!/bin/bash
# ─────────────────────────────────────────────────────────────
# update-embed-manifest.sh
# Updates docs/downloads/update.json with a new Sonidata Embed
# version, signatures, and artifact URLs.
#
# Usage:
#   ./scripts/update-embed-manifest.sh <version> <mac_sig_file> <win_sig_file> [notes]
#
# Example:
#   ./scripts/update-embed-manifest.sh 1.4.0 \
#     ~/path/to/Sonidata_Embed.app.tar.gz.sig \
#     ~/path/to/Sonidata_Embed_x64-setup.nsis.zip.sig \
#     "New features and bug fixes"
# ─────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
MANIFEST="$REPO_ROOT/docs/downloads/update.json"

if [ $# -lt 3 ]; then
  echo "Usage: $0 <version> <mac_sig_file> <win_sig_file> [notes]"
  exit 1
fi

VERSION="$1"
MAC_SIG="$(cat "$2")"
WIN_SIG="$(cat "$3")"
NOTES="${4:-Sonidata Embed v${VERSION}}"
PUB_DATE="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"

BASE_URL="https://gastibarroule.com/downloads"

cat > "$MANIFEST" <<EOF
{
  "version": "${VERSION}",
  "notes": "${NOTES}",
  "pub_date": "${PUB_DATE}",
  "platforms": {
    "darwin-universal": {
      "url": "${BASE_URL}/Sonidata_Embed_${VERSION}_universal.app.tar.gz",
      "signature": "${MAC_SIG}"
    },
    "windows-x86_64": {
      "url": "${BASE_URL}/Sonidata_Embed_${VERSION}_x64-setup.nsis.zip",
      "signature": "${WIN_SIG}"
    }
  }
}
EOF

echo "✅ Updated $MANIFEST → v${VERSION}"
echo "   pub_date: ${PUB_DATE}"
echo "   macOS sig: ${MAC_SIG:0:20}…"
echo "   Windows sig: ${WIN_SIG:0:20}…"
