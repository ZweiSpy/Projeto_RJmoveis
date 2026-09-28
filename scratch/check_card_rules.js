const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');
const regex = /\.collection-grid-card[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(s)) !== null) {
    console.log(m[0]);
}
