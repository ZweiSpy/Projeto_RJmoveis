const fs = require('fs');
const s = fs.readFileSync('site-catalogos-original.html', 'utf8');

const styles = s.match(/<style[^>]*>[\s\S]*?<\/style>/gi) || [];
console.log('Total style tags in whole document:', styles.length);
styles.forEach((st, i) => {
    console.log(`Style #${i}: ${st.length} bytes, starts: ${st.substring(0, 100).replace(/\s+/g, ' ')}`);
});
