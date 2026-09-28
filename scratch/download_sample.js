const https = require('https');
const fs = require('fs');

const options = {
    hostname: 'www.catalogodemoveis.com.br',
    path: '/sofa-retratil-reclinavel-lima-2-00m-linho-cinza-a59-sem-caixa-p1533',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
    }
};

https.get(options, (res) => {
    let chunks = [];
    res.on('data', chunk => chunks.push(chunk));
    res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        fs.writeFileSync('scratch/sample_product_1533.html', buffer);
        console.log('Saved scratch/sample_product_1533.html, size:', buffer.length);
    });
}).on('error', e => console.error(e));
