/**
 * catalog-pagination.js — Paginação Dinâmica Instantânea do Catálogo RJ Móveis
 * Permite paginar centenas de produtos em tempo real (sem recarregar a página)
 * e conecta-se diretamente ao seletor de limite de itens por página existente no topo.
 */

function initPagination() {
    const grid = document.getElementById('rj-products-grid') || document.querySelector('.collection-grid.mode-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (cards.length === 0) return;

    // Seletor existente no cabeçalho da coleção (limit)
    const limitSelect = document.querySelector('select[name="limit"]') || document.getElementById('rj-select-per-page');

    // Se for uma página vitrine curta (ex: home com 12 itens), não requer paginação
    const isShowcase = cards.length <= 12 && (
        window.location.pathname.endsWith('index.html') || 
        window.location.pathname === '/' || 
        document.querySelector('.rj-home-catalog-cta')
    );

    if (isShowcase) {
        if (limitSelect && limitSelect.closest('.collection-limit')) {
            limitSelect.closest('.collection-limit').style.display = 'none';
        }
        return; // Todos os 12 cards permanecem visíveis sem paginação
    }

    // Configura opções do select de limite caso não possua 24
    if (limitSelect) {
        // Desativa submissão de formulário legado
        const parentForm = limitSelect.closest('form');
        if (parentForm) {
            parentForm.onsubmit = function(e) { e.preventDefault(); return false; };
            parentForm.addEventListener('submit', function(e) { e.preventDefault(); return false; });
        }
        limitSelect.removeAttribute('onchange');
        limitSelect.onchange = null;

        // Garante que a opção 24 existe
        let has24 = false;
        Array.from(limitSelect.options).forEach(opt => {
            if (opt.value === '24') has24 = true;
        });

        if (!has24) {
            const opt24 = new Option('24 por página', '24');
            limitSelect.add(opt24, 0);
        }
    }

    // Lê parâmetros da URL caso o usuário tenha informado ?page=X ou ?limit=Y
    const urlParams = new URLSearchParams(window.location.search);
    const paramPage = parseInt(urlParams.get('page'), 10);
    const paramLimit = parseInt(urlParams.get('limit'), 10);

    let itemsPerPage = 24;
    if (!isNaN(paramLimit) && paramLimit > 0) {
        itemsPerPage = paramLimit;
        if (limitSelect) limitSelect.value = String(paramLimit);
    } else if (limitSelect && limitSelect.value) {
        itemsPerPage = parseInt(limitSelect.value, 10) || 24;
    }

    let currentPage = (!isNaN(paramPage) && paramPage >= 1) ? paramPage : 1;

    // Criar contêiner de paginação na base da grade se ainda não existir
    let paginationNav = document.getElementById('rj-pagination-nav');
    if (!paginationNav) {
        paginationNav = document.createElement('nav');
        paginationNav.id = 'rj-pagination-nav';
        paginationNav.className = 'rj-pagination';
        paginationNav.setAttribute('aria-label', 'Paginação do Catálogo');
        grid.parentNode.insertBefore(paginationNav, grid.nextSibling);
    }

    // Elemento informativo de contagem
    let counterInfo = document.getElementById('rj-pagination-info');
    if (!counterInfo) {
        counterInfo = document.createElement('div');
        counterInfo.id = 'rj-pagination-info';
        counterInfo.className = 'rj-pagination-info';
        grid.parentNode.insertBefore(counterInfo, paginationNav);
    }

    function getCards() {
        return Array.from(grid.querySelectorAll('.product-card'));
    }

    function getVisibleCards() {
        // Considera cards na ordem atual do DOM que não foram escondidos pela busca
        return getCards().filter(card => !card.classList.contains('search-hidden'));
    }

    function renderPage() {
        const allCards = Array.from(grid.querySelectorAll('.product-card'));
        const totalItems = allCards.filter(c => !c.classList.contains('search-hidden')).length;
        const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

        // Passada única linear O(N) — Sem buscas aninhadas (zero travamento)
        let visibleCount = 0;
        for (let i = 0; i < allCards.length; i++) {
            const card = allCards[i];
            if (card.classList.contains('search-hidden')) {
                if (!card.classList.contains('page-hidden')) {
                    card.classList.add('page-hidden');
                    card.style.setProperty('display', 'none', 'important');
                }
            } else {
                if (visibleCount >= startIndex && visibleCount < endIndex) {
                    if (card.classList.contains('page-hidden')) {
                        card.classList.remove('page-hidden');
                        card.style.removeProperty('display');
                    }
                } else {
                    if (!card.classList.contains('page-hidden')) {
                        card.classList.add('page-hidden');
                        card.style.setProperty('display', 'none', 'important');
                    }
                }
                visibleCount++;
            }
        }

        // Atualiza texto informativo
        if (totalItems > 0) {
            counterInfo.innerHTML = `Mostrando <strong>${startIndex + 1}</strong>–<strong>${endIndex}</strong> de <strong>${totalItems}</strong> móveis (Página <strong>${currentPage}</strong> de <strong>${totalPages}</strong>)`;
        } else {
            counterInfo.innerHTML = `Nenhum produto exibido.`;
        }

        // Renderiza botões numéricos
        renderPaginationButtons(totalPages);
    }

    function renderPaginationButtons(totalPages) {
        if (totalPages <= 1) {
            paginationNav.style.display = 'none';
            return;
        }
        paginationNav.style.display = 'flex';

        let html = '';

        // Botão Anterior
        const prevDisabled = (currentPage === 1) ? ' disabled' : '';
        html += `<button type="button" class="rj-page-btn rj-page-prev"${prevDisabled} data-page="${currentPage - 1}">‹ Anterior</button>`;

        html += '<div class="rj-page-numbers">';

        // Lógica de Janela de Páginas (ex: 1 2 3 ... 22)
        const delta = 2;
        const range = [];
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        // Primeira página
        html += `<button type="button" class="rj-page-num${currentPage === 1 ? ' active' : ''}" data-page="1">1</button>`;

        if (range.length > 0 && range[0] > 2) {
            html += '<span class="rj-page-dots">...</span>';
        }

        range.forEach(p => {
            html += `<button type="button" class="rj-page-num${currentPage === p ? ' active' : ''}" data-page="${p}">${p}</button>`;
        });

        if (range.length > 0 && range[range.length - 1] < totalPages - 1) {
            html += '<span class="rj-page-dots">...</span>';
        }

        // Última página
        if (totalPages > 1) {
            html += `<button type="button" class="rj-page-num${currentPage === totalPages ? ' active' : ''}" data-page="${totalPages}">${totalPages}</button>`;
        }

        html += '</div>';

        // Botão Próximo
        const nextDisabled = (currentPage === totalPages) ? ' disabled' : '';
        html += `<button type="button" class="rj-page-btn rj-page-next"${nextDisabled} data-page="${currentPage + 1}">Próxima ›</button>`;

        paginationNav.innerHTML = html;
    }

    // Eventos de clique na navegação
    paginationNav.addEventListener('click', function(e) {
        const btn = e.target.closest('button[data-page]');
        if (!btn || btn.disabled) return;

        const targetPage = parseInt(btn.getAttribute('data-page'), 10);
        if (targetPage && targetPage !== currentPage) {
            currentPage = targetPage;
            renderPage();

            // Rolagem suave até o topo da grade
            const gridRect = grid.getBoundingClientRect();
            const targetY = window.pageYOffset + gridRect.top - 80;
            window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
        }
    });

    // Seletor de limite por página (ouve tanto 'change' quanto 'input')
    if (limitSelect) {
        const handleLimitChange = function(e) {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val > 0) {
                itemsPerPage = val;
                currentPage = 1;
                renderPage();
            }
        };
        limitSelect.addEventListener('change', handleLimitChange);
        limitSelect.addEventListener('input', handleLimitChange);
    }

    // Interação com o script de busca e API pública global
    window.RJ_CatalogPagination = {
        recalculate: function() {
            currentPage = 1;
            renderPage();
        },
        setPage: function(p) {
            currentPage = p;
            renderPage();
        },
        setLimit: function(l) {
            itemsPerPage = l;
            if (limitSelect) limitSelect.value = String(l);
            currentPage = 1;
            renderPage();
        },
        getCurrentPage: function() { return currentPage; },
        getItemsPerPage: function() { return itemsPerPage; }
    };

    // Renderização inicial
    renderPage();
}

// Inicialização segura compatível com qualquer estado do documento
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPagination);
} else {
    initPagination();
}
