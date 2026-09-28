const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');
const regex = /<div class="collection-limit hide-on-small-and-down">[\s\S]*?<\/form>\s*<\/div>/gi;
console.log('Match test:', regex.test(s));
const match = s.match(regex);
console.log('Matched text:', match ? match[0] : 'null');
