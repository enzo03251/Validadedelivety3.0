// ==================== VALIDADELIVERY - MVV.JS OTIMIZADO ====================
// Versão: 2.0 - Completo, Otimizado e Modular

// ==================== Configurações e Constantes ====================
const CONFIG = {
    animationDelay: 100,
    rippleTime: 600,
    scrollThreshold: 300,
    backToTopThreshold: 300,
    loadingDelay: 500,
    observerThreshold: 0.1,
    observerMargin: '0px 0px -50px 0px',
    debounceTime: 250,
    throttleTime: 100
};

// ==================== Estado da Aplicação ====================
const AppState = {
    isLoading: false,
    lastScroll: 0,
    initialized: false,
    backToTopVisible: false,
    userInteracted: false
};

// ==================== Utilitários ====================
const Utils = {
    // Debounce para otimizar eventos
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle para scroll events
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Sanitizar strings para prevenir XSS
    sanitize(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    // Log com estilo
    log(message, type = 'info') {
        const styles = {
            info: 'background: #64b6d0; color: white;',
            success: 'background: #6ea56f; color: white;',
            warning: 'background: #f28c00; color: white;',
            error: 'background: #f95d8b; color: white;'
        };
        console.log(`%c ${message}`, `${styles[type]} padding: 4px 8px; border-radius: 4px; font-weight: bold;`);
    },

    // Verifica se elemento está visível
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Scroll suave para elemento
    smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }
};

// ==================== Gerenciador de Loading ====================
const LoadingManager = {
    show() {
        if (AppState.isLoading) return;
        AppState.isLoading = true;
        document.body.classList.add('loading');
    },

    hide() {
        setTimeout(() => {
            AppState.isLoading = false;
            document.body.classList.remove('loading');
        }, CONFIG.loadingDelay);
    }
};

// ==================== Gerenciador de Animações ====================
const AnimationManager = {
    // Anima entrada dos cards
    animateCards() {
        const cards = document.querySelectorAll('.card');
        
        if (!cards.length) return;

        const observerOptions = {
            threshold: CONFIG.observerThreshold,
            rootMargin: CONFIG.observerMargin
        };

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.classList.add('animated');
                    }, index * CONFIG.animationDelay);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            cardObserver.observe(card);
        });
    },

    // Anima título hero
    animateHeroTitle() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(-50px) scale(0.9)';
        
        requestAnimationFrame(() => {
            setTimeout(() => {
                heroTitle.style.transition = 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0) scale(1)';
            }, 200);
        });
    },

    // Cria efeito ripple
    createRipple(element, event) {
        // Remove ripples antigos
        const oldRipples = element.querySelectorAll('.ripple-effect');
        oldRipples.forEach(r => r.remove());

        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        Object.assign(ripple.style, {
            width: `${size}px`,
            height: `${size}px`,
            left: `${x}px`,
            top: `${y}px`,
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.5)',
            pointerEvents: 'none',
            animation: `ripple ${CONFIG.rippleTime}ms ease-out`,
            zIndex: '1'
        });
        
        const originalPosition = window.getComputedStyle(element).position;
        if (originalPosition === 'static') {
            element.style.position = 'relative';
        }
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), CONFIG.rippleTime);
    },

    // Anima elemento com bounce
    bounceElement(element) {
        element.style.animation = 'none';
        requestAnimationFrame(() => {
            element.style.animation = 'bounce 0.5s ease';
        });
    }
};

// ==================== Gerenciador de Cards ====================
const CardManager = {
    cardData: {
        'sacola': {
            title: 'Pedidos e Sacolas',
            color: 'rosa',
            action: () => Utils.log('Navegando para Pedidos', 'info')
        },
        'termos': {
            title: 'Termos e Condições',
            color: 'verde',
            action: () => Utils.log('Abrindo Termos e Condições', 'info')
        },
        'logo': {
            title: 'Sobre ValidaDelivery',
            color: 'laranja',
            action: () => Utils.log('Navegando para Sobre', 'info')
        },
        'missao': {
            title: 'Nossa Missão',
            color: 'rosa',
            action: () => CardManager.showModal('Missão', 'Combater o desperdício de alimentos através da tecnologia e sustentabilidade.')
        },
        'visao': {
            title: 'Nossa Visão',
            color: 'verde',
            action: () => CardManager.showModal('Visão', 'Ser referência em delivery sustentável e economia circular no Brasil.')
        },
        'valores': {
            title: 'Nossos Valores',
            color: 'amarelo',
            action: () => CardManager.showModal('Valores', 'Sustentabilidade, Inovação, Responsabilidade Social e Transparência.')
        }
    },

    // Configura eventos dos cards
    setupCards() {
        const cards = document.querySelectorAll('.card');
        
        if (!cards.length) {
            Utils.log('Nenhum card encontrado', 'warning');
            return;
        }
        
        cards.forEach(card => {
            // Click event
            card.addEventListener('click', function(e) {
                AppState.userInteracted = true;
                CardManager.handleCardClick(this, e);
            });

            // Keyboard support
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    AppState.userInteracted = true;
                    CardManager.handleCardClick(this, e);
                }
            });

            // Hover events para desktop
            if (window.matchMedia('(hover: hover)').matches) {
                card.addEventListener('mouseenter', function() {
                    this.style.transition = 'all 0.3s ease';
                });

                card.addEventListener('mouseleave', function() {
                    this.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                });
            }
        });

        Utils.log(`${cards.length} cards configurados`, 'success');
    },

    // Manipula clique no card
    handleCardClick(card, event) {
        // Previne múltiplos cliques
        if (card.classList.contains('clicking')) return;
        
        card.classList.add('clicking');

        // Animação de escala
        card.style.transform = 'scale(0.95)';
        
        // Cria ripple effect
        AnimationManager.createRipple(card, event);
        
        // Restaura o tamanho
        setTimeout(() => {
            card.style.transform = '';
            card.classList.remove('clicking');
        }, 300);

        // Obtém informação do card
        const cardType = card.dataset.cardType;
        const cardName = card.dataset.cardName || 'Card';
        
        Utils.log(`Card clicado: ${cardName} (${cardType})`, 'info');

        // Executa ação do card
        CardManager.executeCardAction(cardType, cardName);
    },

    // Executa ação específica do card
    executeCardAction(type, name) {
        const cardInfo = this.cardData[type];
        
        if (cardInfo && cardInfo.action) {
            cardInfo.action();
        } else {
            Utils.log(`Ação não definida para: ${name}`, 'warning');
        }
    },

    // Mostra modal simples (pode ser expandido)
    showModal(title, content) {
        // Implementação simples - pode ser melhorada com modal real
        Utils.log(`Modal: ${title} - ${content}`, 'info');
        
        // Exibe alerta temporário (substituir por modal real em produção)
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #6ea56f 0%, #5a8f5b 100%);
            color: white;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.5s ease;
        `;
        
        notification.innerHTML = `
            <h3 style="margin: 0 0 10px 0; font-size: 1.3rem;">${Utils.sanitize(title)}</h3>
            <p style="margin: 0; line-height: 1.6;">${Utils.sanitize(content)}</p>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
};

// ==================== Gerenciador de Navegação ====================
const NavigationManager = {
    // Configura links do menu
    setupNavigation() {
        const menuLinks = document.querySelectorAll('.nav-link');
        
        if (!menuLinks.length) return;
        
        menuLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                NavigationManager.handleNavClick(this, e);
            });
        });

        Utils.log('Navegação configurada', 'success');
    },

    // Manipula clique na navegação
    handleNavClick(link, event) {
        const href = link.getAttribute('href');
        
        // Se for link interno (#), previne comportamento padrão
        if (href && href.startsWith('#')) {
            event.preventDefault();
        }

        const menuLinks = document.querySelectorAll('.nav-link');
        
        // Remove active de todos
        menuLinks.forEach(l => l.classList.remove('active'));
        
        // Adiciona active no clicado
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
        
        // Animação de click
        link.style.transform = 'scale(0.95)';
        setTimeout(() => {
            link.style.transform = '';
        }, 150);

        Utils.log(`Navegação: ${link.textContent.trim()}`, 'info');
    },

    // Configura scroll suave
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(targetId);
                
                if (target) {
                    Utils.smoothScrollTo(target, 100);
                }
            });
        });
    }
};

// ==================== Gerenciador de Header ====================
const HeaderManager = {
    // Configura comportamento do header no scroll
    setupScrollBehavior() {
        const header = document.querySelector('header');
        if (!header) return;

        const handleScroll = Utils.throttle(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > CONFIG.scrollThreshold) {
                header.classList.add('scrolled');
                header.style.boxShadow = '0 8px 25px rgba(242, 140, 0, 0.5)';
                header.style.padding = '1rem 5%';
            } else {
                header.classList.remove('scrolled');
                header.style.boxShadow = '';
                header.style.padding = '';
            }
            
            AppState.lastScroll = currentScroll;
        }, CONFIG.throttleTime);

        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    // Configura logo
    setupLogo() {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        logo.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Se for link interno ou vazio
            if (!href || href === '#' || href.startsWith('#')) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                Utils.log('Voltando ao topo via logo', 'info');
            }
        });
    },

    // Configura botão de perfil
    setupProfileButton() {
        const perfil = document.querySelector('.perfil');
        if (!perfil) return;

        perfil.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Se for link interno
            if (href && href.startsWith('#')) {
                e.preventDefault();
            }
            
            // Animação
            this.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                this.style.transform = '';
                Utils.log('Perfil acessado', 'info');
            }, 200);
        });
    }
};

// ==================== Gerenciador do Botão Voltar ao Topo ====================
const BackToTopManager = {
    button: null,

    // Cria o botão
    createButton() {
        if (document.querySelector('.back-to-top')) return;

        const button = document.createElement('button');
        button.className = 'back-to-top';
        button.setAttribute('aria-label', 'Voltar ao início da página');
        button.setAttribute('title', 'Voltar ao início');
        button.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
        
        document.body.appendChild(button);
        this.button = button;

        Utils.log('Botão "Voltar ao Topo" criado', 'success');
    },

    // Configura eventos do botão
    setupEvents() {
        if (!this.button) return;

        // Click event
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            Utils.log('Voltando ao topo', 'info');
            
            // Feedback visual
            this.button.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.button.style.transform = '';
            }, 200);
        });

        // Keyboard support
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.button.click();
            }
        });
    },

    // Controla visibilidade baseada no scroll
    handleScrollVisibility() {
        const handleScroll = Utils.throttle(() => {
            const currentScroll = window.pageYOffset;
            const shouldShow = currentScroll > CONFIG.backToTopThreshold;

            if (shouldShow && !AppState.backToTopVisible) {
                this.show();
            } else if (!shouldShow && AppState.backToTopVisible) {
                this.hide();
            }
        }, CONFIG.throttleTime);

        window.addEventListener('scroll', handleScroll, { passive: true });
    },

    // Mostra o botão
    show() {
        if (!this.button) return;
        
        AppState.backToTopVisible = true;
        this.button.classList.add('visible');
        this.button.style.opacity = '1';
        this.button.style.visibility = 'visible';
        this.button.style.transform = 'translateY(0)';
    },

    // Esconde o botão
    hide() {
        if (!this.button) return;
        
        AppState.backToTopVisible = false;
        this.button.classList.remove('visible');
        this.button.style.opacity = '0';
        this.button.style.visibility = 'hidden';
        this.button.style.transform = 'translateY(-10px)';
    },

    // Inicializa o gerenciador
    init() {
        this.createButton();
        this.setupEvents();
        this.handleScrollVisibility();
        Utils.log('BackToTopManager inicializado', 'success');
    }
};

// ==================== Gerenciador de Performance ====================
const PerformanceManager = {
    // Lazy loading de imagens
    setupLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if (!images.length) return;

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
            Utils.log('Lazy loading configurado', 'success');
        }
    },

    // Preload de recursos críticos
    preloadCriticalResources() {
        const criticalImages = [
            'img/Captura de tela 2025-10-06 162710.png',
            'img/Captura de tela 2025-10-30 144824.png'
        ];

        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    },

    // Monitora performance
    monitorPerformance() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perfData = performance.timing;
                    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                    Utils.log(`Página carregada em ${pageLoadTime}ms`, 'info');
                }, 0);
            });
        }
    }
};

// ==================== Gerenciador de Acessibilidade ====================
const AccessibilityManager = {
    // Adiciona skip to content
    addSkipToContent() {
        if (document.querySelector('.skip-to-content')) return;

        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.className = 'skip-to-content';
        skipLink.textContent = 'Pular para o conteúdo principal';
        document.body.insertBefore(skipLink, document.body.firstChild);

        const main = document.querySelector('main');
        if (main && !main.id) {
            main.id = 'main';
        }

        Utils.log('Skip to content adicionado', 'success');
    },

    // Gerencia foco do teclado
    setupKeyboardNavigation() {
        // Detecta navegação por teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Atalhos de teclado
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Home: Voltar ao topo
            if ((e.ctrlKey || e.metaKey) && e.key === 'Home') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    },

    // Anuncia mudanças para screen readers
    announceToScreenReader(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => announcement.remove(), 1000);
    },

    // Verifica contraste de cores
    checkColorContrast() {
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            document.body.classList.add('high-contrast');
            Utils.log('Modo de alto contraste ativado', 'info');
        }
    }
};

// ==================== Gerenciador de Erros ====================
const ErrorManager = {
    // Captura erros globais
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            Utils.log(`Erro capturado: ${event.message}`, 'error');
            LoadingManager.hide();
        });

        window.addEventListener('unhandledrejection', (event) => {
            Utils.log(`Promise rejeitada: ${event.reason}`, 'error');
            LoadingManager.hide();
        });
    },

    // Valida elementos críticos
    validateCriticalElements() {
        const criticalSelectors = ['main', '.hero', '.cards-grid'];
        const missing = [];

        criticalSelectors.forEach(selector => {
            if (!document.querySelector(selector)) {
                missing.push(selector);
            }
        });

        if (missing.length > 0) {
            Utils.log(`Elementos críticos faltando: ${missing.join(', ')}`, 'warning');
        }
    }
};

// ==================== CSS Dinâmico ====================
const DynamicStyles = {
    inject() {
        if (document.getElementById('dynamic-styles')) return;

        const style = document.createElement('style');
        style.id = 'dynamic-styles';
        style.textContent = `
            @keyframes ripple {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                100% {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }

            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            .sr-only {
                position: absolute !important;
                width: 1px !important;
                height: 1px !important;
                padding: 0 !important;
                margin: -1px !important;
                overflow: hidden !important;
                clip: rect(0, 0, 0, 0) !important;
                white-space: nowrap !important;
                border-width: 0 !important;
            }

            body.keyboard-nav *:focus-visible {
                outline: 3px solid var(--primary, #f28c00) !important;
                outline-offset: 4px !important;
            }

            .skip-to-content {
                position: absolute;
                top: -40px;
                left: 0;
                background: var(--primary, #f28c00);
                color: var(--white, #ffffff);
                padding: 8px 16px;
                text-decoration: none;
                z-index: 9999;
                border-radius: 0 0 8px 0;
                font-weight: 600;
                transition: top 0.3s ease;
            }

            .skip-to-content:focus {
                top: 0;
            }

            .card.clicking {
                pointer-events: none;
            }

            img.loaded {
                animation: fadeIn 0.5s ease-in;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            /* High Contrast Mode */
            body.high-contrast .card {
                border: 3px solid currentColor;
            }
        `;
        document.head.appendChild(style);
    }
};

// ==================== Inicialização Principal ====================
const App = {
    // Inicializa a aplicação
    async init() {
        if (AppState.initialized) {
            Utils.log('App já foi inicializado', 'warning');
            return;
        }

        try {
            Utils.log('🍐 Valida Delivery - Iniciando sistema...', 'info');
            LoadingManager.show();

            // Valida elementos críticos
            ErrorManager.validateCriticalElements();

            // Injeta estilos dinâmicos
            DynamicStyles.inject();

            // Preload recursos críticos
            PerformanceManager.preloadCriticalResources();

            // Configura gerenciadores principais
            AnimationManager.animateHeroTitle();
            AnimationManager.animateCards();
            CardManager.setupCards();
            NavigationManager.setupNavigation();
            NavigationManager.setupSmoothScroll();
            HeaderManager.setupScrollBehavior();
            HeaderManager.setupLogo();
            HeaderManager.setupProfileButton();
            
            // Inicializa Botão Voltar ao Topo
            BackToTopManager.init();
            
            // Performance e acessibilidade
            PerformanceManager.setupLazyLoading();
            PerformanceManager.monitorPerformance();
            AccessibilityManager.addSkipToContent();
            AccessibilityManager.setupKeyboardNavigation();
            AccessibilityManager.checkColorContrast();
            ErrorManager.setupErrorHandling();

            // Marca como inicializado
            AppState.initialized = true;

            LoadingManager.hide();
            Utils.log('✅ Sistema carregado com sucesso!', 'success');

            // Log estilizado no console
            console.log(
                '%c🍐 Valida Delivery %c Sistema Completo! ',
                'background: linear-gradient(135deg, #f28c00, #ff9f24); color: white; padding: 10px 20px; border-radius: 5px 0 0 5px; font-size: 16px; font-weight: bold;',
                'background: #6ea56f; color: white; padding: 10px 20px; border-radius: 0 5px 5px 0; font-size: 16px;'
            );

            // Mensagem de boas-vindas no console
            console.log('%cBem-vindo ao ValidaDelivery! 🌱', 'color: #6ea56f; font-size: 14px; font-weight: bold;');
            console.log('%cSistema otimizado e pronto para uso.', 'color: #666; font-size: 12px;');

        } catch (error) {
            Utils.log(`❌ Erro na inicialização: ${error.message}`, 'error');
            console.error('Detalhes do erro:', error);
            LoadingManager.hide();
        }
    },

    // Reinicializa componentes
    refresh() {
        Utils.log('Reinicializando componentes...', 'info');
        
        CardManager.setupCards();
        NavigationManager.setupNavigation();
        BackToTopManager.init();
        
        Utils.log('Componentes reinicializados', 'success');
    },

    // Destroy - limpa recursos
    destroy() {
        Utils.log('Limpando recursos da aplicação...', 'info');
        
        // Remove event listeners globais
        window.removeEventListener('scroll', () => {});
        window.removeEventListener('resize', () => {});
        
        // Remove botão voltar ao topo
        const backToTop = document.querySelector('.back-to-top');
        if (backToTop) backToTop.remove();
        
        // Reseta estado
        AppState.initialized = false;
        AppState.backToTopVisible = false;
        
        Utils.log('Recursos limpos', 'success');
    }
};

// ==================== Gerenciador de Tema (Opcional) ====================
const ThemeManager = {
    currentTheme: 'light',

    // Detecta preferência de tema do sistema
    detectSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    },

    // Aplica tema
    applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        this.currentTheme = theme;
        
        // Salva preferência
        try {
            localStorage.setItem('validadelivery-theme', theme);
        } catch (e) {
            Utils.log('Não foi possível salvar preferência de tema', 'warning');
        }
        
        Utils.log(`Tema aplicado: ${theme}`, 'info');
    },

    // Carrega tema salvo
    loadSavedTheme() {
        try {
            const savedTheme = localStorage.getItem('validadelivery-theme');
            return savedTheme || this.detectSystemTheme();
        } catch (e) {
            return this.detectSystemTheme();
        }
    },

    // Alterna tema
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme(newTheme);
    },

    // Inicializa tema
    init() {
        const theme = this.loadSavedTheme();
        this.applyTheme(theme);

        // Monitora mudanças no tema do sistema
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    }
};

// ==================== Gerenciador de Analytics (Opcional) ====================
const AnalyticsManager = {
    events: [],

    // Rastreia evento
    trackEvent(category, action, label = null) {
        const event = {
            category,
            action,
            label,
            timestamp: new Date().toISOString()
        };

        this.events.push(event);
        
        // Integração com Google Analytics (se disponível)
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }

        Utils.log(`Evento rastreado: ${category} - ${action}`, 'info');
    },

    // Rastreia pageview
    trackPageView(page) {
        if (typeof gtag !== 'undefined') {
            gtag('config', 'GA_MEASUREMENT_ID', {
                'page_path': page
            });
        }
        
        Utils.log(`Pageview: ${page}`, 'info');
    },

    // Obtém estatísticas
    getStats() {
        return {
            totalEvents: this.events.length,
            events: this.events
        };
    }
};

// ==================== Utilitários de Desenvolvimento ====================
const DevTools = {
    // Modo debug
    enableDebugMode() {
        window.ValidaDeliveryDebug = {
            AppState,
            Utils,
            CardManager,
            BackToTopManager,
            AnimationManager,
            AnalyticsManager,
            getState: () => AppState,
            refresh: () => App.refresh(),
            version: '2.0.0'
        };
        
        console.log('%c🔧 Debug Mode Ativado', 'background: #f28c00; color: white; padding: 5px 10px; border-radius: 3px; font-weight: bold;');
        console.log('Acesse via: window.ValidaDeliveryDebug');
    },

    // Exibe informações do sistema
    showSystemInfo() {
        console.group('📊 ValidaDelivery - Informações do Sistema');
        console.log('Versão:', '2.0.0');
        console.log('Estado da Aplicação:', AppState);
        console.log('Navegador:', navigator.userAgent);
        console.log('Resolução:', `${window.innerWidth}x${window.innerHeight}`);
        console.log('Cards Configurados:', document.querySelectorAll('.card').length);
        console.log('Performance:', PerformanceManager);
        console.groupEnd();
    }
};

// ==================== Event Listeners Globais ====================

// Aguarda DOM estar pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        DynamicStyles.inject();
        App.init();
        
        // Ativa modo debug em desenvolvimento
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            DevTools.enableDebugMode();
        }
    });
} else {
    // DOM já está pronto
    DynamicStyles.inject();
    App.init();
    
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        DevTools.enableDebugMode();
    }
}

// Limpa recursos ao sair da página
window.addEventListener('beforeunload', () => {
    Utils.log('Limpando recursos...', 'info');
    
    // Salva estado se necessário
    try {
        if (AppState.userInteracted) {
            sessionStorage.setItem('validadelivery-visited', 'true');
        }
    } catch (e) {
        // Silenciosamente falha se sessionStorage não estiver disponível
    }
});

// Detecta mudanças de visibilidade da página
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        Utils.log('Página oculta', 'info');
    } else {
        Utils.log('Página visível', 'info');
        // Recarrega dados se necessário
    }
});

// Detecta mudanças de orientação (mobile)
window.addEventListener('orientationchange', () => {
    Utils.log('Orientação alterada', 'info');
    
    // Reajusta layout se necessário
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
    }, 100);
});

// Detecta mudanças de tamanho da janela
const handleResize = Utils.debounce(() => {
    Utils.log(`Janela redimensionada: ${window.innerWidth}x${window.innerHeight}`, 'info');
    
    // Reajusta animações se necessário
    if (AppState.initialized) {
        // Lógica de reajuste aqui
    }
}, CONFIG.debounceTime);

window.addEventListener('resize', handleResize);

// Detecta quando a conexão volta (útil para PWA)
window.addEventListener('online', () => {
    Utils.log('Conexão restaurada', 'success');
    AccessibilityManager.announceToScreenReader('Conexão com a internet restaurada', 'polite');
});

window.addEventListener('offline', () => {
    Utils.log('Conexão perdida', 'warning');
    AccessibilityManager.announceToScreenReader('Conexão com a internet perdida', 'assertive');
});

// ==================== Exports (para uso como módulo) ====================
// Descomente se for usar como módulo ES6
/*
export {
    App,
    Utils,
    AnimationManager,
    CardManager,
    BackToTopManager,
    NavigationManager,
    HeaderManager,
    PerformanceManager,
    AccessibilityManager,
    ThemeManager,
    AnalyticsManager,
    DevTools
};
*/

// ==================== Objeto Global (fallback) ====================
window.ValidaDelivery = {
    version: '2.0.0',
    init: () => App.init(),
    refresh: () => App.refresh(),
    destroy: () => App.destroy(),
    utils: Utils,
    state: AppState
};

// ==================== Logging Final ====================
console.log(
    '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'color: #6ea56f;'
);
console.log(
    '%c🍐 ValidaDelivery %cv2.0.0',
    'color: #f28c00; font-size: 20px; font-weight: bold;',
    'color: #666; font-size: 12px;'
);
console.log(
    '%cSistema de Missão, Visão e Valores',
    'color: #666; font-style: italic;'
);
console.log(
    '%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    'color: #6ea56f;'
);
console.log('%cDesenvolvido com 💚 para um futuro sustentável', 'color: #6ea56f; font-size: 11px;');

// ==================== FIM DO ARQUIVO ====================