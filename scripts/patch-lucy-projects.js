const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const PROJECTS_PATH = path.join(ROOT, "webapp", "src", "data", "projects.json");
const SCRAPES_DIR = path.join(ROOT, "webapp", "backups", "scrapes");
let EXT_PATH = null;
try {
  const entries = fs.readdirSync(SCRAPES_DIR).filter((n) => n.startsWith("lucy-beech-")).sort();
  const latest = entries.length ? entries[entries.length - 1] : null;
  EXT_PATH = latest ? path.join(SCRAPES_DIR, latest, "projects.json") : null;
} catch (_) {
  EXT_PATH = null;
}
if (!EXT_PATH || !fs.existsSync(EXT_PATH)) {
  throw new Error(`No lucy-beech scrape backup found under ${SCRAPES_DIR}.`);
}

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

const projects = readJson(PROJECTS_PATH);
const ext = readJson(EXT_PATH);

// Build short synopsis lookup by scraped slug
const synopsisBySlug = Object.fromEntries(
  ext.map((e) => [e.slug, e.synopsis || e.rawSynopsis || ""])
);
const syn = (slug) => synopsisBySlug[slug] || "";

// Updates for Lucy Beech projects
const updates = {
  "out-of-body-film-art-installation": {
    poster: "/posters/out-of-body-poster.jpg",
    images: [
      "/galleries/out-of-body-film-art-installation/out-of-body-still-01.jpg",
      "/galleries/out-of-body-film-art-installation/out-of-body-still-02.jpg",
      "/galleries/out-of-body-film-art-installation/out-of-body-still-03.jpg",
      "/galleries/out-of-body-film-art-installation/out-of-body-still-04.jpg",
    ],
    role: "Sound Designer, Mixer, Composer",
    content: syn("out-of-body"),
    year: "2024",
  },
  "flush-film-art-installation": {
    poster: "/posters/flush-poster.jpg",
    images: ["/galleries/flush-film-art-installation/flush-still-01.jpg"],
    role: "Sound Designer, Mixer, Composer",
    content: syn("flush"),
    year: "2023",
  },
  "warm-decembers-film-art-installation": {
    poster: "/posters/warm-decembers-poster.jpg",
    images: [
      "/galleries/warm-decembers-film-art-installation/warm-decembers-still-01.jpg",
      "/galleries/warm-decembers-film-art-installation/warm-decembers-still-02.png",
    ],
    role: "Sound Designer, Mixer, Composer",
    content: syn("warm-decembers"),
    year: "2023",
  },
  "reproductive-exile-film-art-installation": {
    poster: "/posters/reproductive-exile-poster.jpg",
    images: [
      "/galleries/reproductive-exile-film-art-installation/reproductive-exile-still-01.jpg",
      "/galleries/reproductive-exile-film-art-installation/reproductive-exile-still-02.jpg",
      "/galleries/reproductive-exile-film-art-installation/reproductive-exile-still-03.jpg",
    ],
    role: "Sound Designer, Mixer, Composer",
    content: syn("reproductive-exile"),
    year: "2023",
  },
};

let changed = 0;
for (const p of projects) {
  const u = updates[p.slug];
  if (u) {
    if (u.poster) p.poster = u.poster;
    if (u.images) p.images = u.images;
    if (u.role) p.role = u.role;
    if (u.content) p.content = u.content;
    if (u.year && (!p.year || String(p.year).trim() === "")) p.year = u.year;
    changed++;
  }
}

writeJson(PROJECTS_PATH, projects);
console.log(`Patched ${changed} project entries for Lucy Beech.`);
