const fs = require('fs');

// Let's inspect custom.css and see what happens when we remove the grid-template-columns or fix max-width
const customCss = fs.readFileSync('css/custom.css', 'utf8');

// Check the exact lines in custom.css
console.log('Lines 240-285 in custom.css:');
const lines = customCss.split('\n');
console.log(lines.slice(239, 285).join('\n'));
