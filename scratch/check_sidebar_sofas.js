const fs = require('fs');
const c = fs.readFileSync('sofas.html', 'utf8');

const sideIdx = c.indexOf('filter--consultor');
console.log(c.substring(sideIdx, sideIdx + 3000));
