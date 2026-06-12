/**
 * prerender.mjs — Renders the built SPA in a headless browser and writes the
 * resulting HTML back into dist/index.html so that non-JS crawlers (search
 * bots, link-preview fetchers, AWS Activate checks) receive real content
 * instead of an empty <div id="root"></div>.
 *
 * Usage:  node scripts/prerender.mjs          (called by the "postbuild" npm script)
 * Requires: puppeteer-core (devDependency) + system Chromium
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { createServer } from 'http';
import { resolve, join, extname } from 'path';
import puppeteer from 'puppeteer-core';

// Locate system Chromium
const CHROME_PATH = execSync(
  'which chromium-browser || which chromium || which google-chrome-stable || which google-chrome',
  { encoding: 'utf-8' },
).trim();

const DIST = resolve('dist');
const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.png':  'image/png',
  '.webp': 'image/webp',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
  '.xml':  'application/xml',
  '.txt':  'text/plain',
  '.ico':  'image/x-icon',
};

/** Tiny static file server for the dist folder. */
function serve() {
  return new Promise((res) => {
    const srv = createServer((req, reply) => {
      let filePath = join(DIST, req.url === '/' ? 'index.html' : req.url);
      try {
        const data = readFileSync(filePath);
        const ext = extname(filePath);
        reply.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        reply.end(data);
      } catch {
        // SPA fallback — serve index.html for any unknown route
        const html = readFileSync(join(DIST, 'index.html'));
        reply.writeHead(200, { 'Content-Type': 'text/html' });
        reply.end(html);
      }
    });
    srv.listen(0, () => {
      const port = srv.address().port;
      console.log(`  ➜  Static server running at http://localhost:${port}`);
      res({ srv, port });
    });
  });
}

async function prerender() {
  const { srv, port } = await serve();
  const origin = `http://localhost:${port}`;

  // Launch headless Chromium and render the page
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.goto(origin, { waitUntil: 'networkidle0', timeout: 30_000 });

  // Give GSAP animations a moment to settle, then grab the HTML
  await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
  const html = await page.content();

  await browser.close();
  srv.close();

  // Write the pre-rendered HTML back to dist/index.html
  writeFileSync(join(DIST, 'index.html'), html, 'utf-8');

  // Quick sanity check
  const output = readFileSync(join(DIST, 'index.html'), 'utf-8');
  const hasContent = output.includes('Digitalized Plantation') && !output.includes('<div id="root"></div>');
  if (hasContent) {
    console.log('  ✅  Prerender successful — dist/index.html now contains rendered content.');
  } else {
    console.error('  ❌  Prerender may have failed — root div appears empty.');
    process.exit(1);
  }
}

prerender().catch(err => {
  console.error('Prerender error:', err);
  process.exit(1);
});
