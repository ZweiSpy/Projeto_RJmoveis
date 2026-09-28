/**
 * ====================================================================
 * PROJETO MEUSMÓVEIS — MOTOR DE CONVERSÃO WHATSAPP
 * ====================================================================
 * Responsável por:
 * 1. Centralizar a configuração do número de WhatsApp do vendedor (Zwei)
 * 2. Gerar mensagens dinâmicas e personalizadas com o nome exato do produto
 * 3. Sanitizar o número e codificar a URL de forma segura (UTF-8)
 * 4. Atribuir eventos de clique e sincronizar links para acessibilidade
 * ====================================================================
 */

const WHATSAPP_CONFIG = {
    // Número do Vendedor com DDI (55 para Brasil) e DDD, ex: "5511999999999"
    // Pode conter parênteses e traços que serão automaticamente sanitizados
    phoneNumber: "5511999999999",

    // Template padrão da mensagem enviada ao vendedor
    defaultMessageTemplate: "Olá! Vi o catálogo e gostaria de mais informações e atendimento sobre: *{product_name}*. Pode me ajudar?",

    // Mensagem de fallback caso o nome do produto não esteja disponível
    fallbackMessage: "Olá! Vi o catálogo de móveis e gostaria de atendimento sobre um dos produtos. Pode me ajudar?",

    /**
     * Monta o texto final da mensagem substituindo o placeholder pelo nome do produto.
     * @param {string} productName - Nome exato do produto selecionado
     * @returns {string} Mensagem formatada
     */
    buildMessage: function(productName) {
        if (!productName || typeof productName !== "string" || productName.trim() === "") {
            return this.fallbackMessage;
        }
        return this.defaultMessageTemplate.replace("{product_name}", productName.trim());
    },

    /**
     * Sanitiza o número de telefone, mantendo apenas dígitos numéricos.
     * @returns {string} Apenas dígitos
     */
    getCleanPhoneNumber: function() {
        const raw = String(this.phoneNumber || "");
        return raw.replace(/\D/g, "");
    },

    /**
     * Gera a URL final para abertura no WhatsApp Web ou App.
     * @param {string} productName - Nome do produto
     * @returns {string} URL completa com protocolo https://wa.me/
     */
    buildUrl: function(productName) {
        const phone = this.getCleanPhoneNumber();
        const message = this.buildMessage(productName);
        const encodedText = encodeURIComponent(message);
        return `https://wa.me/${phone}?text=${encodedText}`;
    }
};

/**
 * Inicializador da integração com o DOM
 */
function initWhatsAppCTA() {
    if (typeof document === "undefined") {
        return; // Ambiente não-DOM (ex: testes em Node.js)
    }

    // 1. Sincroniza os atributos href de todos os pontos de contato de produto existentes na página
    // Isso garante acessibilidade (hover preview, abrir em nova aba com botão direito)
    const updateButtonsHref = () => {
        const elements = document.querySelectorAll(".btn-whatsapp-cta, .product-card-title a, a.product-link");
        elements.forEach(el => {
            const productName = el.getAttribute("data-product-name") || 
                                (el.closest(".product-card")?.querySelector(".product-card-title a")?.textContent?.trim()) ||
                                "";
            
            const url = WHATSAPP_CONFIG.buildUrl(productName);
            el.setAttribute("href", url);
            el.setAttribute("target", "_blank");
            el.setAttribute("rel", "noopener noreferrer");
        });
    };

    // 2. Delegação de eventos no Document para garantir funcionamento em qualquer interação
    document.addEventListener("click", (event) => {
        const target = event.target.closest(".btn-whatsapp-cta, .product-card-title a, a.product-link");
        if (!target) return;

        const productName = target.getAttribute("data-product-name") || 
                            (target.closest(".product-card")?.querySelector(".product-card-title a")?.textContent?.trim()) ||
                            "";

        const finalUrl = WHATSAPP_CONFIG.buildUrl(productName);
        target.setAttribute("href", finalUrl);
    });

    // Executa ao carregar o DOM
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", updateButtonsHref);
    } else {
        updateButtonsHref();
    }
}

// Auto-inicialização no navegador
if (typeof window !== "undefined") {
    window.WHATSAPP_CONFIG = WHATSAPP_CONFIG;
    window.initWhatsAppCTA = initWhatsAppCTA;
    initWhatsAppCTA();
}

// Suporte para exportação em testes Node.js
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        WHATSAPP_CONFIG,
        initWhatsAppCTA
    };
}
