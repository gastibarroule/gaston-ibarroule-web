#!/usr/bin/env bash

set -euo pipefail

# compress-image.sh — Resize (downscale) and compress an image for web
# Requires ffmpeg and ffprobe
# Usage:
#   scripts/compress-image.sh INPUT OUTPUT [MAX_WIDTH] [QUALITY]
# Defaults: MAX_WIDTH=1600, QUALITY=4 (lower is better 1..31)

if ! command -v ffmpeg >/dev/null 2>&1 || ! command -v ffprobe >/dev/null 2>&1; then
  echo "Error: ffmpeg/ffprobe not found. Install via 'brew install ffmpeg' (macOS)." >&2
  exit 1
fi

INPUT=${1:-}
OUTPUT=${2:-}
MAX_WIDTH=${3:-1600}
QUALITY=${4:-4}

if [[ -z "${INPUT}" || -z "${OUTPUT}" ]]; then
  echo "Usage: $0 INPUT OUTPUT [MAX_WIDTH] [QUALITY]" >&2
  exit 1
fi
if [[ ! -f "${INPUT}" ]]; then
  echo "Error: INPUT not found: ${INPUT}" >&2
  exit 1
fi

mkdir -p "$(dirname "${OUTPUT}")"

# Downscale if wider than MAX_WIDTH, keep aspect; compress to JPEG
ffmpeg -y -hide_banner -loglevel error -i "${INPUT}" \
  -vf "scale='min(iw,${MAX_WIDTH})':-2:flags=lanczos" \
  -q:v "${QUALITY}" -frames:v 1 "${OUTPUT}"

echo "Compressed: ${OUTPUT}"


