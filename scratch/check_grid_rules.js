const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');
const regex = /\.collection-grid[^{]*\{[^}]*\}/g;
let m;
while ((m = regex.exec(s)) !== null) {
    console.log(m[0]);
}
console.log('--- columns="4" ---');
const regex2 = /\[columns="4"\][^{]*\{[^}]*\}/g;
while ((m = regex2.exec(s)) !== null) {
    console.log(m[0]);
}
