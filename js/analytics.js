// =========================================================================
// CONFIGURAÇÃO FÁCIL DE ANALYTICS RJ MÓVEIS
// Basta preencher o ID desejado abaixo para ativar a coleta imediatamente:
// =========================================================================
window.RJ_ANALYTICS_CONFIG = window.RJ_ANALYTICS_CONFIG || {
    googleAnalyticsId: '', // Exemplo: 'G-XXXXXXXXXX' (Google Analytics 4 / GA4)
    metaPixelId: '',       // Exemplo: '123456789012345' (Meta Pixel / Facebook & Instagram)
    vercelAnalytics: true  // Habilitado por padrão. Auto-ativação Vercel Web Analytics
};

// Inicialização imediata dos stubs assíncronos oficiais da Vercel (Web Analytics & Speed Insights)
window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
window.si = window.si || function () { (window.siq = window.siq || []).push(arguments); };

(function(window, document) {
    'use strict';

    const STORAGE_KEY = 'rj_analytics_events';
    const SUMMARY_KEY = 'rj_analytics_summary';

    const RJ_Analytics = {
        // Inicialização
        init: function() {
            this.setupThirdPartyScripts();
            this.trackPageView();
            this.attachEventListeners();
            this.checkUrlForReport();
        },

        // Carregamento automático sob demanda (Zero Configuração Manual)
        setupThirdPartyScripts: function() {
            const config = window.RJ_ANALYTICS_CONFIG || {};

            // 1. Google Analytics 4 Auto-loader
            if (config.googleAnalyticsId && typeof window.gtag !== 'function') {
                const gaScript = document.createElement('script');
                gaScript.async = true;
                gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`;
                document.head.appendChild(gaScript);

                window.dataLayer = window.dataLayer || [];
                window.gtag = function() { window.dataLayer.push(arguments); };
                window.gtag('js', new Date());
                window.gtag('config', config.googleAnalyticsId, { send_page_view: false });
            }

            // 2. Meta Pixel Auto-loader
            if (config.metaPixelId && typeof window.fbq !== 'function') {
                (function(f, b, e, v, n, t, s) {
                    if (f.fbq) return; n = f.fbq = function() {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
                    n.queue = []; t = b.createElement(e); t.async = !0;
                    t.src = v; s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s);
                })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                window.fbq('init', config.metaPixelId);
            }
        },

        // 1. Rastrear Visualização de Página (Pageview)
        trackPageView: function() {
            const pageData = {
                type: 'pageview',
                url: window.location.pathname + window.location.search,
                pageName: document.title,
                referrer: document.referrer || 'direto',
                device: this.getDeviceType(),
                timestamp: new Date().toISOString()
            };

            // Salva localmente
            this.saveEvent(pageData);
            this.incrementSummary('pageviews', window.location.pathname);

            // Google Analytics 4
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'page_view', {
                    page_title: document.title,
                    page_location: window.location.href,
                    page_path: window.location.pathname
                });
            }

            // Meta Pixel
            if (typeof window.fbq === 'function') {
                window.fbq('track', 'PageView');
            }

            // Vercel Analytics
            if (typeof window.va === 'function') {
                window.va('event', {
                    name: 'pageview',
                    data: {
                        page: window.location.pathname,
                        title: document.title
                    }
                });
            }
        },

        // 2. Rastrear Clique de Conversão no WhatsApp
        trackWhatsAppClick: function(productName, buttonLocation) {
            const clickData = {
                type: 'whatsapp_click',
                productName: productName || 'Atendimento Geral',
                buttonLocation: buttonLocation || 'desconhecido',
                page: window.location.pathname,
                timestamp: new Date().toISOString()
            };

            // Salva localmente
            this.saveEvent(clickData);
            this.incrementSummary('whatsapp_clicks', productName || 'Geral');

            console.log(`[RJ Analytics] Conversão WhatsApp registrada: "${clickData.productName}" via ${clickData.buttonLocation}`);

            // Google Analytics 4
            if (typeof window.gtag === 'function') {
                window.gtag('event', 'click_whatsapp', {
                    event_category: 'Conversão',
                    event_label: clickData.productName,
                    product_name: clickData.productName,
                    button_location: clickData.buttonLocation,
                    page_location: window.location.href
                });
            }

            // Meta Pixel
            if (typeof window.fbq === 'function') {
                window.fbq('trackCustom', 'WhatsAppClick', {
                    content_name: clickData.productName,
                    content_category: 'Atendimento WhatsApp',
                    button_location: clickData.buttonLocation
                });
            }

            // Vercel Analytics
            if (typeof window.va === 'function') {
                window.va('event', {
                    name: 'whatsapp_click',
                    data: {
                        product: clickData.productName,
                        location: clickData.buttonLocation,
                        page: window.location.pathname
                    }
                });
            }
        },

        // Captura automática de cliques em qualquer botão do WhatsApp
        attachEventListeners: function() {
            document.addEventListener('click', (e) => {
                const link = e.target.closest('a[href*="wa.me"], .btn-whatsapp-cta, .btn-whatsapp-floating');
                if (!link) return;

                let location = 'outro';
                if (link.closest('.product-card')) {
                    location = 'card_produto';
                } else if (link.closest('.rj-header') || link.closest('.rj-topbar')) {
                    location = 'cabecalho';
                } else if (link.classList.contains('btn-whatsapp-floating')) {
                    location = 'botao_flutuante_fab';
                } else if (link.closest('.cdm-foot')) {
                    location = 'rodape';
                } else if (link.closest('.sidebar-filter-block')) {
                    location = 'sidebar_consultor';
                }

                const prodName = link.getAttribute('data-product-name') || 
                                 link.getAttribute('title') || 
                                 link.textContent.trim() || 
                                 'Móvel do Catálogo';

                this.trackWhatsAppClick(prodName, location);
            }, true);
        },

        // Armazenamento local para consulta autônoma
        saveEvent: function(event) {
            try {
                let events = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                events.push(event);
                // Limita a 200 eventos recentes para economizar espaço
                if (events.length > 200) events = events.slice(-200);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            } catch (err) {}
        },

        incrementSummary: function(type, key) {
            try {
                let summary = JSON.parse(localStorage.getItem(SUMMARY_KEY) || '{"pageviews":{},"whatsapp_clicks":{},"total_clicks":0,"total_views":0}');
                if (type === 'pageviews') {
                    summary.total_views = (summary.total_views || 0) + 1;
                    summary.pageviews[key] = (summary.pageviews[key] || 0) + 1;
                } else if (type === 'whatsapp_clicks') {
                    summary.total_clicks = (summary.total_clicks || 0) + 1;
                    summary.whatsapp_clicks[key] = (summary.whatsapp_clicks[key] || 0) + 1;
                }
                localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
            } catch (err) {}
        },

        // Utilitário para detecção de dispositivo
        getDeviceType: function() {
            const w = window.innerWidth;
            if (w < 768) return 'mobile';
            if (w < 1024) return 'tablet';
            return 'desktop';
        },

        // Relatório impresso no console ou tela
        relatorio: function() {
            try {
                const summary = JSON.parse(localStorage.getItem(SUMMARY_KEY) || '{"pageviews":{},"whatsapp_clicks":{},"total_clicks":0,"total_views":0}');
                console.log('====================================================');
                console.log('📊 RELATÓRIO DE TELEMETRIA & CONVERSÕES RJ MÓVEIS');
                console.log('====================================================');
                console.log(`Total de Visualizações: ${summary.total_views || 0}`);
                console.log(`Total de Cliques no WhatsApp: ${summary.total_clicks || 0}`);
                console.log('\n--- Páginas Mais Acessadas ---');
                console.table(summary.pageviews);
                console.log('\n--- Produtos e Ações Mais Clicados no WhatsApp ---');
                console.table(summary.whatsapp_clicks);
                return summary;
            } catch (err) {
                console.error('Falha ao ler dados de analytics:', err);
            }
        },

        checkUrlForReport: function() {
            if (window.location.search.includes('analytics=1') || window.location.search.includes('relatorio=1')) {
                setTimeout(() => this.relatorio(), 500);
            }
        }
    };

    // Exporta globalmente
    window.RJ_Analytics = RJ_Analytics;

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            RJ_Analytics.init();
        });
    } else {
        RJ_Analytics.init();
    }

})(window, document);
