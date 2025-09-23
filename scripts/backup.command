#!/usr/bin/env bash

# Change to the directory where this script is located
cd "$(dirname "$0")"

# Execute the backup script
./backup.sh

# Pause so the user can see the output
echo ""
echo "Press any key to continue..."
read -n 1 -s
