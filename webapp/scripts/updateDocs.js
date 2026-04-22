const fs = require('fs');

function parseMarkdownToDocs(mdStr, iconsMap, defaultIcon) {
  const lines = mdStr.split('\n');
  const docs = [];
  let currentDoc = null;
  let currentBlock = null;

  function pushBlock() {
    if (currentBlock && currentDoc) {
      currentDoc.content.push(currentBlock);
    }
    currentBlock = null;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (currentBlock && currentBlock.type === 'paragraph') {
        pushBlock();
      }
      continue;
    }

    if (line.startsWith('## ')) {
      pushBlock();
      let title = line.replace(/^##\s*/, '').trim();
      // Remove *(New in Build 13)* type of strings
      title = title.replace(/\*\(New.*?\)\*/g, '').trim();

      // We skip sections that aren't documentation
      if (title.toLowerCase().includes('what is sonidata') ||
          title.toLowerCase() === 'contact & support' ||
          title.toLowerCase() === 'changelog') {
        currentDoc = null;
        continue;
      }

      let id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      if (id.includes('embed')) id = 'sonidata-embed';
      if (id.includes('free-vs-pro')) id = 'free-vs-pro';

      currentDoc = {
        id,
        title,
        icon: iconsMap[id] || defaultIcon,
        content: []
      };
      docs.push(currentDoc);
    } else if (!currentDoc) {
      continue; // Skip frontmatter or unassigned lines
    } else if (line.startsWith('### ')) {
      pushBlock();
      currentBlock = { type: 'heading', text: line.replace('### ', '').trim() };
    } else if (line.startsWith('> **Tip**:') || line.startsWith('> **Note**:') || line.startsWith('> **Important**:')) {
      pushBlock();
      currentBlock = { type: 'tip', text: line.replace(/^> \*\*[^\*]+\*\*:?\s*/, '').trim() };
    } else if (line.startsWith('> ')) {
      if (currentBlock && currentBlock.type === 'tip') {
        currentBlock.text += " " + line.replace(/^>\s*/, '').trim();
      } else {
        pushBlock();
        currentBlock = { type: 'tip', text: line.replace(/^>\s*/, '').trim() };
      }
    } else if (line.match(/^\d+\.\s/)) {
      if (currentBlock && currentBlock.type === 'steps') {
        currentBlock.items.push(line.replace(/^\d+\.\s*/, '').trim());
      } else {
        pushBlock();
        currentBlock = { type: 'steps', items: [line.replace(/^\d+\.\s*/, '').trim()] };
      }
    } else if (line.startsWith('- ')) {
      // Treat list items as steps for simplicity if they aren't part of a table
      if (currentBlock && currentBlock.type === 'steps') {
        currentBlock.items.push(line.replace(/^- \s*/, '').trim());
      } else {
        pushBlock();
        currentBlock = { type: 'steps', items: [line.replace(/^- \s*/, '').trim()] };
      }
    } else if (line.startsWith('|')) {
      if (line.match(/^\|[-\s\|:]+\|$/)) continue; // Separator
      const cells = line.split('|').filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1).map(c => c.trim());
      if (currentBlock && currentBlock.type === 'table') {
        if (!currentBlock.headers) {
          currentBlock.headers = cells;
        } else {
          currentBlock.rows.push(cells);
        }
      } else {
        pushBlock();
        currentBlock = { type: 'table', headers: cells, rows: [] };
      }
    } else if (line.startsWith('```')) {
      if (currentBlock && currentBlock.type === 'code') {
        pushBlock();
      } else {
        pushBlock();
        currentBlock = { type: 'code', text: '' };
      }
    } else {
      if (currentBlock && currentBlock.type === 'code') {
        currentBlock.text += (currentBlock.text ? '\n' : '') + line;
      } else if (currentBlock && currentBlock.type === 'paragraph') {
        currentBlock.text += " " + line;
      } else {
        pushBlock();
        currentBlock = { type: 'paragraph', text: line };
      }
    }
  }
  pushBlock();
  return docs;
}

const iconsMap = {
  'recording': '🎙️',
  'tagging-metadata-the-naming-view': '🏷️',
  'voice-slate': '🎤',
  'siri-shortcuts-automation': '🤖',
  'location-tagging': '📍',
  'browsing-your-library': '📚',
  'folder-organization': '📁',
  'photo-attachments': '📸',
  'exporting-your-library': '📦',
  'importing-audio-from-other-apps': '📥',
  'free-vs-pro': '⭐',
  'privacy-data': '🔒',
  'supported-languages': '🌍',
  'troubleshooting': '🔧',
  'sonidata-embed': '💻',
  'settings-reference': '⚙️',
  'cloud-sync': '☁️'
};

const md1 = fs.readFileSync('../../01_PROJECTS/METASOUND/04_WEBSITE/SONIDATA_DOCUMENTATION.md', 'utf8');
const md2 = fs.readFileSync('../../01_PROJECTS/METASOUND/04_WEBSITE/SONIDATA_EMBED_DOCUMENTATION.md', 'utf8');

const docs1 = parseMarkdownToDocs(md1, iconsMap, '📄');
// For the desktop app doc, we'll replace the sonidata-embed section entirely
// Since SONIDATA_EMBED_DOCUMENTATION.md doesn't use ## for its root name, let's inject a fake one
const md2_injected = '## Sonidata Embed (macOS)\n' + md2.split('## Features')[0].replace('# Sonidata Embed Documentation', '') + '\n## Features\n' + md2.split('## Features')[1];
// actually, parseMarkdownToDocs requires ## sections.
// Let's just create the Embed doc directly using my previous parseMarkdownToContentBlocks logic
const { execSync } = require('child_process');

function parseBlocks(md) {
  return parseMarkdownToDocs('## Sonidata Embed (macOS)\n' + md, iconsMap, '💻')[0];
}

const embedDoc = parseBlocks(md2);

// Find sonidata-embed in docs1 and replace
const idx = docs1.findIndex(d => d.id === 'sonidata-embed');
if (idx !== -1) {
  docs1[idx] = embedDoc;
} else {
  docs1.push(embedDoc);
}

const sitePath = 'webapp/src/data/site.json';
const site = JSON.parse(fs.readFileSync(sitePath, 'utf8'));
site.sonidataSupport.docs = docs1;
site.sonidataSupport.version = "1.5.4";
site.sonidataSupport.lastUpdated = "2026-04-22";

fs.writeFileSync(sitePath, JSON.stringify(site, null, 2) + '\n');
console.log("Updated site.json docs!");
