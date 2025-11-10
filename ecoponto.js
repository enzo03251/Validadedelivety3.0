// ==================== CONFIGURAÇÕES E DADOS ====================

// Dados dos ecopontos
const ecopontos = [
    {
        id: 1,
        nome: "EcoPonto Shopping",
        endereco: "Av. João Naves de Ávila, 1331",
        horario: "Seg-Sáb: 9h - 21h",
        status: "aberto",
        coordenadas: { lat: -18.9188, lng: -48.2766 }
    },
    {
        id: 2,
        nome: "EcoPonto Centro",
        endereco: "Rua Padre Pio, 450",
        horario: "Seg-Sex: 8h - 18h",
        status: "destaque",
        coordenadas: { lat: -18.9186, lng: -48.2772 }
    },
    {
        id: 3,
        nome: "EcoPonto Morumbi",
        endereco: "Av. Rondon Pacheco, 2500",
        horario: "Seg-Dom: 7h - 20h",
        status: "aberto",
        coordenadas: { lat: -18.9000, lng: -48.2500 }
    }
];

// ==================== FUNÇÕES DE NOTIFICAÇÃO ====================

/**
 * Exibe uma notificação toast na tela
 * @param {string} mensagem - Texto da notificação
 * @param {number} duracao - Duração em milissegundos (padrão: 3000)
 */
function mostrarNotificacao(mensagem, duracao = 3000) {
    const notification = document.getElementById('notification');
    
    if (!notification) return;
    
    notification.textContent = mensagem;
    notification.classList.add('show');
    
    // Remove notificação anterior se existir
    if (notification.timeoutId) {
        clearTimeout(notification.timeoutId);
    }
    
    // Define novo timeout
    notification.timeoutId = setTimeout(() => {
        notification.classList.remove('show');
    }, duracao);
}

// ==================== GEOLOCALIZAÇÃO ====================

/**
 * Calcula a distância entre duas coordenadas usando a fórmula de Haversine
 * @param {number} lat1 - Latitude do ponto 1
 * @param {number} lon1 - Longitude do ponto 1
 * @param {number} lat2 - Latitude do ponto 2
 * @param {number} lon2 - Longitude do ponto 2
 * @returns {number} Distância em quilômetros
 */
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

/**
 * Encontra o ecoponto mais próximo da localização atual
 */
function encontrarEcopontoMaisProximo() {
    if (!navigator.geolocation) {
        mostrarNotificacao('❌ Geolocalização não suportada pelo navegador');
        return;
    }
    
    mostrarNotificacao('📍 Buscando sua localização...', 2000);
    
    navigator.geolocation.getCurrentPosition(
        // Sucesso
        (position) => {
            const { latitude, longitude } = position.coords;
            
            // Encontra o ecoponto mais próximo
            let ecopontoMaisProximo = null;
            let menorDistancia = Infinity;
            
            ecopontos.forEach(ecoponto => {
                const distancia = calcularDistancia(
                    latitude,
                    longitude,
                    ecoponto.coordenadas.lat,
                    ecoponto.coordenadas.lng
                );
                
                if (distancia < menorDistancia) {
                    menorDistancia = distancia;
                    ecopontoMaisProximo = ecoponto;
                }
            });
            
            if (ecopontoMaisProximo) {
                const distanciaFormatada = menorDistancia < 1 
                    ? `${Math.round(menorDistancia * 1000)}m` 
                    : `${menorDistancia.toFixed(1)}km`;
                
                mostrarNotificacao(
                    `✅ Ecoponto mais próximo: ${ecopontoMaisProximo.nome} (${distanciaFormatada})`,
                    5000
                );
                
                // Rola suavemente até os cards
                const featuredSection = document.querySelector('.featured-ecopontos');
                if (featuredSection) {
                    featuredSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        },
        // Erro
        (error) => {
            let mensagemErro = '❌ Erro ao obter localização';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    mensagemErro = '❌ Permissão de localização negada';
                    break;
                case error.POSITION_UNAVAILABLE:
                    mensagemErro = '❌ Localização indisponível';
                    break;
                case error.TIMEOUT:
                    mensagemErro = '❌ Timeout ao buscar localização';
                    break;
            }
            
            mostrarNotificacao(mensagemErro, 4000);
        },
        // Opções
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// ==================== ANIMAÇÕES DOS CARDS ====================

/**
 * Adiciona animação de hover personalizada aos cards
 */
function inicializarAnimacoesCards() {
    const cards = document.querySelectorAll('.ecoponto-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ==================== VERIFICAÇÃO DE HORÁRIO ====================

/**
 * Verifica se um ecoponto está aberto no horário atual
 * @param {string} horario - String com o horário (ex: "Seg-Sáb: 9h - 21h")
 * @returns {boolean} true se estiver aberto
 */
function verificarHorarioAberto(horario) {
    const agora = new Date();
    const diaSemana = agora.getDay(); // 0 = Domingo, 6 = Sábado
    const horaAtual = agora.getHours();
    
    // Simplificação: considera aberto entre 7h e 21h nos dias úteis
    const horarioComercial = horaAtual >= 7 && horaAtual < 21;
    const diaUtil = diaSemana >= 1 && diaSemana <= 6;
    
    return horarioComercial && diaUtil;
}

/**
 * Atualiza os badges de status dos ecopontos
 */
function atualizarStatusEcopontos() {
    const badges = document.querySelectorAll('.ecoponto-badge:not(.featured)');
    
    badges.forEach(badge => {
        const card = badge.closest('.ecoponto-card');
        const titulo = card?.querySelector('h3')?.textContent;
        
        const ecoponto = ecopontos.find(e => e.nome === titulo);
        
        if (ecoponto && verificarHorarioAberto(ecoponto.horario)) {
            badge.textContent = 'Aberto agora';
            badge.style.background = 'linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%)';
        } else if (ecoponto) {
            badge.textContent = 'Fechado';
            badge.style.background = 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)';
        }
    });
}

// ==================== SCROLL SUAVE ====================

/**
 * Adiciona scroll suave para links internos
 */
function inicializarScrollSuave() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ==================== EFEITOS DE SCROLL ====================

/**
 * Adiciona animações ao fazer scroll
 */
function inicializarEfeitosScroll() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observa cards e seções
    const elementos = document.querySelectorAll('.ecoponto-card, .info-card, .featured-ecopontos');
    elementos.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ==================== INTERATIVIDADE DO HEADER ====================

/**
 * Adiciona efeito de transparência no header ao fazer scroll
 */
function inicializarEfeitoHeader() {
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 8px 25px rgba(242, 140, 0, 0.5)';
            header.style.padding = '1rem 5%';
        } else {
            header.style.boxShadow = '0 6px 20px rgba(242, 140, 0, 0.4)';
            header.style.padding = '1.25rem 5%';
        }
        
        lastScroll = currentScroll;
    });
}

// ==================== CLICK NOS CARDS ====================

/**
 * Adiciona funcionalidade de click nos cards para mostrar mais informações
 */
function inicializarClickCards() {
    const cards = document.querySelectorAll('.ecoponto-card');
    
    cards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            const nome = this.querySelector('h3').textContent;
            const endereco = this.querySelector('.ecoponto-address span')?.textContent || 
                           this.querySelector('.ecoponto-address').textContent;
            
            mostrarNotificacao(`📍 ${nome} - Clique para ver no mapa!`, 4000);
            
            // Rola até o mapa
            const mapaSection = document.querySelector('.mapa-section');
            if (mapaSection) {
                mapaSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });
}

// ==================== TOOLTIP NO FAB ====================

/**
 * Adiciona tooltip no botão flutuante
 */
function inicializarTooltipFAB() {
    const fab = document.querySelector('.fab-location');
    
    if (!fab) return;
    
    fab.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) rotate(5deg)';
    });
    
    fab.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
}

// ==================== ACESSIBILIDADE ====================

/**
 * Melhora a acessibilidade da página
 */
function melhorarAcessibilidade() {
    // Adiciona role e aria-label para elementos interativos
    const cards = document.querySelectorAll('.ecoponto-card');
    cards.forEach(card => {
        card.setAttribute('role', 'article');
        card.setAttribute('tabindex', '0');
        
        // Permite ativar com Enter ou Space
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// ==================== ATALHOS DE TECLADO ====================

/**
 * Adiciona atalhos de teclado úteis
 */
function inicializarAtalhosKeyboard() {
    document.addEventListener('keydown', (e) => {
        // Alt + L: Buscar localização
        if (e.altKey && e.key === 'l') {
            e.preventDefault();
            encontrarEcopontoMaisProximo();
        }
        
        // Alt + M: Ir para o mapa
        if (e.altKey && e.key === 'm') {
            e.preventDefault();
            const mapa = document.querySelector('.mapa-section');
            if (mapa) {
                mapa.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
        
        // Esc: Fechar notificação
        if (e.key === 'Escape') {
            const notification = document.getElementById('notification');
            if (notification?.classList.contains('show')) {
                notification.classList.remove('show');
            }
        }
    });
}

// ==================== INICIALIZAÇÃO ====================

/**
 * Inicializa todas as funcionalidades quando o DOM estiver pronto
 */
function inicializar() {
    // Log de inicialização
    console.log('🌱 ValidaDelivery - Sistema de Ecopontos inicializado');
    
    // Inicializa funcionalidades principais
    inicializarAnimacoesCards();
    inicializarScrollSuave();
    inicializarEfeitosScroll();
    inicializarEfeitoHeader();
    inicializarClickCards();
    inicializarTooltipFAB();
    melhorarAcessibilidade();
    inicializarAtalhosKeyboard();
    
    // Atualiza status dos ecopontos
    atualizarStatusEcopontos();
    
    // Atualiza status a cada 5 minutos
    setInterval(atualizarStatusEcopontos, 5 * 60 * 1000);
    
    // Configura botão de localização
    const fabLocation = document.querySelector('.fab-location');
    if (fabLocation) {
        fabLocation.addEventListener('click', encontrarEcopontoMaisProximo);
    }
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        mostrarNotificacao('🌱 Bem-vindo aos Ecopontos de Uberlândia!', 3000);
    }, 1000);
    
    // Dica sobre atalhos de teclado
    setTimeout(() => {
        mostrarNotificacao('💡 Dica: Pressione Alt+L para encontrar o ecoponto mais próximo', 5000);
    }, 5000);
}

// ==================== EVENT LISTENERS ====================

// Aguarda o DOM estar completamente carregado
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializar);
} else {
    inicializar();
}

// Previne comportamento padrão em alguns elementos
document.addEventListener('click', (e) => {
    // Previne propagação em links com #
    if (e.target.matches('a[href="#"]')) {
        e.preventDefault();
    }
});

// Log quando a página for descarregada
window.addEventListener('beforeunload', () => {
    console.log('🌱 ValidaDelivery - Sistema de Ecopontos finalizado');
});