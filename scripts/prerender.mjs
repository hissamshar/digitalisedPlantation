/**
 * prerender.mjs — Renders the built SPA in a headless browser and writes the
 * resulting HTML back into dist/index.html so that non-JS crawlers (search
 * bots, link-preview fetchers, AWS Activate checks) receive real content
 * instead of an empty <div id="root"></div>.
 *
 * Browser resolution order:
 *   1. System Chrome/Chromium (fast, for local builds)
 *   2. @sparticuz/chromium (bundled, for CI / Vercel / serverless)
 *   3. Committed fallback file (public/prerendered-index.html)
 *
 * Usage:  node scripts/prerender.mjs         (called by "postbuild")
 *         node scripts/prerender.mjs --local  (generates the committed fallback)
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { createServer } from 'http';
import { resolve, join, extname } from 'path';

const DIST = resolve('dist');
const FALLBACK_PATH = resolve('public', 'prerendered-index.html');
const IS_LOCAL_MODE = process.argv.includes('--local');

// ---------------------------------------------------------------------------
// 1. Resolve a Chromium executable
// ---------------------------------------------------------------------------

/** Try system-installed Chrome/Chromium first (fastest). */
function findSystemChrome() {
  for (const bin of ['chromium-browser', 'chromium', 'google-chrome-stable', 'google-chrome']) {
    try {
      const p = execSync(`which ${bin} 2>/dev/null`, { encoding: 'utf-8' }).trim();
      if (p) return { executablePath: p, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'] };
    } catch { /* next */ }
  }
  return null;
}

/** Fall back to @sparticuz/chromium (works in CI / Vercel). */
async function findSparticuzChrome() {
  try {
    const chromium = await import('@sparticuz/chromium');
    const mod = chromium.default ?? chromium;
    const executablePath = await mod.executablePath();
    if (!executablePath) return null;
    return {
      executablePath,
      args: mod.args ?? [
        '--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu',
        '--disable-dev-shm-usage', '--single-process',
      ],
    };
  } catch {
    return null;
  }
}

async function resolveChrome() {
  const sys = findSystemChrome();
  if (sys) { console.log(`  ➜  Using system browser: ${sys.executablePath}`); return sys; }

  const sparticuz = await findSparticuzChrome();
  if (sparticuz) { console.log(`  ➜  Using @sparticuz/chromium: ${sparticuz.executablePath}`); return sparticuz; }

  return null;
}

// ---------------------------------------------------------------------------
// 2. Tiny static file server for the dist folder
// ---------------------------------------------------------------------------
const MIME = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain',
  '.ico': 'image/x-icon', '.mp4': 'video/mp4',
};

function serve() {
  return new Promise((res) => {
    const srv = createServer((req, reply) => {
      const url = new URL(req.url, 'http://localhost');
      const filePath = join(DIST, url.pathname === '/' ? 'index.html' : url.pathname);
      try {
        const data = readFileSync(filePath);
        reply.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' });
        reply.end(data);
      } catch {
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
// 3. Render the page with Puppeteer
// ---------------------------------------------------------------------------
async function renderPage(chrome) {
  const puppeteer = await import('puppeteer-core');
  const { srv, port } = await serve();

  let browser;
  try {
    browser = await puppeteer.default.launch({
      executablePath: chrome.executablePath,
      headless: true,
      args: chrome.args,
    });

    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}`, { waitUntil: 'networkidle0', timeout: 30_000 });

    // Let GSAP animations settle
    await page.evaluate(() => new Promise(r => setTimeout(r, 1500)));
    return await page.content();
  } finally {
    if (browser) await browser.close();
    srv.close();
  }
}

// ---------------------------------------------------------------------------
// 4. Validate and write
// ---------------------------------------------------------------------------
function validate(html) {
  return html.includes('Digitalized Plantation') && !html.includes('<div id="root"></div>');
}

// ---------------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------------
async function main() {
  const chrome = await resolveChrome();

  if (chrome) {
    // --- Render with Puppeteer ---
    // A resolved executable can still fail to *launch* in a constrained CI /
    // serverless container (missing shared libs, sandbox, /tmp space, etc.).
    // Treat any such failure as "no usable browser" and fall through to the
    // committed fallback rather than failing the whole build.
    try {
      console.log('  …  Rendering page with headless Chromium…');
      const html = await renderPage(chrome);

      if (!validate(html)) {
        throw new Error('rendered HTML has empty body / missing markers');
      }

      writeFileSync(join(DIST, 'index.html'), html, 'utf-8');
      console.log('  ✅  Prerender successful — dist/index.html contains rendered content.');

      // In --local mode, also save the fallback for CI use
      if (IS_LOCAL_MODE) {
        writeFileSync(FALLBACK_PATH, html, 'utf-8');
        console.log(`  📦  Fallback saved to ${FALLBACK_PATH}`);
      }
      return;
    } catch (err) {
      console.warn(`  ⚠  Headless render failed (${err.message || err}); trying committed fallback…`);
    }
  } else {
    // --- No browser available: try committed fallback ---
    console.log('  ⚠  No Chrome/Chromium available in this environment.');
  }

  if (existsSync(FALLBACK_PATH)) {
    const fallback = readFileSync(FALLBACK_PATH, 'utf-8');
    if (validate(fallback)) {
      // The fallback has the original Vite asset paths baked in — we need to
      // update them to match this build's hashed filenames.
      const distHtml = readFileSync(join(DIST, 'index.html'), 'utf-8');

      // Extract current build's <script> and <link rel="stylesheet"> from dist
      const scriptMatch = distHtml.match(/<script type="module"[^>]*src="([^"]+)"[^>]*>/);
      const cssMatch = distHtml.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);

      let patched = fallback;
      // Replace old asset paths in the fallback with this build's paths
      if (scriptMatch) {
        patched = patched.replace(/\/assets\/index-[A-Za-z0-9_-]+\.js/g, scriptMatch[1]);
      }
      if (cssMatch) {
        patched = patched.replace(/\/assets\/index-[A-Za-z0-9_-]+\.css/g, cssMatch[1]);
      }

      writeFileSync(join(DIST, 'index.html'), patched, 'utf-8');
      console.log('  ✅  Used committed fallback (public/prerendered-index.html) — dist/index.html has content.');
      return;
    }
    console.error('  ❌  Fallback file exists but appears empty/invalid.');
  } else {
    console.error('  ❌  No fallback file found at public/prerendered-index.html.');
    console.error('     Run "npm run prerender:local" locally and commit the result.');
  }

  process.exit(1);
}

main().catch(err => {
  console.error('  ❌  Prerender failed:', err.message || err);
  process.exit(1);
});
