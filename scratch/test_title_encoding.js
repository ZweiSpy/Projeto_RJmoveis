const fs = require('fs');

const f = 'site-catalogos-original.html';
const c = fs.readFileSync(f, 'utf8');
const cardStartMarker = 'class="storefront-cards collection-grid-card product-card';
let pos = c.indexOf(cardStartMarker);
console.log('Pos:', pos);
let snippet = c.slice(pos, pos + 1000);
console.log('Snippet:\n', snippet);
