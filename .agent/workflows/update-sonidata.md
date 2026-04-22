---
description: How to update the Sonidata website with new documentation, desktop binaries, and version numbers.
---

# Update Sonidata Website

This workflow describes the process for syncing the latest Sonidata documentation and desktop binaries from the source project (`METASOUND/04_WEBSITE`) into the portfolio website repository.

## Steps

// turbo-all

1. **Copy Binaries and Update Manifest**
   The latest built artifacts for the Sonidata Embed application need to be copied into the website's public downloads directory.
   ```bash
   cp -v "/Volumes/Macbook Pro_Work/01_PROJECTS/METASOUND/04_WEBSITE/assets/Sonidata_Embed_"*"_universal.dmg" "webapp/public/downloads/"
   cp -v "/Volumes/Macbook Pro_Work/01_PROJECTS/METASOUND/04_WEBSITE/assets/downloads/Sonidata_Embed_"*"_universal.app.tar.gz" "webapp/public/downloads/"
   cp -v "/Volumes/Macbook Pro_Work/01_PROJECTS/METASOUND/04_WEBSITE/assets/downloads/update.json" "webapp/public/downloads/"
   ```

2. **Update the Download UI Version and What's New**
   Use your code editing tools (or `sed`) to update `webapp/src/app/sonidata/page.tsx`.
   - Update the macOS download `href` to point to the newest DMG version you just copied.
   - Update the "What's new in vX.X.X" text string if a new major release occurred.
   - Update the `WHATS_NEW_FEATURES` array in the component to reflect the actual new features of the release (e.g., Cloud Sync, Auto-Updater, etc.).

3. **Update the iOS App Auto-Update JSON (`embed-info.json`)**
   The Sonidata iOS app fetches Embed release info from a hosted JSON file to trigger the desktop companion popup. You must update `webapp/public/downloads/embed-info.json` with the new version, the matching `download_url`, and the array of new features so the iOS app alerts users correctly without requiring an iOS app update.

4. **Sync the Documentation**
   The Sonidata support documentation on the website is powered by `webapp/src/data/site.json`. Instead of manually copying JSON, you can run the provided node script to automatically parse the latest `SONIDATA_DOCUMENTATION.md` and `SONIDATA_EMBED_DOCUMENTATION.md` files from the source project and inject them directly into the JSON.
   ```bash
   node webapp/scripts/updateDocs.js
   ```

5. **Deploy the Changes**
   Trigger the standard deployment workflow to build the Next.js static site and push the new artifacts to GitHub Pages.
   ```bash
   source ~/.zshrc && bash "/Volumes/Macbook Pro_Work/05_WEB/gaston-ibarroule-portfolio/scripts/push-to-github.command"
   ```
