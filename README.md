# Gaston Ibarroule Portfolio

A minimal, responsive portfolio website for sound designer, composer, sound editor, and mixer Gaston Ibarroule.

## Project Overview

This is a static portfolio website built with HTML, CSS, and vanilla JavaScript. It features a clean, minimalist design with a dark theme inspired by Apple's design language. The site showcases Gaston's work and provides information about his professional background in audio production.

## Features

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Dark Theme**: Clean black and grey color scheme (#1c1c1e, #333333, #f2f2f5)
- **Project Showcase**: Displays featured projects with titles, roles, and years
- **Content Management**: JSON-based content system for easy updates
- **Web Scraping**: Automated project data collection from IMDb and Crew United
- **Custom Domain**: Configured for www.gastibarroule.com

## Setup Instructions

### Prerequisites

- Node.js v20.x (recommended: v20.2.1 or higher)
- Git
- A modern web browser

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gaston-ibarroule-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment (optional for scraping):
   ```bash
   # Copy and edit .env file if using AI features
   cp .env.example .env
   # Add your OpenAI API key if needed
   ```

## Usage

### Local Development

Start a local HTTP server to preview the site:

```bash
# Using Node.js http-server
npx http-server . -p 8080

# Or using Python
python -m http.server 8080

# Or using PHP
php -S localhost:8080
```

Visit `http://localhost:8080` in your browser.

### Content Management

Edit `content.json` to update:
- Personal information (name, bio)
- Project listings
- Legal/company information

Example content structure:
```json
{
  "name": "Gaston Ibarroule",
  "briefBio": "Your brief bio here",
  "detailedBio": "Detailed biography for the about page",
  "projects": [
    {
      "title": "Project Title",
      "role": "Sound Designer",
      "year": "2023"
    }
  ],
  "legal": {
    "companyName": "Company Name",
    "address": "Business Address",
    "vatNumber": "VAT Number"
  }
}
```

### Available Scripts

- `npm run scrape` - Run the web scraping script to collect project data from IMDb and Crew United
- `npm run gen-css` - Generate AI-powered CSS styling (optional, requires OpenAI API key)

### Web Scraping

To automatically populate projects from your professional profiles:

1. Run the scraping script:
   ```bash
   npm run scrape
   ```

2. When prompted, enter your:
   - IMDb profile URL
   - Crew United profile URL

The script will extract project information and add it to your `content.json` file.

## Deployment

### GitHub Pages

1. Create a new repository on GitHub named `gaston-ibarroule-portfolio`

2. Add the remote and push:
   ```bash
   git remote add origin git@github.com:YOUR_USERNAME/gaston-ibarroule-portfolio.git
   git push -u origin main
   ```

3. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save settings

4. Configure custom domain (optional):
   - In the Pages settings, add your custom domain: `www.gastibarroule.com`
   - The CNAME file is already included in the repository

### DNS Configuration

For the custom domain `www.gastibarroule.com`, add these A records to your DNS provider:

```
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www gastibarroule.com
```

## File Structure

```
gaston-ibarroule-portfolio/
├── index.html          # Homepage
├── about.html          # About page
├── contact.html        # Contact page
├── styles.css          # Main stylesheet
├── loadContent.js      # Content loading script
├── scrape.js          # Web scraping script
├── content.json       # Content data
├── package.json       # Node.js dependencies
├── CNAME              # Custom domain configuration
├── README.md          # This file
└── .env               # Environment variables (not tracked)
```

## Customization

### Styling

The site uses a minimal CSS approach with CSS custom properties for easy theming. Key color variables:

- Background: `#1c1c1e`
- Text: `#f2f2f5`
- Accent: `#333333`

### Content Structure

All content is managed through `content.json`. The JavaScript automatically populates:
- Homepage: name, brief bio, featured projects
- About page: detailed biography
- Contact page: contact information
- Footer: legal information

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This project is licensed under the ISC License.

## Contact

For questions about this portfolio site, please contact Gaston Ibarroule.

---

Built with ❤️ using HTML, CSS, JavaScript, and Node.js
