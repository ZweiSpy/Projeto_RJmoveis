/**
 * catalog-sort.js — Motor de Ordenação Ultrarrápido e Suave (60 FPS)
 * Catálogo RJ Móveis
 * 
 * Performance garantida para mais de 500 produtos em tempo real:
 * 1. Pré-indexação de metadados em memória O(1)
 * 2. Ordenação em memória sem chamadas repetidas de querySelector
 * 3. Reanexação de nó em batch com DocumentFragment (1 único reflow no DOM)
 * 4. Desacoplamento assíncrono (setTimeout / micro-tick) para garantir transição suave e zero travamento de aba
 * 5. Integração com a paginação dinâmica sem reload
 */

function initCatalogSort() {
    const grid = document.getElementById('rj-products-grid') || document.querySelector('.collection-grid.mode-grid');
    if (!grid) return;

    // Cache inicial das referências dos cards
    const initialCards = Array.from(grid.querySelectorAll('.product-card'));
    if (initialCards.length === 0) return;

    // Indexação de dados estruturados em memória
    const items = initialCards.map((card, index) => {
        let title = card.dataset.sortTitle;
        if (!title) {
            const titleEl = card.querySelector('.product-card-title a') || card.querySelector('.btn-whatsapp-cta');
            title = (titleEl ? (titleEl.getAttribute('data-product-name') || titleEl.textContent) : '').trim();
            card.dataset.sortTitle = title;
        }
        let idVal = card.dataset.sortId;
        if (!idVal) {
            idVal = card.getAttribute('data-id') || '0';
            card.dataset.sortId = idVal;
        }
        if (!card.dataset.originalIndex) {
            card.dataset.originalIndex = String(index);
        }

        return {
            card: card,
            originalIndex: index,
            id: parseInt(idVal, 10) || 0,
            title: title
        };
    });

    const sortSelect = document.getElementById('rj-select-sort') || document.querySelector('select[name="sort"]');
    let currentSort = 'bestsellers';
    let isSorting = false;

    function executeSort(criterion) {
        if (!criterion) criterion = 'bestsellers';
        if (isSorting) return;
        isSorting = true;
        currentSort = criterion;

        // 1. Ordenação ultrarrápida em memória
        if (criterion === 'bestsellers') {
            items.sort((a, b) => a.originalIndex - b.originalIndex);
        } else if (criterion === 'new') {
            items.sort((a, b) => b.id - a.id); // Mais recentes primeiro
        } else if (criterion === 'name') {
            items.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR', { sensitivity: 'base', numeric: true }));
        }

        // 2. Batch DOM Update com DocumentFragment (1 único reflow na tela)
        const fragment = document.createDocumentFragment();
        for (let i = 0; i < items.length; i++) {
            fragment.appendChild(items[i].card);
        }
        grid.appendChild(fragment);

        // 3. Notifica a paginação de forma otimizada para reiniciar na página 1
        if (window.RJ_CatalogPagination && typeof window.RJ_CatalogPagination.recalculate === 'function') {
            window.RJ_CatalogPagination.recalculate();
        }

        isSorting = false;
    }

    function handleSortChange(e) {
        if (e) {
            e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
        }
        const val = sortSelect ? sortSelect.value : '';
        if (!val || val === currentSort) return;

        // Transição suave de opacidade durante a reorganização (feedback tátil de carregamento sem travar)
        grid.style.opacity = '0.7';
        grid.style.transition = 'opacity 0.12s ease';

        // Execução descolada da UI thread (libera o dropdown instantaneamente)
        setTimeout(() => {
            executeSort(val);
            grid.style.opacity = '1';
        }, 16);
    }

    if (sortSelect) {
        // Desativa qualquer formulário legado que envolva o select
        const parentForm = sortSelect.closest('form');
        if (parentForm) {
            parentForm.onsubmit = function(e) { 
                e.preventDefault(); 
                e.stopPropagation(); 
                return false; 
            };
        }
        sortSelect.removeAttribute('onchange');
        sortSelect.onchange = null;

        // Ouve apenas o evento oficial 'change' para evitar execuções duplicadas
        sortSelect.addEventListener('change', handleSortChange);

        // Verifica parâmetro de URL inicial ?sort=xxx
        const urlParams = new URLSearchParams(window.location.search);
        const paramSort = urlParams.get('sort');
        if (paramSort && ['bestsellers', 'new', 'name'].includes(paramSort) && paramSort !== 'bestsellers') {
            sortSelect.value = paramSort;
            executeSort(paramSort);
        }
    }

    window.RJ_CatalogSort = {
        applySort: executeSort,
        getCurrentSort: function() { return currentSort; }
    };
}

// Inicialização segura compatível com qualquer estado do documento
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCatalogSort);
} else {
    initCatalogSort();
}
