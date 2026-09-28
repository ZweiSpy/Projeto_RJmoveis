const fs = require('fs');
['index.html', 'catalogo.html', 'sofas.html', 'pronta-entrega.html'].forEach(p => {
  const c = fs.readFileSync(p, 'utf8');
  const idxStart = c.indexOf('meta property="og:title"');
  const idxEnd = c.indexOf('Tracker Matomo');
  console.log(`=== ${p} ===`);
  console.log(c.substring(idxStart - 60, idxEnd + 30));
});
