const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

// Find all CSS rules targeting `.column-left` and `.column-right`
let idx = 0;
while ((idx = s.indexOf('.column-', idx)) !== -1) {
    const start = Math.max(0, s.lastIndexOf('{', idx) - 50);
    const end = Math.min(s.length, s.indexOf('}', idx) + 1);
    console.log(s.substring(start, end).replace(/\s+/g, ' ').trim());
    idx += 8;
}
