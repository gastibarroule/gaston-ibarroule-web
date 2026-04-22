const fs = require('fs');

function parseMarkdownToContentBlocks(md) {
  const blocks = [];
  const lines = md.split('\n');
  let currentBlock = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      if (currentBlock && currentBlock.type === 'paragraph') {
        blocks.push(currentBlock);
        currentBlock = null;
      }
      continue;
    }

    if (line.startsWith('### ')) {
      if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
      blocks.push({ type: 'heading', text: line.replace('### ', '').trim() });
    } else if (line.startsWith('> **Tip**:') || line.startsWith('> **Note**:') || line.startsWith('> **Important**:')) {
      if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
      blocks.push({ type: 'tip', text: line.replace(/^> \*\*[^\*]+\*\*:?\s*/, '').trim() });
    } else if (line.startsWith('> ')) {
      if (currentBlock && currentBlock.type === 'tip') {
        currentBlock.text += " " + line.replace(/^>\s*/, '').trim();
      } else {
        if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
        blocks.push({ type: 'tip', text: line.replace(/^>\s*/, '').trim() });
      }
    } else if (line.match(/^\d+\.\s/)) {
      if (currentBlock && currentBlock.type === 'steps') {
        currentBlock.items.push(line.replace(/^\d+\.\s*/, '').trim());
      } else {
        if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
        currentBlock = { type: 'steps', items: [line.replace(/^\d+\.\s*/, '').trim()] };
      }
    } else if (line.startsWith('|')) {
      if (line.match(/^\|[-\s\|]+\|$/)) {
        // Separator line
        continue;
      }
      const cells = line.split('|').filter((_, idx, arr) => idx !== 0 && idx !== arr.length - 1).map(c => c.trim());
      if (currentBlock && currentBlock.type === 'table') {
        if (!currentBlock.headers) {
          currentBlock.headers = cells;
        } else {
          currentBlock.rows.push(cells);
        }
      } else {
        if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
        currentBlock = { type: 'table', headers: cells, rows: [] };
      }
    } else if (line.startsWith('```')) {
      if (currentBlock && currentBlock.type === 'code') {
        blocks.push(currentBlock);
        currentBlock = null;
      } else {
        if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
        currentBlock = { type: 'code', text: '' };
      }
    } else {
      if (currentBlock && currentBlock.type === 'code') {
        currentBlock.text += (currentBlock.text ? '\n' : '') + line;
      } else if (currentBlock && currentBlock.type === 'paragraph') {
        currentBlock.text += " " + line;
      } else {
        if (currentBlock) { blocks.push(currentBlock); currentBlock = null; }
        currentBlock = { type: 'paragraph', text: line };
      }
    }
  }
  if (currentBlock) blocks.push(currentBlock);
  return blocks;
}

// Read markdown
const embedMd = fs.readFileSync('../../01_PROJECTS/METASOUND/04_WEBSITE/SONIDATA_EMBED_DOCUMENTATION.md', 'utf8');

// Parse embed docs
const embedContent = parseMarkdownToContentBlocks(embedMd);

// We can just dump this to inspect it
console.log(JSON.stringify(embedContent.slice(0, 5), null, 2));

