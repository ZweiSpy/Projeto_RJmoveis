const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const CATALOG_MAP_PATH = path.join(__dirname, '..', 'data', 'products_catalog_map.json');
const OUTPUT_DETAILS_PATH = path.join(__dirname, '..', 'data', 'products_details.json');

if (!fs.existsSync(CATALOG_MAP_PATH)) {
    console.error('Arquivo products_catalog_map.json não encontrado! Execute build_catalog_map.js primeiro.');
    process.exit(1);
}

const catalog = JSON.parse(fs.readFileSync(CATALOG_MAP_PATH, 'utf8'));

// Carrega dados já existentes se houver (para resume)
let detailsMap = {};
if (fs.existsSync(OUTPUT_DETAILS_PATH)) {
    try {
        detailsMap = JSON.parse(fs.readFileSync(OUTPUT_DETAILS_PATH, 'utf8'));
        console.log(`Retomando scraping: ${Object.keys(detailsMap).length} itens já extraídos.`);
    } catch (e) {
        console.warn('Não foi possível ler products_details.json existente, iniciando do zero.');
    }
}

function fetchPage(urlStr, retries = 3) {
    return new Promise((resolve, reject) => {
        try {
            const parsedUrl = new URL(urlStr);
            const options = {
                hostname: parsedUrl.hostname,
                path: parsedUrl.pathname + parsedUrl.search,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7'
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
                        return setTimeout(() => {
                            fetchPage(urlStr, retries - 1).then(resolve).catch(reject);
                        }, 1200);
                    }
                    return reject(new Error(`Status HTTP ${res.statusCode}`));
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
                    }, 1200);
                } else {
                    reject(err);
                }
            });

            req.setTimeout(12000, () => {
                req.destroy();
                if (retries > 0) {
                    setTimeout(() => {
                        fetchPage(urlStr, retries - 1).then(resolve).catch(reject);
                    }, 1200);
                } else {
                    reject(new Error('Timeout de 12s excedido'));
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}

function cleanDescription(rawHtml) {
    if (!rawHtml) return '';
    let cleaned = rawHtml;
    // Remove scripts, styles, iframes
    cleaned = cleaned.replace(/<script[\s\S]*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[\s\S]*?<\/style>/gi, '');
    cleaned = cleaned.replace(/<iframe[\s\S]*?<\/iframe>/gi, '');
    
    // Remove rigorosamente preços, parcelamentos, pix e cartões
    cleaned = cleaned.replace(/R\$\s*[\d\.\,]+/gi, '');
    cleaned = cleaned.replace(/[\d]+x\s+de\s+R\$\s*[\d\.\,]+/gi, '');
    cleaned = cleaned.replace(/sem juros/gi, '');
    cleaned = cleaned.replace(/no cartão/gi, '');
    cleaned = cleaned.replace(/no pix/gi, '');
    cleaned = cleaned.replace(/à vista/gi, '');
    cleaned = cleaned.replace(/em até\s+\d+x/gi, '');

    // Limpa espaços extras no início e fim
    return cleaned.trim();
}

function parseProductPage(html, fallbackImg) {
    // 1. Descrição
    let descHtml = '';
    const tabMatch = html.match(/<div class="tab-content">([\s\S]*?)<\/div>/i);
    if (tabMatch) {
        descHtml = tabMatch[1];
    } else {
        const descSectionMatch = html.match(/<section class="description"[^>]*>([\s\S]*?)<\/section>/i);
        if (descSectionMatch) {
            descHtml = descSectionMatch[1];
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

function saveProgress() {
    fs.writeFileSync(OUTPUT_DETAILS_PATH, JSON.stringify(detailsMap, null, 2), 'utf8');
}

async function run() {
    const pendingProducts = catalog.filter(p => !detailsMap[p.id]);
    console.log(`Iniciando extração: ${pendingProducts.length} produtos pendentes de um total de ${catalog.length}.`);

    let consecutiveErrors = 0;
    let processedCount = 0;

    // Concorrência controlada de 3 em paralelo para velocidade e estabilidade
    const CONCURRENCY = 3;
    let index = 0;

    async function worker(workerId) {
        while (index < pendingProducts.length) {
            if (consecutiveErrors >= 4) {
                console.error(`\n[ABORTADO] Atingido limite de 4 falhas consecutivas!`);
                return;
            }

            const currentIndex = index++;
            const p = pendingProducts[currentIndex];
            const itemNum = Object.keys(detailsMap).length + 1;

            try {
                const html = await fetchPage(p.url);
                const parsed = parseProductPage(html, p.mainImage);

                detailsMap[p.id] = {
                    id: p.id,
                    title: p.title,
                    url: p.url,
                    mainImage: p.mainImage,
                    description: parsed.description,
                    gallery: parsed.gallery,
                    youtubeVideo: parsed.youtubeVideo
                };

                consecutiveErrors = 0;
                processedCount++;

                const videoStatus = parsed.youtubeVideo ? `[Vídeo: ${parsed.youtubeVideo.videoId}]` : '[Sem vídeo]';
                console.log(`[${itemNum}/${catalog.length}] ID ${p.id} - ${p.title.slice(0, 35)}... OK (${parsed.gallery.length} fotos, ${videoStatus})`);

                if (processedCount % 10 === 0) {
                    saveProgress();
                }

                // Pequeno delay entre requisições
                await new Promise(r => setTimeout(r, 200));

            } catch (err) {
                consecutiveErrors++;
                console.error(`[ERRO ${consecutiveErrors}/4] Falha no produto ID ${p.id} (${p.url}): ${err.message}`);
                if (consecutiveErrors >= 4) {
                    saveProgress();
                    throw new Error('Limite de 4 falhas consecutivas atingido. Abortando processo conforme diretriz.');
                }
            }
        }
    }

    const workers = [];
    for (let i = 0; i < CONCURRENCY; i++) {
        workers.push(worker(i));
    }

    try {
        await Promise.all(workers);
    } catch (err) {
        console.error(err.message);
    }

    saveProgress();
    console.log(`\nProcessamento finalizado. Total salvo no banco: ${Object.keys(detailsMap).length}/${catalog.length}`);
}

run();
