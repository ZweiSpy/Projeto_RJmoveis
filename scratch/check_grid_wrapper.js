const fs = require('fs');
const s = fs.readFileSync('catalogo.html', 'utf8');
const idx = s.indexOf('id="rj-products-grid"');
const idxSidebar = s.indexOf('class="collection-title-box"');
console.log('--- FROM TITLE BOX TO GRID ---');
console.log(s.substring(idxSidebar, idx));
