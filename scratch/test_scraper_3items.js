const https = require('https');
const http = require('http');
const { URL } = require('url');

function fetchPage(urlStr, retries = 3) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(urlStr);
        const options = {
            hostname: parsedUrl.hostname,
            path: parsedUrl.pathname + parsedUrl.search,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Connection': 'keep-alive'
            }
        };

        const req = https.get(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redirectUrl = res.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
                }
                return fetchPage(redirectUrl, retries - 1).then(resolve).catch(reject);
            }

            if (res.statusCode !== 200) {
                if (retries > 0) {
                    setTimeout(() => {
                        fetchPage(urlStr, retries - 1).then(resolve).catch(reject);
                    }, 1000);
                } else {
                    reject(new Error(`Status HTTP: ${res.statusCode}`));
                }
                return;
            }

            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                const buffer = Buffer.concat(chunks);
                const contentType = res.headers['content-type'] || '';
                let text = '';
                if (contentType.toLowerCase().includes('utf-8')) {
                    text = buffer.toString('utf8');
                } else {
                    text = buffer.toString('latin1');
                }
                resolve(text);
            });
        });

        req.on('error', (err) => {
            if (retries > 0) {
                setTimeout(() => {
                    fetchPage(urlStr, retries - 1).then(resolve).catch(reject);
                }, 1000);
            } else {
                reject(err);
            }
        });

        req.setTimeout(12000, () => {
            req.destroy();
            if (retries > 0) {
                setTimeout(() => {
                    fetchPage(urlStr, retries - 1).then(resolve).catch(reject);
                }, 1000);
            } else {
                reject(new Error('Timeout de 12s excedido'));
            }
        });
    });
}

function cleanDescription(rawHtml) {
    if (!rawHtml) return '';
    let cleaned = rawHtml;
    // Remover scripts, styles, iframes ou trackers
    cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
    // Remover quaisquer menções de preço, R$, parcelamento, pix, cartao
    cleaned = cleaned.replace(/R\$\s*[\d\.\,]+/gi, '');
    cleaned = cleaned.replace(/[\d]+x\s+de\s+R\$\s*[\d\.\,]+/gi, '');
    cleaned = cleaned.replace(/sem juros/gi, '');
    cleaned = cleaned.replace(/no cartão/gi, '');
    cleaned = cleaned.replace(/no pix/gi, '');
    return cleaned.trim();
}

function parseProductPage(html, fallbackImg) {
    // 1. Descrição
    let descHtml = '';
    const tabMatch = html.match(/<div class="tab-content">([\s\S]*?)<\/div>/i);
    if (tabMatch) {
        descHtml = tabMatch[1];
    } else {
        const descMatch = html.match(/<section class="description"[^>]*>([\s\S]*?)<\/section>/i);
        if (descMatch) {
            descHtml = descMatch[1];
        }
    }
    const description = cleanDescription(descHtml);

    // 2. Galeria de fotos
    const gallery = [];
    const fancyRegex = /data-fancybox="gallery"[^>]*href="([^"]+)"/gi;
    let m;
    while ((m = fancyRegex.exec(html)) !== null) {
        let imgUrl = m[1].trim();
        if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
        if (!gallery.includes(imgUrl)) {
            gallery.push(imgUrl);
        }
    }
    if (gallery.length === 0 && fallbackImg) {
        gallery.push(fallbackImg);
    }

    // 3. Vídeo do YouTube
    let youtubeVideo = null;
    const iframeRegex = /<iframe[^>]*src="([^"]*youtube[^"]*)"/i;
    const videoMatch = html.match(iframeRegex);
    if (videoMatch) {
        let src = videoMatch[1].trim();
        if (src.startsWith('//')) src = 'https:' + src;
        const idMatch = src.match(/(?:embed\/|v=|\/v\/|youtu\.be\/|\/embed\?list=)([^"&?\/ ]{11})/i);
        youtubeVideo = {
            embedUrl: src,
            videoId: idMatch ? idMatch[1] : null
        };
    }

    return {
        description,
        gallery,
        youtubeVideo
    };
}

// Testar com os primeiros 3 produtos do catálogo
(async () => {
    const fs = require('fs');
    const catalog = JSON.parse(fs.readFileSync('data/products_catalog_map.json', 'utf8')).slice(0, 3);
    for (const p of catalog) {
        console.log(`\nTestando [${p.id}] ${p.title} -> ${p.url}`);
        try {
            const html = await fetchPage(p.url);
            const data = parseProductPage(html, p.mainImage);
            console.log(`Sucesso: ${data.gallery.length} fotos, Vídeo: ${data.youtubeVideo ? data.youtubeVideo.videoId : 'Nenhum'}`);
            console.log(`Início da descrição: ${data.description.slice(0, 150).replace(/\s+/g, ' ')}...`);
        } catch (err) {
            console.error(`Erro:`, err.message);
        }
    }
})();
