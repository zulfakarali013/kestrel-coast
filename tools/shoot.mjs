// Takes the game's own screenshots: serves game/, opens each ?shot= pose in Chromium, saves a JPEG.
// Usage: node tools/shoot.mjs   (needs playwright from the dev tools folder)
import { createServer } from 'node:http';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import('playwright');
const root = resolve(fileURLToPath(new URL('../game', import.meta.url)));
const outDir = resolve(fileURLToPath(new URL('../screenshots', import.meta.url)));
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer((req, res) => {
  const p = join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  try { statSync(p); res.writeHead(200, { 'content-type': MIME[extname(p)] ?? 'application/octet-stream' }); res.end(readFileSync(p)); }
  catch { res.writeHead(404); res.end(); }
}).listen(8765);

const shots = [['1-cover.jpg', 'cover'], ['2-cockpit.jpg', 'cockpit'], ['3-ridge.jpg', 'ridge'], ['4-landing.jpg', 'landing']];
const only = process.argv[2];
const browser = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
for (const [file, pose] of shots) {
  if (only && only !== pose) continue;
  await page.goto(`http://localhost:8765/index.html?shot=${pose}`);
  await page.waitForFunction(() => window.__shotReady === true, null, { timeout: 120000 });
  await page.waitForTimeout(300);
  let q = 88, buf;
  do { buf = await page.screenshot({ type: 'jpeg', quality: q }); q -= 6; } while (buf.length > 250000 && q > 30);
  writeFileSync(join(outDir, file + '.b64'), buf.toString('base64')); // one line, decoded by main.ts
  if (process.env.SHOTS_RAW) writeFileSync(join(process.env.SHOTS_RAW, file), buf);
  console.log(file, buf.length, 'bytes, quality', q + 6);
}
if (errors.length) console.log('page errors:\n' + errors.join('\n'));
await browser.close();
server.close();
