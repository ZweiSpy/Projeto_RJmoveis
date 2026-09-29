/**
 * ====================================================================
 * cro-enhancements.js — RJ Móveis CRO Conversion Engine
 * ====================================================================
 * Implementação dos Pilares de Conversão:
 * 1. Smart Floating WhatsApp Chat Bubble (Balão proativo de atendimento)
 * 2. Sticky Mobile CRO Bar (Barra fixa mobile de resposta rápida)
 * 3. Integração com Telemetria e Persistência de Sessão
 * ====================================================================
 */

(function () {
    'use strict';

    const WHATSAPP_PHONE = '5521994990764';
    const SESSION_DISMISSED_KEY = 'rj_bubble_dismissed';

    function initCROEnhancements() {
        // 1. Criar e Gerenciar o Balão Proativo de Atendimento (Pilar 1)
        initWhatsAppBubble();

        // 2. Criar e Gerenciar a Barra Fixa Mobile (Pilar 4)
        initMobileStickyBar();
    }

    /**
     * Pilar 1: Smart Floating WhatsApp Chat Bubble
     */
    function initWhatsAppBubble() {
        if (document.getElementById('rj-whatsapp-bubble')) return;

        // Se o usuário já dispensou nesta sessão de navegação, respeita a escolha
        if (sessionStorage.getItem(SESSION_DISMISSED_KEY) === '1') {
            return;
        }

        const bubble = document.createElement('div');
        bubble.id = 'rj-whatsapp-bubble';
        bubble.className = 'rj-whatsapp-bubble';
        bubble.setAttribute('role', 'complementary');
        bubble.setAttribute('aria-label', 'Atendimento Online RJ Móveis');

        const bubbleMsg = encodeURIComponent('Olá, consultor RJ Móveis! Estava olhando o site e gostaria de tirar dúvidas sobre cores, modelos e prazos de entrega.');

        bubble.innerHTML = `
            <button type="button" class="rj-bubble-close" id="rj-bubble-close-btn" aria-label="Fechar balão de atendimento">&times;</button>
            <div class="rj-bubble-header">
                <div class="rj-bubble-avatar">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                    </svg>
                    <span class="rj-bubble-status-dot" aria-hidden="true"></span>
                </div>
                <div class="rj-bubble-agent-info">
                    <span class="rj-bubble-name">Consultoria RJ Móveis</span>
                    <span class="rj-bubble-status-text"><span class="rj-status-beacon"></span> Online agora</span>
                </div>
            </div>
            <div class="rj-bubble-body">
                <p>Olá! Posso te ajudar a consultar disponibilidade de cores, tecidos ou prazo de entrega para o seu bairro no Rio?</p>
            </div>
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=${bubbleMsg}" target="_blank" rel="noopener noreferrer" class="rj-bubble-cta-btn btn-whatsapp-cta" data-product-name="CRO WhatsApp Bubble CTA">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                <span>Falar com Consultor no WhatsApp</span>
            </a>
            <div class="rj-bubble-arrow" aria-hidden="true"></div>
        `;

        document.body.appendChild(bubble);

        const closeBtn = document.getElementById('rj-bubble-close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dismissBubble(bubble);
            });
        }

        // Exibir após 3.5 segundos ou após scroll de 25%
        let shown = false;
        function showBubble() {
            if (shown) return;
            shown = true;
            bubble.classList.add('rj-bubble-visible');
        }

        const timer = setTimeout(showBubble, 3500);

        function handleScroll() {
            const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollTotal > 300) {
                const ratio = window.scrollY / scrollTotal;
                if (ratio > 0.2) {
                    showBubble();
                    clearTimeout(timer);
                    window.removeEventListener('scroll', handleScroll);
                }
            }
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    function dismissBubble(bubbleEl) {
        sessionStorage.setItem(SESSION_DISMISSED_KEY, '1');
        bubbleEl.classList.remove('rj-bubble-visible');
        bubbleEl.classList.add('rj-bubble-hidden');
        setTimeout(() => {
            if (bubbleEl && bubbleEl.parentNode) {
                bubbleEl.parentNode.removeChild(bubbleEl);
            }
        }, 300);
    }

    /**
     * Pilar 4: Barra Fixa Mobile de Ação Rápida (Sticky Mobile CRO Bar)
     */
    function initMobileStickyBar() {
        if (document.getElementById('rj-mobile-sticky-bar')) return;

        const stickyBar = document.createElement('div');
        stickyBar.id = 'rj-mobile-sticky-bar';
        stickyBar.className = 'rj-mobile-sticky-bar';
        stickyBar.setAttribute('role', 'navigation');
        stickyBar.setAttribute('aria-label', 'Atendimento rápido mobile');

        const stickyMsg = encodeURIComponent('Olá! Estou navegando no catálogo mobile da RJ Móveis e gostaria de atendimento rápido sobre modelos e entrega.');

        stickyBar.innerHTML = `
            <a href="https://wa.me/${WHATSAPP_PHONE}?text=${stickyMsg}" target="_blank" rel="noopener noreferrer" class="rj-sticky-btn-whats btn-whatsapp-cta" data-product-name="CRO Mobile Sticky Bar WhatsApp">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2z"/></svg>
                <span>Chamar no WhatsApp • Resposta Rápida</span>
            </a>
            <a href="catalogo.html" class="rj-sticky-btn-catalog" title="Ver Catálogo Completo" aria-label="Ver Catálogo">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
                <span>Catálogo</span>
            </a>
        `;

        document.body.appendChild(stickyBar);
    }

    // Inicialização ao carregar o DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCROEnhancements);
    } else {
        initCROEnhancements();
    }
})();
