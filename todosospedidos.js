// ==================== DADOS DOS PEDIDOS ====================
const pedidosData = [
    {
        id: 1248,
        restaurante: { nome: 'Baus Food - Saudável', endereco: 'Av. Anselmo Alves dos Santos, 789 - Uberlândia/MG', logo: '🥗' },
        data: '2025-11-15',
        hora: '20:00',
        status: 'em-andamento',
        itens: [
            { quantidade: 1, nome: 'Salada completa com alface e molho especial', preco: 15.00 }
        ],
        ecopontos: 20,
        total: 15.00
    },
    {
        id: 1247,
        restaurante: { nome: 'Pizzaria Bella Massa', endereco: 'Rua Machado de Assis, 123 - Centro - Uberlândia/MG', logo: '🍕' },
        data: '2025-11-14',
        hora: '19:00',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Pizza de Calabresa Grande', preco: 25.00 },
            { quantidade: 1, nome: 'Refrigerante 2L', preco: 5.50 }
        ],
        ecopontos: 40,
        total: 30.50
    },
    {
        id: 1246,
        restaurante: { nome: 'Burger House Premium', endereco: 'Av. Rondon Pacheco, 456 - Tibery - Uberlândia/MG', logo: '🍔' },
        data: '2025-11-15',
        hora: '20:00',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Hambúrguer Artesanal', preco: 20.00 },
        ],
        ecopontos: 30,
        total: 20.00
    },
    {
        id: 1245,
        restaurante: { nome: 'Café Pão de Queijo & CIA', endereco: 'R. Duque de Caxias, 451 - Uberlândia/MG', logo: '🥖' },
        data: '2025-11-14',
        hora: '19:00',
        status: 'entregue',
        itens: [
            { quantidade: 12, nome: 'Pão de Queijo Especial', preco: 10.00 },
        ],
        ecopontos: 15,
        total: 10.00
    },
    {
        id: 1244,
        restaurante: { nome: 'Tuti Cozinha Vegetal', endereco: 'R. Nordau Gonçalves de Melo, 1591 - Uberlândia/MG', logo: '🍜' },
        data: '2025-11-15',
        hora: '20:00',
        status: 'cancelado',
        itens: [
            { quantidade: 1, nome: 'Macarrão Vegano', preco: 15.00 }
        ],
        ecopontos: 20,
        total: 15.00
    },
    {
        id: 1243,
        restaurante: { nome: 'Sublime Brigaderia', endereco: 'Av Seme Simão, 1660 - Uberlândia/MG', logo: '🧁' },
        data: '2025-11-14',
        hora: '20:00',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Brigadeiro de Chocolate', preco: 3.00 }
        ],
        ecopontos: 5,
        total: 3.00
    },
    {
        id: 1242,
        restaurante: { nome: 'Fava Doceria', endereco: 'Av Rondon Pacheco, 3393 - Uberlândia/MG', logo: '🎂' },
        data: '2025-11-15',
        hora: '19:45',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Bolo de Chocolate', preco: 25.00 }
        ],
        ecopontos: 25,
        total: 25.00
    },
    {
        id: 1241,
        restaurante: { nome: 'Cajubá Country Club', endereco: 'Av. Antonio Marques Póvoa Júnior, 35 - Uberlândia/MG', logo: '🍭' },
        data: '2025-11-15',
        hora: '19:30',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Pão de forma', preco: 4.00 }
        ],
        ecopontos: 8,
        total: 4.00
    },
    {
        id: 1240,
        restaurante: { nome: 'Lanchonete do Bairro', endereco: 'Rua Duque de Caxias, 100 - Cazeca - Uberlândia/MG', logo: '🥪' },
        data: '2025-11-14',
        hora: '20:00',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'X-Tudo', preco: 15.00 },
            { quantidade: 1, nome: 'Suco Natural 300 ml', preco: 4.00 }
        ],
        ecopontos: 18,
        total: 19.00
    },
    {
        id: 1239,
        restaurante: { nome: 'Cacau Show', endereco: 'Av. Afonso Pena, 574 - Centro - Uberlândia/MG', logo: '🥮' },
        data: '2025-11-14',
        hora: '19:00',
        status: 'entregue',
        itens: [
            { quantidade: 1, nome: 'Panetone', preco: 25.00 }
        ],
        ecopontos: 30,
        total: 25.00
    }
];

// ==================== VARIÁVEIS GLOBAIS ====================
let pedidosFiltrados = [...pedidosData];
let pedidosVisiveis = [...pedidosData];

// Variáveis para controle de estatísticas acumuladas
let pedidosRealizados = [];
let valorTotalGasto = 0;
let ecopontosTotalGanhos = 0;

// ==================== FUNÇÕES DE RENDERIZAÇÃO ====================

// Renderizar um pedido
function renderizarPedido(pedido) {
    const statusClass = pedido.status;
    const statusTexto = {
        'entregue': 'Entregue',
        'em-andamento': 'Em andamento',
        'cancelado': 'Cancelado'
    }[pedido.status];

    const itensHTML = pedido.itens.map(item => `
        <div class="item">
            <span class="item-qty">${item.quantidade}x</span>
            <span class="item-name">${item.nome}</span>
            <span class="item-price">R$ ${item.preco.toFixed(2)}</span>
        </div>
    `).join('');

    const ecoInfoHTML = pedido.status === 'cancelado' 
        ? `<div class="eco-info" style="opacity: 0.5;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#95A5A6">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            <span>Pedido cancelado</span>
        </div>`
        : `<div class="eco-info">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#52A194">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>+${pedido.ecopontos} Ecopontos${pedido.status === 'em-andamento' ? ' (pendente)' : ''}</span>
        </div>`;

    const acoesHTML = pedido.status === 'em-andamento'
        ? `<button class="action-btn secondary" onclick="rastrearPedido(${pedido.id})">Rastrear Pedido</button>
           <button class="action-btn danger" onclick="cancelarPedido(${pedido.id})">Cancelar</button>`
        : pedido.status === 'cancelado'
        ? `<button class="action-btn secondary" onclick="verMotivoCancelamento(${pedido.id})">Ver Motivo</button>
           <button class="action-btn primary" onclick="pedirNovamente(${pedido.id})">Pedir Novamente</button>`
        : `<button class="action-btn secondary" onclick="verDetalhes(${pedido.id})">Ver Detalhes</button>
           <button class="action-btn primary" onclick="pedirNovamente(${pedido.id})">Pedir Novamente</button>`;

    return `
        <div class="order-card" data-id="${pedido.id}" data-status="${pedido.status}" data-date="${pedido.data}">
            <div class="order-header">
                <div class="order-number">
                    <span class="order-id">#${pedido.id}</span>
                    <span class="order-date">${formatarData(pedido.data)} - ${pedido.hora}</span>
                </div>
                <span class="status-badge ${statusClass}">${statusTexto}</span>
            </div>
            
            <div class="order-body">
                <div class="restaurant-info">
                    <div class="restaurant-logo">${pedido.restaurante.logo}</div>
                    <div class="restaurant-details">
                        <h3>${pedido.restaurante.nome}</h3>
                        <p>${pedido.restaurante.endereco}</p>
                    </div>
                </div>

                <div class="order-items">
                    ${itensHTML}
                </div>

                <div class="order-footer">
                    ${ecoInfoHTML}
                    <div class="order-total">
                        <span>Total:</span>
                        <strong>R$ ${pedido.total.toFixed(2)}</strong>
                    </div>
                </div>
            </div>

            <div class="order-actions">
                ${acoesHTML}
            </div>
        </div>
    `;
}

// Renderizar todos os pedidos
function renderizarPedidos() {
    const container = document.querySelector('.orders-container');
    const noOrders = document.querySelector('.no-orders');
    
    if (pedidosVisiveis.length === 0) {
        container.style.display = 'none';
        noOrders.style.display = 'block';
    } else {
        container.style.display = 'flex';
        noOrders.style.display = 'none';
        container.innerHTML = pedidosVisiveis.map(pedido => renderizarPedido(pedido)).join('');
        
        // Animação de entrada
        animarCards();
    }
}

// Animação dos cards
function animarCards() {
    const cards = document.querySelectorAll('.order-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Formatar data
function formatarData(dataStr) {
    const data = new Date(dataStr + 'T00:00:00');
    return data.toLocaleDateString('pt-BR');
}

// ==================== FUNÇÕES DE FILTRO ====================

// Filtrar por período
function filtrarPorPeriodo(periodo) {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    
    switch(periodo) {
        case 'hoje':
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido.getTime() === hoje.getTime();
            });
        case 'semana':
            const semanaAtras = new Date(hoje);
            semanaAtras.setDate(hoje.getDate() - 7);
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido >= semanaAtras;
            });
        case 'mes':
            const mesAtras = new Date(hoje);
            mesAtras.setMonth(hoje.getMonth() - 1);
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido >= mesAtras;
            });
        case 'ano':
            const anoAtras = new Date(hoje);
            anoAtras.setFullYear(hoje.getFullYear() - 1);
            return pedidosFiltrados.filter(p => {
                const dataPedido = new Date(p.data + 'T00:00:00');
                return dataPedido >= anoAtras;
            });
        default:
            return pedidosFiltrados;
    }
}

// Filtrar por status
function filtrarPorStatus(status) {
    if (status === 'todos') {
        return pedidosFiltrados;
    }
    return pedidosFiltrados.filter(p => p.status === status);
}

// Buscar pedidos
function buscarPedidos(termo) {
    if (!termo) return pedidosVisiveis;
    
    const termoLower = termo.toLowerCase();
    return pedidosVisiveis.filter(p => {
        return p.restaurante.nome.toLowerCase().includes(termoLower) ||
               p.itens.some(item => item.nome.toLowerCase().includes(termoLower)) ||
               p.id.toString().includes(termo);
    });
}

// Aplicar todos os filtros
function aplicarFiltros() {
    const periodoSelect = document.getElementById('periodo-filter');
    const statusSelect = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    
    const periodo = periodoSelect.value;
    const status = statusSelect.value;
    const termoBusca = searchInput.value.trim();
    
    // Primeiro filtra por status
    pedidosFiltrados = status === 'todos' 
        ? [...pedidosData]
        : pedidosData.filter(p => p.status === status);
    
    // Depois filtra por período
    pedidosVisiveis = filtrarPorPeriodo(periodo);
    
    // Por último aplica a busca
    if (termoBusca) {
        pedidosVisiveis = buscarPedidos(termoBusca);
    }
    
    // Renderiza os pedidos
    renderizarPedidos();
}

// Atualizar estatísticas
function atualizarEstatisticas() {
    const totalPedidos = pedidosRealizados.length;
    
    // Atualizar no DOM
    document.getElementById('total-pedidos').textContent = totalPedidos;
    document.getElementById('valor-total').textContent = `R$ ${valorTotalGasto.toFixed(2)}`;
    document.getElementById('ecopontos-total').textContent = ecopontosTotalGanhos >= 1000 
        ? `${(ecopontosTotalGanhos / 1000).toFixed(1)}k` 
        : ecopontosTotalGanhos;
}

// ==================== AÇÕES DOS PEDIDOS ====================

// Ver detalhes do pedido
function verDetalhes(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    const itensTexto = pedido.itens
        .map(i => `${i.quantidade}x ${i.nome} - R$ ${i.preco.toFixed(2)}`)
        .join('\n');
    
    alert(`📦 DETALHES DO PEDIDO #${pedido.id}\n\n` +
          `🏪 ${pedido.restaurante.nome}\n` +
          `📍 ${pedido.restaurante.endereco}\n\n` +
          `📅 Data: ${formatarData(pedido.data)} às ${pedido.hora}\n` +
          `📊 Status: ${pedido.status}\n\n` +
          `🛒 ITENS:\n${itensTexto}\n\n` +
          `💰 Total: R$ ${pedido.total.toFixed(2)}\n` +
          `🌱 Ecopontos: +${pedido.ecopontos}`);
}

// Pedir novamente
function pedirNovamente(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    const confirma = confirm(`🔄 REPETIR PEDIDO\n\n` +
                           `Deseja fazer o mesmo pedido de ${pedido.restaurante.nome}?\n\n` +
                           `Total: R$ ${pedido.total.toFixed(2)}\n` +
                           `Ecopontos: +${pedido.ecopontos}`);
    
    if (confirma) {
        // Animação de feedback
        const card = document.querySelector(`[data-id="${idPedido}"]`);
        if (card) {
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
            }, 200);
        }
        
        // Adiciona aos pedidos realizados
        pedidosRealizados.push({
            ...pedido,
            id: Date.now(), // Novo ID único
            data: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        });
        
        // Atualiza os totais
        valorTotalGasto += pedido.total;
        ecopontosTotalGanhos += pedido.ecopontos;
        
        // Atualiza as estatísticas na tela
        atualizarEstatisticas();
        
        setTimeout(() => {
            alert(`✅ Pedido realizado com sucesso!\n\n` +
                  `📦 Pedido #${pedidosRealizados[pedidosRealizados.length - 1].id}\n` +
                  `💰 Valor: R$ ${pedido.total.toFixed(2)}\n` +
                  `🌱 Ecopontos ganhos: +${pedido.ecopontos}\n\n` +
                  `📊 Totais atualizados:\n` +
                  `Pedidos realizados: ${pedidosRealizados.length}\n` +
                  `Valor total gasto: R$ ${valorTotalGasto.toFixed(2)}\n` +
                  `Ecopontos totais: ${ecopontosTotalGanhos}`);
            
            console.log('✅ Pedido realizado:', pedidosRealizados[pedidosRealizados.length - 1]);
            console.log('📊 Estatísticas atualizadas:', {
                totalPedidos: pedidosRealizados.length,
                valorTotal: valorTotalGasto,
                ecopontos: ecopontosTotalGanhos
            });
        }, 500);
    }
}

// Rastrear pedido
function rastrearPedido(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    alert(`🚚 RASTREAMENTO DO PEDIDO #${pedido.id}\n\n` +
          `Status: Pedido confirmado\n` +
          `🏪 Restaurante preparando seu pedido\n` +
          `⏱️ Tempo estimado: 35-45 minutos\n\n` +
          `📍 ${pedido.restaurante.nome}\n` +
          `${pedido.restaurante.endereco}`);
}

// Cancelar pedido
function cancelarPedido(idPedido) {
    const pedido = pedidosData.find(p => p.id === idPedido);
    if (!pedido) return;
    
    const confirma = confirm(`❌ CANCELAR PEDIDO #${pedido.id}\n\n` +
                           `Tem certeza que deseja cancelar?\n\n` +
                           `⚠️ Esta ação não pode ser desfeita.`);
    
    if (confirma) {
        // Atualiza o status no array
        const index = pedidosData.findIndex(p => p.id === idPedido);
        if (index !== -1) {
            pedidosData[index].status = 'cancelado';
            pedidosData[index].ecopontos = 0;
            
            // Reaplica os filtros e renderiza
            aplicarFiltros();
            
            alert('✅ Pedido cancelado com sucesso!\n\n' +
                  'O valor será estornado em até 48 horas.');
        }
    }
}

// Ver motivo do cancelamento
function verMotivoCancelamento(idPedido) {
    alert(`❌ PEDIDO CANCELADO #${idPedido}\n\n` +
          `Motivo: Cancelado pelo usuário\n` +
          `Data: ${formatarData('2025-10-15')} às 21:15\n\n` +
          `O valor de R$ 42,00 foi estornado.`);
}

// ==================== EVENT LISTENERS ====================

// Filtros
document.getElementById('periodo-filter').addEventListener('change', aplicarFiltros);
document.getElementById('status-filter').addEventListener('change', aplicarFiltros);

// Busca com debounce
let timeoutBusca;
document.getElementById('search-input').addEventListener('input', (e) => {
    clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(() => {
        aplicarFiltros();
    }, 300);
});

// Limpar busca ao pressionar ESC
document.getElementById('search-input').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        e.target.value = '';
        aplicarFiltros();
    }
});

// Atalhos de teclado
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + F para focar na busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        document.getElementById('search-input').focus();
    }
});

// ==================== INICIALIZAÇÃO ====================

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Sistema de Pedidos Carregado!');
    console.log(`📦 ${pedidosData.length} pedidos no histórico`);
    
    // Renderiza os pedidos iniciais
    renderizarPedidos();
    
    // Atualiza estatísticas com valores zerados
    atualizarEstatisticas();
    
    // Mensagem de boas-vindas
    setTimeout(() => {
        console.log('💡 Dica: Use Ctrl+F para buscar pedidos rapidamente!');
        console.log('🎯 Os valores estão zerados. Clique em "Pedir Novamente" para começar!');
    }, 2000);
});

// ==================== FUNÇÕES AUXILIARES ====================

// Exportar histórico (futuro)
function exportarHistorico() {
    const dados = JSON.stringify(pedidosVisiveis, null, 2);
    console.log('Histórico exportado:', dados);
    alert('📊 Funcionalidade de exportação em desenvolvimento!');
}

// Calcular estatísticas detalhadas
function calcularEstatisticas() {
    const stats = {
        totalPedidos: pedidosRealizados.length,
        valorTotal: valorTotalGasto,
        ecopontosTotal: ecopontosTotalGanhos,
        ticketMedio: pedidosRealizados.length > 0 ? valorTotalGasto / pedidosRealizados.length : 0,
        restauranteFavorito: encontrarRestauranteFavorito()
    };
    
    return stats;
}

// Encontrar restaurante favorito
function encontrarRestauranteFavorito() {
    if (pedidosRealizados.length === 0) {
        return { nome: 'Nenhum', pedidos: 0 };
    }
    
    const contagem = {};
    pedidosRealizados.forEach(p => {
        const nome = p.restaurante.nome;
        contagem[nome] = (contagem[nome] || 0) + 1;
    });
    
    let maxPedidos = 0;
    let favorito = '';
    
    for (const [nome, count] of Object.entries(contagem)) {
        if (count > maxPedidos) {
            maxPedidos = count;
            favorito = nome;
        }
    }
    
    return { nome: favorito, pedidos: maxPedidos };
}

// Log de estatísticas no console
setInterval(() => {
    if (pedidosRealizados.length > 0) {
        console.log('📊 Estatísticas Atualizadas:', calcularEstatisticas());
    }
}, 30000); // A cada 30 segundos