const fs = require('fs');
const orig = fs.readFileSync('site-catalogos-original.html', 'utf8');

// Let's check how the original grid container and cards are structured
console.log('Original grid attributes:');
const gridMatch = orig.match(/<div class="collection-grid[^>]*>/);
console.log(gridMatch ? gridMatch[0] : 'not found');

// Let's check card markup
const cardMatch = orig.match(/<div class="storefront-cards collection-grid-card[^>]*>/);
console.log('Original card attributes:');
console.log(cardMatch ? cardMatch[0] : 'not found');

// Let's check card thumbnail markup
const thumbMatch = orig.match(/<figure class="flex product-card-thumbnail[^>]*>[\s\S]*?<\/figure>/);
console.log('Original thumbnail markup:');
console.log(thumbMatch ? thumbMatch[0] : 'not found');
