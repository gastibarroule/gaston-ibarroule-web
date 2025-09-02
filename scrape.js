const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Selector maps for different sites
const selectorMaps = {
  imdb: {
    title: '.titleColumn a, .cli-title a, h1[data-testid="hero-title-block__title"]',
    role: '.secondaryColumn, .cli-title-metadata, [data-testid="title-pc-principal-credit"]',
    year: '.titleColumn .secondaryText, .cli-title-metadata, [data-testid="title-details-releasedate"]'
  },
  crewunited: {
    title: '.project-title, h1.title, .film-title',
    role: '.credit-role, .role, .function',
    year: '.year, .date, .production-year'
  }
};

// Function to scrape a website
async function scrapeSite(url, selectors) {
  try {
    console.log(`Scraping: ${url}`);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    const projects = [];
    
    // Try to find project listings
    const titleElements = $(selectors.title);
    
    titleElements.each((index, element) => {
      const title = $(element).text().trim();
      if (title && title.length > 0) {
        let role = '';
        let year = '';
        
        // Try to find role and year in nearby elements
        const parent = $(element).parent().parent();
        const roleElement = parent.find(selectors.role).first();
        const yearElement = parent.find(selectors.year).first();
        
        if (roleElement.length > 0) {
          role = roleElement.text().trim();
        }
        
        if (yearElement.length > 0) {
          const yearText = yearElement.text().trim();
          const yearMatch = yearText.match(/(\d{4})/);
          if (yearMatch) {
            year = yearMatch[1];
          }
        }
        
        if (title && title !== 'Known For' && title !== 'Filmography') {
          projects.push({
            title: title,
            role: role || 'Sound Designer',
            year: year || 'Unknown'
          });
        }
      }
    });
    
    return projects;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error.message);
    return [];
  }
}

// Function to get user input
function getUserInput(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main function
async function main() {
  console.log('=== Portfolio Project Scraper ===\n');
  
  // Get URLs from user
  const imdbUrl = await getUserInput('Enter your IMDb profile URL (or press Enter to skip): ');
  const crewunitedUrl = await getUserInput('Enter your Crew United profile URL (or press Enter to skip): ');
  
  let allProjects = [];
  
  // Scrape IMDb if URL provided
  if (imdbUrl.trim()) {
    const imdbProjects = await scrapeSite(imdbUrl, selectorMaps.imdb);
    allProjects = allProjects.concat(imdbProjects);
    console.log(`Found ${imdbProjects.length} projects from IMDb`);
  }
  
  // Scrape Crew United if URL provided
  if (crewunitedUrl.trim()) {
    const crewunitedProjects = await scrapeSite(crewunitedUrl, selectorMaps.crewunited);
    allProjects = allProjects.concat(crewunitedProjects);
    console.log(`Found ${crewunitedProjects.length} projects from Crew United`);
  }
  
  if (allProjects.length === 0) {
    console.log('No projects found. You can manually add projects to content.json later.');
    return;
  }
  
  // Read existing content.json
  const contentPath = path.resolve(__dirname, 'content.json');
  let content;
  
  try {
    content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
  } catch (error) {
    console.error('Error reading content.json:', error.message);
    return;
  }
  
  // Add scraped projects to existing projects array
  content.projects = content.projects.concat(allProjects);
  
  // Remove duplicates based on title
  const uniqueProjects = [];
  const seen = new Set();
  
  for (const project of content.projects) {
    const key = project.title.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      uniqueProjects.push(project);
    }
  }
  
  content.projects = uniqueProjects;
  
  // Write updated content back to file
  try {
    fs.writeFileSync(contentPath, JSON.stringify(content, null, 2));
    console.log(`\nSuccessfully updated content.json with ${uniqueProjects.length} total projects.`);
    console.log('Projects added:');
    allProjects.forEach(project => {
      console.log(`- ${project.title} (${project.year}) - ${project.role}`);
    });
  } catch (error) {
    console.error('Error writing to content.json:', error.message);
  }
}

// Run the scraper
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { scrapeSite, selectorMaps };
