const fs = require('fs');
const html = fs.readFileSync('site-catalogos-original.html', 'utf8');
const start = html.indexOf('<div class="collection-filter hide-on-large-only">');
const end = html.indexOf('<div class="collection-grid mode-grid', start);
console.log('=== TOOLBAR CONTAINER IN ORIGINAL ===');
console.log(html.substring(start, end));
