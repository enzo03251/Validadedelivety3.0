/* ==================== CONFIGURAÇÃO ==================== */
const CONFIG = {
  API_URL: '/api/auth', // Substitua pela URL real da sua API
  MIN_PASSWORD_LENGTH: 6,
  MAX_LOGIN_ATTEMPTS: 3,
  LOCKOUT_DURATION: 300000, // 5 minutos em milissegundos
  NOTIFICATION_DURATION: 3000,
  REDIRECT_DELAY: 1200,
  DEBOUNCE_DELAY: 300
};

/* ==================== ESTADO GLOBAL ==================== */
const state = {
  loginAttempts: 0,
  lockedUntil: 0,
  isLoading: false,
  passwordVisible: false,
  lockoutTimer: null
};

/* ==================== UTILITÁRIOS GERAIS ==================== */

/**
 * Debounce - Evita execuções múltiplas de uma função
 */
function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * Sanitiza string para prevenir XSS básico
 */
function sanitizeString(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/**
 * Formata tempo restante em minutos:segundos
 */
function formatTimeRemaining(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

/* ==================== SISTEMA DE NOTIFICAÇÕES ==================== */

/**
 * Exibe notificação toast
 * @param {string} message - Mensagem a exibir
 * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
 * @param {number} duration - Duração em ms
 */
function showNotification(message, type = 'info', duration = CONFIG.NOTIFICATION_DURATION) {
  const container = document.getElementById('notification-container');
  
  if (!container) {
    console.error('Container de notificações não encontrado');
    return;
  }

  // Criar elemento de notificação
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = sanitizeString(message);
  notification.setAttribute('role', 'alert');
  
  // Adicionar ao container
  container.appendChild(notification);
  
  // Trigger animação de entrada
  requestAnimationFrame(() => {
    notification.classList.add('show');
  });
  
  // Remover após duração
  const removeTimer = setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        container.removeChild(notification);
      }
    }, 400);
  }, duration);
  
  // Permitir fechar clicando
  notification.addEventListener('click', () => {
    clearTimeout(removeTimer);
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        container.removeChild(notification);
      }
    }, 400);
  });
}

/* ==================== VALIDAÇÕES ==================== */

/**
 * Valida formato de email
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida força e requisitos da senha
 * @param {string} password
 * @returns {Object} { score, isValid, label, feedback }
 */
function validatePassword(password) {
  const minLength = password.length >= CONFIG.MIN_PASSWORD_LENGTH;
  const hasNumber = /\d/.test(password);
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  // Calcular score (0-5)
  let score = 0;
  if (minLength) score++;
  if (hasNumber) score++;
  if (hasLetter) score++;
  if (hasUpperCase && hasLowerCase) score++;
  if (hasSpecial) score++;
  
  // Determinar label
  let label = 'Muito Fraca';
  if (score === 2) label = 'Fraca';
  else if (score === 3) label = 'Média';
  else if (score === 4) label = 'Forte';
  else if (score === 5) label = 'Muito Forte';
  
  // Senha é válida se tem: mínimo 6 caracteres + letras + números
  const isValid = minLength && hasNumber && hasLetter;
  
  // Feedback específico
  const feedback = [];
  if (!minLength) feedback.push('Mínimo 6 caracteres');
  if (!hasLetter) feedback.push('Adicione letras');
  if (!hasNumber) feedback.push('Adicione números');
  if (!hasSpecial && score < 4) feedback.push('Adicione símbolos para melhorar');
  
  return {
    score,
    isValid,
    label,
    feedback: feedback.join(' • '),
    details: {
      minLength,
      hasNumber,
      hasLetter,
      hasUpperCase,
      hasLowerCase,
      hasSpecial
    }
  };
}

/* ==================== RATE LIMITING ==================== */

/**
 * Verifica se o usuário está bloqueado por rate limiting
 * @returns {boolean}
 */
function checkRateLimit() {
  const now = Date.now();
  
  // Verificar se está bloqueado
  if (state.lockedUntil > now) {
    const remaining = state.lockedUntil - now;
    showNotification(
      `Muitas tentativas incorretas. Aguarde ${formatTimeRemaining(remaining)}`,
      'error',
      4000
    );
    return false;
  }
  
  // Reset se o tempo de bloqueio passou
  if (state.lockedUntil > 0 && state.lockedUntil <= now) {
    resetAttempts();
  }
  
  return true;
}

/**
 * Incrementa contador de tentativas
 */
function incrementAttempts() {
  state.loginAttempts++;
  safeLocalStorage('loginAttempts', state.loginAttempts.toString());
  
  const remaining = CONFIG.MAX_LOGIN_ATTEMPTS - state.loginAttempts;
  
  if (remaining > 0) {
    showNotification(
      `Tentativa ${state.loginAttempts}/${CONFIG.MAX_LOGIN_ATTEMPTS}. ${remaining} restante(s)`,
      'warning',
      3000
    );
  }
  
  // Bloquear se excedeu o limite
  if (state.loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
    state.lockedUntil = Date.now() + CONFIG.LOCKOUT_DURATION;
    safeLocalStorage('lockedUntil', state.lockedUntil.toString());
    
    showNotification(
      `Conta bloqueada por ${CONFIG.LOCKOUT_DURATION / 60000} minutos após ${CONFIG.MAX_LOGIN_ATTEMPTS} tentativas incorretas`,
      'error',
      6000
    );
    
    // Iniciar timer visual
    startLockoutTimer();
  }
}

/**
 * Reseta contador de tentativas
 */
function resetAttempts() {
  state.loginAttempts = 0;
  state.lockedUntil = 0;
  safeLocalStorage('loginAttempts', null);
  safeLocalStorage('lockedUntil', null);
}

/**
 * Inicia timer visual durante o bloqueio
 */
function startLockoutTimer() {
  const submitBtn = document.querySelector('.login-btn');
  if (!submitBtn) return;
  
  // Limpar timer anterior se existir
  if (state.lockoutTimer) {
    clearInterval(state.lockoutTimer);
  }
  
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  
  state.lockoutTimer = setInterval(() => {
    const now = Date.now();
    if (state.lockedUntil <= now) {
      clearInterval(state.lockoutTimer);
      state.lockoutTimer = null;
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      resetAttempts();
      showNotification('Bloqueio removido. Você pode tentar novamente', 'info');
    } else {
      const remaining = state.lockedUntil - now;
      submitBtn.textContent = `Bloqueado: ${formatTimeRemaining(remaining)}`;
    }
  }, 1000);
}

/* ==================== LOCALSTORAGE SEGURO ==================== */

/**
 * Salva no localStorage com tratamento de erro
 * @param {string} key
 * @param {string|null} value
 * @returns {boolean}
 */
function safeLocalStorage(key, value) {
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, value);
    }
    return true;
  } catch (e) {
    console.warn('Erro ao acessar localStorage:', e);
    if (e.name === 'QuotaExceededError') {
      showNotification('Armazenamento local cheio', 'error');
    } else {
      showNotification('Não foi possível salvar dados localmente', 'warning');
    }
    return false;
  }
}

/**
 * Lê do localStorage com tratamento de erro
 * @param {string} key
 * @returns {string|null}
 */
function safeGetLocalStorage(key) {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.warn('Erro ao ler localStorage:', e);
    return null;
  }
}

/* ==================== AUTENTICAÇÃO ==================== */

/**
 * Autentica usuário (simulado - SUBSTITUA por API real)
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>}
 */
async function authenticateUser(email, password) {
  // ====================================================
  // ⚠️ IMPORTANTE: SUBSTITUA ESTA FUNÇÃO POR SUA API REAL
  // ====================================================
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Credenciais de teste (REMOVA EM PRODUÇÃO!)
      if (email === 'teste123@gmail.com' && password === '13030527aa') {
        resolve({
          success: true,
          user: {
            id: '12345',
            email: email,
            name: 'Usuário Teste',
            avatar: null
          },
          token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake.token'
        });
      } else {
        resolve({
          success: false,
          error: 'Email ou senha incorretos'
        });
      }
    }, 1200);
  });
  
  /* ====================================================
   * EXEMPLO DE IMPLEMENTAÇÃO REAL COM FETCH:
   * ====================================================
   
  try {
    const response = await fetch(`${CONFIG.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Erro ao fazer login'
      };
    }
    
    return {
      success: true,
      user: data.user,
      token: data.token
    };
    
  } catch (error) {
    console.error('Erro na autenticação:', error);
    return {
      success: false,
      error: 'Erro de conexão. Verifique sua internet.'
    };
  }
  
  */
}

/**
 * Autentica com provider social (OAuth simulado)
 * @param {string} provider - 'google', 'facebook', 'apple'
 */
async function authenticateWithProvider(provider) {
  // ====================================================
  // ⚠️ SUBSTITUA por OAuth real (Firebase, Auth0, etc)
  // ====================================================
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: {
          id: `${provider}_user_123`,
          email: `user@${provider}.com`,
          name: `Usuário ${provider}`,
          provider: provider
        },
        token: `${provider}_fake_token_${Date.now()}`
      });
    }, 1500);
  });
}

/* ==================== TOGGLE PASSWORD VISIBILITY ==================== */

/**
 * Alterna visibilidade da senha
 */
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const eyeBtn = document.getElementById('eyeBtn');
  
  if (!passwordInput || !eyeBtn) return;
  
  const eyeOpen = eyeBtn.querySelector('.eye-open');
  const eyeClosed = eyeBtn.querySelector('.eye-closed');
  
  state.passwordVisible = !state.passwordVisible;
  
  if (state.passwordVisible) {
    passwordInput.type = 'text';
    if (eyeOpen) eyeOpen.style.display = 'none';
    if (eyeClosed) eyeClosed.style.display = 'block';
    eyeBtn.setAttribute('aria-label', 'Ocultar senha');
  } else {
    passwordInput.type = 'password';
    if (eyeOpen) eyeOpen.style.display = 'block';
    if (eyeClosed) eyeClosed.style.display = 'none';
    eyeBtn.setAttribute('aria-label', 'Mostrar senha');
  }
}

/* ==================== BARRA DE FORÇA DA SENHA ==================== */

/**
 * Atualiza barra de força da senha
 * @param {string} password
 */
function updatePasswordStrength(password) {
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('strengthText');
  
  if (!strengthBar || !strengthText) return;
  
  if (password.length === 0) {
    strengthBar.style.width = '0%';
    strengthText.style.display = 'none';
    return;
  }
  
  const validation = validatePassword(password);
  
  // Atualizar largura (0-100%)
  const percentage = (validation.score / 5) * 100;
  strengthBar.style.width = `${percentage}%`;
  
  // Atualizar cor baseada no score
  const colors = {
    0: 'linear-gradient(90deg, #f44336, #ff7043)',
    1: 'linear-gradient(90deg, #f44336, #ff7043)',
    2: 'linear-gradient(90deg, #ff9800, #ffb74d)',
    3: 'linear-gradient(90deg, #2196f3, #42a5f5)',
    4: 'linear-gradient(90deg, #66bb6a, #4caf50)',
    5: 'linear-gradient(90deg, #4caf50, #388e3c)'
  };
  
  strengthBar.style.background = colors[validation.score] || colors[0];
  
  // Atualizar texto
  strengthText.style.display = 'block';
  strengthText.textContent = `Força: ${validation.label}`;
  strengthText.style.color = validation.isValid ? '#4caf50' : '#f44336';
  
  // Mostrar feedback se senha não é válida
  if (!validation.isValid && validation.feedback) {
    strengthText.textContent += ` • ${validation.feedback}`;
  }
}

/* ==================== VALIDAÇÃO DE FORMULÁRIO ==================== */

/**
 * Valida campo de email
 * @returns {boolean}
 */
function validateEmailField() {
  const emailInput = document.getElementById('email');
  const emailGroup = document.getElementById('email-group');
  
  if (!emailInput || !emailGroup) return false;
  
  const email = emailInput.value.trim();
  
  if (!email || !isValidEmail(email)) {
    emailGroup.classList.add('error');
    return false;
  }
  
  emailGroup.classList.remove('error');
  return true;
}

/**
 * Valida campo de senha
 * @returns {boolean}
 */
function validatePasswordField() {
  const passwordInput = document.getElementById('password');
  const passwordGroup = document.getElementById('password-group');
  
  if (!passwordInput || !passwordGroup) return false;
  
  const password = passwordInput.value;
  const validation = validatePassword(password);
  
  if (!password || !validation.isValid) {
    passwordGroup.classList.add('error');
    return false;
  }
  
  passwordGroup.classList.remove('error');
  return true;
}

/* ==================== HANDLERS DE EVENTOS ==================== */

/**
 * Handler do submit do formulário
 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  
  // Verificar rate limiting
  if (!checkRateLimit()) return;
  
  // Pegar valores
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const rememberCheckbox = document.getElementById('remember');
  const submitBtn = document.querySelector('.login-btn');
  
  if (!emailInput || !passwordInput || !submitBtn) {
    showNotification('Erro: elementos do formulário não encontrados', 'error');
    return;
  }
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const remember = rememberCheckbox ? rememberCheckbox.checked : false;
  
  // Validar campos
  const isEmailValid = validateEmailField();
  const isPasswordValid = validatePasswordField();
  
  if (!isEmailValid || !isPasswordValid) {
    showNotification('Corrija os erros no formulário', 'error');
    return;
  }
  
  // Prevenir múltiplos submits
  if (state.isLoading) return;
  
  // Loading state
  const originalHTML = submitBtn.innerHTML;
  submitBtn.classList.add('loading');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Entrando...';
  state.isLoading = true;
  
  try {
    // Autenticar
    const result = await authenticateUser(email, password);
    
    if (result.success) {
      // ✅ SUCESSO!
      resetAttempts();
      
      // Salvar token (em produção use httpOnly cookie + JWT)
      safeLocalStorage('authToken', result.token);
      safeLocalStorage('userEmail', email);
      
      if (result.user) {
        safeLocalStorage('userName', result.user.name);
      }
      
      // Salvar email se "lembrar-me" marcado
      if (remember) {
        safeLocalStorage('rememberUserEmail', email);
        safeLocalStorage('rememberUser', 'true');
      } else {
        safeLocalStorage('rememberUserEmail', null);
        safeLocalStorage('rememberUser', null);
      }
      
      // Notificar sucesso
      showNotification('✅ Login efetuado com sucesso!', 'success', 2000);
      
      // Redirecionar após delay
      setTimeout(() => {
        window.location.href = 'teladepedidos.html';
      }, CONFIG.REDIRECT_DELAY);
      
    } else {
      // ❌ FALHA
      incrementAttempts();
      
      showNotification(
        result.error || 'Email ou senha incorretos',
        'error',
        4000
      );
      
      // Resetar botão
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;
      state.isLoading = false;
      
      // Focar no campo de senha
      passwordInput.select();
    }
    
  } catch (error) {
    console.error('Erro no login:', error);
    showNotification('Erro ao conectar. Tente novamente.', 'error');
    
    submitBtn.classList.remove('loading');
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
    state.isLoading = false;
  }
}

/**
 * Handler para login social
 */
async function handleSocialLogin(event) {
  const btn = event.currentTarget;
  const provider = btn.getAttribute('data-provider') || 'google';
  
  // Loading state
  const originalHTML = btn.innerHTML;
  btn.classList.add('loading');
  btn.disabled = true;
  btn.textContent = 'Conectando...';
  
  try {
    const result = await authenticateWithProvider(provider);
    
    if (result.success) {
      safeLocalStorage('authToken', result.token);
      safeLocalStorage('userEmail', result.user.email);
      safeLocalStorage('userName', result.user.name);
      
      showNotification(`Login com ${provider} realizado!`, 'success', 2000);
      
      setTimeout(() => {
        window.location.href = 'teladepedidos.html';
      }, CONFIG.REDIRECT_DELAY);
    } else {
      showNotification(`Falha ao conectar com ${provider}`, 'error');
      btn.classList.remove('loading');
      btn.disabled = false;
      btn.innerHTML = originalHTML;
    }
    
  } catch (error) {
    console.error('Erro no login social:', error);
    showNotification('Erro ao conectar', 'error');
    btn.classList.remove('loading');
    btn.disabled = false;
    btn.innerHTML = originalHTML;
  }
}

/**
 * Handler para "Esqueci minha senha"
 */
function handleForgotPassword(event) {
  event.preventDefault();
  
  const emailInput = document.getElementById('email');
  const email = emailInput ? emailInput.value.trim() : '';
  
  if (email && isValidEmail(email)) {
    showNotification(
      `📧 Link de recuperação enviado para ${email}`,
      'success',
      5000
    );
    
    // Em produção, chame sua API aqui
  } else {
    showNotification('Digite um email válido no campo acima', 'warning', 3000);
    if (emailInput) emailInput.focus();
  }
}

/**
 * Handler para botão Registrar
 */
function handleRegister() {
  showNotification('Redirecionando para registro...', 'info', 1500);
  setTimeout(() => {
    window.location.href = 'register.html';
  }, 1000);
}

/* ==================== ATALHOS DE TECLADO ==================== */

/**
 * Handler de atalhos de teclado
 */
function handleKeyboardShortcuts(event) {
  // ESC - Limpar formulário
  if (event.key === 'Escape' && !state.isLoading) {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    document.querySelectorAll('.input-group').forEach(group => {
      group.classList.remove('error');
    });
    
    updatePasswordStrength('');
    
    showNotification('Formulário limpo', 'info', 1500);
  }
  
  // Ctrl/Cmd + Enter - Submit rápido
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    const form = document.getElementById('loginForm');
    if (form && !state.isLoading) {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    }
  }
}

/* ==================== INICIALIZAÇÃO ==================== */

/**
 * Carrega dados salvos (remember me)
 */
function loadSavedData() {
  try {
    // Carregar tentativas de login do localStorage
    const savedAttempts = safeGetLocalStorage('loginAttempts');
    const savedLockout = safeGetLocalStorage('lockedUntil');
    
    if (savedAttempts) {
      state.loginAttempts = parseInt(savedAttempts) || 0;
    }
    
    if (savedLockout) {
      state.lockedUntil = parseInt(savedLockout) || 0;
    }
    
    // Carregar email salvo
    const savedEmail = safeGetLocalStorage('rememberUserEmail');
    const rememberUser = safeGetLocalStorage('rememberUser');
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');
    
    if (savedEmail && rememberUser === 'true' && emailInput) {
      emailInput.value = savedEmail;
      if (rememberCheckbox) {
        rememberCheckbox.checked = true;
      }
      showNotification('Bem-vindo de volta! 👋', 'info', 2500);
    }
    
    // Verificar se ainda está bloqueado
    if (state.lockedUntil > Date.now()) {
      startLockoutTimer();
    }
    
  } catch (error) {
    console.warn('Erro ao carregar dados salvos:', error);
  }
}

/**
 * Registra todos os event listeners
 */
function registerEventListeners() {
  // Formulário de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLoginSubmit);
  }
  
  // Toggle senha
  const eyeBtn = document.getElementById('eyeBtn');
  if (eyeBtn) {
    eyeBtn.addEventListener('click', togglePasswordVisibility);
    
    eyeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePasswordVisibility();
      }
    });
  }
  
  // Força da senha (com debounce)
  const passwordInput = document.getElementById('password');
  if (passwordInput) {
    passwordInput.addEventListener('input', debounce((e) => {
      updatePasswordStrength(e.target.value);
    }, CONFIG.DEBOUNCE_DELAY));
  }
  
  // Remover erro ao digitar
  const emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('input', () => {
      document.getElementById('email-group')?.classList.remove('error');
    });
  }
  
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      document.getElementById('password-group')?.classList.remove('error');
    });
  }
  
  // Botões sociais
  document.querySelectorAll('.btn.social').forEach(btn => {
    btn.addEventListener('click', handleSocialLogin);
  });
  
  // Botão registrar
  const registerBtn = document.getElementById('registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', handleRegister);
  }
  
  // Link esqueci senha
  const forgotLink = document.getElementById('forgotLink');
  if (forgotLink) {
    forgotLink.addEventListener('click', handleForgotPassword);
  }
  
  // Atalhos de teclado
  document.addEventListener('keydown', handleKeyboardShortcuts);
}

/**
 * Inicialização principal
 */
function init() {
  console.log('%c🔐 Sistema de Login Valida Delivery', 'color: #ff8800; font-size: 18px; font-weight: bold;');
  console.log('%c✅ Versão 2.1 - Corrigido e Otimizado', 'color: #4caf50; font-size: 14px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
  console.log('%c📧 Email de teste: teste123@gmail.com', 'color: #2196f3; font-size: 13px;');
  console.log('%c🔑 Senha de teste: 13030527aa', 'color: #2196f3; font-size: 13px;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
  console.log('%c⚠️  IMPORTANTE: Substitua authenticateUser() por sua API real!', 'color: #f44336; font-size: 13px; font-weight: bold;');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #cbd5e0;');
  
  // Registrar eventos
  registerEventListeners();
  
  // Carregar dados salvos
  loadSavedData();
}

/* ==================== EXECUTAR AO CARREGAR ==================== */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ==================== EXPORTS (se usar módulos) ==================== */
// export { authenticateUser, showNotification, validatePassword };