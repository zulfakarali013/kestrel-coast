// Kestrel Coast hands itself in (Node 22, standard library only). The game is game/: plain static
// files a desktop browser loads offline (index.html, its ES modules in game/src, and three.js
// vendored as game/vendor/three.module.min.js). This program copies game/ and screenshots/ to
// /output and writes /output/dossier.json with the vendored make.fun library.
//
// Play locally: `node serve.ts`, then open http://localhost:8080.
// Outside the grader MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'game'), join(out, 'game'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
// The screenshots are kept in the repo as one-line base64 text (screenshots/*.jpg.b64) so the whole
// entry is plain text; decode each back to its JPEG. A plain .jpg/.png beside them is copied as is.
const shotDir = join(here, 'screenshots');
if (existsSync(shotDir)) {
  for (const name of readdirSync(shotDir).sort()) {
    if (name.endsWith('.b64')) writeFileSync(join(out, 'screenshots', name.slice(0, -4)), Buffer.from(readFileSync(join(shotDir, name), 'utf8').trim(), 'base64'));
    else if (/\.(jpe?g|png)$/i.test(name)) cpSync(join(shotDir, name), join(out, 'screenshots', name));
  }
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes: game/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
