/**
 * ====================================================================
 * PROJETO MEUSMÓVEIS — MOTOR DE ALTERNÂNCIA DE TEMA (DARK / LIGHT)
 * ====================================================================
 * Gerenciamento de preferências do usuário, persistência em localStorage
 * e sincronização com preferências de sistema.
 * ====================================================================
 */

(function () {
    'use strict';

    var STORAGE_KEY = 'rj_theme';

    /**
     * Obtém o tema preferido do usuário (armazenado ou preferência do SO).
     */
    function getPreferredTheme() {
        var savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'dark' || savedTheme === 'light') {
            return savedTheme;
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    }

    /**
     * Aplica o tema ao documento raiz e sincroniza estados de botões.
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            // Suprime erro caso cookies/localStorage estejam bloqueados
        }

        // Atualiza atributos ARIA e títulos de todos os botões de alternância
        var toggleButtons = document.querySelectorAll('.rj-theme-toggle');
        toggleButtons.forEach(function (btn) {
            var isDark = theme === 'dark';
            btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
            btn.setAttribute(
                'title',
                isDark ? 'Alternar para Modo Claro' : 'Alternar para Modo Escuro'
            );
        });
    }

    /**
     * Alterna entre modo claro e escuro.
     */
    function toggleTheme() {
        var currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    /**
     * Inicializa ouvintes e sincronização.
     */
    function initThemeEngine() {
        // Inicializa com o tema preferido imediatamente
        var initialTheme = getPreferredTheme();
        applyTheme(initialTheme);

        // Delegação de evento de clique para os botões .rj-theme-toggle
        document.addEventListener('click', function (e) {
            var btn = e.target.closest('.rj-theme-toggle');
            if (btn) {
                e.preventDefault();
                toggleTheme();
            }
        });

        // Ouve alterações no tema do SO caso o usuário não tenha definido preferência manual
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
                if (!localStorage.getItem(STORAGE_KEY)) {
                    applyTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initThemeEngine);
    } else {
        initThemeEngine();
    }
})();
