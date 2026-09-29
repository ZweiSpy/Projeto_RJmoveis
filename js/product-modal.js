/**
 * ====================================================================
 * PROJETO MEUSMÓVEIS — MODAL FLUTUANTE DE DETALHES (QUICK-VIEW)
 * ====================================================================
 * Exibe galeria de fotos em alta resolução, vídeo sob demanda do YouTube,
 * especificações e medidas técnicas e CTA WhatsApp direto, sem exibir preços.
 * Suporta carregamento síncrono via window.RJ_PRODUCTS_DATA (sem CORS/file://)
 * e fallback assíncrono via fetch().
 * ====================================================================
 */

(function () {
    'use strict';

    let productsCache = null;
    let currentProduct = null;
    let modalElements = null;

    const WHATSAPP_PHONE = '5521994990764';

    // 1. Obtenção dos dados dos produtos (Prioriza window.RJ_PRODUCTS_DATA para 0ms e zero CORS)
    async function getProductById(productId) {
        const idStr = String(productId);

        // 1.1. Prioridade Máxima: Objeto síncrono em memória (js/products-data.js)
        if (window.RJ_PRODUCTS_DATA && window.RJ_PRODUCTS_DATA[idStr]) {
            return window.RJ_PRODUCTS_DATA[idStr];
        }

        // 1.2. Cache já carregado anteriormente
        if (productsCache && productsCache[idStr]) {
            return productsCache[idStr];
        }

        // 1.3. Fallback: Requisição fetch assíncrona (se executando sob servidor HTTP/HTTPS)
        try {
            const res = await fetch('data/products_details.json');
            if (res.ok) {
                productsCache = await res.json();
                if (productsCache && productsCache[idStr]) {
                    return productsCache[idStr];
                }
            }
        } catch (e) {
            // Em protocolo file:// o fetch é bloqueado nativamente por CORS, prossegue com fallback
        }

        return null;
    }

    // 2. Formatador Semântico de Descrições e Medidas Técnicas
    function formatProductDescription(rawHtml) {
        if (!rawHtml || typeof rawHtml !== 'string') {
            return '<p class="modal-desc-p">Entre em contato pelo WhatsApp para obter as especificações completas deste item.</p>';
        }

        let text = rawHtml
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/&nbsp;/gi, ' ')
            .trim();

        const rawLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        if (rawLines.length === 0) {
            return '<p class="modal-desc-p">Consulte nossa equipe pelo WhatsApp para especificações deste produto.</p>';
        }

        let html = '';
        let currentList = [];
        let inNotice = false;
        let noticeText = [];

        function flushList() {
            if (currentList.length > 0) {
                html += '<ul class="modal-spec-list">';
                currentList.forEach(item => {
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
                html += `<div class="modal-spec-notice"><div class="modal-spec-notice-icon"><svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg></div><div class="modal-spec-notice-body">${noticeText.join(' ')}</div></div>`;
                noticeText = [];
                inNotice = false;
            }
        }

        const sectionRegex = /^(medidas|dimensões|conforto|funcionamento|estrutura|estrutura e acabamento|acabamento|características|especificações|detalhes|acompanha|peso suportado|itens inclusos|revestimento):?$/i;
        const noticeRegex = /^(aviso importante|importante|atenção|observação):?$/i;

        rawLines.forEach(line => {
            const cleanLine = line.replace(/^[\-\•\*\–]\s*/, '').trim();

            if (noticeRegex.test(cleanLine) || noticeRegex.test(line.replace(/:$/, ''))) {
                flushList();
                flushNotice();
                inNotice = true;
                return;
            }

            if (inNotice) {
                if (sectionRegex.test(cleanLine) || line.startsWith('-')) {
                    flushNotice();
                } else {
                    noticeText.push(cleanLine);
                    return;
                }
            }

            if (sectionRegex.test(cleanLine) || (cleanLine.endsWith(':') && cleanLine.length < 35 && !line.startsWith('-'))) {
                flushList();
                flushNotice();
                const sectionTitle = cleanLine.replace(/:$/, '');
                html += `<h4 class="modal-spec-section-title">${sectionTitle}</h4>`;
                return;
            }

            if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
                currentList.push(cleanLine);
                return;
            }

            flushList();
            flushNotice();
            html += `<p class="modal-desc-p">${cleanLine}</p>`;
        });

        flushList();
        flushNotice();

        return html;
    }

    // 3. Construção e Injeção do DOM do Modal
    function getOrCreateModal() {
        if (modalElements) return modalElements;

        let backdrop = document.getElementById('product-modal-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'product-modal-backdrop';
            backdrop.className = 'product-modal-backdrop';
            backdrop.setAttribute('role', 'dialog');
            backdrop.setAttribute('aria-modal', 'true');
            backdrop.setAttribute('aria-hidden', 'true');

            backdrop.innerHTML = `
                <div class="product-modal-dialog">
                    <button type="button" class="product-modal-close" id="modal-btn-close" aria-label="Fechar">&times;</button>
                    <div class="product-modal-body">
                        <!-- Coluna de Mídia (Esquerda) -->
                        <div class="product-modal-media-col">
                            <div class="product-modal-main-display">
                                <img id="modal-featured-img" class="product-modal-featured-img" src="" alt="Foto do Produto" />
                                <div id="modal-video-box" class="product-modal-video-container"></div>
                            </div>

                            <button type="button" id="modal-btn-video" class="btn-modal-video-trigger" style="display: none;">
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 22c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 2c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z"/>
                                </svg>
                                <span>Assistir Vídeo do Produto</span>
                            </button>

                            <div id="modal-gallery-thumbs" class="product-modal-thumbs"></div>
                        </div>

                        <!-- Coluna de Informações (Direita) -->
                        <div class="product-modal-info-col">
                            <span class="product-modal-badge">Catálogo Oficial RJ Móveis</span>
                            <h2 id="modal-title" class="product-modal-title"></h2>

                            <div class="product-modal-cta-wrap">
                                <a id="modal-whatsapp-link" href="#" target="_blank" rel="noopener noreferrer" class="btn-modal-whatsapp">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.44 0-2.85-.38-4.09-1.11l-.29-.17-3.04.8 1.25-2.96-.19-.3a8.21 8.21 0 0 1-1.25-4.5c0-4.54 3.7-8.24 8.24-8.24m4.53 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.74-.66-1.24-1.48-1.39-1.73-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.45-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.45.06-.69.32-.23.25-.9.88-.9 2.15 0 1.27.92 2.49 1.05 2.66.13.17 1.81 2.76 4.38 3.87.61.26 1.09.42 1.46.54.61.2 1.17.17 1.61.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.48-.29z"/>
                                    </svg>
                                    <span>Chame no WhatsApp agora</span>
                                </a>
                                <a id="modal-frete-link" href="#" target="_blank" rel="noopener noreferrer" class="btn-modal-frete">
                                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
                                    <span>Simular Frete &amp; Prazo no WhatsApp</span>
                                </a>
                            </div>

                            <div class="modal-trust-badges">
                                <div class="modal-trust-item">
                                    <span class="trust-icon">🚚</span>
                                    <div class="trust-text"><strong>Entrega Cuidadosa</strong><span>Rio de Janeiro &amp; Região</span></div>
                                </div>
                                <div class="modal-trust-item">
                                    <span class="trust-icon">🎨</span>
                                    <div class="trust-text"><strong>Cores &amp; Tecidos</strong><span>Consulte opções com o consultor</span></div>
                                </div>
                                <div class="modal-trust-item">
                                    <span class="trust-icon">🤝</span>
                                    <div class="trust-text"><strong>Atendimento Humano</strong><span>Especialistas direto no WhatsApp</span></div>
                                </div>
                            </div>

                            <div class="product-modal-desc-box">
                                <h3 class="product-modal-desc-title">Especificações & Medidas</h3>
                                <div id="modal-desc-content" class="product-modal-desc-text"></div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(backdrop);
        }

        modalElements = {
            backdrop: backdrop,
            closeBtn: document.getElementById('modal-btn-close'),
            featuredImg: document.getElementById('modal-featured-img'),
            videoBox: document.getElementById('modal-video-box'),
            videoBtn: document.getElementById('modal-btn-video'),
            galleryThumbs: document.getElementById('modal-gallery-thumbs'),
            title: document.getElementById('modal-title'),
            whatsappLink: document.getElementById('modal-whatsapp-link'),
            freteLink: document.getElementById('modal-frete-link'),
            descContent: document.getElementById('modal-desc-content')
        };

        // Eventos de fechamento
        modalElements.closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });

        // Evento de vídeo sob demanda (lazy load)
        modalElements.videoBtn.addEventListener('click', () => {
            if (!currentProduct || !currentProduct.youtubeVideo) return;
            const embedUrl = currentProduct.youtubeVideo.embedUrl || `https://www.youtube.com/embed/${currentProduct.youtubeVideo.videoId}`;
            modalElements.videoBox.innerHTML = `
                <iframe src="${embedUrl}?autoplay=1&rel=0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            `;
            modalElements.videoBox.style.display = 'block';
            modalElements.featuredImg.style.display = 'none';
        });

        return modalElements;
    }

    // 4. Abertura do Modal com os Dados do Produto
    async function openModal(productId, fallbackTitle, fallbackImg) {
        const elems = getOrCreateModal();
        const prod = await getProductById(productId);

        currentProduct = prod || {
            id: productId,
            title: fallbackTitle || 'Móvel',
            mainImage: fallbackImg || '',
            gallery: fallbackImg ? [fallbackImg] : [],
            youtubeVideo: null,
            description: 'Entre em contato com nossa equipe pelo WhatsApp para obter as especificações completas deste item.'
        };

        // Configurar Título
        elems.title.textContent = currentProduct.title;

        // Configurar Link Principal do WhatsApp com Copywriting Persuasivo
        const msgWhats = encodeURIComponent(`Olá, equipe RJ Móveis! Me encantei pelo *${currentProduct.title}* no catálogo oficial. Gostaria de consultar opções de cores de tecido, prazo de entrega para meu CEP e condições. Poderiam me atender?`);
        elems.whatsappLink.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msgWhats}`;

        // Configurar Link Secundário de Simulação de Frete
        if (elems.freteLink) {
            const msgFrete = encodeURIComponent(`Olá! Gostaria de simular o frete e prazo de entrega para o produto: *${currentProduct.title}*. Meu CEP/bairro é: `);
            elems.freteLink.href = `https://wa.me/${WHATSAPP_PHONE}?text=${msgFrete}`;
        }

        // Resetar player de vídeo
        elems.videoBox.innerHTML = '';
        elems.videoBox.style.display = 'none';
        elems.featuredImg.style.display = 'block';

        // Configurar Imagem em Destaque
        const mainImgUrl = (currentProduct.gallery && currentProduct.gallery.length > 0) 
            ? currentProduct.gallery[0] 
            : (currentProduct.mainImage || fallbackImg || '');
        
        elems.featuredImg.src = mainImgUrl;
        elems.featuredImg.alt = currentProduct.title;

        // Configurar Miniaturas da Galeria
        elems.galleryThumbs.innerHTML = '';
        const galleryList = (currentProduct.gallery && currentProduct.gallery.length > 0)
            ? currentProduct.gallery
            : (mainImgUrl ? [mainImgUrl] : []);

        galleryList.forEach((imgUrl, idx) => {
            const thumb = document.createElement('img');
            thumb.className = `product-modal-thumb ${idx === 0 ? 'active' : ''}`;
            thumb.src = imgUrl;
            thumb.alt = `${currentProduct.title} - Foto ${idx + 1}`;
            thumb.loading = 'lazy';

            thumb.addEventListener('click', () => {
                // Ao clicar na miniatura, volta para a visualização de imagem (oculta vídeo se estiver aberto)
                elems.videoBox.innerHTML = '';
                elems.videoBox.style.display = 'none';
                elems.featuredImg.style.display = 'block';
                elems.featuredImg.src = imgUrl;

                elems.galleryThumbs.querySelectorAll('.product-modal-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });

            elems.galleryThumbs.appendChild(thumb);
        });

        // Configurar Botão de Vídeo do YouTube (apenas se existir vídeo no produto)
        if (currentProduct.youtubeVideo && (currentProduct.youtubeVideo.videoId || currentProduct.youtubeVideo.embedUrl)) {
            elems.videoBtn.style.display = 'inline-flex';
        } else {
            elems.videoBtn.style.display = 'none';
        }

        // Configurar Descrição e Medidas Formatadas Semanticamente
        elems.descContent.innerHTML = formatProductDescription(currentProduct.description);

        // Exibir Modal e Travar Scroll do Body
        document.body.classList.add('modal-open');
        elems.backdrop.style.display = 'flex';
        elems.backdrop.setAttribute('aria-hidden', 'false');

        // Gatilho de animação CSS
        setTimeout(() => {
            elems.backdrop.classList.add('active');
        }, 10);
    }

    // 5. Fechamento do Modal
    function closeModal() {
        if (!modalElements) return;
        modalElements.backdrop.classList.remove('active');
        modalElements.backdrop.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');

        // Limpar player de vídeo imediatamente para encerrar áudio
        modalElements.videoBox.innerHTML = '';
        modalElements.videoBox.style.display = 'none';
        modalElements.featuredImg.style.display = 'block';

        setTimeout(() => {
            modalElements.backdrop.style.display = 'none';
        }, 260);
    }

    // Fechar com tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalElements && modalElements.backdrop.classList.contains('active')) {
            closeModal();
        }
    });

    // 6. Interceptação Inteligente de Cliques nos Cards de Produto
    document.addEventListener('click', (e) => {
        // Se clicou no botão de WhatsApp do card, NÃO abre o modal (abre o WhatsApp direto)
        if (e.target.closest('.btn-whatsapp-cta') || e.target.closest('a[href*="whatsapp"]') || e.target.closest('a[href*="api.whatsapp.com"]')) {
            return;
        }

        // Identifica se o clique ocorreu dentro de um card de produto
        const card = e.target.closest('.product-card') || e.target.closest('[data-id]') || e.target.closest('.collection-grid-card');
        if (!card) return;

        // Se clicou em um link ou botão dentro do card que não seja o WhatsApp (ex: link de título ou imagem)
        const link = e.target.closest('a');
        if (link && !link.href.includes('whatsapp')) {
            e.preventDefault();
        }

        // Extrai ID do produto do atributo data-id ou do link
        let productId = card.getAttribute('data-id');
        if (!productId) {
            const cardLink = card.querySelector('a[href*="-p"]');
            if (cardLink) {
                const match = cardLink.href.match(/-p(\d+)/);
                if (match) productId = match[1];
            }
        }

        if (!productId) return;

        // Extrai título e imagem de fallback do próprio card
        const titleElem = card.querySelector('.product-card-title a') || card.querySelector('.product-card-title') || card.querySelector('a[title]');
        const fallbackTitle = titleElem ? (titleElem.getAttribute('title') || titleElem.textContent.trim()) : '';
        const imgElem = card.querySelector('img');
        const fallbackImg = imgElem ? (imgElem.getAttribute('data-src') || imgElem.src) : '';

        openModal(productId, fallbackTitle, fallbackImg);
    });

    // Expõe globalmente caso necessário
    window.RJProductModal = {
        open: openModal,
        close: closeModal
    };

})();
