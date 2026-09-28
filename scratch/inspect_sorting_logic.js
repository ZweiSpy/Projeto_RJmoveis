const fs = require('fs');

const orig = fs.readFileSync('site-catalogos-original.html', 'utf8');

// Look for sort in scripts
const scripts = orig.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Total scripts in original:', scripts.length);
scripts.forEach((s, idx) => {
    if (s.includes('sort') || s.includes('order') || s.includes('bestsellers')) {
        console.log(`Script ${idx} mentions sort/order/bestsellers (length ${s.length}):`);
        console.log(s.slice(0, 300));
        console.log('---');
    }
});
