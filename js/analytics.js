// =========================================================================
// CONFIGURAÇÃO DE TELEMETRIA RJ MÓVEIS (GITHUB PAGES: GA4 + MS CLARITY)
// =========================================================================
// Google Analytics 4 (Measurement ID G-8VNZNQ8C1K) e Microsoft Clarity
// (zftkkx1ir8) ativos por padrão para coleta em produção no GitHub Pages.
window.RJ_ANALYTICS_CONFIG = window.RJ_ANALYTICS_CONFIG || {
    googleAnalyticsId: 'G-8VNZNQ8C1K',      // ID da métrica Web oficial no GA4
    googleAnalyticsPropertyId: '416985372', // Referência administrativa da propriedade GA4
    clarityProjectId: 'zftkkx1ir8',        // Microsoft Clarity (heatmaps, gravações e eventos)
    metaPixelId: '',                       // Opcional: ID do Meta Pixel (Facebook / Instagram)
    debugConsole: false                    // Ativa logs detalhados no console (ou via ?analytics=1)
};

(function (window, document) {
    'use strict';

    const STORAGE_KEY = 'rj_analytics_events';
    const SUMMARY_KEY = 'rj_analytics_summary';
    const SESSION_DAY_KEY = 'rj_analytics_session_day';
    const MAX_EVENTS = 250;
    const MAX_DAILY_BUCKETS = 60;

    function getLocalDateKey(dateObj) {
        const d = dateObj || new Date();
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    function sanitizeText(str, maxLen) {
        const cleaned = String(str || '').replace(/\s+/g, ' ').trim();
        if (!maxLen || cleaned.length <= maxLen) return cleaned;
        return cleaned.slice(0, maxLen - 1) + '…';
    }

    function escapeHtml(str) {
        if (str === undefined || str === null) return '';
        return String(str).replace(/[&<>"']/g, function (ch) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
        });
    }

    function isValidGa4Id(id) {
        if (!id || typeof id !== 'string') return false;
        const trimmed = id.trim();
        if (!trimmed || /^G-X+$/i.test(trimmed)) return false;
        return /^(G|AW|GT)-[A-Z0-9]+$/i.test(trimmed);
    }

    function isValidClarityId(id) {
        if (!id || typeof id !== 'string') return false;
        const trimmed = id.trim();
        return /^[a-z0-9]{6,20}$/i.test(trimmed) && !/^x+$/i.test(trimmed);
    }

    function isDebugMode() {
        const cfg = window.RJ_ANALYTICS_CONFIG || {};
        const search = (window.location && window.location.search) || '';
        return Boolean(cfg.debugConsole || search.includes('analytics=1') || search.includes('relatorio=1'));
    }

    const RJ_Analytics = {
        _initialized: false,
        _listenersAttached: false,
        _warnedNumericGaId: false,
        _lastSearchKey: '',

        init: function () {
            if (this._initialized) return;
            this._initialized = true;

            this.setupThirdPartyScripts();
            this.trackPageView();
            this.attachEventListeners();
            this.checkUrlForReport();
        },

        // Carregamento automático de GA4, Microsoft Clarity e Meta Pixel (compatível com GitHub Pages)
        setupThirdPartyScripts: function () {
            const config = window.RJ_ANALYTICS_CONFIG || {};
            const gaId = String(config.googleAnalyticsId || '').trim();
            const clarityId = String(config.clarityProjectId || '').trim();
            const pixelId = String(config.metaPixelId || '').trim();

            // 1. Google Analytics 4 (gtag.js — exige ID da métrica G-XXXXXXXXXX)
            if (gaId) {
                if (isValidGa4Id(gaId)) {
                    if (typeof window.gtag !== 'function') {
                        window.dataLayer = window.dataLayer || [];
                        window.gtag = function () {
                            window.dataLayer.push(arguments);
                        };
                        window.gtag('js', new Date());
                        window.gtag('config', gaId, { send_page_view: false });

                        if (document && typeof document.createElement === 'function' && document.head) {
                            const gaScript = document.createElement('script');
                            gaScript.async = true;
                            gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
                            document.head.appendChild(gaScript);
                        }
                    }
                } else if (/^\d+$/.test(gaId) && !this._warnedNumericGaId) {
                    this._warnedNumericGaId = true;
                    if (window.console && typeof window.console.warn === 'function') {
                        window.console.warn(
                            `[RJ Analytics] "${gaId}" é um Property ID numérico e NÃO é aceito pelo gtag.js. Informe o "ID da métrica" Web no formato G-XXXXXXXXXX em RJ_ANALYTICS_CONFIG.googleAnalyticsId.`
                        );
                    }
                }
            }

            // 2. Microsoft Clarity (Heatmaps, Gravações de Sessão & Eventos)
            if (isValidClarityId(clarityId)) {
                if (typeof window.clarity !== 'function') {
                    window.clarity = function () {
                        (window.clarity.q = window.clarity.q || []).push(arguments);
                    };
                    if (document && typeof document.createElement === 'function') {
                        const targetParent = document.head || (typeof document.getElementsByTagName === 'function' && document.getElementsByTagName('script')[0]?.parentNode);
                        if (targetParent) {
                            const clarityScript = document.createElement('script');
                            clarityScript.async = true;
                            clarityScript.src = `https://www.clarity.ms/tag/${encodeURIComponent(clarityId)}`;
                            targetParent.appendChild(clarityScript);
                        }
                    }
                }
            }

            // 3. Meta Pixel (Opcional)
            if (pixelId && typeof window.fbq !== 'function' && document && typeof document.createElement === 'function') {
                const targetParent = document.head || (typeof document.getElementsByTagName === 'function' && document.getElementsByTagName('head')[0]);
                if (targetParent) {
                    const n = window.fbq = function () {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
                    };
                    if (!window._fbq) window._fbq = n;
                    n.push = n;
                    n.loaded = true;
                    n.version = '2.0';
                    n.queue = [];
                    const fbScript = document.createElement('script');
                    fbScript.async = true;
                    fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
                    targetParent.appendChild(fbScript);
                    window.fbq('init', pixelId);
                }
            }
        },

        // Despachantes unificados para GA4 e Microsoft Clarity
        sendGA4Event: function (eventName, params, useBeacon) {
            if (typeof window.gtag !== 'function') return;
            const payload = Object.assign({}, params || {});
            if (useBeacon) {
                payload.transport_type = 'beacon';
            }
            window.gtag('event', eventName, payload);
        },

        sendClarityEvent: function (eventName, tags) {
            if (typeof window.clarity !== 'function') return;
            try {
                if (tags && typeof tags === 'object') {
                    Object.keys(tags).forEach(k => {
                        const val = tags[k];
                        if (val !== undefined && val !== null && val !== '') {
                            window.clarity('set', String(k), sanitizeText(val, 120));
                        }
                    });
                }
                if (eventName) {
                    window.clarity('event', String(eventName));
                }
            } catch (err) {}
        },

        getPagePath: function () {
            return (window.location && window.location.pathname) || '/';
        },

        getPageDepartment: function (pathname) {
            const p = String(pathname || this.getPagePath()).toLowerCase();
            if (p === '/' || p.endsWith('/index.html') || p.endsWith('/index')) return 'inicio';
            if (p.includes('catalogo')) return 'catalogo_completo';
            if (p.includes('sofas')) return 'sofas';
            if (p.includes('quartos')) return 'quartos';
            if (p.includes('cozinha')) return 'cozinha';
            if (p.includes('salas')) return 'salas';
            if (p.includes('paineis')) return 'paineis';
            if (p.includes('pronta-entrega')) return 'pronta_entrega';
            return 'outra_pagina';
        },

        getDeviceType: function () {
            const w = window.innerWidth || 1280;
            if (w < 768) return 'mobile';
            if (w < 1024) return 'tablet';
            return 'desktop';
        },

        checkAndMarkDailySession: function (dayKey) {
            try {
                if (!window.sessionStorage) return false;
                const lastDay = window.sessionStorage.getItem(SESSION_DAY_KEY);
                if (lastDay !== dayKey) {
                    window.sessionStorage.setItem(SESSION_DAY_KEY, dayKey);
                    return true;
                }
            } catch (err) {}
            return false;
        },

        // 1. Visualização de página e início de sessão diária
        trackPageView: function () {
            const path = this.getPagePath();
            const search = (window.location && window.location.search) || '';
            const department = this.getPageDepartment(path);
            const device = this.getDeviceType();
            const dayKey = getLocalDateKey();
            const isNewDailySession = this.checkAndMarkDailySession(dayKey);

            const pageData = {
                type: 'pageview',
                date: dayKey,
                url: path + search,
                pagePath: path,
                pageName: (document && document.title) || 'RJ Móveis',
                department: department,
                referrer: (document && document.referrer) || 'direto',
                device: device,
                timestamp: new Date().toISOString()
            };

            this.saveEvent(pageData);
            this.incrementDailyMetric(dayKey, 'views', 1);
            if (isNewDailySession) {
                this.incrementDailyMetric(dayKey, 'sessions', 1);
            }
            this.incrementSummary('pageviews', path);

            this.sendGA4Event('page_view', {
                page_title: pageData.pageName,
                page_location: (window.location && window.location.href) || path,
                page_path: path,
                department: department,
                device_type: device
            });

            if (typeof window.fbq === 'function') {
                window.fbq('track', 'PageView');
            }

            if (typeof window.clarity === 'function') {
                try {
                    window.clarity('set', 'page_department', department);
                    window.clarity('set', 'device_type', device);
                    window.clarity('set', 'page_path', path);
                } catch (err) {}
            }
        },

        // 2. Cliques em links de navegação (menu, departamentos, banner, rodapé, externos)
        trackNavigationClick: function (linkUrl, linkLabel, linkLocation, isExternal) {
            const dayKey = getLocalDateKey();
            const path = this.getPagePath();
            const cleanUrl = sanitizeText(linkUrl || '#', 240);
            const cleanLabel = sanitizeText(linkLabel || cleanUrl, 100);
            const loc = sanitizeText(linkLocation || 'outro_link', 60);

            const navEvent = {
                type: 'navigation_click',
                date: dayKey,
                linkUrl: cleanUrl,
                linkLabel: cleanLabel,
                linkLocation: loc,
                isExternal: Boolean(isExternal),
                page: path,
                timestamp: new Date().toISOString()
            };

            this.saveEvent(navEvent);
            this.incrementDailyMetric(dayKey, 'nav_clicks', 1);
            this.incrementSummary('nav_links', `${loc} | ${cleanLabel}`);

            if (isDebugMode() && window.console) {
                window.console.log(`[RJ Analytics] Link clicado (${loc}): "${cleanLabel}" -> ${cleanUrl}`);
            }

            this.sendGA4Event('navegacao_link', {
                link_url: cleanUrl,
                link_label: cleanLabel,
                link_location: loc,
                is_external: Boolean(isExternal),
                page_path: path
            }, true);

            this.sendClarityEvent('nav_link_click', {
                last_nav_location: loc,
                last_nav_label: cleanLabel
            });
        },

        // 3. Cliques de conversão no WhatsApp (cards, modal, busca, sticky, FAB, cabeçalho, rodapé)
        trackWhatsAppClick: function (productName, buttonLocation, href) {
            const dayKey = getLocalDateKey();
            const path = this.getPagePath();
            const prod = sanitizeText(productName || 'Atendimento Geral', 140);
            const loc = sanitizeText(buttonLocation || 'desconhecido', 60);

            const clickData = {
                type: 'whatsapp_click',
                date: dayKey,
                productName: prod,
                buttonLocation: loc,
                linkUrl: sanitizeText(href || '', 240),
                page: path,
                timestamp: new Date().toISOString()
            };

            this.saveEvent(clickData);
            this.incrementDailyMetric(dayKey, 'whatsapp_clicks', 1);
            this.incrementSummary('whatsapp_clicks', `${prod} (${loc})`);

            if (isDebugMode() && window.console) {
                window.console.log(`[RJ Analytics] Conversão WhatsApp: "${prod}" via ${loc}`);
            }

            this.sendGA4Event('click_whatsapp', {
                event_category: 'Conversão',
                event_label: prod,
                product_name: prod,
                button_location: loc,
                page_path: path,
                page_location: (window.location && window.location.href) || path
            }, true);

            if (typeof window.fbq === 'function') {
                window.fbq('trackCustom', 'WhatsAppClick', {
                    content_name: prod,
                    content_category: 'Atendimento WhatsApp',
                    button_location: loc
                });
            }

            this.sendClarityEvent('whatsapp_click', {
                last_whatsapp_location: loc,
                last_whatsapp_product: prod
            });
        },

        // 4. Abertura de produto no Modal Quick-View (clique em card ou item da busca)
        trackProductModalOpen: function (productId, productTitle, source) {
            const dayKey = getLocalDateKey();
            const path = this.getPagePath();
            const title = sanitizeText(productTitle || `Produto #${productId}`, 140);
            const src = sanitizeText(source || 'grid_card', 40);

            const modalData = {
                type: 'product_modal_open',
                date: dayKey,
                productId: String(productId || ''),
                productTitle: title,
                source: src,
                page: path,
                timestamp: new Date().toISOString()
            };

            this.saveEvent(modalData);
            this.incrementDailyMetric(dayKey, 'modal_opens', 1);
            this.incrementSummary('products_opened', title);

            this.sendGA4Event('select_item', {
                item_list_name: src,
                items: [{
                    item_id: String(productId || ''),
                    item_name: title
                }],
                page_path: path
            });

            this.sendClarityEvent('product_modal_open', {
                last_product_opened: title,
                last_modal_source: src
            });
        },

        // 5. Interações de mídia dentro do Modal (miniaturas da galeria e vídeo YouTube)
        trackProductMedia: function (productId, productTitle, mediaType, detail) {
            const path = this.getPagePath();
            const title = sanitizeText(productTitle || `Produto #${productId}`, 140);
            const mType = sanitizeText(mediaType || 'gallery_thumb', 40);
            const det = sanitizeText(detail || '', 60);

            this.saveEvent({
                type: 'product_media_view',
                date: getLocalDateKey(),
                productId: String(productId || ''),
                productTitle: title,
                mediaType: mType,
                detail: det,
                page: path,
                timestamp: new Date().toISOString()
            });

            this.sendGA4Event('product_media_view', {
                item_id: String(productId || ''),
                item_name: title,
                media_type: mType,
                media_detail: det,
                page_path: path
            });

            this.sendClarityEvent('product_media_view', {
                last_media_type: mType
            });
        },

        // 6. Buscas na Busca Inteligente
        trackSearch: function (searchTerm, resultsCount, trigger) {
            const cleanTerm = sanitizeText(searchTerm || '', 100);
            if (!cleanTerm) return;

            const dedupeKey = `${cleanTerm.toLowerCase()}|${trigger || ''}|${resultsCount ?? ''}`;
            if (dedupeKey === this._lastSearchKey) return;
            this._lastSearchKey = dedupeKey;

            const dayKey = getLocalDateKey();
            const path = this.getPagePath();
            const hasCount = typeof resultsCount === 'number' && !isNaN(resultsCount);

            this.saveEvent({
                type: 'search',
                date: dayKey,
                searchTerm: cleanTerm,
                resultsCount: hasCount ? resultsCount : null,
                trigger: sanitizeText(trigger || 'search', 40),
                page: path,
                timestamp: new Date().toISOString()
            });

            this.incrementDailyMetric(dayKey, 'searches', 1);
            this.incrementSummary('searches', cleanTerm.toLowerCase());

            const gaEventName = (hasCount && resultsCount === 0) ? 'search_zero_results' : 'search';
            this.sendGA4Event(gaEventName, {
                search_term: cleanTerm,
                results_count: hasCount ? resultsCount : -1,
                search_trigger: sanitizeText(trigger || 'search', 40),
                page_path: path
            }, trigger === 'submit_redirect' || trigger === 'view_all_click');

            this.sendClarityEvent(gaEventName === 'search_zero_results' ? 'catalog_search_empty' : 'catalog_search', {
                last_search_term: cleanTerm
            });
        },

        // 7. Controles de Catálogo & UI (ordenação, itens/página, paginação, tema, drawer)
        trackCatalogControl: function (controlType, controlValue, extraLabel) {
            const dayKey = getLocalDateKey();
            const path = this.getPagePath();
            const cType = sanitizeText(controlType || 'ui', 40);
            const cVal = sanitizeText(controlValue || '', 80);

            this.saveEvent({
                type: 'catalog_control',
                date: dayKey,
                controlType: cType,
                controlValue: cVal,
                extraLabel: sanitizeText(extraLabel || '', 80),
                page: path,
                timestamp: new Date().toISOString()
            });

            this.incrementDailyMetric(dayKey, 'controls', 1);
            this.incrementSummary('controls', `${cType}: ${cVal}`);

            this.sendGA4Event('catalog_interaction', {
                control_type: cType,
                control_value: cVal,
                control_label: sanitizeText(extraLabel || cVal, 80),
                page_path: path
            });

            this.sendClarityEvent('catalog_interaction', {
                last_control_used: `${cType}:${cVal}`
            });
        },

        // Classifica exatamente onde está o WhatsApp clicado
        classifyWhatsAppLocation: function (link) {
            if (!link || typeof link.closest !== 'function') return 'outro';
            if (link.id === 'modal-whatsapp-link') return 'modal_whatsapp';
            if (link.id === 'modal-frete-link') return 'modal_frete_whatsapp';
            if (link.closest('.rj-search-footer-whatsapp-link') || link.classList.contains('rj-search-footer-whatsapp-link')) return 'busca_whatsapp';
            if (link.classList.contains('btn-cro-whatsapp')) return 'busca_vazia_whatsapp';
            if (link.closest('#rj-whatsapp-bubble')) return 'cro_bubble_whatsapp';
            if (link.closest('#rj-mobile-sticky-bar')) return 'mobile_sticky_whatsapp';
            if (link.classList && link.classList.contains('btn-whatsapp-floating')) return 'floating_whatsapp_fab';
            if (link.closest('.product-card')) return 'card_produto_whatsapp';
            if (link.closest('.rj-header') || link.closest('.rj-topbar')) return 'header_whatsapp';
            if (link.closest('.sidebar-filter-block')) return 'sidebar_consultor_whatsapp';
            if (link.closest('.cdm-foot')) return 'footer_cta_whatsapp';
            return 'outro_whatsapp';
        },

        // Classifica exatamente qual área de navegação do site foi clicada
        classifyLinkLocation: function (link) {
            if (!link || typeof link.closest !== 'function') return 'outro_link';
            if (link.classList && link.classList.contains('rj-brand-logo') && link.closest('.rj-header')) return 'header_logo';
            if (link.closest('.rj-nav-list') || link.closest('.rj-navbar')) return 'header_nav';
            if (link.classList && link.classList.contains('rj-drawer-brand')) return 'mobile_drawer_brand';
            if (link.closest('.rj-drawer-nav-list') || link.closest('#rj-mobile-drawer')) return 'mobile_drawer_nav';
            if (link.closest('#breadcrumb')) return 'breadcrumb';
            if (link.closest('.rj-sidebar-departments')) return 'sidebar_departamento';
            if (link.closest('.rj-home-catalog-cta')) return 'home_banner_catalogo';
            if (link.classList && link.classList.contains('rj-sticky-btn-catalog')) return 'mobile_sticky_catalogo';
            if (link.closest('.cdm-foot-col')) {
                const navSection = link.closest('.cdm-foot-col');
                const aria = (navSection && navSection.getAttribute && navSection.getAttribute('aria-label')) || '';
                if (/atendimento/i.test(aria)) return 'rodape_atendimento';
                return 'rodape_departamentos';
            }
            if (link.closest('.cdm-foot-bottom')) return 'rodape_credito';
            if (link.closest('.cdm-foot')) return 'rodape_link';
            return 'outro_link';
        },

        isWhatsAppLink: function (link) {
            if (!link) return false;
            const href = (link.getAttribute && link.getAttribute('href')) || link.href || '';
            if (/wa\.me|api\.whatsapp\.com/i.test(href)) return true;
            return Boolean(
                link.classList && (
                    link.classList.contains('btn-whatsapp-cta') ||
                    link.classList.contains('btn-whatsapp-floating') ||
                    link.classList.contains('btn-cro-whatsapp') ||
                    link.classList.contains('rj-search-footer-whatsapp-link') ||
                    link.classList.contains('btn-modal-whatsapp') ||
                    link.classList.contains('btn-modal-frete')
                )
            );
        },

        // Captura unificada de cliques em links <a> e CTAs WhatsApp
        attachEventListeners: function () {
            if (this._listenersAttached || !document || typeof document.addEventListener !== 'function') return;
            this._listenersAttached = true;

            document.addEventListener('click', (e) => {
                const target = e.target;
                if (!target || typeof target.closest !== 'function') return;

                const anchorOrWa = target.closest('a, .btn-whatsapp-cta, .btn-whatsapp-floating');
                if (!anchorOrWa) return;

                // 1. Cliques em qualquer ponto de conversão WhatsApp
                if (this.isWhatsAppLink(anchorOrWa)) {
                    const location = this.classifyWhatsAppLocation(anchorOrWa);
                    const href = (anchorOrWa.getAttribute && anchorOrWa.getAttribute('href')) || anchorOrWa.href || '';
                    const prodName = (anchorOrWa.getAttribute && (
                        anchorOrWa.getAttribute('data-product-name') ||
                        anchorOrWa.getAttribute('title')
                    )) || anchorOrWa.textContent || 'Móvel do Catálogo';

                    this.trackWhatsAppClick(prodName, location, href);
                    return;
                }

                // 2. Cliques em links <a> de navegação (ignora links internos de card que abrem o Modal)
                if (anchorOrWa.tagName && anchorOrWa.tagName.toUpperCase() === 'A') {
                    if (anchorOrWa.closest('.product-card')) {
                        return; // product-modal.js registra trackProductModalOpen com precisão
                    }

                    const rawHref = (anchorOrWa.getAttribute && anchorOrWa.getAttribute('href')) || anchorOrWa.href || '';
                    if (!rawHref || rawHref === '#' || rawHref.startsWith('javascript:')) return;

                    const linkLocation = this.classifyLinkLocation(anchorOrWa);
                    const linkLabel = (anchorOrWa.getAttribute && (
                        anchorOrWa.getAttribute('title') ||
                        anchorOrWa.getAttribute('aria-label')
                    )) || anchorOrWa.textContent || rawHref;

                    let isExternal = false;
                    if (/^https?:\/\//i.test(rawHref)) {
                        const currentOrigin = (window.location && window.location.origin) || '';
                        isExternal = currentOrigin ? !rawHref.startsWith(currentOrigin) : true;
                    }

                    this.trackNavigationClick(rawHref, linkLabel, linkLocation, isExternal);
                }
            }, true);
        },

        // Persistência local (auditoria diária autônoma e painel ?analytics=1)
        readSummary: function () {
            const empty = {
                pageviews: {},
                whatsapp_clicks: {},
                nav_links: {},
                products_opened: {},
                searches: {},
                controls: {},
                daily: {},
                total_views: 0,
                total_clicks: 0,
                total_nav_clicks: 0,
                total_modal_opens: 0,
                total_searches: 0
            };
            try {
                if (!window.localStorage) return empty;
                const parsed = JSON.parse(window.localStorage.getItem(SUMMARY_KEY) || '{}');
                return Object.assign(empty, parsed || {});
            } catch (err) {
                return empty;
            }
        },

        writeSummary: function (summary) {
            try {
                if (!window.localStorage) return;
                window.localStorage.setItem(SUMMARY_KEY, JSON.stringify(summary));
            } catch (err) {}
        },

        saveEvent: function (event) {
            try {
                if (!window.localStorage) return;
                let events = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
                if (!Array.isArray(events)) events = [];
                events.push(event);
                if (events.length > MAX_EVENTS) events = events.slice(-MAX_EVENTS);
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            } catch (err) {}
        },

        incrementDailyMetric: function (dayKey, field, delta) {
            try {
                const summary = this.readSummary();
                if (!summary.daily || typeof summary.daily !== 'object') summary.daily = {};
                if (!summary.daily[dayKey]) {
                    summary.daily[dayKey] = {
                        views: 0,
                        sessions: 0,
                        nav_clicks: 0,
                        whatsapp_clicks: 0,
                        modal_opens: 0,
                        searches: 0,
                        controls: 0
                    };
                }
                summary.daily[dayKey][field] = (summary.daily[dayKey][field] || 0) + (delta || 1);

                // Mantém histórico recente dos últimos MAX_DAILY_BUCKETS dias
                const keys = Object.keys(summary.daily).sort();
                if (keys.length > MAX_DAILY_BUCKETS) {
                    keys.slice(0, keys.length - MAX_DAILY_BUCKETS).forEach(oldKey => {
                        delete summary.daily[oldKey];
                    });
                }

                this.writeSummary(summary);
            } catch (err) {}
        },

        incrementSummary: function (bucket, key) {
            try {
                const summary = this.readSummary();
                const safeKey = sanitizeText(key || 'outro', 120);
                if (!summary[bucket] || typeof summary[bucket] !== 'object') summary[bucket] = {};
                summary[bucket][safeKey] = (summary[bucket][safeKey] || 0) + 1;

                if (bucket === 'pageviews') summary.total_views = (summary.total_views || 0) + 1;
                if (bucket === 'whatsapp_clicks') summary.total_clicks = (summary.total_clicks || 0) + 1;
                if (bucket === 'nav_links') summary.total_nav_clicks = (summary.total_nav_clicks || 0) + 1;
                if (bucket === 'products_opened') summary.total_modal_opens = (summary.total_modal_opens || 0) + 1;
                if (bucket === 'searches') summary.total_searches = (summary.total_searches || 0) + 1;

                this.writeSummary(summary);
            } catch (err) {}
        },

        relatorio: function () {
            try {
                const summary = this.readSummary();
                if (window.console) {
                    window.console.log('====================================================');
                    window.console.log('📊 TELEMETRIA RJ MÓVEIS (GITHUB PAGES: GA4 + CLARITY)');
                    window.console.log('====================================================');
                    window.console.log(`Visualizações: ${summary.total_views || 0} | Links: ${summary.total_nav_clicks || 0} | Modal Produtos: ${summary.total_modal_opens || 0} | Buscas: ${summary.total_searches || 0} | WhatsApp: ${summary.total_clicks || 0}`);
                    if (window.console.table) {
                        window.console.log('\n--- Resumo Diário (Navegador Atual) ---');
                        window.console.table(summary.daily);
                        window.console.log('\n--- Páginas Mais Acessadas ---');
                        window.console.table(summary.pageviews);
                        window.console.log('\n--- Links Mais Clicados ---');
                        window.console.table(summary.nav_links);
                        window.console.log('\n--- Produtos Mais Abertos no Modal ---');
                        window.console.table(summary.products_opened);
                        window.console.log('\n--- Cliques no WhatsApp ---');
                        window.console.table(summary.whatsapp_clicks);
                    }
                }
                return summary;
            } catch (err) {
                if (window.console) window.console.error('Falha ao ler dados de analytics:', err);
                return null;
            }
        },

        renderDiagnosticPanel: function () {
            if (!document || !document.body || typeof document.createElement !== 'function') return;
            if (document.getElementById('rj-analytics-diagnostic')) return;

            const cfg = window.RJ_ANALYTICS_CONFIG || {};
            const summary = this.readSummary();
            const dayKey = getLocalDateKey();
            const today = (summary.daily && summary.daily[dayKey]) || {
                views: 0, sessions: 0, nav_clicks: 0, whatsapp_clicks: 0, modal_opens: 0, searches: 0
            };

            const gaStatus = isValidGa4Id(cfg.googleAnalyticsId)
                ? `<span style="color:#10b981;font-weight:700;">Ativo (${escapeHtml(cfg.googleAnalyticsId)})</span>`
                : `<span style="color:#f59e0b;font-weight:700;">Aguardando ID G-XXXXXXXXXX (Prop. ref: ${escapeHtml(cfg.googleAnalyticsPropertyId || '-')})</span>`;

            const clarityStatus = isValidClarityId(cfg.clarityProjectId)
                ? `<span style="color:#10b981;font-weight:700;">Ativo (${escapeHtml(cfg.clarityProjectId)})</span>`
                : `<span style="color:#f59e0b;font-weight:700;">Não configurado</span>`;

            let recentEvents = [];
            try {
                recentEvents = JSON.parse((window.localStorage && window.localStorage.getItem(STORAGE_KEY)) || '[]').slice(-6).reverse();
            } catch (err) {}

            const topEntries = (obj) => Object.entries(obj || {})
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([k, v]) => `<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;border-bottom:1px solid rgba(148,163,184,.2);font-size:12px;"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(sanitizeText(k, 48))}</span><strong>${escapeHtml(v)}</strong></div>`)
                .join('') || '<div style="font-size:12px;color:#94a3b8;">Sem registros ainda</div>';

            const panel = document.createElement('aside');
            panel.id = 'rj-analytics-diagnostic';
            panel.setAttribute('aria-label', 'Diagnóstico de Telemetria RJ Móveis');
            panel.style.cssText = 'position:fixed;bottom:16px;left:16px;z-index:999999;width:min(380px,calc(100vw - 32px));max-height:82vh;overflow-y:auto;background:#0f172a;color:#f8fafc;border:1px solid #334155;border-radius:14px;padding:16px;box-shadow:0 20px 45px rgba(0,0,0,.45);font-family:inherit;font-size:13px;line-height:1.45;';

            panel.innerHTML = `
                <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;border-bottom:1px solid #334155;padding-bottom:8px;">
                    <strong style="font-size:14px;">📊 Diagnóstico Telemetria (?analytics=1)</strong>
                    <button type="button" id="rj-diag-close" style="background:#1e293b;color:#e2e8f0;border:1px solid #475569;border-radius:6px;padding:3px 9px;cursor:pointer;font-size:12px;">Fechar</button>
                </div>
                <div style="margin-bottom:10px;font-size:12px;">
                    <div><strong>Google Analytics 4:</strong> ${gaStatus}</div>
                    <div><strong>Microsoft Clarity:</strong> ${clarityStatus}</div>
                </div>
                <div style="background:#1e293b;border-radius:10px;padding:10px;margin-bottom:10px;">
                    <div style="font-weight:700;margin-bottom:6px;font-size:12px;color:#fbbf24;">Hoje (${escapeHtml(dayKey)}) — Este Navegador</div>
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;text-align:center;font-size:11px;">
                        <div style="background:#0f172a;padding:6px;border-radius:6px;"><div style="font-size:15px;font-weight:800;">${escapeHtml(today.views || 0)}</div>Visitas</div>
                        <div style="background:#0f172a;padding:6px;border-radius:6px;"><div style="font-size:15px;font-weight:800;">${escapeHtml(today.nav_clicks || 0)}</div>Links</div>
                        <div style="background:#0f172a;padding:6px;border-radius:6px;"><div style="font-size:15px;font-weight:800;color:#22c55e;">${escapeHtml(today.whatsapp_clicks || 0)}</div>WhatsApp</div>
                        <div style="background:#0f172a;padding:6px;border-radius:6px;"><div style="font-size:15px;font-weight:800;">${escapeHtml(today.modal_opens || 0)}</div>Produtos</div>
                        <div style="background:#0f172a;padding:6px;border-radius:6px;"><div style="font-size:15px;font-weight:800;">${escapeHtml(today.searches || 0)}</div>Buscas</div>
                        <div style="background:#0f172a;padding:6px;border-radius:6px;"><div style="font-size:15px;font-weight:800;">${escapeHtml(today.controls || 0)}</div>Filtros</div>
                    </div>
                </div>
                <div style="margin-bottom:8px;">
                    <div style="font-weight:700;font-size:12px;margin-bottom:4px;">Top Páginas</div>
                    ${topEntries(summary.pageviews)}
                </div>
                <div style="margin-bottom:8px;">
                    <div style="font-weight:700;font-size:12px;margin-bottom:4px;">Últimos Eventos Disparados</div>
                    ${recentEvents.map(ev => `<div style="font-size:11px;color:#cbd5e1;padding:2px 0;">• <strong>${escapeHtml(ev.type)}</strong>: ${escapeHtml(sanitizeText(ev.linkLabel || ev.productTitle || ev.productName || ev.searchTerm || ev.url || ev.controlValue || '', 42))}</div>`).join('') || '<div style="font-size:12px;color:#94a3b8;">Nenhum evento ainda</div>'}
                </div>
                <div style="display:flex;gap:8px;margin-top:10px;">
                    <button type="button" id="rj-diag-refresh" style="flex:1;background:#2563eb;color:#fff;border:none;border-radius:7px;padding:7px;cursor:pointer;font-size:12px;font-weight:600;">Atualizar</button>
                    <button type="button" id="rj-diag-clear" style="flex:1;background:#334155;color:#f8fafc;border:none;border-radius:7px;padding:7px;cursor:pointer;font-size:12px;">Limpar Local</button>
                </div>
            `;

            document.body.appendChild(panel);

            const closeBtn = document.getElementById('rj-diag-close');
            const refreshBtn = document.getElementById('rj-diag-refresh');
            const clearBtn = document.getElementById('rj-diag-clear');

            if (closeBtn) closeBtn.addEventListener('click', () => panel.remove());
            if (refreshBtn) refreshBtn.addEventListener('click', () => {
                panel.remove();
                this.renderDiagnosticPanel();
            });
            if (clearBtn) clearBtn.addEventListener('click', () => {
                try {
                    if (window.localStorage) {
                        window.localStorage.removeItem(STORAGE_KEY);
                        window.localStorage.removeItem(SUMMARY_KEY);
                    }
                } catch (err) {}
                panel.remove();
                this.renderDiagnosticPanel();
            });
        },

        checkUrlForReport: function () {
            const search = (window.location && window.location.search) || '';
            if (search.includes('analytics=1') || search.includes('relatorio=1')) {
                setTimeout(() => {
                    this.relatorio();
                    this.renderDiagnosticPanel();
                }, 400);
            }
        }
    };

    window.RJ_Analytics = RJ_Analytics;

    if (document && document.readyState === 'loading' && typeof document.addEventListener === 'function') {
        document.addEventListener('DOMContentLoaded', function () {
            RJ_Analytics.init();
        });
    } else {
        RJ_Analytics.init();
    }
})(window, document);
