import fs from 'node:fs';
import postcss from 'postcss';
const source = ['fonts.css', 'styles.css', 'contour.css', 'library.css', 'navigation.css', 'scroll-area.css', 'dashboard.css', 'record-layouts.css', 'collection-workspace.css', 'calendar.css', 'app-header.css', 'data-lists.css', 'infinite-table.css', 'kanban-board.css', 'buttons.css', 'services.css'].map(name => fs.readFileSync(`src/contour/${name}`, 'utf8')).join('\n');
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
`));
fs.writeFileSync('dist/contour/styles.css', css.toString());
console.log('Contour stylesheet built with an explicit theme boundary.');
const scrollCSS = fs.readFileSync('src/contour/scroll-area.css', 'utf8');
const navigationCSS = fs.readFileSync('src/contour/navigation.css', 'utf8');
postcss.parse(scrollCSS); postcss.parse(navigationCSS);
fs.writeFileSync('dist/contour/scroll-area.css', scrollCSS);
fs.writeFileSync('dist/contour/navigation.css', fs.readFileSync('src/contour/fonts.css','utf8') + '\n' + scrollCSS + '\n' + navigationCSS);

fs.mkdirSync('dist/contour/fonts', {recursive:true});
for (const file of fs.readdirSync('src/contour/fonts')) {
  if (file.endsWith('.woff2')) fs.copyFileSync(`src/contour/fonts/${file}`, `dist/contour/fonts/${file}`);
}
console.log('Self-hosted Urbanist and DM Mono font assets copied.');
