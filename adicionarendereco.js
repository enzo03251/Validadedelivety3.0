    // Máscara de CEP
            document.getElementById('cep').addEventListener('input', function(e) {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length <= 8) {
                    value = value.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
                }
                e.target.value = value;
            });

            // Buscar CEP na API ViaCEP
            document.getElementById('searchCep').addEventListener('click', async function() {
                const cep = document.getElementById('cep').value.replace(/\D/g, '');
                
                if (cep.length !== 8) {
                    alert('⚠️ Por favor, digite um CEP válido com 8 dígitos.');
                    return;
                }

                // Mostrar loading
                this.textContent = '🔄 Buscando...';
                this.disabled = true;

                try {
                    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                    const data = await response.json();

                    if (data.erro) {
                        alert('❌ CEP não encontrado. Verifique e tente novamente.');
                    } else {
                        // Preencher campos
                        document.getElementById('logradouro').value = data.logradouro || '';
                        document.getElementById('bairro').value = data.bairro || '';
                        document.getElementById('cidade').value = data.localidade || '';
                        document.getElementById('estado').value = data.uf || '';
                        
                        // Focar no campo número
                        document.getElementById('numero').focus();
                        
                        alert('✅ Endereço encontrado!');
                    }
                } catch (error) {
                    alert('❌ Erro ao buscar CEP. Tente novamente.');
                } finally {
                    this.textContent = '🔍 Buscar';
                    this.disabled = false;
                }
            });

            // Buscar ao pressionar Enter no campo CEP
            document.getElementById('cep').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    document.getElementById('searchCep').click();
                }
            });

            // Submit do formulário
            document.getElementById('addAddressForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Validar campos obrigatórios
                const requiredFields = ['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'];
                let isValid = true;

                requiredFields.forEach(field => {
                    const input = document.getElementById(field);
                    if (!input.value.trim()) {
                        input.style.borderColor = '#E74C3C';
                        isValid = false;
                    } else {
                        input.style.borderColor = '#ECF0F1';
                    }
                });

                if (!isValid) {
                    alert('⚠️ Por favor, preencha todos os campos obrigatórios.');
                    return;
                }

                // Coletar dados
                const addressData = {
                    cep: document.getElementById('cep').value,
                    logradouro: document.getElementById('logradouro').value,
                    numero: document.getElementById('numero').value,
                    complemento: document.getElementById('complemento').value,
                    bairro: document.getElementById('bairro').value,
                    cidade: document.getElementById('cidade').value,
                    estado: document.getElementById('estado').value,
                    pontoReferencia: document.getElementById('pontoReferencia').value,
                    principal: document.getElementById('enderecoPrincipal').checked
                };

                console.log('Endereço salvo:', addressData);

                // Mostrar mensagem de sucesso
                const successMsg = document.getElementById('successMessage');
                successMsg.classList.add('show');
                
                // Scroll para o topo
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = 'perfil.html';
                }, 2000);
            });