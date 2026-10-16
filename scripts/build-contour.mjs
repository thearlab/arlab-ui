import fs from 'node:fs';
import postcss from 'postcss';
const source = ['styles.css', 'contour.css', 'library.css'].map(name => fs.readFileSync(`src/contour/${name}`, 'utf8')).join('\n');
const css = postcss.parse(source);
css.walkRules(rule => {
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && /keyframes$/i.test(parent.name)) return;
  }
  rule.selectors = rule.selectors.map(selector => {
    if (selector.includes('.themed-preview')) return selector.replaceAll('.themed-preview', '.arlab-contour');
    if (/^(html|body|:root)(?=[\s.:#\[]|$)/.test(selector)) return selector.replace(/^(html|body|:root)/, '.arlab-contour');
    return `.arlab-contour ${selector}`;
  });
});
css.append(postcss.parse(`
.arlab-contour { box-sizing: border-box; border: 0; border-radius: 0; min-height: 0; overflow: visible; box-shadow: none; background: var(--ground); color: var(--ink); font-family: var(--font-sans); }
/* The document's own scroll bar sits outside the boundary, so it gets the same 2px hairline here. */
html:has(.arlab-contour) { scrollbar-width: thin; scrollbar-color: rgba(228, 20, 219, 0.35) transparent; }
html:has(.arlab-contour[data-mode="dark"]) { scrollbar-color: rgba(240, 78, 232, 0.35) transparent; }
@supports selector(::-webkit-scrollbar) { html:has(.arlab-contour), html:has(.arlab-contour[data-mode="dark"]) { scrollbar-width: auto; scrollbar-color: auto; } }
html:has(.arlab-contour)::-webkit-scrollbar { width: 2px; height: 2px; }
html:has(.arlab-contour)::-webkit-scrollbar-track, html:has(.arlab-contour)::-webkit-scrollbar-corner { background: transparent; }
html:has(.arlab-contour)::-webkit-scrollbar-thumb { background: rgba(228, 20, 219, 0.35); border: 0; border-radius: 0; }
html:has(.arlab-contour)::-webkit-scrollbar-thumb:hover { background: rgba(228, 20, 219, 0.6); }
html:has(.arlab-contour[data-mode="dark"])::-webkit-scrollbar-thumb { background: rgba(240, 78, 232, 0.35); }
html:has(.arlab-contour[data-mode="dark"])::-webkit-scrollbar-thumb:hover { background: rgba(240, 78, 232, 0.6); }
html:has(.arlab-contour)::-webkit-scrollbar-button { display: none; width: 0; height: 0; }
`));
fs.writeFileSync('dist/contour/styles.css', css.toString());
console.log('Contour stylesheet built with an explicit theme boundary.');
