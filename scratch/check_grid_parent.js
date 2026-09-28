const fs = require('fs');
const s = fs.readFileSync('catalogo.html', 'utf8');
const idx = s.indexOf('id="rj-products-grid"');
console.log('--- 2500 CHARS BEFORE GRID ---');
console.log(s.substring(idx - 2500, idx));
