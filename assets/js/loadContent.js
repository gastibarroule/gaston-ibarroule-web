// Load content from content.json and populate the page
document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  fetch('data/content.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load content');
      }
      return response.json();
    })
    .then(data => {
      // Brand + page heading name
      const brand = document.querySelector('.brand');
      if (brand && data.name) brand.textContent = data.name;
      const nameElement = document.getElementById('name');
      if (nameElement) nameElement.textContent = data.name || 'Gaston Ibarroule';
      
      // Populate brief bio on homepage
      const bioElement = document.getElementById('bio');
      if (bioElement) {
        bioElement.textContent = data.briefBio || 'Sound Designer, Composer, Sound Editor, and Mixer';
      }
      
      // Populate detailed bio on about page
      const detailedBioElement = document.getElementById('detailedBio');
      if (detailedBioElement) {
        const detailedBio = data.detailedBio || data.briefBio || 'More information about Gaston Ibarroule coming soon.';
        detailedBioElement.innerHTML = `<p>${detailedBio}</p>`;
      }
      
      // Populate projects on homepage (grid with role filters)
      const projectsGrid = document.getElementById('projectsGrid');
      const filters = document.getElementById('roleFilters');
      let allProjects = Array.isArray(data.projects) ? data.projects : [];
      
      function renderProjects(roleFilter = 'all') {
        if (!projectsGrid) return;
        const selected = roleFilter === 'all' ? allProjects : allProjects.filter(p => (p.role || '').toLowerCase().includes(roleFilter.toLowerCase()));
        const featured = selected.slice(0, 5);
        projectsGrid.innerHTML = '';
        featured.forEach(project => {
          const projectCard = document.createElement('div');
          projectCard.className = 'project';
          const title = project.title || 'Untitled Project';
          const role = project.role || 'Sound Designer';
          const year = project.year || '';
          projectCard.innerHTML = `
            <h3>${title}</h3>
            <p>${role}${year ? ` (${year})` : ''}</p>
          `;
          projectsGrid.appendChild(projectCard);
        });
      }
      
      if (filters && projectsGrid) {
        filters.addEventListener('click', (e) => {
          const btn = e.target.closest('.filter-btn');
          if (!btn) return;
          filters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          renderProjects(btn.dataset.role);
        });
      }
      renderProjects('all');
      
      // Populate contact information
      const contactsElement = document.getElementById('contacts');
      if (contactsElement) {
        // Add default contact methods - can be customized based on data
        contactsElement.innerHTML = `
          <li><a href="mailto:contact@gastibarroule.com">Email: contact@gastibarroule.com</a></li>
          <li><a href="#" target="_blank">Professional Profile</a></li>
        `;
      }
      
      // Add legal footer if legal information is available
      addLegalFooter(data.legal);
    })
    .catch(error => {
      console.error('Error loading content:', error);
      
      // Fallback content if loading fails
      const nameElement = document.getElementById('name');
      if (nameElement) {
        nameElement.textContent = 'Gaston Ibarroule';
      }
      
      const bioElement = document.getElementById('bio');
      if (bioElement) {
        bioElement.textContent = 'Sound Designer, Composer, Sound Editor, and Mixer';
      }
      
      const detailedBioElement = document.getElementById('detailedBio');
      if (detailedBioElement) {
        detailedBioElement.innerHTML = '<p>Sound Designer, Composer, Sound Editor, and Mixer with extensive experience in film and audio production.</p>';
      }
    });

  // Setup interactions once DOM is ready
  setupGlitchInteractions();
  setupLinkTransitions();
});

// Function to add legal footer
function addLegalFooter(legalData) {
  const container = document.getElementById('legalFooter');
  if (!container || !legalData || !legalData.companyName) return;
  let html = `&copy; ${new Date().getFullYear()} ${legalData.companyName}`;
  if (legalData.address) html += `<br>${legalData.address}`;
  if (legalData.vatNumber) html += `<br>VAT: ${legalData.vatNumber}`;
  container.innerHTML = `<p>${html}</p>`;
}

// Highlight active navigation link
function setActiveNav() {
  const links = document.querySelectorAll('.nav-links a');
  if (!links.length) return;
  const path = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(a => {
    const hrefFile = a.getAttribute('href');
    if (hrefFile === path || (path === '' && hrefFile === 'index.html')) {
      a.classList.add('active');
    }
  });
}

// Animate brand text like a subtle sound wave using GSAP
function animateBrandWave() { /* disabled per design request */ }

// Helper: pick a per-element scale based on type
function glitchScale(el) {
  if (el.classList.contains('filter-btn')) return 0.8;
  if (el.closest && el.closest('.nav-links')) return 0.7;
  if (el.closest && el.closest('.project')) return 1.2;
  if (el.classList && el.classList.contains('brand')) return 0.9;
  return 1.0;
}

// Glitch interactions using GSAP
function setupGlitchInteractions() {
  if (!window.gsap) return;
  document.querySelectorAll('.brand, .nav-links a, .project h3, .project p, .filter-btn').forEach(el => {
    el.classList.add('glitchable');
    el.addEventListener('mouseenter', () => glitch(el));
    el.addEventListener('mouseleave', () => resetGlitch(el));
    el.addEventListener('click', () => clickGlitch(el));
  });
}

function glitch(el) {
  if (!window.gsap) return;
  gsap.killTweensOf(el);
  const s = glitchScale(el);
  const jitter = 2 + Math.floor(Math.random() * 4); // 2..5 steps
  const variant = Math.floor(Math.random() * 3); // 0..2
  const dx = (Math.random() * 6 - 3) * s;
  const dy = (Math.random() * 4 - 2) * s;
  const skew = (Math.random() * 6 - 3) * s;
  let filterStr = 'contrast(112%) saturate(112%)';
  if (variant === 1) filterStr = `hue-rotate(${(Math.random() * 24 - 12).toFixed(1)}deg)`;
  if (variant === 2) filterStr = `blur(${(Math.random() * 0.6).toFixed(2)}px)`;
  gsap.to(el, {
    duration: 0.06 + Math.random() * 0.06,
    x: dx,
    y: dy,
    skewX: skew,
    filter: filterStr,
    repeat: jitter,
    yoyo: true,
    ease: 'none'
  });
}

function resetGlitch(el) {
  if (!window.gsap) return;
  gsap.to(el, { duration: 0.2, x: 0, y: 0, skewX: 0, filter: 'none', ease: 'power2.out' });
}

function clickGlitch(el) {
  if (!window.gsap) return;
  const s = glitchScale(el) * 1.3;
  gsap.fromTo(el,
    { opacity: 1, x: 0, y: 0, skewX: 0 },
    { opacity: 0.7, x: (Math.random() * 8 - 4) * s, y: (Math.random() * 6 - 3) * s, skewX: (Math.random() * 8 - 4) * s, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' }
  );
}

// Page transition on link clicks
function setupLinkTransitions() {
  if (!window.gsap) return;
  const overlay = document.getElementById('pageOverlay');
  if (!overlay) return;
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http')) return;
    e.preventDefault();
    gsap.timeline()
      .set(overlay, { pointerEvents: 'auto' })
      .to(overlay, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.in' })
      .call(() => { window.location.href = href; });
  });
  gsap.to(overlay, { y: '100%', opacity: 0, duration: 0.4, delay: 0.05, ease: 'power2.out', onComplete: () => {
    overlay.style.pointerEvents = 'none';
  }});
}

// Scroll navigation disabled per design request
function setupScrollNavigation() { /* no-op */ }
