const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

const head = s.substring(0, s.indexOf('</head>'));
const links = head.match(/<link[^>]+stylesheet[^>]*>/gi) || [];
console.log('Stylesheets in head:');
links.forEach(l => console.log(l));

const styles = head.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
console.log('Total style tags in head:', styles.length);
