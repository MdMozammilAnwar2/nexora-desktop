// Copies ../web/dist into ./renderer so Electron can load it offline.
const fs = require('fs');
const path = require('path');
const src = path.join(__dirname, '..', '..', 'web', 'dist');
const dest = path.join(__dirname, '..', 'renderer');
if (!fs.existsSync(path.join(src, 'index.html'))) {
  console.error('✗ web/dist not found. Run "npm run build" inside the web folder first.');
  process.exit(1);
}
fs.rmSync(dest, { recursive: true, force: true });
fs.cpSync(src, dest, { recursive: true });
console.log('✓ Copied web build into desktop/renderer');
