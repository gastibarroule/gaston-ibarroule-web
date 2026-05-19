#!/usr/bin/env node

/**
 * Content Manager — Local Web UI Server
 *
 * Standalone Express server that provides a visual admin panel for managing
 * the portfolio website content (projects.json, site.json) and assets.
 *
 * Port: 4000 (or CMS_PORT env)
 * Reads/writes: ../webapp/src/data/projects.json, ../webapp/src/data/site.json
 * Assets:       ../webapp/public/
 */

const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { execFileSync, execFile, spawn } = require("child_process");
const os = require("os");

const app = express();
const PORT = parseInt(process.env.CMS_PORT || "4000", 10);

// ── Paths ──────────────────────────────────────────────────────────────
const CMS_DIR = __dirname;
const REPO_ROOT = path.resolve(CMS_DIR, "..");
const WEBAPP_DIR = path.join(REPO_ROOT, "webapp");
const DATA_DIR = path.join(WEBAPP_DIR, "src", "data");
const PROJECTS_PATH = path.join(DATA_DIR, "projects.json");
const SITE_PATH = path.join(DATA_DIR, "site.json");
const PUBLIC_DIR = path.join(WEBAPP_DIR, "public");
const MAKE_POSTER = path.join(REPO_ROOT, "scripts", "make-poster.sh");
const COMPRESS_IMG = path.join(REPO_ROOT, "scripts", "compress-image.sh");

// ── Middleware ──────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(CMS_DIR, "public")));

// Serve webapp public assets (posters, galleries, videos) for preview
app.use("/assets", express.static(PUBLIC_DIR));

// ── Helpers (ported from content.js) ───────────────────────────────────
function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch { return fallback; }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function slugify(input) {
  return String(input || "")
    .toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function sanitizeName(name) {
  return String(name || "").toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$|\.+$/g, "");
}

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function runMakePoster(inputAbs, outputAbs, aspect = "4:5", quality = "4", maxWidth = "1400") {
  try {
    execFileSync(MAKE_POSTER, [inputAbs, outputAbs, aspect, quality, maxWidth], { stdio: "pipe" });
    return true;
  } catch (e) { console.error("make-poster failed:", e?.message); return false; }
}

function runCompress(inputAbs, outputAbs, maxWidth = "1600", quality = "4") {
  try {
    execFileSync(COMPRESS_IMG, [inputAbs, outputAbs, maxWidth, quality], { stdio: "pipe" });
    return true;
  } catch (e) { console.error("compress-image failed:", e?.message); return false; }
}

// ── Upload storage ─────────────────────────────────────────────────────
const upload = multer({ dest: path.join(CMS_DIR, ".uploads") });

// ── API: Projects ──────────────────────────────────────────────────────
app.get("/api/projects", (_req, res) => {
  res.json(readJson(PROJECTS_PATH, []));
});

app.post("/api/projects", (req, res) => {
  const projects = readJson(PROJECTS_PATH, []);
  const p = req.body;
  if (!p.title) return res.status(400).json({ error: "Title required" });
  p.slug = p.slug || slugify(p.title);
  if (projects.some(x => x.slug === p.slug)) return res.status(409).json({ error: "Slug exists" });
  p.images = p.images || [];
  p.featured = !!p.featured;
  p.comingSoon = !!p.comingSoon;
  projects.push(p);
  writeJson(PROJECTS_PATH, projects);
  res.json(p);
});

app.put("/api/projects/reorder", (req, res) => {
  const { slugs } = req.body;
  if (!Array.isArray(slugs)) return res.status(400).json({ error: "slugs array required" });
  const projects = readJson(PROJECTS_PATH, []);
  const map = Object.fromEntries(projects.map(p => [p.slug, p]));
  const reordered = slugs.map(s => map[s]).filter(Boolean);
  // Append any projects not in the slugs list (safety)
  for (const p of projects) { if (!slugs.includes(p.slug)) reordered.push(p); }
  writeJson(PROJECTS_PATH, reordered);
  res.json(reordered);
});

app.put("/api/projects/:slug", (req, res) => {
  const projects = readJson(PROJECTS_PATH, []);
  const idx = projects.findIndex(p => p.slug === req.params.slug);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const updated = { ...projects[idx], ...req.body };
  // If slug changed, check uniqueness
  if (updated.slug !== req.params.slug && projects.some(p => p.slug === updated.slug)) {
    return res.status(409).json({ error: "Slug exists" });
  }
  projects[idx] = updated;
  writeJson(PROJECTS_PATH, projects);
  res.json(updated);
});

app.delete("/api/projects/:slug", (req, res) => {
  const projects = readJson(PROJECTS_PATH, []);
  const next = projects.filter(p => p.slug !== req.params.slug);
  if (next.length === projects.length) return res.status(404).json({ error: "Not found" });
  writeJson(PROJECTS_PATH, next);
  res.json({ ok: true });
});

// ── API: Site ──────────────────────────────────────────────────────────
app.get("/api/site", (_req, res) => {
  res.json(readJson(SITE_PATH, {}));
});

app.put("/api/site", (req, res) => {
  const site = readJson(SITE_PATH, {});
  const { aboutText, homeIntro, contact } = req.body;
  if (aboutText !== undefined) site.aboutText = aboutText;
  if (homeIntro !== undefined) site.homeIntro = homeIntro;
  if (contact !== undefined) site.contact = contact;
  writeJson(SITE_PATH, site);
  res.json(site);
});

app.put("/api/site/sonidata-support", (req, res) => {
  const site = readJson(SITE_PATH, {});
  site.sonidataSupport = { ...site.sonidataSupport, ...req.body };
  writeJson(SITE_PATH, site);
  res.json(site.sonidataSupport);
});

app.put("/api/site/sonidata-privacy", (req, res) => {
  const site = readJson(SITE_PATH, {});
  site.sonidataPrivacy = { ...site.sonidataPrivacy, ...req.body };
  writeJson(SITE_PATH, site);
  res.json(site.sonidataPrivacy);
});

// ── API: Uploads ───────────────────────────────────────────────────────
app.post("/api/upload/poster/:slug", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const slug = sanitizeName(req.params.slug);
  const outPublic = `/posters/${slug}.jpg`;
  const outAbs = path.join(PUBLIC_DIR, outPublic.slice(1));
  ensureDir(path.dirname(outAbs));
  const ok = runMakePoster(req.file.path, outAbs, "4:5", "4", "1400");
  fs.unlinkSync(req.file.path);
  if (!ok) return res.status(500).json({ error: "Processing failed" });
  res.json({ path: outPublic });
});

app.post("/api/upload/gallery/:slug", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });
  const slug = sanitizeName(req.params.slug);
  const base = sanitizeName(path.basename(req.file.originalname, path.extname(req.file.originalname)));
  const outPublic = `/galleries/${slug}/${base || "img"}.jpg`;
  const outAbs = path.join(PUBLIC_DIR, outPublic.slice(1));
  ensureDir(path.dirname(outAbs));
  const ok = runCompress(req.file.path, outAbs, "1600", "4");
  fs.unlinkSync(req.file.path);
  if (!ok) return res.status(500).json({ error: "Processing failed" });
  res.json({ path: outPublic });
});

// ── API: Git Status & Deploy ───────────────────────────────────────────
const DEPLOY_SCRIPT = path.join(REPO_ROOT, "scripts", "push-to-github.command");

app.get("/api/git/status", (_req, res) => {
  try {
    const status = require("child_process")
      .execSync("git status --short", { cwd: REPO_ROOT, encoding: "utf8" })
      .trim();
    const branch = require("child_process")
      .execSync("git rev-parse --abbrev-ref HEAD", { cwd: REPO_ROOT, encoding: "utf8" })
      .trim();
    const lastCommit = require("child_process")
      .execSync("git log --oneline -1", { cwd: REPO_ROOT, encoding: "utf8" })
      .trim();
    const files = status ? status.split("\n").map(l => ({
      status: l.substring(0, 2).trim(),
      file: l.substring(3),
    })) : [];
    res.json({ branch, lastCommit, files, clean: files.length === 0 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// SSE endpoint — streams deploy script output line by line
app.get("/api/deploy", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  const send = (type, data) => {
    res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
  };

  send("log", "Starting deploy...");

  const child = spawn("bash", [DEPLOY_SCRIPT], {
    cwd: REPO_ROOT,
    env: { ...process.env, PATH: process.env.PATH },
  });

  child.stdout.on("data", chunk => {
    chunk.toString().split("\n").filter(Boolean).forEach(line => send("log", line));
  });

  child.stderr.on("data", chunk => {
    chunk.toString().split("\n").filter(Boolean).forEach(line => send("stderr", line));
  });

  child.on("close", code => {
    send(code === 0 ? "done" : "error", code === 0 ? "Deploy complete!" : `Deploy failed (exit ${code})`);
    res.end();
  });

  child.on("error", err => {
    send("error", err.message);
    res.end();
  });

  req.on("close", () => { child.kill(); });
});

// ── Start ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  ✦  Content Manager UI`);
  console.log(`     http://localhost:${PORT}\n`);
  console.log(`  Data:   ${DATA_DIR}`);
  console.log(`  Assets: ${PUBLIC_DIR}\n`);
});
