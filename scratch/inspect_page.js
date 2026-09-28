const fs = require('fs');

const c = fs.readFileSync('site-catalogos-original.html', 'utf8');
const pBread = c.indexOf('id="breadcrumb"');
console.log('Pos breadcrumb:', pBread);
if (pBread !== -1) {
    const pBreadStart = c.lastIndexOf('<ul', pBread);
    const pBreadEnd = c.indexOf('</ul>', pBread) + 5;
    console.log('--- ORIGINAL BREADCRUMB ---');
    console.log(c.slice(pBreadStart, pBreadEnd));
}

const pSectionHeader = c.indexOf('class="section-header search-header"');
console.log('Pos section-header:', pSectionHeader);
if (pSectionHeader !== -1) {
    const pHeaderStart = c.lastIndexOf('<div', pSectionHeader);
    const pHeaderEnd = c.indexOf('</div>\n            <div class="content flex"', pSectionHeader);
    console.log('--- ORIGINAL SECTION HEADER ---');
    console.log(c.slice(pHeaderStart, pHeaderEnd !== -1 ? pHeaderEnd + 6 : pSectionHeader + 300));
}
