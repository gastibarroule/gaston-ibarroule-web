#!/usr/bin/env node

/*
 Terminal Content Manager for gaston-ibarroule-portfolio
 - Add/Edit projects in webapp/src/data/projects.json
 - Edit site info in webapp/src/data/site.json (about, contact, home intro)
 - Prompts are non-destructive; press Enter to keep existing values
*/

const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const os = require("os");
const prompts = require("prompts");

const ROOT = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(ROOT, "..");
const DATA_DIR = path.join(ROOT, "src", "data");
const PROJECTS_PATH = path.join(DATA_DIR, "projects.json");
const SITE_PATH = path.join(DATA_DIR, "site.json");
const PUBLIC_DIR = path.join(ROOT, "public");
const MAKE_POSTER = path.join(REPO_ROOT, "scripts", "make-poster.sh");
const COMPRESS_IMG = path.join(REPO_ROOT, "scripts", "compress-image.sh");

function readJson(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (e) {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function publicPathExists(p) {
  if (!p) return false;
  const rel = p.startsWith("/") ? p.slice(1) : p;
  const abs = path.join(PUBLIC_DIR, rel);
  return fs.existsSync(abs);
}

function publicPathToAbs(p) {
  if (!p) return null;
  const rel = p.startsWith("/") ? p.slice(1) : p;
  return path.join(PUBLIC_DIR, rel);
}

function ensureJpegPosterPath(publicPath) {
  const ext = path.extname(publicPath || "").toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return publicPath;
  const without = publicPath.replace(/\.[^.]+$/, "");
  return `${without}.jpg`;
}

function getImageDims(absPath) {
  try {
    const out = execFileSync("ffprobe", [
      "-v", "error",
      "-select_streams", "v:0",
      "-show_entries", "stream=width,height",
      "-of", "csv=p=0:s=x",
      absPath,
    ], { encoding: "utf8" }).trim();
    const [wStr, hStr] = out.split("x");
    const w = parseInt(wStr, 10); const h = parseInt(hStr, 10);
    if (Number.isFinite(w) && Number.isFinite(h)) return { width: w, height: h };
  } catch (_) {}
  return null;
}

function approxIsAspect(width, height, num, den, tolerancePx = 2) {
  // Compare num/den vs width/height using cross-multiplication
  return Math.abs(width * den - height * num) <= tolerancePx;
}

function runMakePoster(inputAbs, outputAbs, aspect = "4:5", quality = "4", maxWidth = "1400") {
  try {
    execFileSync(MAKE_POSTER, [inputAbs, outputAbs, aspect, quality, maxWidth], { stdio: "inherit" });
    return true;
  } catch (e) {
    console.error("make-poster failed:", e?.message || e);
    return false;
  }
}

function runCompress(inputAbs, outputAbs, maxWidth = "1600", quality = "4") {
  try {
    execFileSync(COMPRESS_IMG, [inputAbs, outputAbs, maxWidth, quality], { stdio: "inherit" });
    return true;
  } catch (e) {
    console.error("compress-image failed:", e?.message || e);
    return false;
  }
}

function classifyPath(inputPath) {
  if (!inputPath) return { type: "none" };
  // First, if it resolves inside public and exists, treat as public site path
  if (inputPath.startsWith("/")) {
    const rel = inputPath.slice(1);
    const abs = path.join(PUBLIC_DIR, rel);
    if (fs.existsSync(abs)) {
      return { type: "public", rel, abs, publicPath: inputPath };
    }
  }
  // Else if it's an existing file path on disk, treat as file
  const absFs = path.isAbsolute(inputPath) ? inputPath : path.resolve(REPO_ROOT, inputPath);
  if (fs.existsSync(absFs)) {
    return { type: "file", abs: absFs };
  }
  return { type: "missing" };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function sanitizeName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$|\.+$/g, "");
}

function normalizePosterForSlug(slug, inputPath) {
  if (!inputPath) return "";
  const cls = classifyPath(inputPath);
  const outPublic = `/posters/${sanitizeName(slug)}.jpg`;
  const outAbs = publicPathToAbs(outPublic);
  ensureDir(path.dirname(outAbs));
  if (cls.type === "public") {
    // Already in public; ensure aspect/compress and return possibly same path (converted to .jpg if needed)
    return ensurePosterProcessed(cls.publicPath);
  } else if (cls.type === "file") {
    runMakePoster(cls.abs, outAbs, "4:5", "4", "1400");
    return outPublic;
  } else {
    console.warn(`Poster path not found: ${inputPath}`);
    return inputPath; // leave as-is; frontend may 404 until fixed
  }
}

function normalizeGalleryImageForSlug(slug, inputPath, index) {
  if (!inputPath) return "";
  const cls = classifyPath(inputPath);
  const base = sanitizeName(path.basename(inputPath, path.extname(inputPath)) || `img-${index + 1}`);
  const outPublic = `/galleries/${sanitizeName(slug)}/${base}.jpg`;
  const outAbs = publicPathToAbs(outPublic);
  ensureDir(path.dirname(outAbs));
  if (cls.type === "public") {
    // If already in public, compress in place (JPEGs only). If not JPEG, write a compressed jpg alongside.
    const ext = path.extname(cls.publicPath).toLowerCase();
    if (ext === ".jpg" || ext === ".jpeg") {
      runCompress(cls.abs, cls.abs, "1600", "4");
      return cls.publicPath;
    }
    runCompress(cls.abs, outAbs, "1600", "4");
    return outPublic;
  } else if (cls.type === "file") {
    runCompress(cls.abs, outAbs, "1600", "4");
    return outPublic;
  } else {
    console.warn(`Gallery image not found: ${inputPath}`);
    return inputPath;
  }
}

function normalizeVideoForSlug(slug, inputPath) {
  if (!inputPath) return "";
  const cls = classifyPath(inputPath);
  // If already a public path in /public, keep as-is (prefer /videos but don't enforce)
  if (cls.type === "public") {
    return cls.publicPath;
  }
  // If it's a real file on disk, copy into /public/videos/<slug>-<basename>.<ext>
  if (cls.type === "file") {
    const base = sanitizeName(path.basename(inputPath, path.extname(inputPath)) || "video");
    const ext = (path.extname(inputPath) || ".mp4").toLowerCase();
    const outPublic = `/videos/${sanitizeName(slug)}-${base}${ext}`;
    const outAbs = publicPathToAbs(outPublic);
    ensureDir(path.dirname(outAbs));
    fs.copyFileSync(cls.abs, outAbs);
    return outPublic;
  }
  // Otherwise treat as external URL (YouTube/Vimeo/etc.) and return unchanged
  return inputPath;
}

function ensurePosterProcessed(publicPath) {
  if (!publicPath) return publicPath;
  const abs = publicPathToAbs(publicPath);
  if (!abs || !fs.existsSync(abs)) return publicPath;
  const dims = getImageDims(abs);
  const outPublic = ensureJpegPosterPath(publicPath);
  const outAbs = publicPathToAbs(outPublic);
  const targetNum = 4, targetDen = 5;
  if (!dims) {
    // Unknown dims: just try to crop+scale to be safe
    runMakePoster(abs, outAbs, `${targetNum}:${targetDen}`, "4", "1400");
    return outPublic;
  }
  const isAspect = approxIsAspect(dims.width, dims.height, targetNum, targetDen, 2);
  if (!isAspect) {
    runMakePoster(abs, outAbs, `${targetNum}:${targetDen}`, "4", "1400");
    return outPublic;
  }
  // Aspect already correct: just compress (overwrite or convert ext to jpg if needed)
  runCompress(abs, outAbs, "1400", "4");
  return outPublic;
}

function maybeCompressGalleryImage(publicPath) {
  if (!publicPath) return publicPath;
  const abs = publicPathToAbs(publicPath);
  if (!abs || !fs.existsSync(abs)) return publicPath;
  const ext = path.extname(publicPath).toLowerCase();
  // Only auto-compress JPEGs to avoid changing formats unexpectedly
  if (ext === ".jpg" || ext === ".jpeg") {
    runCompress(abs, abs, "1600", "4");
  }
  return publicPath;
}

async function promptMultiline(initialText) {
  const { mode } = await prompts({
    type: "select",
    name: "mode",
    message: "Description input mode",
    choices: [
      { title: "Paste multi-line (type ::done on its own line to finish)", value: "paste" },
      { title: "Single line", value: "single" },
    ],
    initial: 0,
  });
  if (mode === "single") {
    const { text } = await prompts({ type: "text", name: "text", message: "Description", initial: initialText || "" });
    return text || initialText || "";
  }
  console.log("Paste your description below. Type ::done on its own line to finish.\n(Leave empty then type ::done to keep current text.)\n");
  const lines = [];
  return new Promise((resolve) => {
    const rl = require("readline").createInterface({ input: process.stdin, output: process.stdout });
    rl.on("line", (line) => {
      if (line.trim() === "::done") {
        rl.close();
      } else {
        lines.push(line);
      }
    });
    rl.on("close", () => {
      const joined = lines.join("\n").trimEnd();
      resolve(joined.length > 0 ? joined : (initialText || ""));
    });
  });
}

async function getFeaturedMediaForAdd(slug) {
  const { mode } = await prompts({
    type: "select",
    name: "mode",
    message: "Featured media input",
    choices: [
      { title: "URL or file path", value: "url" },
      { title: "Embed HTML (paste)", value: "embed" },
      { title: "Skip", value: "skip" },
    ],
    initial: 0,
  });
  if (mode === "url") {
    const { txt } = await prompts({
      type: "text",
      name: "txt",
      message: "Featured URL / video URL or file path (optional)",
    });
    return txt ? normalizeVideoForSlug(slug, txt) : "";
  }
  if (mode === "embed") {
    console.log("Paste your EMBED HTML below (type ::done on its own line to finish).");
    const html = await promptMultiline("");
    return html || "";
  }
  return "";
}

async function getFeaturedMediaForEdit(slug, current) {
  const { mode } = await prompts({
    type: "select",
    name: "mode",
    message: `Featured media (${current ? "current set" : "empty"})`,
    choices: [
      { title: "Keep current", value: "keep" },
      { title: "Replace with URL or file path", value: "url" },
      { title: "Replace with Embed HTML (paste)", value: "embed" },
      { title: current ? "Clear" : "Clear (n/a)", value: "clear" },
    ],
    initial: 0,
  });
  if (mode === "keep") return current || "";
  if (mode === "clear") return "";
  if (mode === "url") {
    const { txt } = await prompts({
      type: "text",
      name: "txt",
      message: "Featured URL / video URL or file path",
      initial: current && !String(current).includes("<") ? String(current) : "",
    });
    return txt ? normalizeVideoForSlug(slug, txt) : "";
  }
  if (mode === "embed") {
    console.log("Paste your EMBED HTML below (type ::done on its own line to finish).");
    const html = await promptMultiline(current && String(current).includes("<") ? String(current) : "");
    return html || "";
  }
  return current || "";
}

async function addProject() {
  const projects = readJson(PROJECTS_PATH, []);
  const base = await prompts([
    { type: "text", name: "title", message: "Title", validate: (v) => (!!v ? true : "Required" ) },
    { type: (prev) => (prev ? "text" : null), name: "slug", message: "Slug", initial: (prev) => slugify(prev) },
    { type: "text", name: "role", message: "Role (e.g., Graphic Designer)" },
    { type: "text", name: "category", message: "Category (optional)" },
    { type: "text", name: "year", message: "Year (optional)" },
    { type: "toggle", name: "featured", message: "Feature on homepage?", initial: false, active: "yes", inactive: "no" },
  ]);

  const poster = await prompts({
    type: "text",
    name: "poster",
    message: "Poster path (public path like /posters/omni.jpg OR a file path)",
    validate: (v) => {
      if (!v) return true;
      const cls = classifyPath(v);
      return (cls.type === "public" || cls.type === "file") ? true : "Not found: provide public path under webapp/public or a valid file path";
    }
  });

  const images = [];
  for (let i = 0; i < 3; i++) {
    const { img } = await prompts({ type: "text", name: "img", message: `Gallery image ${i + 1} (public path or file path, blank to skip)` });
    if (!img) break;
    images.push(normalizeGalleryImageForSlug(base.slug || slugify(base.title), img, i));
  }

  const featured = await getFeaturedMediaForAdd(base.slug || slugify(base.title));
  const content = await promptMultiline("");

  const project = {
    title: base.title,
    slug: base.slug || slugify(base.title),
    role: base.role || "",
    category: base.category || "",
    year: base.year || "",
    poster: poster.poster ? normalizePosterForSlug(base.slug || slugify(base.title), poster.poster) : "",
    featured: !!base.featured,
    images,
    videoUrl: featured,
    content: content || "",
  };

  // if slug exists, refuse
  if (projects.some((p) => p.slug === project.slug)) {
    console.error(`A project with slug '${project.slug}' already exists.`);
    return;
  }
  projects.push(project);
  writeJson(PROJECTS_PATH, projects);
  console.log(`\nSaved new project '${project.title}' (${project.slug}).`);
}

async function pickProject(projects) {
  if (!projects.length) return null;
  const { slug } = await prompts({
    type: "autocomplete",
    name: "slug",
    message: "Select project",
    choices: projects.map((p) => ({ title: `${p.title} ${p.year ? `(${p.year})` : ""}`, value: p.slug })),
    suggest: (input, choices) => Promise.resolve(choices.filter((c) => c.title.toLowerCase().includes((input || "").toLowerCase()))),
  });
  return projects.find((p) => p.slug === slug) || null;
}

async function editProject() {
  const projects = readJson(PROJECTS_PATH, []);
  const project = await pickProject(projects);
  if (!project) { console.log("No project selected."); return; }

  const updated = { ...project };

  const base = await prompts([
    { type: "text", name: "title", message: `Title`, initial: updated.title },
    { type: "text", name: "slug", message: `Slug`, initial: updated.slug },
    { type: "text", name: "role", message: `Role`, initial: updated.role || "" },
    { type: "text", name: "category", message: `Category`, initial: updated.category || "" },
    { type: "text", name: "year", message: `Year`, initial: updated.year || "" },
    { type: "toggle", name: "featured", message: "Feature on homepage?", initial: !!updated.featured, active: "yes", inactive: "no" },
  ]);
  Object.assign(updated, base);

  const { poster } = await prompts({ type: "text", name: "poster", message: `Poster path (public or file path)`, initial: updated.poster || "" });
  if (poster !== undefined) updated.poster = poster ? normalizePosterForSlug(updated.slug, poster) : "";

  // Edit images
  let imgs = Array.isArray(updated.images) ? [...updated.images] : [];
  for (let i = 0; i < 3; i++) {
    const cur = imgs[i] || "";
    const { action } = await prompts({
      type: "select",
      name: "action",
      message: `Image ${i + 1}: ${cur ? cur : "<empty>"}`,
      choices: [
        { title: cur ? "Keep" : "Skip", value: "keep" },
        { title: "Replace/Add", value: "set" },
        { title: cur ? "Remove" : "Remove (n/a)", value: "remove" },
      ],
      initial: 0,
    });
    if (action === "set") {
      const { img } = await prompts({ type: "text", name: "img", message: `Enter image (public path or file path)`, initial: cur });
      if (img) imgs[i] = normalizeGalleryImageForSlug(updated.slug, img, i);
    } else if (action === "remove") {
      if (cur) imgs.splice(i, 1);
    }
  }
  // Trim to max 3
  imgs = imgs.filter(Boolean).slice(0, 3);
  updated.images = imgs;

  const featured = await getFeaturedMediaForEdit(updated.slug, updated.videoUrl || "");
  updated.videoUrl = featured;

  const editContent = await prompts({ type: "toggle", name: "doEdit", message: "Edit description?", initial: false, active: "yes", inactive: "no" });
  if (editContent.doEdit) {
    updated.content = await promptMultiline(updated.content || "");
  }

  // Ensure slug uniqueness
  if (updated.slug !== project.slug && projects.some((p) => p.slug === updated.slug)) {
    console.error(`Another project already uses slug '${updated.slug}'. Aborting.`);
    return;
  }

  const idx = projects.findIndex((p) => p.slug === project.slug);
  projects[idx] = updated;
  writeJson(PROJECTS_PATH, projects);
  console.log(`\nSaved changes to '${updated.title}' (${updated.slug}).`);
}

async function deleteProject() {
  const projects = readJson(PROJECTS_PATH, []);
  if (!projects.length) { console.log("No projects to delete."); return; }
  const project = await pickProject(projects);
  if (!project) { console.log("No project selected."); return; }
  const { sure } = await prompts({
    type: "toggle",
    name: "sure",
    message: `Delete project '${project.title}' (${project.slug})? (JSON entry only; files untouched)`,
    initial: false,
    active: "yes",
    inactive: "no",
  });
  if (!sure) { console.log("Cancelled."); return; }
  const next = projects.filter((p) => p.slug !== project.slug);
  writeJson(PROJECTS_PATH, next);
  console.log(`Deleted project '${project.title}'.`);
}

async function editAbout() {
  const site = readJson(SITE_PATH, {});
  const text = await promptMultiline(site.aboutText || "");
  site.aboutText = text;
  writeJson(SITE_PATH, site);
  console.log("Saved about text.");
}

async function editHomeIntro() {
  const site = readJson(SITE_PATH, {});
  const text = await promptMultiline(site.homeIntro || "");
  site.homeIntro = text;
  writeJson(SITE_PATH, site);
  console.log("Saved home intro.");
}

async function editContact() {
  const site = readJson(SITE_PATH, {});
  site.contact = site.contact || {};
  const c = site.contact;
  const base = await prompts([
    { type: "text", name: "emailUser", message: "Email user (before @)", initial: c.emailUser || "" },
    { type: "text", name: "emailDomain", message: "Email domain (after @)", initial: c.emailDomain || "" },
  ]);
  c.emailUser = base.emailUser || "";
  c.emailDomain = base.emailDomain || "";
  c.email = (c.emailUser && c.emailDomain) ? `${c.emailUser}@${c.emailDomain}` : (c.email || "");

  const links = c.links || {};
  const social = await prompts([
    { type: "text", name: "linkedin", message: "LinkedIn URL", initial: links.linkedin || "" },
    { type: "text", name: "instagram", message: "Instagram URL", initial: links.instagram || "" },
    { type: "text", name: "imdb", message: "IMDb URL", initial: links.imdb || "" },
    { type: "text", name: "crew", message: "Crew United URL", initial: links["crew-united"] || "" },
  ]);
  c.links = {
    linkedin: social.linkedin || "",
    instagram: social.instagram || "",
    imdb: social.imdb || "",
    "crew-united": social.crew || "",
  };

  site.contact = c;
  writeJson(SITE_PATH, site);
  console.log("Saved contact info.");
}

async function importVideoToProject() {
  const projects = readJson(PROJECTS_PATH, []);
  const project = await pickProject(projects);
  if (!project) { console.log("No project selected."); return; }

  const { src } = await prompts({
    type: "text",
    name: "src",
    message: "Path to video file (.mp4/.webm/.ogg) or existing public path (/videos/...)",
    validate: (v) => (!!v ? true : "Required"),
  });
  if (!src) { console.log("Cancelled."); return; }

  const out = normalizeVideoForSlug(project.slug, src);
  project.videoUrl = out;
  writeJson(PROJECTS_PATH, projects);
  console.log(`Imported video to '${out}' and updated project '${project.title}'.`);
  console.log("Tip: Use this public path in the project if needed:", out);
}

async function mainMenu() {
  for (;;) {
    const { action } = await prompts({
      type: "select",
      name: "action",
      message: "Content Manager",
      choices: [
        { title: "Add project", value: "add" },
        { title: "Edit project", value: "edit" },
        { title: "Delete project", value: "delete" },
        { title: "Edit About page", value: "about" },
        { title: "Edit Home intro", value: "home" },
        { title: "Edit Contact page", value: "contact" },
        { title: "Import video to a project", value: "video" },
        { title: "Exit", value: "exit" },
      ],
      initial: 0,
    });
    if (action === "exit" || action === undefined) break;
    try {
      if (action === "add") await addProject();
      else if (action === "edit") await editProject();
      else if (action === "delete") await deleteProject();
      else if (action === "about") await editAbout();
      else if (action === "home") await editHomeIntro();
      else if (action === "contact") await editContact();
      else if (action === "video") await importVideoToProject();
    } catch (err) {
      console.error("Error:", err?.message || err);
    }
    console.log("\n—");
  }
}

mainMenu();
