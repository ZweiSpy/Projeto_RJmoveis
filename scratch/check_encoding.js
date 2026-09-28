const fs = require('fs');
const buffer = fs.readFileSync('scratch/sample_product_1533.html');

// Testar decodificação utf-8 vs latin1
const utf8Str = buffer.toString('utf8');
const latin1Str = buffer.toString('latin1');

console.log('UTF-8 sample:', utf8Str.match(/O Sof[\s\S]{0,30}combina/)?.[0]);
console.log('Latin1 sample:', latin1Str.match(/O Sof[\s\S]{0,30}combina/)?.[0]);
