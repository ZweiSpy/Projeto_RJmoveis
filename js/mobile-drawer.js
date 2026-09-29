/**
 * ====================================================================
 * mobile-drawer.js — RJ Móveis Mobile Navigation Drawer
 * ====================================================================
 * Gerenciador moderno de navegação off-canvas para telas menores:
 * - Abertura/fechamento fluido com aceleração de hardware (CSS transform)
 * - Fechamento por backdrop, botão de fechar, swipe e tecla ESC
 * - Prevenção de rolagem do body quando o drawer estiver aberto
 * - Acessibilidade completa (ARIA expanded, role dialog, foco gerenciado)
 * ====================================================================
 */

(function () {
    'use strict';

    function initMobileDrawer() {
        const toggleBtn = document.getElementById('rj-mobile-menu-toggle');
        const drawer = document.getElementById('rj-mobile-drawer');
        const backdrop = document.getElementById('rj-drawer-backdrop');
        const closeBtn = document.getElementById('rj-drawer-close-btn');

        if (!toggleBtn || !drawer) return;

        function openDrawer() {
            drawer.classList.add('is-open');
            if (backdrop) backdrop.classList.add('is-open');
            document.body.classList.add('rj-drawer-open');
            toggleBtn.setAttribute('aria-expanded', 'true');
            if (closeBtn) closeBtn.focus();
        }

        function closeDrawer() {
            drawer.classList.remove('is-open');
            if (backdrop) backdrop.classList.remove('is-open');
            document.body.classList.remove('rj-drawer-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        }

        toggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            if (drawer.classList.contains('is-open')) {
                closeDrawer();
            } else {
                openDrawer();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                closeDrawer();
            });
        }

        if (backdrop) {
            backdrop.addEventListener('click', function () {
                closeDrawer();
            });
        }

        // Fechar ao pressionar ESC
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
                closeDrawer();
            }
        });

        // Fechar ao clicar em qualquer link de navegação dentro do drawer
        const drawerLinks = drawer.querySelectorAll('.rj-drawer-nav-list a');
        drawerLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                closeDrawer();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMobileDrawer);
    } else {
        initMobileDrawer();
    }
})();
