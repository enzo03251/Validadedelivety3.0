// ==================== CARROSSEL ====================
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentSlide = 0;

// Criar dots de navegação
slides.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.dot');

// Função para ir para um slide específico
function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    
    currentSlide = (n + slides.length) % slides.length;
    
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

// Próximo slide
function nextSlide() {
    goToSlide(currentSlide + 1);
}

// Slide anterior
function prevSlide() {
    goToSlide(currentSlide - 1);
}

// Event listeners para botões
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
}

// Autoplay - muda a cada 5 segundos
let autoplayInterval = setInterval(nextSlide, 5000);

// Pausar autoplay ao passar o mouse
const carouselContainer = document.querySelector('.carousel-container');
if (carouselContainer) {
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(autoplayInterval);
    });

    carouselContainer.addEventListener('mouseleave', () => {
        autoplayInterval = setInterval(nextSlide, 5000);
    });
}

// Suporte para gestos touch em dispositivos móveis
let touchStartX = 0;
let touchEndX = 0;

const carousel = document.querySelector('.carousel');

if (carousel) {
    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide();
    }
    if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide();
    }
}

// Navegação por teclado (setas esquerda/direita)
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// ==================== TOGGLE SWITCHES ====================
const toggleSwitches = document.querySelectorAll('.toggle-switch');

toggleSwitches.forEach(toggle => {
    toggle.addEventListener('click', function() {
        this.classList.toggle('active');
        
        // Feedback visual
        const preferenceLabel = this.parentElement.querySelector('.preference-label');
        if (preferenceLabel) {
            const isActive = this.classList.contains('active');
            console.log(`${preferenceLabel.textContent}: ${isActive ? 'Ativado' : 'Desativado'}`);
        }
    });
});

// ==================== BOTÕES DE EDIÇÃO COM LINKS ====================
const editButtons = document.querySelectorAll('.edit-btn');

editButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Animação de clique
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
        
        // Log da ação (opcional)
        const action = this.getAttribute('data-action');
        if (action) {
            console.log(`Ação: ${action}`);
        }
    });
});

// ==================== ANIMAÇÃO DE PEDIDOS ====================
const orderItems = document.querySelectorAll('.order-item');

orderItems.forEach(item => {
    item.addEventListener('click', function() {
        const orderName = this.querySelector('.order-name').textContent;
        const orderPrice = this.querySelector('.order-price').textContent;
        
        console.log(`Pedido selecionado: ${orderName} - ${orderPrice}`);
        
        // Feedback visual
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'translateX(5px)';
        }, 100);
    });
});

// ==================== SMOOTH SCROLL PARA NAVEGAÇÃO ====================
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        // Se for uma âncora interna (#)
        if (href.startsWith('#')) {
            e.preventDefault();
            
            // Remove active de todos os links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Adiciona active ao link clicado
            this.classList.add('active');
            
            // Scroll suave (se o elemento existir)
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== ANIMAÇÃO DE ENTRADA ====================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'all 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar cards do perfil
const sectionCards = document.querySelectorAll('.section-card');
sectionCards.forEach(card => observer.observe(card));

// ==================== MENSAGEM DE BOAS-VINDAS ====================
window.addEventListener('load', () => {
    console.log('✅ ValidaDelivery - Perfil carregado com sucesso!');
    console.log('🎨 Carrossel ativo com', slides.length, 'slides');
    console.log('⚙️ Preferências configuráveis:', toggleSwitches.length);
});

// ==================== PREVENÇÃO DE ERROS ====================
if (!carousel) {
    console.warn('⚠️ Carrossel não encontrado. Verifique o HTML.');
}

if (slides.length === 0) {
    console.warn('⚠️ Nenhum slide encontrado no carrossel.');
}