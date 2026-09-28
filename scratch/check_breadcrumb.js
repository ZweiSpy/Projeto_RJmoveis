const fs = require('fs');
const c = fs.readFileSync('site-catalogos-original.html', 'utf8');
const idx = c.indexOf('id="breadcrumb"');
const endIdx = c.indexOf('</ul>', idx);
console.log(c.substring(idx, endIdx + 5));
