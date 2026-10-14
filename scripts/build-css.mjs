// Inline src/index.css's @imports (recursively, in order) into dist/styles.css, then make sure every
// source file and the bundle parse (scripts/check-css.mjs). One stylesheet for consumers, no bundler.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const seen = [];
function inline(file) {
  seen.push(path.relative(root, file));
  const css = fs.readFileSync(file, 'utf8');
  return css.replace(/^@import\s+['"](.+?)['"];\s*$/gm, (_, rel) => inline(path.resolve(path.dirname(file), rel)));
}
const out = `/* @arlab/ui ${JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version} - generated from src/index.css, do not edit */\n` + inline(path.join(root, 'src/index.css'));
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/styles.css'), out);
execFileSync('node', [path.join(root, 'scripts/check-css.mjs'), ...seen.slice(1), 'dist/styles.css'], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
console.log(`styles.css: ${seen.length - 1} files, ${(out.length / 1024).toFixed(1)} KB`);
