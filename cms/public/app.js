/* Content Manager UI — Application Logic */

// ── State ──────────────────────────────────────────────────────────────
let projects = [];
let site = {};
let currentPanel = "projects";

// ── API helpers ────────────────────────────────────────────────────────
async function api(url, opts = {}) {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...opts,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

async function loadProjects() {
  projects = await api("/api/projects");
  renderProjects();
}

async function loadSite() {
  site = await api("/api/site");
  renderSiteInfo();
  renderSonidata();
}

// ── Toast ──────────────────────────────────────────────────────────────
function toast(msg, type = "success") {
  const c = document.getElementById("toasts");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

// ── Confirm dialog ─────────────────────────────────────────────────────
function confirmDialog(msg, { label = "Confirm", danger = false } = {}) {
  return new Promise(resolve => {
    const overlay = document.getElementById("confirmOverlay");
    const yesBtn = document.getElementById("confirmYes");
    document.getElementById("confirmMsg").textContent = msg;
    yesBtn.textContent = label;
    yesBtn.className = danger ? "btn btn-danger" : "btn btn-primary";
    overlay.classList.add("open");
    yesBtn.onclick = () => { overlay.classList.remove("open"); resolve(true); };
    document.getElementById("confirmNo").onclick = () => { overlay.classList.remove("open"); resolve(false); };
  });
}

// ── Navigation ─────────────────────────────────────────────────────────
function switchPanel(name) {
  currentPanel = name;
  document.querySelectorAll(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.panel === name));
  document.querySelectorAll(".panel").forEach(p => p.classList.toggle("active", p.id === `panel-${name}`));
}

// ── Projects Panel ─────────────────────────────────────────────────────
function renderProjects() {
  const grid = document.getElementById("projectGrid");
  document.getElementById("projectCount").textContent = projects.length;
  grid.innerHTML = projects.map((p, i) => `
    <div class="project-card" data-slug="${p.slug}" onclick="openProjectEditor('${p.slug}')">
      <div class="badges">
        ${p.featured ? '<span class="badge-pill badge-featured">★ Featured</span>' : ""}
        ${p.comingSoon ? '<span class="badge-pill badge-soon">Soon</span>' : ""}
      </div>
      ${p.poster
        ? `<img class="poster" src="/assets${p.poster}" alt="${p.title}" loading="lazy" onerror="this.outerHTML='<div class=poster-placeholder>🎬</div>'">`
        : '<div class="poster-placeholder">🎬</div>'}
      <div class="card-body">
        <div class="card-title">${esc(p.title)}</div>
        <div class="card-meta">
          <span>${esc(p.role || "—")}</span>
          ${p.year ? `<span>· ${p.year}</span>` : ""}
        </div>
      </div>
    </div>
  `).join("");
}

function esc(s) {
  const d = document.createElement("div");
  d.textContent = s || "";
  return d.innerHTML;
}

// ── Project Editor Modal ───────────────────────────────────────────────
let editingSlug = null;

function openProjectEditor(slug) {
  const modal = document.getElementById("projectModal");
  const p = slug ? projects.find(x => x.slug === slug) : null;
  editingSlug = slug || null;
  document.getElementById("modalTitle").textContent = p ? `Edit: ${p.title}` : "New Project";
  document.getElementById("pTitle").value = p?.title || "";
  document.getElementById("pSlug").value = p?.slug || "";
  document.getElementById("pRole").value = p?.role || "";
  document.getElementById("pCategory").value = p?.category || "";
  document.getElementById("pYear").value = p?.year || "";
  document.getElementById("pFeatured").checked = !!p?.featured;
  document.getElementById("pComingSoon").checked = !!p?.comingSoon;
  document.getElementById("pPoster").value = p?.poster || "";
  document.getElementById("pVideoUrl").value = p?.videoUrl || "";
  document.getElementById("pContent").value = p?.content || "";

  // Gallery preview
  renderGalleryPreview(p?.images || []);

  // Poster preview
  const pp = document.getElementById("posterPreview");
  if (p?.poster) {
    pp.innerHTML = `<img src="/assets${p.poster}" style="height:80px;border-radius:8px;object-fit:cover">`;
  } else {
    pp.innerHTML = "";
  }

  // Delete button
  document.getElementById("deleteProjectBtn").style.display = p ? "inline-flex" : "none";

  modal.classList.add("open");
}

function renderGalleryPreview(images) {
  const container = document.getElementById("galleryPreview");
  window._galleryImages = [...images];
  container.innerHTML = images.map((img, i) => `
    <div class="gallery-item">
      <img class="gallery-thumb" src="/assets${img}" alt="" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect fill=%22%23242428%22 width=%221%22 height=%221%22/></svg>'">
      <button class="remove-btn" onclick="event.stopPropagation();removeGalleryImage(${i})">×</button>
    </div>
  `).join("");
}

function removeGalleryImage(idx) {
  window._galleryImages.splice(idx, 1);
  renderGalleryPreview(window._galleryImages);
}

function closeProjectModal() {
  document.getElementById("projectModal").classList.remove("open");
  editingSlug = null;
}

async function saveProject() {
  const data = {
    title: document.getElementById("pTitle").value.trim(),
    slug: document.getElementById("pSlug").value.trim() || slugify(document.getElementById("pTitle").value),
    role: document.getElementById("pRole").value.trim(),
    category: document.getElementById("pCategory").value.trim(),
    year: document.getElementById("pYear").value.trim(),
    featured: document.getElementById("pFeatured").checked,
    comingSoon: document.getElementById("pComingSoon").checked,
    poster: document.getElementById("pPoster").value.trim(),
    videoUrl: document.getElementById("pVideoUrl").value.trim(),
    content: document.getElementById("pContent").value,
    images: window._galleryImages || [],
  };
  if (!data.title) return toast("Title is required", "error");
  try {
    if (editingSlug) {
      await api(`/api/projects/${editingSlug}`, { method: "PUT", body: data });
      toast(`Updated "${data.title}"`);
    } else {
      await api("/api/projects", { method: "POST", body: data });
      toast(`Created "${data.title}"`);
    }
    closeProjectModal();
    await loadProjects();
  } catch (e) { toast(e.message, "error"); }
}

async function deleteProject() {
  if (!editingSlug) return;
  const p = projects.find(x => x.slug === editingSlug);
  if (!await confirmDialog(`Delete "${p?.title}"? This only removes the JSON entry.`, { label: "Delete", danger: true })) return;
  try {
    await api(`/api/projects/${editingSlug}`, { method: "DELETE" });
    toast(`Deleted "${p?.title}"`);
    closeProjectModal();
    await loadProjects();
  } catch (e) { toast(e.message, "error"); }
}

function slugify(s) {
  return String(s || "").toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

// Auto-slug on title change
document.addEventListener("DOMContentLoaded", () => {
  const titleEl = document.getElementById("pTitle");
  const slugEl = document.getElementById("pSlug");
  titleEl?.addEventListener("input", () => {
    if (!editingSlug) slugEl.value = slugify(titleEl.value);
  });
});

// ── Poster Upload ──────────────────────────────────────────────────────
function setupPosterUpload() {
  const zone = document.getElementById("posterDropZone");
  const input = document.getElementById("posterFileInput");
  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("dragover"); uploadPoster(e.dataTransfer.files[0]); });
  input.addEventListener("change", () => { if (input.files[0]) uploadPoster(input.files[0]); });
}

async function uploadPoster(file) {
  const slug = document.getElementById("pSlug").value || slugify(document.getElementById("pTitle").value);
  if (!slug) return toast("Set a title first", "error");
  const fd = new FormData();
  fd.append("file", file);
  try {
    const res = await fetch(`/api/upload/poster/${slug}`, { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    document.getElementById("pPoster").value = data.path;
    document.getElementById("posterPreview").innerHTML = `<img src="/assets${data.path}?t=${Date.now()}" style="height:80px;border-radius:8px;object-fit:cover">`;
    toast("Poster uploaded");
  } catch (e) { toast(e.message, "error"); }
}

// ── Gallery Upload ─────────────────────────────────────────────────────
function setupGalleryUpload() {
  const zone = document.getElementById("galleryDropZone");
  const input = document.getElementById("galleryFileInput");
  zone.addEventListener("click", () => input.click());
  zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("dragover"); });
  zone.addEventListener("dragleave", () => zone.classList.remove("dragover"));
  zone.addEventListener("drop", e => { e.preventDefault(); zone.classList.remove("dragover"); uploadGalleryFiles(e.dataTransfer.files); });
  input.addEventListener("change", () => { if (input.files.length) uploadGalleryFiles(input.files); });
}

async function uploadGalleryFiles(files) {
  const slug = document.getElementById("pSlug").value || slugify(document.getElementById("pTitle").value);
  if (!slug) return toast("Set a title first", "error");
  for (const file of files) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(`/api/upload/gallery/${slug}`, { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      window._galleryImages.push(data.path);
    } catch (e) { toast(`Upload failed: ${e.message}`, "error"); }
  }
  renderGalleryPreview(window._galleryImages);
  toast(`${files.length} image(s) uploaded`);
}

// ── Site Info Panel ────────────────────────────────────────────────────
function renderSiteInfo() {
  document.getElementById("sAbout").value = site.aboutText || "";
  document.getElementById("sHomeIntro").value = site.homeIntro || "";
  const c = site.contact || {};
  document.getElementById("sEmail").value = c.email || "";
  const links = c.links || {};
  document.getElementById("sLinkedin").value = links.linkedin || "";
  document.getElementById("sInstagram").value = links.instagram || "";
  document.getElementById("sImdb").value = links.imdb || "";
  document.getElementById("sCrewUnited").value = links["crew-united"] || "";
}

async function saveSiteInfo() {
  const email = document.getElementById("sEmail").value.trim();
  const [emailUser, emailDomain] = email.split("@");
  try {
    await api("/api/site", {
      method: "PUT",
      body: {
        aboutText: document.getElementById("sAbout").value,
        homeIntro: document.getElementById("sHomeIntro").value,
        contact: {
          email,
          emailUser: emailUser || "",
          emailDomain: emailDomain || "",
          links: {
            linkedin: document.getElementById("sLinkedin").value.trim(),
            instagram: document.getElementById("sInstagram").value.trim(),
            imdb: document.getElementById("sImdb").value.trim(),
            "crew-united": document.getElementById("sCrewUnited").value.trim(),
          }
        }
      }
    });
    await loadSite();
    toast("Site info saved");
  } catch (e) { toast(e.message, "error"); }
}

// ── Sonidata Panel ─────────────────────────────────────────────────────
function renderSonidata() {
  const s = site.sonidataSupport || {};
  document.getElementById("sdTitle").value = s.title || "";
  document.getElementById("sdSubtitle").value = s.subtitle || "";
  document.getElementById("sdEmail").value = s.email || "";
  document.getElementById("sdVersion").value = s.version || "";
  renderFaqs(s.faqs || []);

  const p = site.sonidataPrivacy || {};
  document.getElementById("spLastUpdated").value = p.lastUpdated || "";
  document.getElementById("spEmail").value = p.email || "";
}

let faqs = [];

function renderFaqs(data) {
  faqs = [...data];
  const list = document.getElementById("faqList");
  list.innerHTML = faqs.map((f, i) => `
    <div class="info-card" style="padding:14px 16px">
      <div style="display:flex;justify-content:space-between;align-items:start;gap:12px">
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;font-size:13px;margin-bottom:4px">${esc(f.question)}</div>
          <div style="font-size:12px;color:var(--text-secondary);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(f.answer)}</div>
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0">
          <button class="btn btn-outline btn-sm" onclick="editFaq(${i})">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="removeFaq(${i})">×</button>
        </div>
      </div>
    </div>
  `).join("");
}

function addFaq() {
  faqs.push({ question: "New question?", answer: "Answer here." });
  renderFaqs(faqs);
  editFaq(faqs.length - 1);
}

function editFaq(i) {
  const f = faqs[i];
  const q = prompt("Question:", f.question);
  if (q === null) return;
  const a = prompt("Answer:", f.answer);
  if (a === null) return;
  faqs[i] = { question: q, answer: a };
  renderFaqs(faqs);
}

function removeFaq(i) {
  faqs.splice(i, 1);
  renderFaqs(faqs);
}

async function saveSonidataSupport() {
  try {
    await api("/api/site/sonidata-support", {
      method: "PUT",
      body: {
        title: document.getElementById("sdTitle").value.trim(),
        subtitle: document.getElementById("sdSubtitle").value.trim(),
        email: document.getElementById("sdEmail").value.trim(),
        version: document.getElementById("sdVersion").value.trim(),
        faqs,
      }
    });
    await loadSite();
    toast("Sonidata Support saved");
  } catch (e) { toast(e.message, "error"); }
}

async function saveSonidataPrivacy() {
  try {
    await api("/api/site/sonidata-privacy", {
      method: "PUT",
      body: {
        lastUpdated: document.getElementById("spLastUpdated").value.trim(),
        email: document.getElementById("spEmail").value.trim(),
      }
    });
    await loadSite();
    toast("Sonidata Privacy saved");
  } catch (e) { toast(e.message, "error"); }
}

// ── Deploy Panel ───────────────────────────────────────────────────────
async function loadGitStatus() {
  try {
    const data = await api("/api/git/status");
    document.getElementById("gitBranch").textContent = data.branch;
    document.getElementById("gitLastCommit").textContent = data.lastCommit;
    const list = document.getElementById("gitFileList");
    const clean = document.getElementById("gitClean");
    if (data.clean) {
      list.innerHTML = "";
      clean.style.display = "block";
    } else {
      clean.style.display = "none";
      const statusColors = { "M": "var(--yellow)", "A": "var(--green)", "D": "var(--red)", "??": "var(--accent)" };
      const statusLabels = { "M": "Modified", "A": "Added", "D": "Deleted", "??": "Untracked" };
      list.innerHTML = `<div style="margin-bottom:8px;color:var(--yellow);font-weight:600">${data.files.length} changed file(s)</div>` +
        data.files.map(f => {
          const color = statusColors[f.status] || "var(--text-secondary)";
          const label = statusLabels[f.status] || f.status;
          return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;font-family:'SF Mono',Menlo,monospace">
            <span style="color:${color};font-weight:700;min-width:70px">${label}</span>
            <span style="color:var(--text-secondary)">${esc(f.file)}</span>
          </div>`;
        }).join("");
    }
  } catch (e) { toast("Failed to load git status: " + e.message, "error"); }
}

let deploying = false;

async function startDeploy() {
  if (deploying) return;
  if (!await confirmDialog("Build, commit, and push to GitHub Pages?", { label: "Deploy" })) return;

  deploying = true;
  const btn = document.getElementById("deployBtn");
  const log = document.getElementById("deployLog");
  btn.disabled = true;
  btn.textContent = "⏳ Deploying...";
  log.style.display = "block";
  log.innerHTML = "";

  const addLine = (text, color = "var(--text-secondary)") => {
    const line = document.createElement("div");
    line.style.color = color;
    line.textContent = text;
    log.appendChild(line);
    log.scrollTop = log.scrollHeight;
  };

  try {
    const es = new EventSource("/api/deploy");
    es.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "log") {
        addLine(msg.data, msg.data.startsWith("==>") ? "var(--accent)" : "var(--text-secondary)");
      } else if (msg.type === "stderr") {
        addLine(msg.data, "var(--yellow)");
      } else if (msg.type === "done") {
        addLine("✓ " + msg.data, "var(--green)");
        es.close();
        deploying = false;
        btn.disabled = false;
        btn.textContent = "🚀 Deploy Now";
        toast("Deploy complete!", "success");
        loadGitStatus();
      } else if (msg.type === "error") {
        addLine("✗ " + msg.data, "var(--red)");
        es.close();
        deploying = false;
        btn.disabled = false;
        btn.textContent = "🚀 Deploy Now";
        toast("Deploy failed", "error");
      }
    };
    es.onerror = () => {
      addLine("Connection lost", "var(--red)");
      es.close();
      deploying = false;
      btn.disabled = false;
      btn.textContent = "🚀 Deploy Now";
    };
  } catch (e) {
    addLine("Failed to start: " + e.message, "var(--red)");
    deploying = false;
    btn.disabled = false;
    btn.textContent = "🚀 Deploy Now";
  }
}

// ── Init ───────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  // Nav
  document.querySelectorAll(".nav-item").forEach(n => {
    n.addEventListener("click", () => {
      switchPanel(n.dataset.panel);
      if (n.dataset.panel === "deploy") loadGitStatus();
    });
  });

  setupPosterUpload();
  setupGalleryUpload();

  // Close modal on overlay click
  document.getElementById("projectModal").addEventListener("click", e => {
    if (e.target === e.currentTarget) closeProjectModal();
  });

  // Keyboard: Escape closes modal
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeProjectModal();
  });

  // Load data
  loadProjects();
  loadSite();
});
