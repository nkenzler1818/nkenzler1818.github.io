# Portfolio Site: nathanaelkenzler.org

A modern, performant portfolio website built with vanilla HTML, CSS, and JavaScript. Showcases marketing strategy work, AI/ML projects, photography, and professional writing.

## Live Site

Visit: https://nathanaelkenzler.org

## Features

- **Responsive Design**: Mobile-first, works on all devices
- **Zero Dependencies**: Vanilla HTML/CSS/JS (no build step required)
- **Fast**: Optimized animations, lazy-loaded modals
- **JSON-Driven Content**: Easy to update projects and blog posts
- **RSS Feed**: Automated blog syndication
- **Dark Mode**: Built-in theme support
- **Smooth Transitions**: Custom navigation animations

## Project Structure

```
.
├── index.html              # Homepage
├── pages/                  # Individual pages
│   ├── about.html
│   ├── projects.html
│   ├── blog.html
│   ├── photography.html
│   └── uses.html
├── css/
│   └── style.css           # All styles
├── js/
│   ├── nav-transition.js   # Navigation animations
│   └── [other utilities]
├── assets/                 # Images and media
├── portfolio-content.json   # Projects and blog metadata
├── campaign_interactive.json # Campaign case study data
├── rss.xml                 # Auto-generated RSS feed
└── scripts/                # Build and automation tools
```

## Content Structure

### portfolio-content.json

Defines all projects and blog posts. Format:

```json
{
  "blog": [
    {
      "title": "Post Title",
      "slug": "post-slug",
      "link": "https://nathanaelkenzler.org/pages/blog.html",
      "pubDate": "2026-08-22",
      "description": "Short description"
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "slug": "project-slug",
      "link": "https://nathanaelkenzler.org/projects.html",
      "pubDate": "2026-08-22",
      "description": "Project overview"
    }
  ]
}
```

To add a project or blog post:
1. Add entry to `portfolio-content.json` with title, slug, link, date, and description
2. Create corresponding page in `pages/`
3. Links in the portal reference these slugs

## Local Development

### Requirements

- Any modern web browser
- Optional: Python 3 for simple HTTP server (for testing)

### Running Locally

Option 1: Direct file access
```bash
# Just open index.html in your browser
open index.html
```

Option 2: Local server (recommended for testing)
```bash
# Python 3
python -m http.server 3000

# Then visit http://localhost:3000
```

Option 3: Using Node npx
```bash
# Requires Node.js
npx serve -l 3000 .

# Then visit http://localhost:3000
```

## Deployment

The site is deployed to GitHub Pages automatically when you push to main:

1. Ensure you have push access to the repo
2. Make changes locally and test
3. Commit and push to `main` branch
4. GitHub Actions automatically deploys to https://nathanaelkenzler.org

No build step needed. The site is served as-is.

## RSS Feed

The RSS feed at `/rss.xml` is auto-generated from `portfolio-content.json` and blog posts.

To regenerate:
```bash
# The feed is auto-generated on each commit via GitHub Actions
# No manual action needed

# To view feed subscribers and stats:
# Use a service like Feedly or your RSS reader
```

The feed validates at: https://validator.w3.org/feed/

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Lighthouse Score: 95+ (mobile and desktop)
- No external JavaScript frameworks
- CSS animations use GPU acceleration
- Modal content lazy-loaded on demand

## Accessibility

- WCAG 2.1 Level AA compliant
- Semantic HTML structure
- Keyboard navigation supported
- Color contrast meets standards
- Alt text on all images

## License

Copyright 2026 Nathanael Kenzler. All rights reserved.

## Contact

Find contact information on the About page at https://nathanaelkenzler.org/pages/about.html

---

### Technical Notes

#### Navigation Animation
The navigation pill animation uses `sessionStorage` to avoid flashing on page transitions. See `js/nav-transition.js`.

#### Modal Behavior
Modals use SimpleBar library for custom scrolling. The backdrop prevents body scroll while modal is open (CSS `overflow: hidden`).

#### Image Optimization
Photography gallery images are optimized for web. Originals are stored separately and not tracked in Git.

#### File Size Considerations
The site is designed to be lightweight. `index.html` is large (70KB) because it contains all home page content inline for fast first paint.

If making major additions:
- Consider splitting large pages into separate files
- Use lazy loading for below-fold content
- Optimize image sizes with WebP fallbacks
