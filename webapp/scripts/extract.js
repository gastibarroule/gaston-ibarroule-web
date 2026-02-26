#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..', '..');
const docsDir = path.join(repoRoot, 'docs');
const projectsHtmlDir = path.join(docsDir, 'projects');
const galleriesDir = path.join(docsDir, 'galleries');
const postersDir = path.join(docsDir, 'posters');

const webappDir = path.resolve(__dirname, '..');
const dataFile = path.join(webappDir, 'src', 'data', 'projects.json');
const siteFile = path.join(webappDir, 'src', 'data', 'site.json');

/**
 * Extracts project metadata from exported HTML in docs/projects/index.html embedded seed data.
 * Falls back to scanning individual pages for poster and title if needed.
 */
function extractFromProjectsIndex() {
  const indexPath = path.join(projectsHtmlDir, 'index.html');
  if (!fs.existsSync(indexPath)) return null;
  const html = fs.readFileSync(indexPath, 'utf8');

  // The exported HTML includes a JSON-like data blob listing projects.
  const seedStart = html.indexOf('"projects":[');
  if (seedStart === -1) return null;
  const slice = html.slice(seedStart);
  // Heuristic: capture until the closing ]} of the projects array
  const endIdx = slice.indexOf(']}]');
  if (endIdx === -1) return null;
  const jsonLike = '{' + slice.slice(0, endIdx + 1) + '}';
  const normalized = jsonLike
    .replace(/\$undefined/g, 'null')
    .replace(/,(\s*[}\]])/g, '$1');

  try {
    const parsed = JSON.parse(normalized);
    const projects = parsed.projects || [];
    return projects.map((p) => ({
      title: p.title || '',
      slug: p.slug || '',
      role: p.role || '',
      year: p.year || '',
      poster: p.poster || null,
      videoUrl: p.videoUrl || null,
      images: Array.isArray(p.images) ? p.images : [],
      content: p.content || '',
      featured: Boolean(p.featured),
    }));
  } catch (_) {
    return null;
  }
}

function mergeWithPageDetails(projects) {
  for (const project of projects) {
    if (!project.slug) continue;
    const pagePath = path.join(projectsHtmlDir, `${project.slug}.html`);
    if (!fs.existsSync(pagePath)) continue;
    const html = fs.readFileSync(pagePath, 'utf8');
    if (!project.poster) {
      const m = html.match(/<img src="([^"]+)"[^>]*class="w-full h-full object-cover"/);
      if (m) project.poster = m[1];
    }
    if (!project.videoUrl) {
      const mv = html.match(/<iframe src="([^"]+)"/);
      if (mv) project.videoUrl = mv[1];
    }
    if (!project.title) {
      const mt = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (mt) project.title = mt[1];
    }
    // Gallery images
    if (!project.images || project.images.length === 0) {
      const galleryMatches = Array.from(html.matchAll(/<img src="(\/galleries\/[^"]+)"/g));
      const seen = new Set();
      const imgs = [];
      for (const m of galleryMatches) {
        const url = m[1];
        if (!seen.has(url)) { seen.add(url); imgs.push(url); }
      }
      if (imgs.length > 0) project.images = imgs;
    }
  }
  return projects;
}

function main() {
  if (!fs.existsSync(projectsHtmlDir)) {
    console.error('Cannot find docs/projects. Run from repo with docs exported.');
    process.exit(1);
  }

  let projects = extractFromProjectsIndex();
  if (!projects) {
    // Fallback: scrape each project page for minimal info
    projects = fs
      .readdirSync(projectsHtmlDir)
      .filter((f) => f.endsWith('.html') && f !== 'index.html')
      .map((file) => {
        const slug = path.basename(file, '.html');
        const html = fs.readFileSync(path.join(projectsHtmlDir, file), 'utf8');
        const title = (html.match(/<h1[^>]*>([^<]+)<\/h1>/) || [null, ''])[1];
        const meta = (html.match(/<div class=\"text-muted[^\"]*\">([^<]+)<\/div>/) || [null, ''])[1];
        let role = '';
        let year = '';
        if (meta) {
          const parts = meta.split('•').map((s) => s.trim());
          if (parts.length === 2) {
            role = parts[0];
            year = parts[1];
          } else {
            role = meta;
          }
        }
        const poster = (html.match(/<img src=\"([^\"]+)\"[^>]*class=\"w-full h-full object-cover\"/) || [null, null])[1];
        const videoUrl = (html.match(/<iframe src=\"([^\"]+)\"/) || [null, null])[1];
        const content = (html.match(/<div class=\"mt-3 text-sm whitespace-pre-wrap\">([\s\S]*?)<\/div>/) || [null, ''])[1]
          .replace(/<br\s*\/?>(\n)?/g, '\n')
          .replace(/\n+/g, '\n')
          .trim();
        return { title, slug, role, year, poster: poster || null, videoUrl: videoUrl || null, images: [], content };
      });
  }
  projects = mergeWithPageDetails(projects);

  // Sort newest first by year (keep unknown at end)
  projects.sort((a, b) => {
    const ay = parseInt(a.year || '0', 10) || 0;
    const by = parseInt(b.year || '0', 10) || 0;
    return by - ay;
  });

  fs.mkdirSync(path.dirname(dataFile), { recursive: true });
  fs.writeFileSync(dataFile, JSON.stringify(projects, null, 2));
  console.log(`Wrote ${projects.length} projects to ${path.relative(webappDir, dataFile)}`);

  // Extract site pages
  const aboutPath = path.join(docsDir, 'about.html');
  const contactPath = path.join(docsDir, 'contact.html');
  const homePath = path.join(docsDir, 'index.html');
  const site = {};
  if (fs.existsSync(aboutPath)) {
    const html = fs.readFileSync(aboutPath, 'utf8');
    const inner = (html.match(/<div class=\"prose prose-invert max-w-none whitespace-pre-wrap\">([\s\S]*?)<\/div>/) || [null, ""])[1];
    const text = inner
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&#x27;/g, "'")
      .trim();
    site.aboutText = text;
  }
  if (fs.existsSync(contactPath)) {
    const html = fs.readFileSync(contactPath, 'utf8');
    const user = (html.match(/\"user\":\"([^\"]+)\"/) || [null, null])[1];
    const domain = (html.match(/\"domain\":\"([^\"]+)\"/) || [null, null])[1];
    const links = {};
    const providers = ['linkedin', 'instagram', 'imdb', 'crew-united', 'crewunited'];
    for (const prov of providers) {
      const m = html.match(new RegExp(`<a href=\"([^\"]+)\"[^>]*aria-label=\"${prov}\"`));
      if (m) links[prov === 'crewunited' ? 'crew-united' : prov] = m[1];
    }
    site.contact = { email: user && domain ? `${user}@${domain}` : null, emailUser: user, emailDomain: domain, links };
  }
  if (fs.existsSync(homePath)) {
    const html = fs.readFileSync(homePath, 'utf8');
    const intro = (html.match(/<p class=\"p-responsive text-muted whitespace-pre-line\">([\s\S]*?)<\/p>/) || [null, ""])[1]
      .replace(/<[^>]+>/g, '')
      .replace(/&amp;/g, '&')
      .trim();
    site.homeIntro = intro;
  }

  // Preserve existing Sonidata data if present
  let existingSite = {};
  if (fs.existsSync(siteFile)) {
    try {
      existingSite = JSON.parse(fs.readFileSync(siteFile, 'utf8'));
    } catch (_) { }
  }
  const finalSite = { ...existingSite, ...site };

  fs.writeFileSync(siteFile, JSON.stringify(finalSite, null, 2));
  console.log(`Wrote site info to ${path.relative(webappDir, siteFile)}`);
}

main();


