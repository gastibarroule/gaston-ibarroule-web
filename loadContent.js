// Load content from content.json and populate the page
document.addEventListener('DOMContentLoaded', function() {
  fetch('content.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to load content');
      }
      return response.json();
    })
    .then(data => {
      // Populate name on homepage
      const nameElement = document.getElementById('name');
      if (nameElement) {
        nameElement.textContent = data.name || 'Gaston Ibarroule';
      }
      
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
      
      // Populate projects on homepage
      const projectsElement = document.getElementById('projects');
      if (projectsElement && data.projects && data.projects.length > 0) {
        projectsElement.innerHTML = '<h2>Featured Projects</h2>';
        
        // Show up to 5 featured projects
        const featuredProjects = data.projects.slice(0, 5);
        
        featuredProjects.forEach(project => {
          const projectDiv = document.createElement('div');
          projectDiv.className = 'project';
          
          const title = project.title || 'Untitled Project';
          const role = project.role || 'Sound Designer';
          const year = project.year || '';
          
          projectDiv.innerHTML = `
            <h3>${title}</h3>
            <p>${role}${year ? ` (${year})` : ''}</p>
          `;
          
          projectsElement.appendChild(projectDiv);
        });
      }
      
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
});

// Function to add legal footer
function addLegalFooter(legalData) {
  if (!legalData || !legalData.companyName) {
    return;
  }
  
  const footer = document.createElement('footer');
  footer.style.cssText = `
    margin-top: 4rem;
    padding: 2rem 1rem 1rem 1rem;
    border-top: 1px solid #333333;
    font-size: 0.8rem;
    color: #cccccc;
    text-align: center;
  `;
  
  let footerContent = `<p>&copy; ${new Date().getFullYear()} ${legalData.companyName}`;
  
  if (legalData.address) {
    footerContent += `<br>${legalData.address}`;
  }
  
  if (legalData.vatNumber) {
    footerContent += `<br>VAT: ${legalData.vatNumber}`;
  }
  
  footerContent += '</p>';
  
  footer.innerHTML = footerContent;
  document.body.appendChild(footer);
}
