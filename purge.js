const { PurgeCSS } = require('purgecss');
const fs = require('fs');
const path = require('path');

(async () => {
  const purgeCSSResult = await new PurgeCSS().purge({
    content: ['./index.html', './assets/scripts.js'],
    css: ['./assets/bootstrap/bootstrap.css', './assets/style.css'],
    safelist: [
      /^carousel/, /^nav/, /^d-/, /^w-/, /^visually-hidden/, /^container/, /^row/, /^col/, /^py-3/, /^right/, /^left/
    ],
    keyframes: true,
  });
  const outDir = './assets/clean-bootstrap/';
  purgeCSSResult.forEach((res) => {
    const relPath = require('path').relative('.', res.file);
    const outPath = require('path').join(outDir, relPath);
    fs.mkdirSync(require('path').dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, res.css, 'utf-8');
  });
})();