#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
BACKUP_DIR="$REPO_ROOT/backups"
BUILD_DIR="$REPO_ROOT/docs"
WEBAPP_DIR="$REPO_ROOT/webapp"

if [ ! -d "$BUILD_DIR" ]; then
  echo "Error: build directory '$BUILD_DIR' not found. Ensure the site is exported to docs/." >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
TS="$(date -u +%Y%m%dT%H%M%SZ)"
ARCHIVE_PATH="$BACKUP_DIR/site-$TS.tar.gz"
WEBAPP_ARCHIVE_PATH="$BACKUP_DIR/webapp-full-$TS.tar.gz"

echo "Creating backup: $ARCHIVE_PATH"
tar -czf "$ARCHIVE_PATH" -C "$REPO_ROOT" docs
echo "Backup created at: $ARCHIVE_PATH"

if [ -d "$WEBAPP_DIR" ]; then
  echo "Creating webapp backup: $WEBAPP_ARCHIVE_PATH"
  tar -czf "$WEBAPP_ARCHIVE_PATH" -C "$REPO_ROOT" webapp
  echo "Webapp backup created at: $WEBAPP_ARCHIVE_PATH"
else
  echo "Warning: webapp directory '$WEBAPP_DIR' not found, skipping webapp backup." >&2
fi


