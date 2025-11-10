// ==================== CARREGAR DADOS SALVOS ====================
function loadSavedData() {
    const savedData = JSON.parse(localStorage.getItem('profileData') || '{}');
    
    if (Object.keys(savedData).length > 0) {
        // Carregar dados nos campos
        if (savedData.nomeCompleto) document.getElementById('nomeCompleto').value = savedData.nomeCompleto;
        if (savedData.email) document.getElementById('email').value = savedData.email;
        if (savedData.telefone) document.getElementById('telefone').value = savedData.telefone;
        if (savedData.cpf) document.getElementById('cpf').value = savedData.cpf;
        if (savedData.dataNascimento) document.getElementById('dataNascimento').value = savedData.dataNascimento;
        if (savedData.endereco) document.getElementById('endereco').value = savedData.endereco;
        if (savedData.bairro) document.getElementById('bairro').value = savedData.bairro;
        if (savedData.cidade) document.getElementById('cidade').value = savedData.cidade;
        if (savedData.estado) document.getElementById('estado').value = savedData.estado;
        if (savedData.cep) document.getElementById('cep').value = savedData.cep;
        
        // Carregar avatar
        if (savedData.avatarImage) {
            const avatarPreview = document.getElementById('avatarPreview');
            const avatarImage = document.getElementById('avatarImage');
            avatarImage.src = savedData.avatarImage;
            avatarPreview.classList.add('has-image');
            avatarPreview.textContent = '';
            avatarPreview.appendChild(avatarImage);
        } else {
            updateAvatar();
        }
        
        console.log('✅ Dados carregados do perfil!');
    }
}

// Carregar dados ao iniciar a página
window.addEventListener('load', loadSavedData);

// ==================== UPLOAD DE FOTO ====================
// Quando clicar no botão "Alterar Foto", abre o explorador de arquivos
document.getElementById('changeAvatarBtn').addEventListener('click', function() {
    document.getElementById('avatarInput').click();
});

// Upload de foto do avatar
document.getElementById('avatarInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            const avatarPreview = document.getElementById('avatarPreview');
            const avatarImage = document.getElementById('avatarImage');
            
            avatarImage.src = event.target.result;
            avatarPreview.classList.add('has-image');
            avatarPreview.textContent = '';
            avatarPreview.appendChild(avatarImage);
        };
        
        reader.readAsDataURL(file);
    }
});

// ==================== ATUALIZAR AVATAR COM INICIAIS ====================
function updateAvatar() {
    const avatarPreview = document.getElementById('avatarPreview');
    
    // Só atualiza se não tiver imagem
    if (!avatarPreview.classList.contains('has-image')) {
        const nome = document.getElementById('nomeCompleto').value;
        if (nome) {
            const iniciais = nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
            avatarPreview.textContent = iniciais;
        }
    }
}

document.getElementById('nomeCompleto').addEventListener('input', updateAvatar);

// ==================== MÁSCARAS DE INPUT ====================
document.getElementById('telefone').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    }
    e.target.value = value;
});

document.getElementById('cpf').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 11) {
        value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4');
    }
    e.target.value = value;
});

document.getElementById('cep').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 8) {
        value = value.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
    }
    e.target.value = value;
});

// ==================== VALIDAÇÃO DO FORMULÁRIO ====================
function validateForm() {
    const nomeCompleto = document.getElementById('nomeCompleto').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    
    if (!nomeCompleto) {
        alert('Por favor, preencha o nome completo!');
        return false;
    }
    
    if (!email || !email.includes('@')) {
        alert('Por favor, insira um e-mail válido!');
        return false;
    }
    
    if (!telefone || telefone.length < 14) {
        alert('Por favor, insira um telefone válido!');
        return false;
    }
    
    return true;
}

// ==================== SUBMIT DO FORMULÁRIO ====================
document.getElementById('editProfileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validar formulário
    if (!validateForm()) {
        return;
    }
    
    // Obter imagem do avatar se houver
    const avatarImage = document.getElementById('avatarImage');
    const avatarSrc = avatarImage.src || null;
    
    // Preparar dados para salvar
    const formData = {
        nomeCompleto: document.getElementById('nomeCompleto').value,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value,
        cpf: document.getElementById('cpf').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        endereco: document.getElementById('endereco').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        estado: document.getElementById('estado').value,
        cep: document.getElementById('cep').value,
        avatarImage: avatarSrc
    };
    
    // Salvar no localStorage
    localStorage.setItem('profileData', JSON.stringify(formData));
    
    console.log('✅ Dados salvos:', formData);
    
    // Mostrar mensagem de sucesso
    const successMsg = document.getElementById('successMessage');
    successMsg.classList.add('show');
    
    // Scroll para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Esconder mensagem após 3 segundos e redirecionar
    setTimeout(() => {
        successMsg.classList.remove('show');
        // Redirecionar para a página de perfil
        window.location.href = 'perfil.html';
    }, 2000);
});

// ==================== BUSCAR CEP AUTOMATICAMENTE ====================
document.getElementById('cep').addEventListener('blur', function() {
    const cep = this.value.replace(/\D/g, '');
    
    if (cep.length === 8) {
        // Integração com API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (!data.erro) {
                    document.getElementById('endereco').value = data.logradouro || '';
                    document.getElementById('bairro').value = data.bairro || '';
                    document.getElementById('cidade').value = data.localidade || '';
                    document.getElementById('estado').value = data.uf || 'MG';
                    console.log('✅ CEP encontrado:', data);
                } else {
                    console.log('❌ CEP não encontrado');
                }
            })
            .catch(error => {
                console.log('❌ Erro ao buscar CEP:', error);
            });
    }
});

// ==================== CONFIRMAÇÃO ANTES DE CANCELAR ====================
document.querySelector('.btn-cancel').addEventListener('click', function(e) {
    e.preventDefault();
    
    const confirmCancel = confirm('Tem certeza que deseja cancelar? Todas as alterações não salvas serão perdidas.');
    
    if (confirmCancel) {
        window.location.href = 'perfil.html';
    }
});

console.log('✅ EditarPerfil.js carregado com sucesso!');