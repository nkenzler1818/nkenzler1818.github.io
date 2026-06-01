#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read portfolio content
const contentPath = path.join(__dirname, '../portfolio-content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

// Helper to format date as RFC 2822
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toUTCString();
}

// Generate RSS items
function generateItems() {
  let items = '';

  // Blog posts
  content.blog.forEach(post => {
    items += `    <item>
      <title>Blog: ${post.title}</title>
      <link>${post.link}</link>
      <guid>${post.link}#${post.slug}</guid>
      <pubDate>${formatDate(post.pubDate)}</pubDate>
      <category>Blog</category>
      <description><![CDATA[
        ${post.description}
      ]]></description>
    </item>\n`;
  });

  // Projects
  content.projects.forEach(project => {
    items += `    <item>
      <title>Project: ${project.title}</title>
      <link>${project.link}</link>
      <guid>${project.link}#${project.slug}</guid>
      <pubDate>${formatDate(project.pubDate)}</pubDate>
      <category>Projects</category>
      <description><![CDATA[
        ${project.description}
      ]]></description>
    </item>\n`;
  });

  return items;
}

// Generate RSS feed
function generateRSS() {
  const lastBuildDate = new Date().toUTCString();

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="rss-style.xslt"?>
<rss version="2.0">
  <channel>
    <title>Nathanael Kenzler Portfolio Updates</title>
    <link>https://nathanaelkenzler.org</link>
    <description>New projects and blog posts from my personal portfolio.</description>
    <language>en-us</language>
    <generator>Automated Portfolio RSS</generator>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>

${generateItems()}
  </channel>
</rss>`;

  return rss;
}

// Write RSS file
const rssPath = path.join(__dirname, '../rss.xml');
const rssContent = generateRSS();
fs.writeFileSync(rssPath, rssContent, 'utf8');
console.log('✓ RSS feed generated at', rssPath);
