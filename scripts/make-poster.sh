#!/usr/bin/env bash

set -euo pipefail

# make-poster.sh — Crop an image to poster aspect using the original width and top portion
# Default poster aspect is 4:5 (width:height). Output defaults to JPG.
# Requires: ffmpeg and ffprobe
#
# Usage:
#   scripts/make-poster.sh INPUT [OUTPUT] [ASPECT] [QUALITY] [MAX_WIDTH]
# Examples:
#   scripts/make-poster.sh /path/to/image.jpg webapp/public/posters/my-project.jpg 4:5 4 1400
#   scripts/make-poster.sh input.png   # -> input_poster.jpg next to input

if ! command -v ffmpeg >/dev/null 2>&1 || ! command_v_ffprobe=$(command -v ffprobe); then
  echo "Error: ffmpeg/ffprobe not found. Install via 'brew install ffmpeg' (macOS)." >&2
  exit 1
fi

INPUT=${1:-}
OUTPUT=${2:-}
ASPECT=${3:-4:5}
QUALITY=${4:-4}     # ffmpeg MJPEG quality (lower is better, 1..31)
MAX_WIDTH=${5:-0}   # 0 = no scaling, otherwise scale down if wider than this

if [[ -z "${INPUT}" ]]; then
  echo "Usage: $0 INPUT [OUTPUT] [ASPECT width:height]" >&2
  exit 1
fi

if [[ ! -f "${INPUT}" ]]; then
  echo "Error: INPUT not found: ${INPUT}" >&2
  exit 1
fi

# Parse aspect like 4:5 -> num=4 den=5
if [[ "${ASPECT}" =~ ^([0-9]+):([0-9]+)$ ]]; then
  NUM=${BASH_REMATCH[1]}
  DEN=${BASH_REMATCH[2]}
else
  echo "Error: ASPECT must be in width:height form, e.g., 4:5" >&2
  exit 1
fi

# Probe input dimensions
DIM=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "${INPUT}") || true
IW=${DIM%x*}
IH=${DIM#*x}

if [[ -z "${IW}" || -z "${IH}" ]]; then
  echo "Error: Could not read image dimensions via ffprobe." >&2
  exit 1
fi

# Compute required height = ceil(iw * DEN/NUM) without Python (portable awk)
REQUIRED_H=$(awk -v iw="$IW" -v num="$NUM" -v den="$DEN" 'BEGIN { printf("%d\n", int((iw*den + num - 1)/num)) }')

if (( REQUIRED_H > IH )); then
  echo "Error: Image is not tall enough to crop to aspect ${NUM}:${DEN} at original width." >&2
  echo "       Input: ${IW}x${IH}, required height: ${REQUIRED_H}." >&2
  echo "       Provide a taller image or pre-scale before cropping." >&2
  exit 1
fi

# Determine output path
if [[ -z "${OUTPUT}" ]]; then
  base="${INPUT%.*}"
  OUTPUT="${base}_poster.jpg"
fi

mkdir -p "$(dirname "${OUTPUT}")"

# Build filter: crop to required height at top; optionally scale if wider than MAX_WIDTH
VF="crop=iw:trunc(iw*${DEN}/${NUM}):0:0"
if [[ "${MAX_WIDTH}" != "0" ]]; then
  VF="${VF},scale='min(iw,${MAX_WIDTH})':-2:flags=lanczos"
fi

ffmpeg -y -hide_banner -loglevel error -i "${INPUT}" \
  -vf "${VF}" \
  -q:v "${QUALITY}" -frames:v 1 "${OUTPUT}"

echo "Wrote poster: ${OUTPUT}"


