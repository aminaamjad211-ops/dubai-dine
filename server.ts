import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/api';
import { loadRestaurants } from './server/storage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API endpoints
app.use('/api', apiRouter);

// Robots.txt endpoint
app.get('/robots.txt', (_req, res) => {
  const robotsPath = path.join(process.cwd(), 'public', 'robots.txt');
  if (fs.existsSync(robotsPath)) {
    res.header('Content-Type', 'text/plain');
    res.sendFile(robotsPath);
  } else {
    res.header('Content-Type', 'text/plain');
    res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /#admin\nSitemap: https://dinedubai.guide/sitemap.xml\n`);
  }
});

// Sitemap.xml endpoint for search engine indexing
app.get(['/sitemap.xml', '/api/sitemap.xml'], (_req, res) => {
  const baseUrl = 'https://dinedubai.guide';
  const restaurants = loadRestaurants();
  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    { loc: '', changefreq: 'daily', priority: '1.0' },
    { loc: '#about', changefreq: 'monthly', priority: '0.8' },
    { loc: '#contact', changefreq: 'monthly', priority: '0.7' },
    { loc: '#privacy-policy', changefreq: 'yearly', priority: '0.5' },
    { loc: '#terms-and-conditions', changefreq: 'yearly', priority: '0.5' },
    { loc: '#cookie-policy', changefreq: 'yearly', priority: '0.5' },
    { loc: '#faq', changefreq: 'monthly', priority: '0.8' },
    { loc: '#editorial-policy', changefreq: 'monthly', priority: '0.8' },
    { loc: '#advertising-disclosure', changefreq: 'yearly', priority: '0.5' },
    { loc: '#affiliate-disclosure', changefreq: 'yearly', priority: '0.5' },
    { loc: '#corrections', changefreq: 'weekly', priority: '0.8' },
    { loc: '#sitemap', changefreq: 'weekly', priority: '0.7' },
  ];

  const neighbourhoods = [
    'downtown-dubai',
    'dubai-marina',
    'jbr',
    'deira',
    'bur-dubai',
    'business-bay',
    'difc',
    'jumeirah',
    'al-barsha',
    'palm-jumeirah',
  ];

  const guides = [
    'indian-restaurants',
    'pakistani-restaurants',
    'arabic-restaurants',
    'italian-restaurants',
    'chinese-restaurants',
    'japanese-restaurants',
    'affordable-restaurants',
    'family-friendly-dining',
    'rooftop-restaurants',
    'waterfront-restaurants',
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Core & Essential Pages
  for (const page of staticPages) {
    xml += `  <url>\n    <loc>${baseUrl}/${page.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
  }

  // 10 Neighbourhood Pages
  for (const n of neighbourhoods) {
    xml += `  <url>\n    <loc>${baseUrl}/#neighbourhood/${n}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  // 10 Cuisine Guides
  for (const g of guides) {
    xml += `  <url>\n    <loc>${baseUrl}/#guide/${g}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  }

  // Verified Individual Restaurants (50-60+ listings)
  for (const r of restaurants) {
    const lastMod = r.verification?.lastCheckedAt ? r.verification.lastCheckedAt.split('T')[0] : today;
    xml += `  <url>\n    <loc>${baseUrl}/#restaurant/${r.slug}</loc>\n    <lastmod>${lastMod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  }

  xml += `</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

// Serve static assets from dist
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback to index.html for SPA routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`DineDubai server running on port ${PORT}`);
});
