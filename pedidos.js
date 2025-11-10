// ==================== 📦 VALIDADELIVERY JS COMPLETO v3.0 ====================
// Bugs corrigidos, performance otimizada, acessibilidade aprimorada

'use strict';

// ==================== 🎯 DADOS DOS PRODUTOS ====================
const produtos = [
    {
        nome: "Pizza de Quatro Queijos",
        preco: 20.00,
        quantidade: 1,
        categoria: "lanches",
        descricao: "Deliciosa pizza artesanal com 4 queijos diferentes.",
        validade: "10/12/2025",
        rating: 4.8,
        imagem: "https://th.bing.com/th/id/OIP.wWgqCgMTimc6s7bLwf0fyAHaFj?w=227&h=180&c=7&r=0&o=7&pid=1.7&rm=3",
        badge: "Popular"
    },
    {
        nome: "Pastel de Carne",
        preco: 20.00,
        quantidade: 3,
        categoria: "lanches",
        descricao: "Casquinha crocante, recheio bem temperado e sabor de feira na sua casa",
        validade: "10/12/2025",
        rating: 4.8,
        imagem: "https://receitatodahora.com.br/wp-content/uploads/2022/03/pastel-de-carne1-1333x1333.jpg",
        badge: "Popular"
    },
    {
        nome: "Lasanha à Bolonhesa",
        preco: 20.00,
        quantidade: 3,
        categoria: "lanches",
        descricao: "Massa artesanal, molho de carne bem temperado e camadas generosas de queijo.",
        validade: "10/12/2025",
        rating: 4.8,
        imagem: "https://guiadacozinha.com.br/wp-content/uploads/2014/01/lasanha-bolonhesa-na-pressao.jpg",
        badge: "Popular"
    },
    {
        nome: "Pizza de Calabresa",
        preco: 20.00,
        quantidade: 1,
        categoria: "lanches",
        descricao: "Deliciosa pizza artesanal com calabresa e queijo derretido.",
        validade: "10/12/2025",
        rating: 4.8,
        imagem: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop",
        badge: "Popular"
    },
    {
        nome: "Hambúrguer Artesanal",
        preco: 10.00,
        quantidade: 1,
        categoria: "lanches",
        descricao: "Carne suculenta, queijo cheddar e molho especial.",
        validade: "08/12/2025",
        rating: 4.9,
        imagem: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        badge: "Novo"
    },
    {
        nome: "Torta de Limão",
        preco: 7.00,
        quantidade: 1,
        categoria: "doces",
        descricao: "Massa crocante, recheio cremoso e aquele toque cítrico irresistível. Refrescante, doce na medida e simplesmente apaixonante!",
        validade: "15/12/2025",
        rating: 5.0,
        imagem: "https://cknj.com.br/teste/wp-content/uploads/2021/10/torta-de-limao-01-1800x1286.jpg",
        badge: "-30%",
        promo: true
    },
    {
        nome: "Combo Especial de Pão de Queijo",
        preco: 12.00,
        quantidade: 12,
        categoria: "lanches",
        descricao: "Um prato típico mineiro, muito suculento. Perfeito para compartilhar!",
        validade: "15/12/2025",
        rating: 5.0,
        imagem: "https://amopaocaseiro.com.br/wp-content/uploads/2022/08/yt-069_pao-de-queijo_receita.jpg",
        badge: "-30%",
        promo: true
    },
    {
        nome: "Salada Caesar",
        preco: 10.00,
        quantidade: 1,
        categoria: "saudavel",
        descricao: "Alface romana, croutons, parmesão e molho caesar cremoso.",
        validade: "07/12/2025",
        rating: 4.5,
        imagem: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
        badge: "🌱 Eco"
    },
    {
        nome: "Batatas Fritas",
        preco: 13.99,
        quantidade: 20,
        categoria: "lanches",
        descricao: "Batatas crocantes com sal e ervas especiais.",
        validade: "09/12/2025",
        rating: 4.6,
        imagem: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop"
    },
    {
        nome: "Bolo de Chocolate",
        preco: 20.00,
        quantidade: 1,
        categoria: "doces",
        descricao: "Bolo caseiro fofinho com cobertura cremosa de chocolate.",
        validade: "20/12/2025",
        rating: 4.9,
        imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop"
    },
    {
        nome: "Brigadeiro de Chocolate",
        preco: 6.00,
        quantidade: 3,
        categoria: "doces",
        descricao: "Brigadeiro cremoso de chocolate.",
        validade: "20/12/2025",
        rating: 4.9,
        imagem: "https://www.mavalerio.com.br/wp-content/uploads/2019/04/Brigadeiro.png"
    },
    {
        nome: "Jujubas Coloridas",
        preco: 11.00,
        quantidade: "1 saco",
        categoria: "doces",
        descricao: "1 saco de jujubas coloridas e saborosas.",
        validade: "30/01/2026",
        rating: 4.3,
        imagem: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=400&h=300&fit=crop",
        badge: "-20%",
        promo: true
    },
    {
        nome: "Pudim de Leite Condensado",
        preco: 11.00,
        quantidade: "1 pote",
        categoria: "doces",
        descricao: "Clássico e irresistível! Textura cremosa, calda dourada de caramelo e aquele sabor caseiro que derrete na boca. Uma sobremesa perfeita para adoçar qualquer momento.",
        validade: "30/01/2026",
        rating: 4.3,
        imagem: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiOarlJeGTkqOXi0RQTmRXu5_tMndMpDR4g&s",
        badge: "-20%"
    },
    {
        nome: "Hambúrguer Congelado",
        preco: 25.90,
        quantidade: 12,
        categoria: "congelados",
        descricao: "Sabor autêntico e suculento, pronto para grelhar! Feito com carne de qualidade, tempero caseiro e praticidade para o seu dia a dia. Basta preparar e saborear!",
        validade: "12/12/2025",
        rating: 4.8,
        imagem: "https://th.bing.com/th/id/OIP.Rvs9Q6vfYohBh8SgCFo40wHaE7?w=288&h=192&c=7&r=0&o=7&pid=1.7&rm=3"
    },
    {
        nome: "Nuggets de Frango Congelados",
        preco: 25.90,
        quantidade: 12,
        categoria: "congelados",
        descricao: "Crocantes por fora, macios por dentro e cheios de sabor! Feitos com peito de frango selecionado, prontos para fritar ou assar e deixar seu dia mais prático e delicioso.",
        validade: "12/12/2025",
        rating: 4.8,
        imagem: "https://th.bing.com/th/id/OIP.eJz4qhC99kcWqA3Rn7SoZwHaE6?w=257&h=180&c=7&r=0&o=7&pid=1.7&rm=3"
    },
    {
        nome: "Macarrão Vegano",
        preco: 15.00,
        quantidade: 12,
        categoria: "saudavel",
        descricao: "Macarrão vegano delicioso com ingredientes simples e saudáveis.",
        validade: "07/12/2025",
        rating: 4.5,
        imagem: "https://bing.com/th?id=OSK.4ed28491b1c7df08fd7a131e13e12ec5",
        badge: "🌱 Eco"
    }
];

// ==================== 💰 CUPONS VÁLIDOS ====================
const cuponsValidos = {
    'PRIMEIRACOMPRA': { desconto: 0.10, tipo: 'percentual', descricao: '10% de desconto' },
    'FRETEGRATIS': { desconto: 5.00, tipo: 'fixo', descricao: 'Frete Grátis' },
    'VIP20': { desconto: 0.20, tipo: 'percentual', descricao: '20% de desconto' },
    'NATAL2025': { desconto: 15.00, tipo: 'fixo', descricao: 'R$ 15 de desconto' },
    'BEMVINDO': { desconto: 0.15, tipo: 'percentual', descricao: '15% de boas-vindas' }
};

// ==================== 🎯 ESTADO DA APLICAÇÃO ====================
let carrinho = [];
let favoritos = [];
let historico = [];
let notificacoes = [
    { id: 1, mensagem: "Bem-vindo ao ValidaDelivery! 🎉", lida: false, data: new Date() },
    { id: 2, mensagem: "Novas promoções disponíveis! 🎁", lida: false, data: new Date() }
];
let cupomAplicado = null;
const TAXA_ENTREGA = 5.00;
const PLACEHOLDER_IMAGEM = 'https://via.placeholder.com/400x300?text=Sem+Imagem';

// ==================== 🔧 ELEMENTOS DO DOM ====================
let elements = {};

// ==================== 🚀 INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', () => {
    mostrarLoading();

    setTimeout(() => {
        cachearElementos();
        carregarEstado();
        inicializarEventos();
        renderizarProdutos();
        atualizarContadores();
        inicializarDarkMode();
        verificarCookieConsent();
        aplicarAnimacoesIniciais();
        esconderLoading();

        console.log('%c🌱 ValidaDelivery v3.0 COMPLETO', 'color: #6ea56f; font-size: 20px; font-weight: bold;');
        console.log('%c✨ Todos os bugs corrigidos!', 'color: #f28c00; font-size: 14px;');

        // Mensagem de boas-vindas
        setTimeout(() => {
            mostrarNotificacao('Bem-vindo ao ValidaDelivery! Explore nossos produtos 🎉');
        }, 500);
    }, 1200);
});

// ==================== 📍 LOADING SCREEN ====================
function mostrarLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.remove('hidden');
        loading.style.display = 'flex';
        loading.setAttribute('aria-hidden', 'false');
    }
}

function esconderLoading() {
    const loading = document.getElementById('loadingScreen');
    if (loading) {
        loading.classList.add('hidden');
        loading.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
            loading.style.display = 'none';
        }, 500);
    }
}

// ==================== 📍 CACHEAR ELEMENTOS ====================
function cachearElementos() {
    elements = {
        // Carrinho
        carrinhoFloat: document.getElementById('carrinhoFloat'),
        carrinhoCount: document.getElementById('carrinhoCount'),
        modalCarrinho: document.getElementById('modalCarrinho'),
        cartItems: document.getElementById('cartItems'),
        cartSubtotal: document.getElementById('cartSubtotal'),
        cartTotal: document.getElementById('cartTotal'),
        finalizarPedido: document.getElementById('finalizarPedido'),

        // Cupons
        couponInput: document.getElementById('couponInput'),
        couponForm: document.getElementById('couponForm'),
        applyCoupon: document.getElementById('applyCoupon'),
        discountInfo: document.getElementById('discountInfo'),
        discountAmount: document.getElementById('discountAmount'),

        // Modais
        modalGenerico: document.getElementById('modalGenerico'),
        modalTitle: document.getElementById('modalTitle'),
        modalBody: document.getElementById('modalBody'),

        // Produtos
        productsGrid: document.getElementById('productsGrid'),

        // Busca e Filtros
        searchInput: document.getElementById('searchInput'),
        clearSearch: document.getElementById('clearSearch'),
        sortSelect: document.getElementById('sortSelect'),
        resultsCount: document.getElementById('resultsCount'),

        // Sidebar
        favCount: document.getElementById('favCount'),
        notifCount: document.getElementById('notifCount'),

        // Outros
        notification: document.getElementById('notification'),
        themeToggle: document.getElementById('themeToggle'),
        scrollToTop: document.getElementById('scrollToTop'),
        loadingScreen: document.getElementById('loadingScreen')
    };
}

// ==================== ⤵️ PERSISTÊNCIA (localStorage) ====================
function salvarEstado() {
    try {
        localStorage.setItem('vd_carrinho', JSON.stringify(carrinho));
        localStorage.setItem('vd_favoritos', JSON.stringify(favoritos));
        localStorage.setItem('vd_historico', JSON.stringify(historico));
        localStorage.setItem('vd_notificacoes', JSON.stringify(notificacoes));
        localStorage.setItem('vd_cupom', JSON.stringify(cupomAplicado));
    } catch (err) {
        console.warn('Erro ao salvar no localStorage:', err);
    }
}

function carregarEstado() {
    try {
        const sCarrinho = JSON.parse(localStorage.getItem('vd_carrinho') || 'null');
        const sFav = JSON.parse(localStorage.getItem('vd_favoritos') || 'null');
        const sHist = JSON.parse(localStorage.getItem('vd_historico') || 'null');
        const sNot = JSON.parse(localStorage.getItem('vd_notificacoes') || 'null');
        const sCupom = JSON.parse(localStorage.getItem('vd_cupom') || 'null');

        if (Array.isArray(sCarrinho)) carrinho = sCarrinho;
        if (Array.isArray(sFav)) favoritos = sFav;
        if (Array.isArray(sHist)) historico = sHist;
        if (Array.isArray(sNot)) {
            notificacoes = sNot.map(n => ({
                ...n,
                data: n.data ? new Date(n.data) : new Date()
            }));
        }
        if (sCupom) cupomAplicado = sCupom;
    } catch (err) {
        console.warn('Erro ao carregar estado:', err);
    }
}

// ==================== 🎨 RENDERIZAR PRODUTOS ====================
function renderizarProdutos(filtro = 'todos', busca = '', ordenacao = 'relevancia') {
    if (!elements.productsGrid) return;

    // Filtrar por categoria
    let produtosFiltrados = filtro === 'todos'
        ? [...produtos]
        : produtos.filter(p => p.categoria === filtro);

    // Filtrar por busca
    if (busca) {
        const buscaLower = busca.toLowerCase().trim();
        produtosFiltrados = produtosFiltrados.filter(p =>
            p.nome.toLowerCase().includes(buscaLower) ||
            p.descricao.toLowerCase().includes(buscaLower)
        );
    }

    // Ordenar produtos
    ordenarProdutos(produtosFiltrados, ordenacao);

    // Atualizar contador de resultados
    if (elements.resultsCount) {
        const count = produtosFiltrados.length;
        elements.resultsCount.textContent =
            `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
    }

    // Renderizar se houver produtos
    if (produtosFiltrados.length === 0) {
        elements.productsGrid.innerHTML = `
            <div class="no-results" role="status" aria-live="polite">
                Nenhum produto encontrado
                <br><small>Tente ajustar seus filtros ou busca</small>
            </div>
        `;
        return;
    }

    elements.productsGrid.innerHTML = produtosFiltrados.map((produto) => {
        const isFavorito = favoritos.includes(produto.nome);
        const produtoIndex = produtos.indexOf(produto);
        const imgSrc = produto.imagem && produto.imagem.trim() !== ''
            ? produto.imagem
            : PLACEHOLDER_IMAGEM;

        const badgeClass = produto.promo ? 'promo' :
            produto.badge === 'Novo' ? 'new' :
                produto.badge?.includes('Eco') ? 'eco' : '';

        return `
            <article class="card" 
                     data-index="${produtoIndex}" 
                     data-categoria="${produto.categoria}" 
                     ${produto.promo ? 'data-promo="true"' : ''} 
                     role="listitem" 
                     tabindex="0"
                     aria-label="${escapeHtml(produto.nome)} - R$ ${formatarMoeda(produto.preco)}">
                ${produto.badge ? `<div class="card-badge ${badgeClass}" aria-label="Selo: ${escapeHtml(produto.badge)}">${escapeHtml(produto.badge)}</div>` : ''}
                
                <button class="favorite-btn ${isFavorito ? 'favorited' : ''}" 
                        data-produto="${escapeHtml(produto.nome)}"
                        role="button"
                        aria-pressed="${isFavorito}"
                        aria-label="${isFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}"
                        type="button">
                    ${isFavorito ? '❤️' : '🤍'}
                </button>
                
                <div class="card-image">
                    <img src="${imgSrc}" 
                         alt="${escapeHtml(produto.nome)}" 
                         loading="lazy" 
                         onerror="this.src='${PLACEHOLDER_IMAGEM}'"
                         width="400"
                         height="300">
                </div>
                
                <div class="card-content">
                    <div class="card-rating">
                        <span class="stars" aria-hidden="true">${gerarEstrelas(produto.rating)}</span>
                        <span class="rating-number" aria-label="Avaliação ${produto.rating} de 5 estrelas">${produto.rating}</span>
                    </div>
                    <h3>${escapeHtml(produto.nome)}</h3>
                    <p>${escapeHtml(produto.descricao)}</p>
                    
                    <div class="card-footer">
                        <div class="validade" aria-label="Validade: ${escapeHtml(produto.validade)}">
                            <span aria-hidden="true">📅</span>
                            <span>Val: ${escapeHtml(produto.validade)}</span>
                        </div>
                        <div class="quantidade" aria-label="Quantidade: ${produto.quantidade} unidades">
                            <span>📦 ${produto.quantidade} un${typeof produto.quantidade === 'number' && produto.quantidade > 1 ? 's' : ''}</span>
                        </div>
                        <div class="preco" aria-label="Preço: R$ ${formatarMoeda(produto.preco)}">
                            R$ ${formatarMoeda(produto.preco)}
                        </div>
                        <button class="btn btn-add" 
                                data-index="${produtoIndex}" 
                                type="button" 
                                aria-label="Adicionar ${escapeHtml(produto.nome)} ao carrinho">
                            <span class="btn-icon" aria-hidden="true">🛒</span>
                            Adicionar
                        </button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    aplicarEventListenersProdutos();
    aplicarAnimacoesCards();
}

// ==================== 📊 ORDENAR PRODUTOS ====================
function ordenarProdutos(produtos, criterio) {
    switch (criterio) {
        case 'preco-asc':
            produtos.sort((a, b) => a.preco - b.preco);
            break;
        case 'preco-desc':
            produtos.sort((a, b) => b.preco - a.preco);
            break;
        case 'rating':
            produtos.sort((a, b) => b.rating - a.rating);
            break;
        case 'nome':
            produtos.sort((a, b) => a.nome.localeCompare(b.nome));
            break;
        default: // relevancia
            produtos.sort((a, b) => {
                if (a.promo && !b.promo) return -1;
                if (!a.promo && b.promo) return 1;
                return b.rating - a.rating;
            });
    }
}

// ==================== 🎯 INICIALIZAR EVENTOS ====================
function inicializarEventos() {
    // Categorias
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.addEventListener('click', () => filtrarPorCategoria(btn));
        btn.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                filtrarPorCategoria(btn);
            }
        });
    });

    // Busca
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', debounce((e) => {
            const valor = e.target.value.trim();

            // Mostrar/esconder botão limpar
            if (elements.clearSearch) {
                elements.clearSearch.style.display = valor ? 'block' : 'none';
            }

            const categoriaAtiva = document.querySelector('.categoria-btn.active');
            const categoria = categoriaAtiva ? categoriaAtiva.dataset.categoria : 'todos';
            const ordenacao = elements.sortSelect?.value || 'relevancia';

            renderizarProdutos(categoria, valor, ordenacao);
        }, 300));
    }

    // Botão limpar busca
    if (elements.clearSearch) {
        elements.clearSearch.addEventListener('click', () => {
            if (elements.searchInput) {
                elements.searchInput.value = '';
                elements.searchInput.focus();
                elements.clearSearch.style.display = 'none';
            }

            const categoriaAtiva = document.querySelector('.categoria-btn.active');
            const categoria = categoriaAtiva ? categoriaAtiva.dataset.categoria : 'todos';
            const ordenacao = elements.sortSelect?.value || 'relevancia';

            renderizarProdutos(categoria, '', ordenacao);
        });
    }

    // Ordenação
    if (elements.sortSelect) {
        elements.sortSelect.addEventListener('change', (e) => {
            const categoriaAtiva = document.querySelector('.categoria-btn.active');
            const categoria = categoriaAtiva ? categoriaAtiva.dataset.categoria : 'todos';
            const busca = elements.searchInput?.value.trim() || '';

            renderizarProdutos(categoria, busca, e.target.value);
            mostrarNotificacao(`Ordenado por: ${e.target.options[e.target.selectedIndex].text} 📊`);
        });
    }

    // Carrinho flutuante
    if (elements.carrinhoFloat) {
        elements.carrinhoFloat.addEventListener('click', () => abrirModal('modalCarrinho'));
    }

    // Fechar modais (delegation)
    document.addEventListener('click', (e) => {
        const closeBtn = e.target.closest('.close-modal');
        if (closeBtn) {
            const modal = closeBtn.closest('.modal');
            if (modal) fecharModal(modal.id);
        }
    });

    // Click fora do modal para fechar
    [elements.modalCarrinho, elements.modalGenerico].forEach(modal => {
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal(modal.id);
        });
    });

    // Finalizar pedido
    if (elements.finalizarPedido) {
        elements.finalizarPedido.addEventListener('click', finalizarPedido);
    }

    // Cupom - CORRIGIDO: event listener no form
    if (elements.couponForm) {
        elements.couponForm.addEventListener('submit', (e) => {
            e.preventDefault();
            aplicarCupom();
        });
    }

    // Sidebar items
    document.querySelectorAll('.sidebar-item').forEach(item => {
        item.addEventListener('click', () => executarAcaoSidebar(item.dataset.action));
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                executarAcaoSidebar(item.dataset.action);
            }
        });
    });

    // ESC para fechar modais
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                fecharModal(modal.id);
            });
        }
    });

    // Scroll to top
    if (elements.scrollToTop) {
        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 300) {
                elements.scrollToTop.classList.add('visible');
                elements.scrollToTop.style.display = 'flex';
            } else {
                elements.scrollToTop.classList.remove('visible');
                elements.scrollToTop.style.display = 'none';
            }
        }, 200));

        elements.scrollToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Header scroll effect
    window.addEventListener('scroll', throttle(() => {
        const header = document.querySelector('header');
        if (!header) return;

        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, 100));

    // Cookie Consent
    const acceptCookies = document.getElementById('acceptCookies');
    const rejectCookies = document.getElementById('rejectCookies');

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('vd_cookies_accepted', 'true');
            const cookieConsent = document.getElementById('cookieConsent');
            if (cookieConsent) {
                cookieConsent.style.display = 'none';
            }
            mostrarNotificacao('Obrigado! Cookies aceitos 🍪');
        });
    }

    if (rejectCookies) {
        rejectCookies.addEventListener('click', () => {
            localStorage.setItem('vd_cookies_accepted', 'false');
            const cookieConsent = document.getElementById('cookieConsent');
            if (cookieConsent) {
                cookieConsent.style.display = 'none';
            }
            mostrarNotificacao('Cookies recusados');
        });
    }
}

// ==================== 🎯 EVENT LISTENERS DOS PRODUTOS ====================
function aplicarEventListenersProdutos() {
    // Botões adicionar
    document.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const index = parseInt(btn.dataset.index, 10);
            if (!isNaN(index) && index >= 0 && index < produtos.length) {
                adicionarAoCarrinho(index);
                // Feedback visual
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btn.style.transform = '';
                }, 180);
            }
        });
    });

    // Botões favoritos
    document.querySelectorAll('.favorite-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const nomeProduto = btn.dataset.produto;
            if (nomeProduto) {
                toggleFavorito(nomeProduto);
            }
        });
    });

    // Click nos cards (detalhes)
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Ignorar se clicou em botão
            if (e.target.closest('.btn-add') || e.target.closest('.favorite-btn')) {
                return;
            }
            const index = parseInt(card.dataset.index, 10);
            if (!isNaN(index) && index >= 0 && index < produtos.length) {
                mostrarDetalhes(produtos[index]);
            }
        });

        card.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const index = parseInt(card.dataset.index, 10);
                if (!isNaN(index) && index >= 0 && index < produtos.length) {
                    mostrarDetalhes(produtos[index]);
                }
            }
        });
    });
}

// ==================== 🔍 FILTRAR POR CATEGORIA ====================
function filtrarPorCategoria(botaoClicado) {
    document.querySelectorAll('.categoria-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
    });

    botaoClicado.classList.add('active');
    botaoClicado.setAttribute('aria-pressed', 'true');

    const categoria = botaoClicado.dataset.categoria || 'todos';
    const busca = elements.searchInput?.value.trim() || '';
    const ordenacao = elements.sortSelect?.value || 'relevancia';

    renderizarProdutos(categoria, busca, ordenacao);

    const nomeCategoria = botaoClicado.textContent.trim();
    mostrarNotificacao(`Mostrando: ${nomeCategoria} 🔍`);
}

// ==================== ❤️ FAVORITOS ====================
function toggleFavorito(nomeProduto) {
    const index = favoritos.indexOf(nomeProduto);

    if (index > -1) {
        favoritos.splice(index, 1);
        mostrarNotificacao(`${nomeProduto} removido dos favoritos 💔`);
    } else {
        favoritos.push(nomeProduto);
        mostrarNotificacao(`${nomeProduto} adicionado aos favoritos ❤️`);
    }

    salvarEstado();

    const categoriaAtiva = document.querySelector('.categoria-btn.active');
    const categoria = categoriaAtiva ? categoriaAtiva.dataset.categoria : 'todos';
    const busca = elements.searchInput?.value.trim() || '';
    const ordenacao = elements.sortSelect?.value || 'relevancia';

    renderizarProdutos(categoria, busca, ordenacao);
    atualizarContadores();
}

// CORRIGIDO: Função global para chamar do HTML renderizado
window.toggleFavorito = toggleFavorito;

function mostrarFavoritos() {
    const produtosFavoritos = produtos.filter(p => favoritos.includes(p.nome));

    if (!elements.modalBody || !elements.modalTitle) return;

    if (produtosFavoritos.length === 0) {
        elements.modalBody.innerHTML = `
            <div class="empty-state" role="status">
                <div class="empty-state-icon">❤️</div>
                <p>Você ainda não tem favoritos.<br>Clique no coração dos produtos para adicionar!</p>
            </div>
        `;
    } else {
        elements.modalBody.innerHTML = `
            <div class="item-list">
                ${produtosFavoritos.map(p => {
            const produtoIndex = produtos.indexOf(p);
            return `
                        <div class="item-card">
                            <div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;">
                                <div style="flex: 1;">
                                    <h4>${escapeHtml(p.nome)}</h4>
                                    <p>${escapeHtml(p.descricao)}</p>
                                    <p style="color: var(--gold); font-weight: bold; margin-top: 10px;">
                                        R$ ${formatarMoeda(p.preco)}
                                    </p>
                                </div>
                                <button onclick="window.toggleFavorito('${escapeHtml(p.nome)}'); window.mostrarFavoritos();" 
                                        style="background: none; border: none; font-size: 1.5rem; cursor: pointer; min-width: 44px; min-height: 44px;"
                                        aria-label="Remover ${escapeHtml(p.nome)} dos favoritos"
                                        type="button">
                                    ❤️
                                </button>
                            </div>
                            <button class="btn" 
                                    onclick="window.adicionarAoCarrinho(${produtoIndex})" 
                                    style="margin-top: 10px; width: 100%;"
                                    type="button"
                                    aria-label="Adicionar ${escapeHtml(p.nome)} ao carrinho">
                                <span class="btn-icon" aria-hidden="true">🛒</span>
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    elements.modalTitle.innerHTML = '<span class="modal-icon" aria-hidden="true">❤️</span> Meus Favoritos';
    abrirModal('modalGenerico');
}

// CORRIGIDO: Função global
window.mostrarFavoritos = mostrarFavoritos;

// ==================== 🛒 CARRINHO ====================
function adicionarAoCarrinho(index) {
    if (index < 0 || index >= produtos.length) {
        console.error('Índice de produto inválido:', index);
        return;
    }

    const produto = produtos[index];

    // Validar validade
    if (!validarValidade(produto.validade)) {
        mostrarNotificacao('Este produto está fora da validade ❌', 'erro');
        return;
    }

    const itemExistente = carrinho.find(item => item.nome === produto.nome);

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            nome: produto.nome,
            preco: produto.preco,
            quantidade: 1
        });
    }

    atualizarCarrinho();
    salvarEstado();
    atualizarContadores();
    mostrarNotificacao(`${produto.nome} adicionado ao carrinho! 🛒`);
}

// CORRIGIDO: Função global
window.adicionarAoCarrinho = adicionarAoCarrinho;

function removerDoCarrinho(index) {
    if (index < 0 || index >= carrinho.length) return;

    const item = carrinho[index];
    carrinho.splice(index, 1);

    // Remover cupom se carrinho ficar vazio
    if (carrinho.length === 0) {
        cupomAplicado = null;
    }

    atualizarCarrinho();
    salvarEstado();
    atualizarContadores();
    mostrarNotificacao(`${item.nome} removido do carrinho! 🗑️`);
}

// CORRIGIDO: Função global
window.removerDoCarrinho = removerDoCarrinho;

function atualizarQuantidade(index, delta) {
    if (index < 0 || index >= carrinho.length) return;

    carrinho[index].quantidade += delta;

    if (carrinho[index].quantidade <= 0) {
        removerDoCarrinho(index);
    } else {
        atualizarCarrinho();
        salvarEstado();
    }
}

// CORRIGIDO: Função global
window.atualizarQuantidade = atualizarQuantidade;

function atualizarCarrinho() {
    if (!elements.cartItems || !elements.cartSubtotal || !elements.cartTotal) return;

    if (carrinho.length === 0) {
        elements.cartItems.innerHTML = `
            <div class="empty-state" role="status">
                <div class="empty-state-icon">🛒</div>
                <p>Seu carrinho está vazio 😢<br>Adicione alguns produtos deliciosos!</p>
            </div>
        `;
        elements.cartSubtotal.textContent = 'R$ 0,00';

        const totalSpan = elements.cartTotal.querySelector('span:last-child');
        if (totalSpan) totalSpan.textContent = `R$ ${formatarMoeda(TAXA_ENTREGA)}`;

        // Esconder desconto
        if (elements.discountInfo) elements.discountInfo.style.display = 'none';

        return;
    }

    let subtotal = 0;

    elements.cartItems.innerHTML = carrinho.map((item, index) => {
        const totalItem = item.preco * item.quantidade;
        subtotal += totalItem;

        return `
            <div class="cart-item" role="listitem" aria-label="${escapeHtml(item.nome)} - ${item.quantidade} unidades">
                <div class="cart-item-info">
                    <h4>${escapeHtml(item.nome)}</h4>
                    <p aria-label="Preço unitário: R$ ${formatarMoeda(item.preco)}">R$ ${formatarMoeda(item.preco)}</p>
                    <div class="qty-controls" role="group" aria-label="Controles de quantidade">
                        <button class="qty-btn" 
                                onclick="window.atualizarQuantidade(${index}, -1)" 
                                aria-label="Diminuir quantidade de ${escapeHtml(item.nome)}" 
                                type="button">−</button>
                        <span style="font-weight: bold; min-width: 30px; text-align: center;" 
                              role="status" 
                              aria-live="polite" 
                              aria-label="${item.quantidade} unidades">${item.quantidade}</span>
                        <button class="qty-btn" 
                                onclick="window.atualizarQuantidade(${index}, 1)" 
                                aria-label="Aumentar quantidade de ${escapeHtml(item.nome)}" 
                                type="button">+</button>
                    </div>
                </div>
                <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
                    <div style="font-size: 1.3rem; font-weight: bold; color: #6ea56f;" 
                         aria-label="Total do item: R$ ${formatarMoeda(totalItem)}">
                        R$ ${formatarMoeda(totalItem)}
                    </div>
                    <button class="remove-item" 
                            onclick="window.removerDoCarrinho(${index})" 
                            type="button" 
                            aria-label="Remover ${escapeHtml(item.nome)} do carrinho">
                        🗑️ Remover
                    </button>
                </div>
            </div>
        `;
    }).join('');

    // Calcular desconto
    let desconto = 0;
    if (cupomAplicado) {
        if (cupomAplicado.tipo === 'percentual') {
            desconto = subtotal * cupomAplicado.desconto;
        } else {
            desconto = cupomAplicado.desconto;
        }

        if (elements.discountInfo) {
            elements.discountInfo.style.display = 'flex';
            if (elements.discountAmount) {
                elements.discountAmount.textContent = `- R$ ${formatarMoeda(desconto)}`;
            }
        }
    } else {
        if (elements.discountInfo) elements.discountInfo.style.display = 'none';
    }

    const total = Math.max(0, subtotal - desconto + TAXA_ENTREGA);

    elements.cartSubtotal.textContent = `R$ ${formatarMoeda(subtotal)}`;
    const ttSpan = elements.cartTotal.querySelector('span:last-child');
    if (ttSpan) ttSpan.textContent = `R$ ${formatarMoeda(total)}`;
}

// ==================== 💰 CUPONS ====================
function aplicarCupom() {
    if (!elements.couponInput) return;

    const codigo = elements.couponInput.value.trim().toUpperCase();

    if (!codigo) {
        mostrarNotificacao('Digite um código de cupom', 'erro');
        return;
    }

    if (carrinho.length === 0) {
        mostrarNotificacao('Adicione produtos ao carrinho primeiro', 'erro');
        return;
    }

    const cupom = cuponsValidos[codigo];

    if (cupom) {
        cupomAplicado = { ...cupom, codigo };
        mostrarNotificacao(`✅ Cupom aplicado: ${cupom.descricao}!`);
        elements.couponInput.value = '';
        atualizarCarrinho();
        salvarEstado();
    } else {
        mostrarNotificacao('❌ Cupom inválido', 'erro');
    }
}

// CORRIGIDO: Função global
window.aplicarCupom = aplicarCupom;

// ==================== ✅ FINALIZAR PEDIDO ====================
function finalizarPedido() {
    if (carrinho.length === 0) {
        mostrarNotificacao('Adicione itens ao carrinho primeiro! 🛒', 'erro');
        return;
    }

    const btn = elements.finalizarPedido;
    if (!btn) return;

    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '<span>Processando...</span>';
    btn.disabled = true;
    btn.style.transform = 'scale(0.95)';

    setTimeout(() => {
        let subtotal = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
        let desconto = 0;

        if (cupomAplicado) {
            if (cupomAplicado.tipo === 'percentual') {
                desconto = subtotal * cupomAplicado.desconto;
            } else {
                desconto = cupomAplicado.desconto;
            }
        }

        const total = Math.max(0, subtotal - desconto + TAXA_ENTREGA);

        // Adicionar ao histórico
        historico.unshift({
            data: new Date().toLocaleString('pt-BR'),
            itens: JSON.parse(JSON.stringify(carrinho)),
            total: total,
            cupom: cupomAplicado ? cupomAplicado.codigo : null
        });

        // Adicionar notificação
        notificacoes.unshift({
            id: Date.now(),
            mensagem: `Pedido realizado! Total: R$ ${formatarMoeda(total)} 🎉`,
            lida: false,
            data: new Date()
        });

        mostrarNotificacao(`Pedido realizado com sucesso! Total: R$ ${formatarMoeda(total)} 🎉`);

        // Limpar
        carrinho = [];
        cupomAplicado = null;
        atualizarCarrinho();
        salvarEstado();
        atualizarContadores();

        btn.innerHTML = textoOriginal;
        btn.disabled = false;
        btn.style.transform = '';

        setTimeout(() => fecharModal('modalCarrinho'), 1500);
    }, 1200);
}

// ==================== 📜 HISTÓRICO ====================
function mostrarHistorico() {
    if (!elements.modalBody || !elements.modalTitle) return;

    if (historico.length === 0) {
        elements.modalBody.innerHTML = `
            <div class="empty-state" role="status">
                <div class="empty-state-icon">📜</div>
                <p>Você ainda não fez nenhum pedido.<br>Faça seu primeiro pedido agora!</p>
            </div>
        `;
    } else {
        elements.modalBody.innerHTML = `
            <div class="item-list" role="list">
                ${historico.map((pedido, idx) => `
                    <div class="history-item" role="listitem" aria-label="Pedido ${idx + 1} de ${historico.length}">
                        <div class="history-header">
                            <span class="history-date" aria-label="Data: ${escapeHtml(pedido.data)}">📅 ${escapeHtml(pedido.data)}</span>
                            <span class="history-total" aria-label="Total: R$ ${formatarMoeda(pedido.total)}">R$ ${formatarMoeda(pedido.total)}</span>
                        </div>
                        <div class="history-items">
                            <strong>Itens:</strong><br>
                            <ul style="list-style: none; padding: 0; margin-top: 8px;">
                                ${pedido.itens.map(item => `<li>• ${item.quantidade}x ${escapeHtml(item.nome)}</li>`).join('')}
                            </ul>
                        </div>
                        ${pedido.cupom ? `<div style="margin-top: 10px; color: var(--gold); font-weight: 600;">🎟️ Cupom: ${escapeHtml(pedido.cupom)}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    elements.modalTitle.innerHTML = '<span class="modal-icon" aria-hidden="true">📜</span> Histórico de Pedidos';
    abrirModal('modalGenerico');
}

// CORRIGIDO: Função global
window.mostrarHistorico = mostrarHistorico;

// ==================== 🔔 NOTIFICAÇÕES ====================
function mostrarNotificacoes() {
    if (!elements.modalBody || !elements.modalTitle) return;

    if (notificacoes.length === 0) {
        elements.modalBody.innerHTML = `
            <div class="empty-state" role="status">
                <div class="empty-state-icon">🔔</div>
                <p>Nenhuma notificação no momento.</p>
            </div>
        `;
    } else {
        elements.modalBody.innerHTML = `
            <div class="item-list" role="list">
                ${notificacoes.map((notif, i) => `
                    <div class="item-card" 
                         style="${notif.lida ? 'opacity: 0.6;' : ''}"
                         role="listitem"
                         aria-label="${notif.lida ? 'Notificação lida' : 'Notificação não lida'}">
                        <div style="display: flex; justify-content: space-between; align-items: start; gap: 15px;">
                            <div style="flex: 1;">
                                <h4>${notif.lida ? '✓' : '🔔'} Notificação</h4>
                                <p>${escapeHtml(notif.mensagem)}</p>
                                <p style="font-size: 0.8rem; margin-top: 5px; opacity: 0.7;">
                                    ${notif.data instanceof Date ? notif.data.toLocaleString('pt-BR') : escapeHtml(String(notif.data))}
                                </p>
                            </div>
                            ${!notif.lida ? `
                                <button onclick="window.marcarComoLida(${i}); window.mostrarNotificacoes();" 
                                        style="background: none; border: none; color: #f28c00; cursor: pointer; font-size: 0.9rem; font-weight: 600; min-width: 44px; min-height: 44px;"
                                        type="button"
                                        aria-label="Marcar notificação como lida">
                                    Marcar como lida
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    elements.modalTitle.innerHTML = '<span class="modal-icon" aria-hidden="true">🔔</span> Notificações';
    abrirModal('modalGenerico');
}

// CORRIGIDO: Função global
window.mostrarNotificacoes = mostrarNotificacoes;

function marcarComoLida(index) {
    if (index >= 0 && index < notificacoes.length) {
        notificacoes[index].lida = true;
        salvarEstado();
        atualizarContadores();
    }
}

// CORRIGIDO: Função global
window.marcarComoLida = marcarComoLida;

// ==================== 🎁 PROMOÇÕES ====================
function mostrarPromocoes() {
    if (!elements.modalBody || !elements.modalTitle) return;

    const promocoes = produtos.filter(p => p.promo);

    if (promocoes.length === 0) {
        elements.modalBody.innerHTML = `
            <div class="empty-state" role="status">
                <div class="empty-state-icon">🎁</div>
                <p>Nenhuma promoção disponível no momento.<br>Fique de olho!</p>
            </div>
        `;
    } else {
        elements.modalBody.innerHTML = `
            <div class="item-list" role="list">
                ${promocoes.map(p => {
            const produtoIndex = produtos.indexOf(p);
            return `
                        <div class="item-card" role="listitem">
                            <h4>🔥 ${escapeHtml(p.nome)} ${escapeHtml(p.badge || '')}</h4>
                            <p>${escapeHtml(p.descricao)}</p>
                            <p style="color: #f28c00; font-weight: bold; margin-top: 10px; font-size: 1.3rem;">
                                R$ ${formatarMoeda(p.preco)}
                            </p>
                            <button class="btn" 
                                    onclick="window.adicionarAoCarrinho(${produtoIndex}); window.fecharModal('modalGenerico')" 
                                    style="margin-top: 10px; width: 100%;"
                                    type="button"
                                    aria-label="Adicionar ${escapeHtml(p.nome)} ao carrinho">
                                <span class="btn-icon" aria-hidden="true">🛒</span>
                                Adicionar ao Carrinho
                            </button>
                        </div>
                    `;
        }).join('')}
            </div>
        `;
    }

    elements.modalTitle.innerHTML = '<span class="modal-icon" aria-hidden="true">🎁</span> Promoções Especiais';
    abrirModal('modalGenerico');
}

// CORRIGIDO: Função global
window.mostrarPromocoes = mostrarPromocoes;

// ==================== 📋 DETALHES DO PRODUTO ====================
function mostrarDetalhes(produto) {
    const produtoIndex = produtos.indexOf(produto);

    const detalhesHTML = `
        <div style="text-align: center; padding: 20px;">
            <h3 style="color: var(--gold); margin-bottom: 15px; font-size: 1.8rem;">${escapeHtml(produto.nome)}</h3>
            <div style="margin-bottom: 15px;">
                <span style="color: var(--gold); font-size: 1.2rem;" aria-hidden="true">${gerarEstrelas(produto.rating)}</span>
                <span style="font-weight: bold; margin-left: 10px; color: rgba(255,255,255,0.9);" aria-label="Avaliação ${produto.rating} de 5 estrelas">${produto.rating}</span>
            </div>
            <p style="color: rgba(255,255,255,0.9); margin-bottom: 20px; line-height: 1.8;">${escapeHtml(produto.descricao)}</p>
            <div style="display: flex; justify-content: space-around; margin: 20px 0; flex-wrap: wrap; gap: 15px;">
                <div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Validade</div>
                    <div style="color: var(--white); font-weight: 600;" aria-label="Validade: ${escapeHtml(produto.validade)}">📅 ${escapeHtml(produto.validade)}</div>
                </div>
                <div>
                    <div style="color: rgba(255,255,255,0.7); font-size: 0.9rem;">Quantidade</div>
                    <div style="color: var(--white); font-weight: 600;" aria-label="Quantidade: ${produto.quantidade} unidades">📦 ${produto.quantidade} un</div>
                </div>
            </div>
            <div style="font-size: 2.2rem; color: var(--gold); font-weight: 900; margin: 20px 0; text-shadow: 0 2px 8px rgba(0,0,0,0.3);" aria-label="Preço: R$ ${formatarMoeda(produto.preco)}">
                R$ ${formatarMoeda(produto.preco)}
            </div>
            <button onclick="window.fecharModal('modalDetalhes'); window.adicionarAoCarrinho(${produtoIndex})" 
                    style="background: var(--white); color: var(--secondary); border: none; padding: 15px 30px; border-radius: 12px; font-size: 1.1rem; font-weight: bold; cursor: pointer; width: 100%; margin-top: 10px; transition: all 0.3s ease; box-shadow: 0 4px 15px rgba(255,255,255,0.3);"
                    type="button"
                    aria-label="Adicionar ${escapeHtml(produto.nome)} ao carrinho">
                <span aria-hidden="true">🛒</span>
                Adicionar ao Carrinho
            </button>
        </div>
    `;

    let modalDetalhes = document.getElementById('modalDetalhes');
    if (!modalDetalhes) {
        modalDetalhes = document.createElement('div');
        modalDetalhes.id = 'modalDetalhes';
        modalDetalhes.className = 'modal';
        modalDetalhes.setAttribute('role', 'dialog');
        modalDetalhes.setAttribute('aria-modal', 'true');
        modalDetalhes.setAttribute('aria-labelledby', 'modalDetalhesTitle');
        document.body.appendChild(modalDetalhes);
    }

    modalDetalhes.innerHTML = `
        <div class="modal-content" style="max-width: 500px;">
            <div class="modal-header">
                <h2 id="modalDetalhesTitle"><span class="modal-icon" aria-hidden="true">📋</span> Detalhes do Produto</h2>
                <button class="close-modal" onclick="window.fecharModal('modalDetalhes')" type="button" aria-label="Fechar">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            </div>
            ${detalhesHTML}
        </div>
    `;

    // Event listener para fechar ao clicar fora
    modalDetalhes.addEventListener('click', (e) => {
        if (e.target === modalDetalhes) {
            fecharModal('modalDetalhes');
        }
    });

    abrirModal('modalDetalhes');
}

// ==================== 🎭 MODAIS ====================
function abrirModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (modalId === 'modalCarrinho') {
        atualizarCarrinho();
    }

    // Foco no primeiro elemento focável
    setTimeout(() => {
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) firstFocusable.focus();
    }, 100);
}

function fecharModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    // Remover modal de detalhes do DOM
    if (modalId === 'modalDetalhes') {
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// CORRIGIDO: Função global
window.fecharModal = fecharModal;

// ==================== 📊 AÇÕES DA SIDEBAR ====================
function executarAcaoSidebar(action) {
    const acoes = {
        'promocoes': mostrarPromocoes,
        'favoritos': mostrarFavoritos,
        'historico': mostrarHistorico,
        'notificacoes': mostrarNotificacoes
    };

    if (acoes[action]) {
        acoes[action]();
    } else {
        mostrarNotificacao(`Abrindo ${action}... 🚀`);
    }
}

// ==================== 🔢 CONTADORES ====================
function atualizarContadores() {
    // Carrinho
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
    if (elements.carrinhoCount) {
        elements.carrinhoCount.textContent = totalItens;
        elements.carrinhoCount.style.display = totalItens > 0 ? 'flex' : 'none';
        elements.carrinhoCount.setAttribute('aria-label', `${totalItens} ${totalItens === 1 ? 'item' : 'itens'} no carrinho`);
    }

    // Favoritos
    if (elements.favCount) {
        elements.favCount.textContent = favoritos.length;
        elements.favCount.style.display = favoritos.length > 0 ? 'flex' : 'none';
        elements.favCount.setAttribute('aria-label', `${favoritos.length} ${favoritos.length === 1 ? 'favorito' : 'favoritos'}`);
    }

    // Notificações
    if (elements.notifCount) {
        const naoLidas = notificacoes.filter(n => !n.lida).length;
        elements.notifCount.textContent = naoLidas;
        elements.notifCount.style.display = naoLidas > 0 ? 'flex' : 'none';
        elements.notifCount.setAttribute('aria-label', `${naoLidas} ${naoLidas === 1 ? 'notificação não lida' : 'notificações não lidas'}`);
    }
}

// ==================== 🔔 NOTIFICAÇÃO TOAST ====================
function mostrarNotificacao(mensagem, tipo = 'sucesso') {
    if (!elements.notification) return;

    elements.notification.textContent = mensagem;
    elements.notification.className = 'notification show';

    if (tipo === 'erro' || tipo === 'error') {
        elements.notification.classList.add('error');
    }

    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

// ==================== 🌙 DARK MODE ====================
function inicializarDarkMode() {
    const savedTheme = localStorage.getItem('vd_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);

    if (elements.themeToggle) {
        const icon = elements.themeToggle.querySelector('i');
        if (icon) {
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }

        elements.themeToggle.addEventListener('click', toggleDarkMode);
    }
}

function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('vd_theme', newTheme);

    const icon = elements.themeToggle?.querySelector('i');
    if (icon) {
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    mostrarNotificacao(`Tema ${newTheme === 'dark' ? 'escuro' : 'claro'} ativado ${newTheme === 'dark' ? '🌙' : '☀️'}`);
}

// ==================== 🍪 COOKIE CONSENT ====================
function verificarCookieConsent() {
    const cookieConsent = document.getElementById('cookieConsent');
    if (!cookieConsent) return;

    const accepted = localStorage.getItem('vd_cookies_accepted');
    if (accepted === null) {
        cookieConsent.style.display = 'block';
    }
}

// ==================== 🎬 ANIMAÇÕES ====================
function aplicarAnimacoesIniciais() {
    // Observador de interseção para animações ao scroll
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: 0.1
        });

        // Observar cards quando criados
        setTimeout(() => {
            document.querySelectorAll('.card').forEach(card => {
                observer.observe(card);
            });
        }, 100);
    } else {
        // Fallback para navegadores sem IntersectionObserver
        aplicarAnimacoesCards();
    }
}

function aplicarAnimacoesCards() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'all 0.45s cubic-bezier(.2,.8,.2,1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 40);
    });
}

// ==================== 🛡️ UTILIDADES ====================
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

function formatarMoeda(valor) {
    return Number(valor).toFixed(2).replace('.', ',');
}

function validarValidade(dataStr) {
    if (!dataStr || !dataStr.includes('/')) return true;

    try {
        const [d, m, y] = dataStr.split('/').map(Number);
        if (!d || !m || !y) return true;

        const dataValidade = new Date(y, m - 1, d);
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return dataValidade >= hoje;
    } catch {
        return true;
    }
}

function gerarEstrelas(rating) {
    const completas = Math.floor(rating);
    const meia = rating % 1 >= 0.5;
    const vazias = 5 - completas - (meia ? 1 : 0);

    return '⭐'.repeat(completas) + (meia ? '✨' : '') + '☆'.repeat(Math.max(0, vazias));
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall < delay) return;
        lastCall = now;
        return func(...args);
    };
}

// ==================== 🎉 FIM ====================
console.log('%c✨ ValidaDelivery JS v3.0 - Bugs corrigidos!', 'color: #6ea56f; font-weight: bold;');
console.log('%c📋 Melhorias:', 'color: #f28c00; font-weight: bold;');
console.log('  ✅ Funções globais exportadas corretamente');
console.log('  ✅ Event listeners do formulário de cupom corrigidos');
console.log('  ✅ Acessibilidade aprimorada (ARIA labels)');
console.log('  ✅ Validações de índices adicionadas');
console.log('  ✅ Performance otimizada');