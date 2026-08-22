# nathanaelkenzler.org

A modern portfolio built with vanilla HTML, CSS, and JavaScript. Showcases marketing strategy, AI/ML work, and photography.

## Features

- Responsive design, mobile-first
- Zero dependencies - no build step required
- Fast animations and smooth transitions
- JSON-driven content system
- RSS feed for blog posts
- Dark mode support

## Project Structure

```
.
├── index.html                    # Homepage
├── pages/                        # Individual pages
│   ├── about.html
│   ├── projects.html
│   ├── blog.html
│   ├── photography.html
│   └── uses.html
├── css/
│   └── style.css                 # All styles
├── js/
│   ├── nav-transition.js         # Navigation animations
│   └── [utilities]
├── assets/                       # Images and media
├── portfolio-content.json         # Projects and blog metadata
├── campaign_interactive.json      # Campaign case study data
├── rss.xml                       # Auto-generated RSS feed
└── scripts/                      # Build and automation tools
```

## Local Development

Run a local server to test:

```bash
python -m http.server 3000
# or
npx serve -l 3000 .
```

Then visit `http://localhost:3000`

## Deployment

Push to `main` branch - GitHub Actions automatically deploys to the live site.

## Content

Projects and blog posts are managed via `portfolio-content.json`. Add entries there with title, slug, date, and description.

## License

Copyright 2026 Nathanael Kenzler. All rights reserved.
