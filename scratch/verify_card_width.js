const fs = require('fs');

const catalogo = fs.readFileSync('catalogo.html', 'utf8');
const customCss = fs.readFileSync('css/custom.css', 'utf8');

console.log('--- CHECK EXACT GRID TAG ---');
const idx = catalogo.indexOf('id="rj-products-grid"');
const start = catalogo.lastIndexOf('<div', idx);
const end = catalogo.indexOf('>', idx);
console.log('Exact tag:', catalogo.substring(start, end + 1));
