#!/bin/zsh

# Navigate to the project directory
cd "$(dirname "$0")"

# Stage all changes
git add .

# Commit changes
git commit -m "Automated push from .command file"

# Push changes to GitHub
git push origin main
