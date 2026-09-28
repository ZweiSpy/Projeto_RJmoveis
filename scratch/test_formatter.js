const fs = require('fs');

const details = JSON.parse(fs.readFileSync('data/products_details.json', 'utf8'));

function formatProductDescription(rawHtml) {
    if (!rawHtml || typeof rawHtml !== 'string') {
        return '<p class="modal-desc-empty">Entre em contato pelo WhatsApp para obter as especificações completas deste item.</p>';
    }

    // 1. Limpar tags indesejadas e normalizar quebras
    let text = rawHtml
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/gi, ' ')
        .trim();

    const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (rawLines.length === 0) {
        return '<p class="modal-desc-empty">Consulte nossa equipe pelo WhatsApp para especificações deste produto.</p>';
    }

    let html = '';
    let currentList = [];
    let inNotice = false;
    let noticeText = [];

    function flushList() {
        if (currentList.length > 0) {
            html += '<ul class="modal-spec-list">';
            currentList.forEach(item => {
                // Se tiver "Chave: Valor"
                const sepIdx = item.indexOf(':');
                if (sepIdx !== -1 && sepIdx < 30) {
                    const label = item.slice(0, sepIdx).trim();
                    const val = item.slice(sepIdx + 1).trim();
                    html += `<li class="modal-spec-item"><strong class="modal-spec-label">${label}:</strong> <span class="modal-spec-val">${val}</span></li>`;
                } else {
                    html += `<li class="modal-spec-item"><span class="modal-spec-bullet"></span><span class="modal-spec-val">${item}</span></li>`;
                }
            });
            html += '</ul>';
            currentList = [];
        }
    }

    function flushNotice() {
        if (noticeText.length > 0) {
            html += `<div class="modal-spec-notice"><div class="modal-spec-notice-icon"><svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg></div><div class="modal-spec-notice-body">${noticeText.join(' ')}</div></div>`;
            noticeText = [];
            inNotice = false;
        }
    }

    const sectionRegex = /^(medidas|dimensões|conforto|funcionamento|estrutura|acabamento|características|especificações|detalhes|acompanha|peso suportado|itens inclusos|revestimento):?$/i;
    const noticeRegex = /^(aviso importante|importante|atenção|observação):?$/i;

    rawLines.forEach(line => {
        const cleanLine = line.replace(/^[\-\•\*\–]\s*/, '').trim();

        // Checar se é início de aviso
        if (noticeRegex.test(cleanLine) || noticeRegex.test(line.replace(/:$/, ''))) {
            flushList();
            flushNotice();
            inNotice = true;
            return;
        }

        // Se está dentro de aviso
        if (inNotice) {
            // Se encontrar nova seção ou item de lista, fecha o aviso
            if (sectionRegex.test(cleanLine) || line.startsWith('-')) {
                flushNotice();
            } else {
                noticeText.push(cleanLine);
                return;
            }
        }

        // Checar se é título de seção
        if (sectionRegex.test(cleanLine) || (cleanLine.endsWith(':') && cleanLine.length < 35 && !line.startsWith('-'))) {
            flushList();
            flushNotice();
            const sectionTitle = cleanLine.replace(/:$/, '');
            html += `<h4 class="modal-spec-section-title">${sectionTitle}</h4>`;
            return;
        }

        // Checar se é item de lista com hífen ou ponto
        if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
            currentList.push(cleanLine);
            return;
        }

        // Caso contrário, é parágrafo explicativo
        flushList();
        flushNotice();
        html += `<p class="modal-desc-p">${cleanLine}</p>`;
    });

    flushList();
    flushNotice();

    return html;
}

// Testar com o produto 1532
const sample = details['1532'];
const formatted = formatProductDescription(sample.description);
console.log('--- HTML FORMATADO DO PRODUTO 1532 ---');
console.log(formatted.slice(0, 1200));
console.log('\nFinal do HTML formatado:');
console.log(formatted.slice(-400));
