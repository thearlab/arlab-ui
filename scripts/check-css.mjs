// The stylesheet has to PARSE, not just render.
//
// In the 1.0 work, dropping the old Tabs deleted the selector line and left its declaration body
// behind: a rule with no selector, followed by a stray `}`. Every browser skipped it silently and
// every app looked fine, so nothing caught it. A build tool that really parses CSS is not so
// forgiving: Tailwind's Lightning CSS pipeline threw `Missing opening {` and failed the whole
// production build for the first consumer to add it. dist/styles.css is concatenated at install
// time by `prepare`, so a parse error in any source file reaches every consumer.
//
// This is that missing check. It runs as part of `build`, so `prepare` fails on the installing
// machine instead of shipping CSS that cannot be compiled. No parser dependency: this package is
// installed from git, which means every consumer would install it too, and the two faults worth
// catching (a declaration at the top level, a brace that does not close) need no full parser.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// The same files, in the same order, that `build` concatenates into dist/styles.css.
const FILES = ['src/styles.css', 'src/layout.css', 'src/shells.css'];

/** Comments and quoted strings can contain braces and semicolons; blank them, keeping newlines
 *  so reported line numbers still point at the real source line. */
const blank = (css) => css
  .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .replace(/"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'/g, (m) => m.replace(/[^\n]/g, ' '));

function check(css, label) {
  const src = blank(css);
  const problems = [];
  let depth = 0, line = 1, pending = '', pendingLine = 1;
  for (const ch of src) {
    if (ch === '\n') line++;
    if (ch === '{') { depth++; pending = ''; pendingLine = line; continue; }
    if (ch === '}') {
      depth--;
      if (depth < 0) { problems.push(`line ${line}: a closing brace with nothing open (missing selector or opening brace above)`); depth = 0; }
      pending = ''; pendingLine = line;
      continue;
    }
    if (ch === ';' && depth === 0) {
      const text = pending.trim();
      // An at-rule statement (@import, @charset, @layer a, b) is legal at the top level.
      // Anything else ending in a semicolon out here is a declaration that lost its rule.
      if (text && !text.startsWith('@')) problems.push(`line ${pendingLine}: declaration outside any rule: ${text.slice(0, 60)}`);
      pending = ''; pendingLine = line;
      continue;
    }
    if (!pending.trim() && /\s/.test(ch)) { pendingLine = line; continue; }
    pending += ch;
  }
  if (depth > 0) problems.push(`end of file: ${depth} block(s) left open`);

  if (problems.length) {
    console.log(`FAIL  ${label}`);
    for (const p of problems) console.log(`        ${p}`);
    return false;
  }
  const rules = (src.match(/\{/g) || []).length;
  console.log(`ok    ${label}: ${rules} blocks, balanced`);
  return true;
}

const parts = FILES.map((f) => fs.readFileSync(path.join(root, f), 'utf8'));
let ok = FILES.every((f, i) => check(parts[i], f));
// The concatenation is the artifact consumers compile: a file that ends mid-block only shows up here.
ok = check(parts.join(''), 'concatenated dist/styles.css') && ok;

if (!ok) {
  console.log('\nThis would break any consumer that compiles CSS (Tailwind, Lightning CSS, PostCSS).');
  process.exit(1);
}
console.log('\nstylesheet: parses clean');
