const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');
const idx = s.indexOf('Pronta Entrega');
console.log(s.substring(idx - 400, idx + 100));
