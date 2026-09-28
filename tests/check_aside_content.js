const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

const asideStart = s.indexOf('<aside class="collection-sidebar-filter');
const asideEnd = s.indexOf('</aside>', asideStart);
const asideContent = s.substring(asideStart, asideEnd + 8);

console.log('Total aside length in original:', asideContent.length);
// Find all divs or elements in aside
const blocks = asideContent.match(/class="[^"]*sidebar-filter-block[^"]*"/g) || [];
console.log('Sidebar filter blocks in original:', blocks);
