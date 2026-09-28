const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');
const idx = s.indexOf('class="product-card-marks"');
if (idx !== -1) {
    console.log(s.substring(idx - 50, idx + 350));
} else {
    console.log('Not found with exact class, looking for marks in html...');
    const m = s.match(/<ul[^>]*product-card-marks[^>]*>[\s\S]*?<\/ul>/);
    if (m) console.log(m[0]);
}
