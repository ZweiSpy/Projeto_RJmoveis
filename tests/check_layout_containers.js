const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

function findRules(selector) {
    console.log('=== RULES FOR ' + selector + ' ===');
    const regex = new RegExp('([^{}]*' + selector + '[^{}]*\\{[^{}]*\\})', 'g');
    let m;
    let count = 0;
    while ((m = regex.exec(s)) !== null) {
        console.log(m[1].replace(/\s+/g, ' ').trim());
        count++;
        if (count >= 10) break;
    }
}

findRules('custom-container');
findRules('search-results-page');
findRules('column-left');
findRules('column-right');
