/**
 * prerender.mjs — Renders the built SPA in a headless browser and writes the
 * resulting HTML back into dist/index.html so that non-JS crawlers (search
 * bots, link-preview fetchers, AWS Activate checks) receive real content
 * instead of an empty <div id="root"></div>.
 *
 * When no browser is available (e.g. Vercel CI), the script exits gracefully
 * so the build still succeeds — the static meta tags, OG tags, JSON-LD, and
 * sitemap.xml already cover most crawler/link-preview needs.
 *
 * Usage:  node scripts/prerender.mjs   (called automatically by "postbuild")
 * Requires: puppeteer-core (devDependency) + a system Chromium/Chrome
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { resolve, join, extname } from 'path';

const DIST = resolve('dist');

// ---------------------------------------------------------------------------
// 1. Find a usable browser, or bail out gracefully
// ---------------------------------------------------------------------------
function findChrome() {
  const candidates = [
    'chromium-browser',
    'chromium',
    'google-chrome-stable',
    'google-chrome',
  ];
  for (const bin of candidates) {
    try {
      const path = execSync(`which ${bin} 2>/dev/null`, { encoding: 'utf-8' }).trim();
      if (path) return path;
    } catch { /* not found, try next */ }
  }
  return null;
}

const CHROME_PATH = findChrome();

if (!CHROME_PATH) {
  console.log('  ⚠  No Chrome/Chromium found — skipping prerender (CI/Vercel detected).');
  console.log('     Meta tags, OG tags, JSON-LD, robots.txt, and sitemap.xml are still present.');
  process.exit(0);
}

console.log(`  ➜  Using browser: ${CHROME_PATH}`);

// ---------------------------------------------------------------------------
// 2. Tiny static file server for the dist folder
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.ico': 'image/x-icon',
};

function serve() {
  return new Promise((res) => {
    const srv = createServer((req, reply) => {
      const filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);
      try {
        const data = readFileSync(filePath);
        reply.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        reply.end(data);
      } catch {
        // SPA fallback
        const html = readFileSync(join(DIST, 'index.html'));
        reply.writeHead(200, { 'Content-Type': 'text/html' });
        reply.end(html);
      }
    });
    srv.listen(0, () => {
      const port = srv.address().port;
      console.log(`  ➜  Static server on http://localhost:${port}`);
      res({ srv, port });
    });
  });
}

// ---------------------------------------------------------------------------
// 3. Prerender
// ---------------------------------------------------------------------------
async function prerender() {
  const puppeteer = await import('puppeteer-core');
  const { srv, port } = await serve();

  const browser = await puppeteer.default.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0', timeout: 30_000 });

  // Let GSAP animations settle
  await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
  const html = await page.content();

  await browser.close();
  srv.close();

  writeFileSync(join(DIST, 'index.html'), html, 'utf-8');

  // Sanity check
  const hasContent = html.includes('Digitalized Plantation') && !html.includes('<div id="root"></div>');
  if (hasContent) {
    console.log('  ✅  Prerender successful — dist/index.html contains rendered content.');
  } else {
    console.error('  ❌  Prerender may have failed — root div appears empty.');
    process.exit(1);
  }
}

prerender().catch(err => {
  console.error('Prerender error:', err);
  process.exit(1);
});
