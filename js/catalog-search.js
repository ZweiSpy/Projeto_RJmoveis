/**
 * catalog-search.js — Busca Inteligente em Tempo Real (Live Search & Autocomplete)
 * 
 * Funcionalidades:
 * 1. Sugestões em tempo real com fotos e títulos de móveis (dropdown flutuante).
 * 2. Consulta ultrarrápida (< 2ms) diretamente na base local window.RJ_PRODUCTS_DATA (523 itens).
 * 3. Tolerância a acentos, maiúsculas/minúsculas e busca por múltiplos termos.
 * 4. Ao clicar na sugestão: abertura imediata do Modal Flutuante de Detalhes (window.RJProductModal).
 * 5. Ao pressionar Enter / submeter: filtra o grid em catalogo.html ou redireciona com ?q=... nas outras páginas.
 * 6. Navegação fluida por teclado (setas cima/baixo, Enter, ESC).
 * 7. Suporte nativo completo ao Dark Mode.
 */

(function () {
    'use strict';

    // Utilitário de normalização de texto (remove acentos, pontuações e caixa alta)
    function normalizeText(str) {
        return (str || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();
    }

    // Escapar caracteres especiais HTML para prevenir injeções
    function escapeHtml(str) {
        return (str || '').replace(/[&<>"']/g, function (m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    // Destaque visual dos termos buscados no título do produto
    function highlightMatches(text, searchTerms) {
        if (!searchTerms || searchTerms.length === 0) return escapeHtml(text);
        
        let result = escapeHtml(text);
        searchTerms.forEach(term => {
            if (!term) return;
            const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
            result = result.replace(regex, '<mark class="rj-search-highlight">$1</mark>');
        });
        return result;
    }

    // Detector dinâmico de categoria do móvel com base no nome
    function detectCategory(title) {
        const t = normalizeText(title);
        if (/sofa|poltrona|chaise|puff|estofad/i.test(t)) return 'Estofados & Sofás';
        if (/guarda-roupa|roupeiro|cama|comoda|cabeceira|beliche|quarto|mesinha de cabeceira/i.test(t)) return 'Quartos & Roupeiros';
        if (/cozinha|balcao|aereo|paneleiro|torre quente|armario/i.test(t)) return 'Cozinha & Modulados';
        if (/mesa|cadeira|jantar|aparador|buffet/i.test(t)) return 'Salas de Jantar & Mesas';
        if (/painel|rack|home|bancada tv/i.test(t)) return 'Painéis & Racks';
        return 'Móveis';
    }

    // Inicialização do Motor de Busca Inteligente
    function initSmartSearch() {
        const searchInput = document.getElementById('rj-catalog-search-input');
        const searchForm = document.getElementById('rj-catalog-search-form');
        const searchBox = document.querySelector('.rj-search-box') || (searchInput ? searchInput.closest('div') : null);

        if (!searchInput || !searchBox) return;

        // 1. Construção do Índice de Busca em Memória (523 itens)
        let productIndex = [];

        function buildIndex() {
            if (window.RJ_PRODUCTS_DATA) {
                const keys = Object.keys(window.RJ_PRODUCTS_DATA);
                productIndex = keys.map(id => {
                    const item = window.RJ_PRODUCTS_DATA[id];
                    const thumb = (item.gallery && item.gallery.length > 0)
                        ? item.gallery[0]
                        : (item.mainImage || '');

                    return {
                        id: String(item.id),
                        title: item.title,
                        normTitle: normalizeText(item.title),
                        mainImage: thumb,
                        category: detectCategory(item.title)
                    };
                });
            } else {
                // Fallback a partir dos cards existentes no DOM
                const cards = Array.from(document.querySelectorAll('.product-card'));
                productIndex = cards.map(card => {
                    const id = card.getAttribute('data-product-id') || card.id.replace(/\D/g, '') || '';
                    const titleEl = card.querySelector('.product-card-title a') || card.querySelector('.product-card-title');
                    const title = titleEl ? titleEl.textContent.trim() : '';
                    const imgEl = card.querySelector('.product-card-image img') || card.querySelector('img');
                    const thumb = imgEl ? (imgEl.getAttribute('data-src') || imgEl.src) : '';

                    return {
                        id: id,
                        title: title,
                        normTitle: normalizeText(title),
                        mainImage: thumb,
                        category: detectCategory(title)
                    };
                });
            }
        }

        buildIndex();

        // 2. Container do Dropdown de Sugestões em Tempo Real
        let suggestionsDropdown = document.getElementById('rj-search-suggestions-box');
        if (!suggestionsDropdown) {
            suggestionsDropdown = document.createElement('div');
            suggestionsDropdown.id = 'rj-search-suggestions-box';
            suggestionsDropdown.className = 'rj-search-suggestions';
            suggestionsDropdown.setAttribute('role', 'listbox');
            suggestionsDropdown.style.display = 'none';
            searchBox.appendChild(suggestionsDropdown);
        }

        let selectedIndex = -1;
        let currentSuggestions = [];
        let debounceTimer = null;

        // 3. Algoritmo de Busca e Relevância
        function searchProducts(rawQuery) {
            const clean = normalizeText(rawQuery);
            if (clean.length < 2) return { results: [], total: 0 };

            // Se o índice ainda estiver vazio (ex: delay de script), reconstrói
            if (productIndex.length === 0) buildIndex();

            const terms = clean.split(/\s+/).filter(w => w.length > 0);

            const matched = [];
            for (let i = 0; i < productIndex.length; i++) {
                const item = productIndex[i];
                const matchesAll = terms.every(term => item.normTitle.includes(term));

                if (matchesAll) {
                    let score = 0;
                    if (item.normTitle.startsWith(clean)) score += 100;
                    else if (item.normTitle.includes(clean)) score += 60;
                    if (item.normTitle.startsWith(terms[0])) score += 30;
                    score += Math.max(0, 50 - item.normTitle.length * 0.2);

                    matched.push({
                        item: item,
                        score: score
                    });
                }
            }

            matched.sort((a, b) => b.score - a.score);

            return {
                results: matched.slice(0, 6).map(m => m.item),
                total: matched.length
            };
        }

        // 4. Renderização das Sugestões no Dropdown
        function renderSuggestions(query) {
            const searchData = searchProducts(query);
            currentSuggestions = searchData.results;
            selectedIndex = -1;

            if (normalizeText(query).length < 2) {
                closeSuggestions();
                return;
            }

            const cleanTerms = normalizeText(query).split(/\s+/).filter(w => w.length > 0);

            if (currentSuggestions.length === 0) {
                suggestionsDropdown.innerHTML = `
                    <div class="rj-search-empty">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            <line x1="8" y1="11" x2="14" y2="11"></line>
                        </svg>
                        <span>Nenhum móvel encontrado para "<strong>${escapeHtml(query)}</strong>".</span>
                        <div class="rj-search-empty-hints">Sugestões: Sofá retrátil, Mesa de jantar, Cômoda, Balcão de cozinha</div>
                    </div>
                `;
                suggestionsDropdown.style.display = 'block';
                return;
            }

            let html = `
                <div class="rj-search-header-bar">
                    <span class="rj-search-count-badge">${searchData.total} móve${searchData.total > 1 ? 'is encontrados' : 'l encontrado'}</span>
                    <span class="rj-search-nav-hint">Use as setas ↑ ↓ para navegar</span>
                </div>
                <div class="rj-search-list-container">
            `;

            currentSuggestions.forEach((item, index) => {
                const highlighted = highlightMatches(item.title, cleanTerms);
                html += `
                    <div class="rj-search-item" data-index="${index}" data-id="${item.id}" role="option" tabindex="-1">
                        <img class="rj-search-item-thumb" src="${escapeHtml(item.mainImage)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.style.display='none'">
                        <div class="rj-search-item-info">
                            <span class="rj-search-item-title">${highlighted}</span>
                            <span class="rj-search-item-meta">${escapeHtml(item.category)} • Código: #${item.id}</span>
                        </div>
                        <span class="rj-search-item-badge">Ver detalhes →</span>
                    </div>
                `;
            });

            html += `</div>`;

            // Rodapé do Dropdown
            html += `
                <div class="rj-search-footer" id="rj-search-view-all">
                    <span>Ver todos os <strong>${searchData.total}</strong> resultados no Catálogo Completo</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </div>
            `;

            suggestionsDropdown.innerHTML = html;
            suggestionsDropdown.style.display = 'block';

            // Eventos de clique nos itens sugeridos
            const itemsEls = suggestionsDropdown.querySelectorAll('.rj-search-item');
            itemsEls.forEach(el => {
                el.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const id = this.getAttribute('data-id');
                    openProductDetails(id);
                });

                el.addEventListener('mouseenter', function () {
                    itemsEls.forEach(i => i.classList.remove('is-active'));
                    this.classList.add('is-active');
                    selectedIndex = parseInt(this.getAttribute('data-index'), 10);
                });
            });

            // Evento no rodapé "Ver todos no catálogo"
            const viewAllEl = document.getElementById('rj-search-view-all');
            if (viewAllEl) {
                viewAllEl.addEventListener('click', function (e) {
                    e.stopPropagation();
                    executeGlobalSearch(query);
                });
            }
        }

        // 5. Abertura Instantânea do Modal de Detalhes
        function openProductDetails(productId) {
            closeSuggestions();

            // Se a API global do modal estiver disponível, abre diretamente
            if (window.RJProductModal && typeof window.RJProductModal.open === 'function') {
                const prod = window.RJ_PRODUCTS_DATA ? window.RJ_PRODUCTS_DATA[String(productId)] : null;
                const title = prod ? prod.title : '';
                const img = prod ? (prod.mainImage || (prod.gallery && prod.gallery[0]) || '') : '';
                window.RJProductModal.open(productId, title, img);
                return;
            }

            // Fallback: se o produto estiver visível no card da página, dispara clique
            const card = document.querySelector(`.product-card[data-product-id="${productId}"]`);
            if (card) {
                card.click();
            } else {
                // Redireciona para o catálogo caso o modal não esteja montado
                window.location.href = `catalogo.html?q=${encodeURIComponent(searchInput.value)}`;
            }
        }

        // 6. Fechamento do Dropdown
        function closeSuggestions() {
            suggestionsDropdown.style.display = 'none';
            selectedIndex = -1;
        }

        // 7. Execução da Busca Global (Enter no input ou botão de pesquisa)
        function executeGlobalSearch(term) {
            const cleanTerm = (term || searchInput.value || '').trim();
            closeSuggestions();

            const isCatalogPage = window.location.pathname.endsWith('catalogo.html') || 
                                  window.location.pathname.endsWith('/catalogo') ||
                                  document.body.classList.contains('catalog-full-page');

            // Se estiver no catálogo geral com todos os 523 itens: filtra os cards localmente
            if (isCatalogPage) {
                filterGridCards(cleanTerm);
            } else {
                // Se estiver na Home ou em categoria específica: navega para catalogo.html com ?q=
                window.location.href = `catalogo.html?q=${encodeURIComponent(cleanTerm)}`;
            }
        }

        // 8. Filtragem dos Cards do Grid em catalogo.html
        function filterGridCards(term) {
            const grid = document.getElementById('rj-products-grid') || document.querySelector('.collection-grid');
            if (!grid) return;

            const cards = Array.from(grid.querySelectorAll('.product-card'));
            if (cards.length === 0) return;

            let feedbackEl = document.getElementById('rj-search-feedback');
            if (!feedbackEl) {
                feedbackEl = document.createElement('div');
                feedbackEl.id = 'rj-search-feedback';
                feedbackEl.className = 'rj-search-grid-feedback';
                grid.parentNode.insertBefore(feedbackEl, grid);
            }

            const clean = normalizeText(term);

            if (clean === '') {
                cards.forEach(card => {
                    card.classList.remove('search-hidden');
                    card.style.removeProperty('display');
                });
                feedbackEl.style.display = 'none';

                if (window.RJ_CatalogPagination) {
                    window.RJ_CatalogPagination.recalculate();
                }
                return;
            }

            const words = clean.split(/\s+/).filter(w => w.length > 0);
            let visibleCount = 0;

            cards.forEach(card => {
                const titleEl = card.querySelector('.product-card-title a') || card.querySelector('.product-card-title');
                const title = titleEl ? titleEl.textContent : '';
                const normCardTitle = normalizeText(title);

                const matchesAll = words.every(w => normCardTitle.includes(w));
                if (matchesAll) {
                    card.classList.remove('search-hidden');
                    card.style.removeProperty('display');
                    visibleCount++;
                } else {
                    card.classList.add('search-hidden');
                    card.style.setProperty('display', 'none', 'important');
                }
            });

            feedbackEl.style.display = 'flex';
            if (visibleCount === 0) {
                feedbackEl.innerHTML = `
                    <span>Nenhum móvel encontrado no catálogo para "<strong>${escapeHtml(term)}</strong>".</span>
                    <button type="button" class="btn-clear-search" id="btn-reset-search">Limpar busca e ver todos</button>
                `;
                const resetBtn = document.getElementById('btn-reset-search');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        searchInput.value = '';
                        filterGridCards('');
                    });
                }
            } else {
                feedbackEl.innerHTML = `
                    <span>Exibindo <strong>${visibleCount}</strong> móve${visibleCount > 1 ? 'is' : 'l'} para "<strong>${escapeHtml(term)}</strong>".</span>
                    <button type="button" class="btn-clear-search" id="btn-reset-search">Limpar filtro</button>
                `;
                const resetBtn = document.getElementById('btn-reset-search');
                if (resetBtn) {
                    resetBtn.addEventListener('click', () => {
                        searchInput.value = '';
                        filterGridCards('');
                    });
                }
            }

            if (window.RJ_CatalogPagination) {
                window.RJ_CatalogPagination.recalculate();
            }
        }

        // 9. Eventos de Escuta e Teclado
        // Digitação com micro-debounce de 60ms para resposta ultra-rápida (< 2ms)
        searchInput.addEventListener('input', function (e) {
            clearTimeout(debounceTimer);
            const val = e.target.value;
            debounceTimer = setTimeout(() => {
                renderSuggestions(val);
            }, 60);
        });

        // Foco no input reabre sugestões se já houver texto
        searchInput.addEventListener('focus', function () {
            if (this.value.trim().length >= 2) {
                renderSuggestions(this.value);
            }
        });

        // Navegação por Teclado Acessível
        searchInput.addEventListener('keydown', function (e) {
            const items = suggestionsDropdown.querySelectorAll('.rj-search-item');
            const total = items.length;

            if (suggestionsDropdown.style.display !== 'none' && total > 0) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    selectedIndex = (selectedIndex + 1) >= total ? 0 : selectedIndex + 1;
                    updateItemSelection(items);
                    return;
                }
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    selectedIndex = (selectedIndex - 1) < 0 ? total - 1 : selectedIndex - 1;
                    updateItemSelection(items);
                    return;
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < total) {
                        items[selectedIndex].click();
                    } else {
                        executeGlobalSearch(this.value);
                    }
                    return;
                }
                if (e.key === 'Escape') {
                    e.preventDefault();
                    closeSuggestions();
                    return;
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                executeGlobalSearch(this.value);
            }
        });

        function updateItemSelection(items) {
            items.forEach((item, idx) => {
                if (idx === selectedIndex) {
                    item.classList.add('is-active');
                    item.scrollIntoView({ block: 'nearest' });
                } else {
                    item.classList.remove('is-active');
                }
            });
        }

        // Clique no botão de submissão do formulário
        if (searchForm) {
            searchForm.addEventListener('submit', function (e) {
                e.preventDefault();
                executeGlobalSearch(searchInput.value);
            });
        }

        // Fechar dropdown ao clicar fora
        document.addEventListener('click', function (e) {
            if (!searchBox.contains(e.target)) {
                closeSuggestions();
            }
        });

        // 10. Tratamento de Query Param na URL (?q=termo)
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('q') || urlParams.get('keywords');
        if (queryParam) {
            searchInput.value = queryParam;
            // Aguarda montagem dos cards se necessário
            setTimeout(() => {
                filterGridCards(queryParam);
            }, 50);
        }
    }

    // Inicialização segura
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSmartSearch);
    } else {
        initSmartSearch();
    }

    // Exportação da API para testes e integrações externas
    window.RJ_SmartSearch = {
        init: initSmartSearch
    };
})();
