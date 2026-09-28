/**
 * catalog-search.js — Busca Instantânea no Catálogo RJ Móveis
 * Filtra os produtos em tempo real na tela conforme o usuário digita
 * com integração transparente com o sistema de paginação.
 */

function initSearch() {
    const searchInput = document.getElementById('rj-catalog-search-input');
    const searchForm = document.getElementById('rj-catalog-search-form');
    const grid = document.getElementById('rj-products-grid') || document.querySelector('.collection-grid');

    if (!searchInput || !grid) return;

    // Todos os cards de produto da página
    const cards = Array.from(grid.querySelectorAll('.product-card'));
    if (cards.length === 0) return;

    // Elemento para exibir contagem da busca / feedback
    let feedbackEl = document.getElementById('rj-search-feedback');
    if (!feedbackEl) {
        feedbackEl = document.createElement('div');
        feedbackEl.id = 'rj-search-feedback';
        feedbackEl.style.cssText = 'width: 100%; margin: 10px 0 20px 0; font-size: 0.9rem; color: #64748b; font-weight: 500; display: none;';
        grid.parentNode.insertBefore(feedbackEl, grid);
    }

    // Pré-computar termos de busca de cada card para máxima performance
    const cardData = cards.map(card => {
        const titleEl = card.querySelector('.product-card-title a') || card.querySelector('.product-card-title');
        const text = titleEl ? titleEl.textContent.toLowerCase() : '';
        return {
            element: card,
            text: text
        };
    });

    let debounceTimer = null;

    function performSearch(term) {
        const cleanTerm = term.trim().toLowerCase();

        if (cleanTerm === '') {
            cardData.forEach(item => {
                item.element.classList.remove('search-hidden');
                item.element.style.removeProperty('display');
            });
            feedbackEl.style.display = 'none';

            if (window.RJ_CatalogPagination) {
                window.RJ_CatalogPagination.recalculate();
            }
            return;
        }

        const words = cleanTerm.split(/\s+/).filter(w => w.length > 0);
        let visibleCount = 0;

        cardData.forEach(item => {
            const matchesAll = words.every(w => item.text.includes(w));
            if (matchesAll) {
                item.element.classList.remove('search-hidden');
                item.element.style.removeProperty('display');
                visibleCount++;
            } else {
                item.element.classList.add('search-hidden');
                item.element.style.setProperty('display', 'none', 'important');
            }
        });

        feedbackEl.style.display = 'block';
        if (visibleCount === 0) {
            feedbackEl.innerHTML = `Nenhum móvel encontrado para "<strong>${escapeHtml(term)}</strong>". <a href="catalogo.html" style="color: var(--color-primary-navy); font-weight: 600; text-decoration: underline;">Ver todos no Catálogo Geral</a>`;
        } else {
            feedbackEl.innerHTML = `Exibindo <strong>${visibleCount}</strong> resultado${visibleCount > 1 ? 's' : ''} para "<strong>${escapeHtml(term)}</strong>".`;
        }

        if (window.RJ_CatalogPagination) {
            window.RJ_CatalogPagination.recalculate();
        }
    }

    function escapeHtml(str) {
        return str.replace(/[&<>"']/g, function(m) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m];
        });
    }

    searchInput.addEventListener('input', function(e) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            performSearch(e.target.value);
        }, 120);
    });

    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
    }

    // Se houver query param ?q= na URL, inicializa a busca
    const urlParams = new URLSearchParams(window.location.search);
    const initialQuery = urlParams.get('q') || urlParams.get('keywords');
    if (initialQuery) {
        searchInput.value = initialQuery;
        performSearch(initialQuery);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
