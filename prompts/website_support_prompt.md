# MetaSound App Store Support Page Generation Prompt

**Role**: You are an expert web developer and UI/UX designer.

**Task**: Create a complete, single-page professional Support Page for an iOS application called **MetaSound**. This page will be used as the official Support URL for the Apple App Store submission.

## App Context (from KNOWLEDGE.md)
MetaSound is a native iOS SwiftUI app for professional sound recordists. 
Features include:
1. **Record**: High-quality audio (WAV 48kHz/24bit, WAV 44.1kHz/16bit, or M4A).
2. **Tag**: Rich metadata using the Universal Category System (UCS v8.2).
3. **Rename & Organize**: Auto-rename to UCS-compliant formats and auto-organize into folders.
4. **Browse & Export**: List/folder views, batch editing, and export as ZIP (audio + photos + CSV).
5. **Backups**: iCloud Drive, Google Drive, Dropbox.
6. **Voice Slate**: On-device speech-to-text (WhisperKit) to dictate the FX Name.
7. **Photo Attach & Location**: Associate a photo and GPS location with each recording.

## Requirements for the Support Page:
1. **Design Aesthetics**: Use a modern, dark-mode premium design (glassmorphism, subtle gradients, clean typography like Inter or Roboto). It must look highly professional and trustworthy to satisfy Apple's App Store Review Guidelines.
2. **Hero Section**: A crisp title ("MetaSound Support"), a brief subtitle explaining what the app does, and a contact button.
3. **FAQ Section**: Include the following common questions:
   - *How do I change recording quality?* (Answer: Go to Settings Tab > Audio Quality)
   - *Where are my files backed up?* (Answer: You can enable iCloud, Google Drive, or Dropbox in Settings > Cloud Sync)
   - *How does Voice Slate work?* (Answer: Tap the mic icon next to the FX Name field to dictate via on-device speech-to-text)
   - *How do I export my recordings?* (Answer: In the Recordings or Folders view, select files, then tap the Share icon. In Settings, you can also Export all metadata and audio as a ZIP archive)
4. **Contact Form / Email Link**: A clear way for users to reach out for support (e.g., a simple form UI or a `mailto:` link to support@metasoundapp.com).
5. **Footer**: Include standard links like "Privacy Policy", "Terms of Service", and copyright info.

## Technical Requirements:
- Use **HTML, CSS (Vanilla), and JavaScript**.
- Ensure the page is **fully scalable and mobile-responsive** (it will be viewed frequently from iPhones).
- All CSS and JS can be inline or in separate standard files, but ensure the code is ready to be hosted immediately.
- Do not use bloated frameworks unless specifically requested; prefer clean, maintainable vanilla code.
