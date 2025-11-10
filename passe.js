// ==================== 🎯 CONFIGURAÇÃO GLOBAL APRIMORADA ====================
const APP_CONFIG = {
  ANIMATION_DELAY: 2000,
  NOTIFICATION_DURATION: 5000,
  MODAL_FOCUS_DELAY: 100,
  MIN_NAME_LENGTH: 3,
  MIN_CARD_LENGTH: 13,
  MAX_CARD_LENGTH: 19,
  CVV_MIN_LENGTH: 3,
  CVV_MAX_LENGTH: 4,
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100,
  MAX_RETRIES: 3,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutos
  RETRY_DELAY: 1500,
  MAX_NOTIFICATION_QUEUE: 5,
  PERFORMANCE_THRESHOLD: 3000, // ms
  VERSION: '2.2.0', // Versão atualizada
  ENV: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'development' : 'production',
};

// ==================== 🛡️ GERENCIADOR DE ESTADO APRIMORADO ====================
class PaymentState {
  #state = {
    planType: '',
    planName: '',
    planPrice: '',
    isProcessing: false,
    formData: {},
    errors: {},
    retryCount: 0,
    lastUpdate: null,
    isValid: false,
  };

  #listeners = new Set();
  #history = [];
  #maxHistorySize = 10;

  constructor() {
    this.#loadFromStorage();
  }

  setPlan(name, price, type) {
    this.#addToHistory();
    this.#setState({
      planName: name,
      planPrice: price,
      planType: type,
      lastUpdate: Date.now(),
    });
    this.#saveToStorage();
  }

  setProcessing(isProcessing) {
    this.#setState({ isProcessing, lastUpdate: Date.now() });
  }

  setFormData(field, value) {
    this.#setState({
      formData: { ...this.#state.formData, [field]: value },
      lastUpdate: Date.now(),
    });
  }

  setError(field, error) {
    this.#setState({
      errors: { ...this.#state.errors, [field]: error },
      isValid: false,
      lastUpdate: Date.now(),
    });
  }

  clearError(field) {
    const errors = { ...this.#state.errors };
    delete errors[field];
    this.#setState({ 
      errors,
      isValid: Object.keys(errors).length === 0,
      lastUpdate: Date.now(),
    });
  }

  clearAllErrors() {
    this.#setState({ 
      errors: {}, 
      isValid: true,
      lastUpdate: Date.now(),
    });
  }

  incrementRetry() {
    this.#setState({ 
      retryCount: this.#state.retryCount + 1,
      lastUpdate: Date.now(),
    });
  }

  reset() {
    this.#addToHistory();
    this.#state = {
      planType: '',
      planName: '',
      planPrice: '',
      isProcessing: false,
      formData: {},
      errors: {},
      retryCount: 0,
      lastUpdate: Date.now(),
      isValid: false,
    };
    this.#clearStorage();
    this.#notify();
  }

  isFree() {
    return this.#state.planType === 'free';
  }

  isProcessing() {
    return this.#state.isProcessing;
  }

  canRetry() {
    return this.#state.retryCount < APP_CONFIG.MAX_RETRIES;
  }

  isValid() {
    return this.#state.isValid;
  }

  get(key) {
    return this.#state[key];
  }

  getAll() {
    return { ...this.#state };
  }

  getHistory() {
    return [...this.#history];
  }

  undo() {
    if (this.#history.length > 0) {
      const previousState = this.#history.pop();
      this.#state = { ...previousState };
      this.#notify();
      return true;
    }
    return false;
  }

  subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new TypeError('Listener must be a function');
    }
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  #setState(updates) {
    this.#state = { ...this.#state, ...updates };
    this.#notify();
  }

  #notify() {
    this.#listeners.forEach(listener => {
      try {
        listener(this.#state);
      } catch (error) {
        Logger.error('Erro no listener de estado:', error);
      }
    });
  }

  #addToHistory() {
    this.#history.push({ ...this.#state });
    if (this.#history.length > this.#maxHistorySize) {
      this.#history.shift();
    }
  }

  #saveToStorage() {
    try {
      const data = {
        planType: this.#state.planType,
        planName: this.#state.planName,
        planPrice: this.#state.planPrice,
        timestamp: Date.now(),
      };
      sessionStorage.setItem('paymentState', JSON.stringify(data));
    } catch (error) {
      Logger.error('Erro ao salvar estado:', error);
      try {
        sessionStorage.clear();
      } catch (clearError) {
        Logger.error('Erro ao limpar storage:', clearError);
      }
    }
  }

  #loadFromStorage() {
    try {
      const stored = sessionStorage.getItem('paymentState');
      if (stored) {
        const data = JSON.parse(stored);
        const age = Date.now() - data.timestamp;
        
        if (age < APP_CONFIG.CACHE_DURATION) {
          this.#state.planType = data.planType;
          this.#state.planName = data.planName;
          this.#state.planPrice = data.planPrice;
          Logger.log('✅ Estado carregado do storage');
        } else {
          this.#clearStorage();
          Logger.log('⏰ Cache expirado, storage limpo');
        }
      }
    } catch (error) {
      Logger.error('Erro ao carregar estado:', error);
      this.#clearStorage();
    }
  }

  #clearStorage() {
    try {
      sessionStorage.removeItem('paymentState');
    } catch (error) {
      Logger.error('Erro ao limpar storage:', error);
    }
  }
}

const state = new PaymentState();

// ==================== 🔧 GERENCIADOR DE DOM MELHORADO ====================
class DOMManager {
  #elements = new Map();
  #isInitialized = false;
  #observer = null;

  init() {
    if (this.#isInitialized) return;

    const elementsConfig = {
      modalOverlay: 'modalOverlay',
      planName: 'planName',
      planPrice: 'planPrice',
      paymentForm: 'paymentForm',
      cardName: 'cardName',
      cardNumber: 'cardNumber',
      cardExpiry: 'cardExpiry',
      cardCVV: 'cardCVV',
      notification: 'notification',
    };

    Object.entries(elementsConfig).forEach(([key, id]) => {
      const element = document.getElementById(id);
      if (element) {
        this.#elements.set(key, element);
      } else {
        Logger.warn(`Elemento não encontrado: ${id}`);
      }
    });

    // Elementos por seletor
    this.#elements.set('btnConfirm', document.querySelector('.btn-confirm'));
    this.#elements.set('modalClose', document.querySelector('.modal-close'));
    this.#elements.set('purchaseButtons', document.querySelectorAll('.btn-purchase'));

    this.#setupMutationObserver();
    this.#isInitialized = true;
    Logger.log('✅ DOM Manager inicializado');
  }

  get(key) {
    const element = this.#elements.get(key);
    if (!element && !['purchaseButtons'].includes(key)) {
      Logger.warn(`Elemento não encontrado: ${key}`);
    }
    return element || null;
  }

  getAll(key) {
    const elements = this.#elements.get(key);
    return elements ? (NodeList.prototype.isPrototypeOf(elements) ? elements : [elements]) : [];
  }

  exists(key) {
    return this.#elements.has(key) && this.#elements.get(key) !== null;
  }

  addClass(key, ...classes) {
    const element = this.get(key);
    if (element && element.classList) {
      element.classList.add(...classes);
    }
  }

  removeClass(key, ...classes) {
    const element = this.get(key);
    if (element && element.classList) {
      element.classList.remove(...classes);
    }
  }

  toggleClass(key, className, force) {
    const element = this.get(key);
    return element?.classList?.toggle(className, force);
  }

  setAttribute(key, attr, value) {
    const element = this.get(key);
    if (element && typeof element.setAttribute === 'function') {
      element.setAttribute(attr, value);
    }
  }

  removeAttribute(key, attr) {
    const element = this.get(key);
    if (element && typeof element.removeAttribute === 'function') {
      element.removeAttribute(attr);
    }
  }

  setHTML(key, html) {
    const element = this.get(key);
    if (element) {
      // Sanitize HTML para prevenir XSS
      element.innerHTML = this.#sanitizeHTML(html);
    }
  }

  setText(key, text) {
    const element = this.get(key);
    if (element) {
      element.textContent = text;
    }
  }

  getValue(key) {
    const element = this.get(key);
    return element?.value || '';
  }

  setValue(key, value) {
    const element = this.get(key);
    if (element) {
      element.value = value;
    }
  }

  #sanitizeHTML(html) {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }

  #setupMutationObserver() {
    if (typeof MutationObserver === 'undefined') return;

    this.#observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          Logger.log('🔄 DOM alterado, verificando elementos...');
        }
      });
    });

    this.#observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  destroy() {
    if (this.#observer) {
      this.#observer.disconnect();
      this.#observer = null;
    }
    this.#elements.clear();
    this.#isInitialized = false;
  }
}

const dom = new DOMManager();

// ==================== 🎨 FORMATADOR AVANÇADO COM MELHORIAS ====================
class FieldFormatter {
  static #cardPatterns = {
    visa: /^4/,
    mastercard: /^(5[1-5]|2[2-7])/,
    amex: /^3[47]/,
    discover: /^6(?:011|5)/,
    diners: /^3(?:0[0-5]|[68])/,
    elo: /^(4011|4312|4389|4514|5041|5066|5067|636368)/,
    hipercard: /^(606282|3841)/,
  };

  static formatCardNumber(value) {
    if (typeof value !== 'string') return '';
    
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '');
    const cardType = this.detectCardType(cleaned);
    
    // American Express usa formato 4-6-5
    if (cardType === 'amex') {
      const match = cleaned.match(/(\d{1,4})(\d{1,6})?(\d{1,5})?/);
      if (!match) return cleaned;
      return [match[1], match[2], match[3]].filter(Boolean).join(' ');
    }
    
    // Outros cartões usam formato 4-4-4-4
    return cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
  }

  static formatExpiry(value) {
    if (typeof value !== 'string') return '';
    
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length === 0) return '';
    if (cleaned.length <= 2) return cleaned;
    
    // Auto-corrige mês inválido
    let month = cleaned.slice(0, 2);
    if (parseInt(month, 10) > 12) {
      month = '12';
    }
    
    return month + '/' + cleaned.slice(2, 4);
  }

  static formatCVV(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/\D/g, '').slice(0, 4);
  }

  static formatName(value) {
    if (typeof value !== 'string') return '';
    
    return value
      .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  static cleanCardNumber(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/\s/g, '');
  }

  static detectCardType(number) {
    if (typeof number !== 'string') return 'unknown';
    
    const cleaned = this.cleanCardNumber(number);
    
    for (const [type, pattern] of Object.entries(this.#cardPatterns)) {
      if (pattern.test(cleaned)) {
        return type;
      }
    }
    
    return 'unknown';
  }

  static getCardIcon(cardType) {
    const icons = {
      visa: 'fab fa-cc-visa',
      mastercard: 'fab fa-cc-mastercard',
      amex: 'fab fa-cc-amex',
      discover: 'fab fa-cc-discover',
      diners: 'fab fa-cc-diners-club',
      elo: 'fas fa-credit-card',
      hipercard: 'fas fa-credit-card',
    };
    return icons[cardType] || 'fas fa-credit-card';
  }

  static maskCardNumber(number) {
    if (typeof number !== 'string') return '';
    
    const cleaned = this.cleanCardNumber(number);
    if (cleaned.length < 4) return cleaned;
    
    const lastFour = cleaned.slice(-4);
    const masked = '•'.repeat(Math.max(0, cleaned.length - 4));
    return masked + lastFour;
  }

  static getCardBrand(number) {
    const type = this.detectCardType(number);
    const brands = {
      visa: 'Visa',
      mastercard: 'Mastercard',
      amex: 'American Express',
      discover: 'Discover',
      diners: 'Diners Club',
      elo: 'Elo',
      hipercard: 'Hipercard',
    };
    return brands[type] || 'Desconhecido';
  }
}

// ==================== ✅ VALIDADOR ROBUSTO MELHORADO ====================
class Validator {
  static #errorMessages = {
    name: {
      required: 'Nome no cartão é obrigatório',
      minLength: `Nome deve ter no mínimo ${APP_CONFIG.MIN_NAME_LENGTH} caracteres`,
      invalid: 'Nome inválido. Use apenas letras',
      tooShort: 'Nome muito curto',
    },
    cardNumber: {
      required: 'Número do cartão é obrigatório',
      invalid: 'Número do cartão inválido',
      luhn: 'Número do cartão não passou na verificação de segurança',
      length: 'Número do cartão com tamanho inválido',
    },
    expiry: {
      required: 'Data de validade é obrigatória',
      invalid: 'Data de validade inválida (use MM/AA)',
      month: 'Mês inválido (use 01-12)',
      expired: 'Cartão vencido',
      future: 'Data de validade muito distante',
    },
    cvv: {
      required: 'CVV é obrigatório',
      invalid: 'CVV inválido (3 ou 4 dígitos)',
      length: 'CVV deve ter 3 ou 4 dígitos',
    },
  };

  static validateName(name) {
    if (typeof name !== 'string') {
      return { valid: false, message: this.#errorMessages.name.invalid };
    }

    const trimmed = name.trim();
    
    if (!trimmed) {
      return { valid: false, message: this.#errorMessages.name.required };
    }
    
    if (trimmed.length < APP_CONFIG.MIN_NAME_LENGTH) {
      return { valid: false, message: this.#errorMessages.name.minLength };
    }
    
    if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(trimmed)) {
      return { valid: false, message: this.#errorMessages.name.invalid };
    }

    // Verifica se tem pelo menos nome e sobrenome
    const parts = trimmed.split(' ').filter(p => p.length > 0);
    if (parts.length < 2) {
      return { valid: false, message: 'Digite nome e sobrenome' };
    }
    
    return { valid: true };
  }

  static validateCardNumber(number) {
    if (typeof number !== 'string') {
      return { valid: false, message: this.#errorMessages.cardNumber.invalid };
    }

    const cleaned = FieldFormatter.cleanCardNumber(number);
    
    if (!cleaned) {
      return { valid: false, message: this.#errorMessages.cardNumber.required };
    }
    
    if (cleaned.length < APP_CONFIG.MIN_CARD_LENGTH || cleaned.length > APP_CONFIG.MAX_CARD_LENGTH) {
      return { valid: false, message: this.#errorMessages.cardNumber.length };
    }
    
    if (!this.#luhnCheck(cleaned)) {
      return { valid: false, message: this.#errorMessages.cardNumber.luhn };
    }
    
    const cardType = FieldFormatter.detectCardType(cleaned);
    return { valid: true, cardType, brand: FieldFormatter.getCardBrand(cleaned) };
  }

  static validateExpiry(expiry) {
    if (typeof expiry !== 'string' || !expiry || expiry.length !== 5) {
      return { valid: false, message: this.#errorMessages.expiry.invalid };
    }

    const [monthStr, yearStr] = expiry.split('/');
    const month = parseInt(monthStr, 10);
    const year = parseInt(yearStr, 10);
    
    if (isNaN(month) || isNaN(year)) {
      return { valid: false, message: this.#errorMessages.expiry.invalid };
    }
    
    if (month < 1 || month > 12) {
      return { valid: false, message: this.#errorMessages.expiry.month };
    }

    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    const fullYear = 2000 + year;

    // Verifica se está vencido
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return { valid: false, message: this.#errorMessages.expiry.expired };
    }

    // Verifica se a data é muito distante (mais de 20 anos)
    if (fullYear > now.getFullYear() + 20) {
      return { valid: false, message: this.#errorMessages.expiry.future };
    }

    return { valid: true, expiryDate: new Date(fullYear, month - 1) };
  }

  static validateCVV(cvv, cardType = 'unknown') {
    if (typeof cvv !== 'string' || !cvv) {
      return { valid: false, message: this.#errorMessages.cvv.required };
    }

    const expectedLength = cardType === 'amex' ? 4 : 3;
    
    if (cvv.length < APP_CONFIG.CVV_MIN_LENGTH || cvv.length > APP_CONFIG.CVV_MAX_LENGTH) {
      return { valid: false, message: this.#errorMessages.cvv.length };
    }

    if (!/^\d+$/.test(cvv)) {
      return { valid: false, message: 'CVV deve conter apenas números' };
    }

    if (cardType !== 'unknown' && cvv.length !== expectedLength) {
      return { 
        valid: false, 
        message: `CVV deve ter ${expectedLength} dígitos para ${cardType.toUpperCase()}` 
      };
    }
    
    return { valid: true };
  }

  static validateAll(formData) {
    const results = {
      name: this.validateName(formData.cardName || ''),
      cardNumber: this.validateCardNumber(formData.cardNumber || ''),
      expiry: this.validateExpiry(formData.cardExpiry || ''),
      cvv: this.validateCVV(formData.cardCVV || '', formData.cardType),
    };

    const isValid = Object.values(results).every(r => r.valid);
    const errors = Object.entries(results)
      .filter(([_, result]) => !result.valid)
      .reduce((acc, [key, result]) => {
        acc[key] = result.message;
        return acc;
      }, {});

    return { valid: isValid, errors, results };
  }

  static #luhnCheck(cardNumber) {
    if (typeof cardNumber !== 'string' || !/^\d+$/.test(cardNumber)) {
      return false;
    }

    let sum = 0;
    let alternate = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (alternate) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      alternate = !alternate;
    }

    return (sum % 10) === 0 && sum > 0;
  }
}

// ==================== 🎭 GERENCIADOR DE MODAL MELHORADO ====================
class ModalManager {
  static #isOpen = false;
  static #focusTrap = null;
  static #previousFocus = null;
  static #scrollPosition = 0;

  static open(planName, planPrice, planType) {
    if (this.#isOpen) {
      Logger.warn('Modal já está aberto');
      return;
    }

    const overlay = dom.get('modalOverlay');
    if (!overlay) {
      Logger.error('Modal overlay não encontrado');
      return;
    }

    // Salva posição de scroll
    this.#scrollPosition = window.pageYOffset;
    this.#previousFocus = document.activeElement;

    state.setPlan(planName, planPrice, planType);

    dom.setText('planName', `Plano ${this.#escapeHtml(planName)}`);
    dom.setText('planPrice', planPrice + (planType === 'paid' ? '/mês' : ''));

    dom.addClass('modalOverlay', 'active');
    dom.setAttribute('modalOverlay', 'aria-hidden', 'false');
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${this.#scrollPosition}px`;

    this.#updateFormVisibility(planType);
    FormManager.clear();
    this.#setInitialFocus(planType);
    this.#setupFocusTrap();

    this.#isOpen = true;

    Analytics.trackEvent('modal_opened', {
      plan: planName,
      price: planPrice,
      type: planType,
    });

    Logger.log(`📋 Modal aberto: ${planName} (${planType})`);
  }

  static close() {
    if (!this.#isOpen) return;

    const overlay = dom.get('modalOverlay');
    if (!overlay) return;

    dom.removeClass('modalOverlay', 'active');
    dom.setAttribute('modalOverlay', 'aria-hidden', 'true');
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, this.#scrollPosition);

    FormManager.clear();
    state.reset();
    this.#removeFocusTrap();

    // Restaura foco anterior
    if (this.#previousFocus && typeof this.#previousFocus.focus === 'function') {
      setTimeout(() => this.#previousFocus.focus(), 0);
    }

    this.#isOpen = false;

    Analytics.trackEvent('modal_closed');
    Logger.log('❌ Modal fechado');
  }

  static isOpen() {
    return this.#isOpen;
  }

  static #updateFormVisibility(planType) {
    const form = dom.get('paymentForm');
    const btnConfirm = dom.get('btnConfirm');

    if (planType === 'free') {
      if (form) form.style.display = 'none';
      dom.setHTML('btnConfirm', '<i class="fas fa-check" aria-hidden="true"></i> Ativar Plano Gratuito');
    } else {
      if (form) form.style.display = 'block';
      dom.setHTML('btnConfirm', ' Confirmar Pagamento');
    }
  }

  static #setInitialFocus(planType) {
    setTimeout(() => {
      const target = planType === 'paid' ? dom.get('cardName') : dom.get('btnConfirm');
      if (target && typeof target.focus === 'function') {
        target.focus();
      }
    }, APP_CONFIG.MODAL_FOCUS_DELAY);
  }

  static #setupFocusTrap() {
    const modal = dom.get('modalOverlay')?.querySelector('.modal');
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    this.#focusTrap = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    };

    modal.addEventListener('keydown', this.#focusTrap);
  }

  static #removeFocusTrap() {
    if (this.#focusTrap) {
      const modal = dom.get('modalOverlay')?.querySelector('.modal');
      if (modal) {
        modal.removeEventListener('keydown', this.#focusTrap);
      }
      this.#focusTrap = null;
    }
  }

  static #escapeHtml(text) {
    if (!text) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
  }
}

// ==================== 📝 GERENCIADOR DE FORMULÁRIO MELHORADO ====================
class FormManager {
  static #validators = new Map();
  static #debouncedValidators = new Map();
  static #isValidating = false;

  static clear() {
    const form = dom.get('paymentForm');
    if (form && typeof form.reset === 'function') {
      form.reset();
    }
    ErrorManager.clearAll();
    state.clearAllErrors();
    this.#isValidating = false;
  }

  static async validate() {
    if (this.#isValidating) {
      Logger.warn('Validação já em andamento');
      return false;
    }

    if (state.isFree()) {
      return true;
    }

    this.#isValidating = true;

    try {
      const formData = {
        cardName: dom.getValue('cardName'),
        cardNumber: dom.getValue('cardNumber'),
        cardExpiry: dom.getValue('cardExpiry'),
        cardCVV: dom.getValue('cardCVV'),
        cardType: FieldFormatter.detectCardType(dom.getValue('cardNumber')),
      };

      const validation = Validator.validateAll(formData);

      ErrorManager.clearAll();

      if (!validation.valid) {
        const fieldMap = {
          name: 'cardName',
          cardNumber: 'cardNumber',
          expiry: 'cardExpiry',
          cvv: 'cardCVV',
        };

        Object.entries(validation.errors).forEach(([field, message]) => {
          ErrorManager.show(fieldMap[field], message);
        });

        // Foca no primeiro campo com erro
        const firstErrorField = Object.keys(validation.errors)[0];
        if (firstErrorField) {
          const element = dom.get(fieldMap[firstErrorField]);
          if (element && typeof element.focus === 'function') {
            element.focus();
          }
        }
      }

      return validation.valid;
    } finally {
      this.#isValidating = false;
    }
  }

  static setupRealtimeValidation() {
    const fields = [
      { id: 'cardName', validator: (v) => Validator.validateName(v) },
      { id: 'cardNumber', validator: (v) => Validator.validateCardNumber(v) },
      { id: 'cardExpiry', validator: (v) => Validator.validateExpiry(v) },
      { id: 'cardCVV', validator: (v) => Validator.validateCVV(v) },
    ];

    fields.forEach(({ id, validator }) => {
      const element = dom.get(id);
      if (!element) return;

      const debouncedValidate = this.#debounce((value) => {
        if (!value) {
          ErrorManager.clear(id);
          dom.removeClass(id, 'success', 'error');
          return;
        }

        try {
          const result = validator(value);
          if (result.valid) {
            ErrorManager.clear(id);
            dom.addClass(id, 'success');
            dom.removeClass(id, 'error');
          } else {
            ErrorManager.show(id, result.message);
            dom.addClass(id, 'error');
            dom.removeClass(id, 'success');
          }
        } catch (error) {
          Logger.error(`Erro na validação de ${id}:`, error);
        }
      }, APP_CONFIG.DEBOUNCE_DELAY);

      element.addEventListener('input', (e) => {
        debouncedValidate(e.target.value);
      });

      element.addEventListener('blur', (e) => {
        const value = e.target.value;
        if (value) {
          try {
            const result = validator(value);
            if (!result.valid) {
              ErrorManager.show(id, result.message);
            }
          } catch (error) {
            Logger.error(`Erro na validação blur de ${id}:`, error);
          }
        }
      });
    });

    Logger.log('✅ Validação em tempo real configurada');
  }

  static #debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
}

// ==================== ⚠️ GERENCIADOR DE ERROS MELHORADO ====================
class ErrorManager {
  static #errorCount = new Map();
  static #maxErrorsPerField = 3;

  static show(fieldId, message) {
    if (!fieldId || !message) {
      Logger.warn('Campo ou mensagem inválida para erro');
      return;
    }

    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = dom.get(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
    }

    if (inputElement) {
      dom.addClass(fieldId, 'error');
      dom.removeClass(fieldId, 'success');
      dom.setAttribute(fieldId, 'aria-invalid', 'true');
      dom.setAttribute(fieldId, 'aria-describedby', `${fieldId}Error`);
    }

    state.setError(fieldId, message);

    // Tracking de erros frequentes
    const count = this.#errorCount.get(fieldId) || 0;
    this.#errorCount.set(fieldId, count + 1);

    if (count + 1 >= this.#maxErrorsPerField) {
      Analytics.trackEvent('field_error_frequent', {
        field: fieldId,
        count: count + 1,
        message,
      });
    }
  }

  static clear(fieldId) {
    if (!fieldId) return;

    const errorElement = document.getElementById(`${fieldId}Error`);
    const inputElement = dom.get(fieldId);

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }

    if (inputElement) {
      dom.removeClass(fieldId, 'error');
      dom.setAttribute(fieldId, 'aria-invalid', 'false');
      dom.removeAttribute(fieldId, 'aria-describedby');
    }

    state.clearError(fieldId);
  }

  static clearAll() {
    ['cardName', 'cardNumber', 'cardExpiry', 'cardCVV'].forEach(id => this.clear(id));
    this.#errorCount.clear();
  }

  static hasErrors() {
    return Object.keys(state.get('errors')).length > 0;
  }

  static getErrorStats() {
    return new Map(this.#errorCount);
  }
}

// ==================== 💳 PROCESSADOR DE PAGAMENTO MELHORADO ====================
class PaymentProcessor {
  static #isProcessing = false;
  static #abortController = null;

  static async process(e) {
    e?.preventDefault();

    if (this.#isProcessing) {
      Logger.warn('Pagamento já está sendo processado');
      return;
    }

    if (state.isProcessing()) {
      Logger.warn('Estado indica processamento em andamento');
      return;
    }

    Logger.log('🔄 Iniciando processamento de pagamento...');

    const isValid = await FormManager.validate();
    if (!isValid) {
      NotificationManager.show('Por favor, corrija os erros no formulário', 'error');
      Logger.log('❌ Validação falhou');
      return;
    }

    const btn = dom.get('btnConfirm');
    if (!btn) {
      Logger.error('Botão de confirmação não encontrado');
      return;
    }

    const originalHTML = btn.innerHTML;
    this.#isProcessing = true;
    this.#abortController = new AbortController();
    
    this.#setLoadingState(btn);
    state.setProcessing(true);

    try {
      const paymentData = this.#preparePaymentData();
      await this.#simulatePayment(paymentData);
      this.#handleSuccess(btn, originalHTML);
    } catch (error) {
      if (error.name === 'AbortError') {
        Logger.log('Pagamento cancelado');
        this.#handleCancel(btn, originalHTML);
      } else {
        this.#handleError(btn, originalHTML, error);
      }
    } finally {
      this.#isProcessing = false;
      this.#abortController = null;
    }
  }

  static cancel() {
    if (this.#abortController) {
      this.#abortController.abort();
      Logger.log('Cancelamento solicitado');
    }
  }

  static #preparePaymentData() {
    const data = {
      planName: state.get('planName'),
      planPrice: state.get('planPrice'),
      planType: state.get('planType'),
      cardData: state.isFree() ? null : {
        name: dom.getValue('cardName'),
        number: FieldFormatter.maskCardNumber(dom.getValue('cardNumber')),
        expiry: dom.getValue('cardExpiry'),
        cardType: FieldFormatter.detectCardType(dom.getValue('cardNumber')),
        brand: FieldFormatter.getCardBrand(dom.getValue('cardNumber')),
      },
      timestamp: new Date().toISOString(),
      sessionId: Analytics.getSessionId(),
    };

    // Remove dados sensíveis do log
    const safeData = { ...data };
    if (safeData.cardData) {
      safeData.cardData = { ...safeData.cardData, cvv: '***' };
    }
    Logger.log('💳 Dados preparados:', safeData);

    return data;
  }

  static #setLoadingState(btn) {
    btn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Processando...';
    btn.disabled = true;
    btn.classList.add('loading');
    btn.setAttribute('aria-busy', 'true');
  }

  static #simulatePayment(paymentData) {
    return new Promise((resolve, reject) => {
      // Simula falha aleatória para demonstração (5% de chance)
      const shouldFail = Math.random() < 0.05;

      const timeoutId = setTimeout(() => {
        if (this.#abortController?.signal.aborted) {
          reject(new DOMException('Payment cancelled', 'AbortError'));
        } else if (shouldFail && !state.isFree()) {
          reject(new Error('Erro na comunicação com o banco'));
        } else {
          resolve(paymentData);
        }
      }, APP_CONFIG.ANIMATION_DELAY);

      // Permite cancelamento
      if (this.#abortController) {
        this.#abortController.signal.addEventListener('abort', () => {
          clearTimeout(timeoutId);
          reject(new DOMException('Payment cancelled', 'AbortError'));
        });
      }
    });
  }

  static #handleSuccess(btn, originalHTML) {
    const message = state.isFree()
      ? '✅ Plano Starter ativado com sucesso!'
      : `✅ Pagamento aprovado! Plano ${state.get('planName')} ativado por ${state.get('planPrice')}/mês`;

    NotificationManager.show(message, 'success');
    
    Analytics.trackPaymentSuccess({
      plan: state.get('planName'),
      price: state.get('planPrice'),
      type: state.get('planType'),
    });

    Logger.log('✅', message);

    btn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i> Sucesso!';
    btn.classList.add('success-state');
    btn.classList.remove('loading');
    btn.removeAttribute('aria-busy');

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.classList.remove('success-state');
      state.setProcessing(false);
      ModalManager.close();
    }, APP_CONFIG.ANIMATION_DELAY);
  }

  static #handleError(btn, originalHTML, error) {
    const canRetry = state.canRetry();
    const errorMessage = canRetry
      ? 'Erro ao processar pagamento. Tentando novamente...'
      : 'Erro ao processar pagamento. Tente novamente mais tarde.';

    NotificationManager.show(errorMessage, 'error');
    
    Analytics.trackPaymentError({
      error: error.message,
      retryCount: state.get('retryCount'),
      stack: error.stack,
    });

    Logger.error('❌ Erro no pagamento:', error);

    btn.classList.add('error-state');
    btn.classList.remove('loading');
    btn.removeAttribute('aria-busy');

    if (canRetry) {
      state.incrementRetry();
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.classList.remove('error-state');
        state.setProcessing(false);
      }, APP_CONFIG.RETRY_DELAY);
    } else {
      btn.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i> Falhou';
      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.disabled = false;
        btn.classList.remove('error-state');
        state.setProcessing(false);
      }, APP_CONFIG.ANIMATION_DELAY);
    }
  }

  static #handleCancel(btn, originalHTML) {
    NotificationManager.show('Pagamento cancelado', 'info');
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    btn.classList.remove('loading');
    btn.removeAttribute('aria-busy');
    state.setProcessing(false);
  }
}

// ==================== 🔔 GERENCIADOR DE NOTIFICAÇÕES MELHORADO ====================
class NotificationManager {
  static #queue = [];
  static #isShowing = false;
  static #currentTimeout = null;
  static #notificationElement = null;

  static show(message, type = 'success') {
    if (!message) {
      Logger.warn('Mensagem vazia para notificação');
      return;
    }

    // Limita tamanho da fila
    if (this.#queue.length >= APP_CONFIG.MAX_NOTIFICATION_QUEUE) {
      this.#queue.shift();
      Logger.warn('Fila de notificações cheia, removendo mais antiga');
    }

    this.#queue.push({ message, type, timestamp: Date.now() });
    
    if (!this.#isShowing) {
      this.#showNext();
    }
  }

  static #showNext() {
    if (this.#queue.length === 0) {
      this.#isShowing = false;
      return;
    }

    this.#isShowing = true;
    const { message, type, timestamp } = this.#queue.shift();

    this.#notificationElement = dom.get('notification');
    if (!this.#notificationElement) {
      Logger.error('Elemento de notificação não encontrado');
      this.#isShowing = false;
      return;
    }

    this.#notificationElement.textContent = message;
    this.#notificationElement.className = `notification show ${type}`;

    const gradients = {
      success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      info: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    };

    this.#notificationElement.style.background = gradients[type] || gradients.success;
    this.#notificationElement.setAttribute('role', type === 'error' ? 'alert' : 'status');
    this.#notificationElement.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

    if (this.#currentTimeout) {
      clearTimeout(this.#currentTimeout);
    }

    this.#currentTimeout = setTimeout(() => {
      if (this.#notificationElement) {
        this.#notificationElement.classList.remove('show');
      }
      setTimeout(() => {
        this.#showNext();
      }, 300);
    }, APP_CONFIG.NOTIFICATION_DURATION);

    Analytics.trackEvent('notification_shown', { message, type, age: Date.now() - timestamp });
  }

  static clear() {
    this.#queue = [];
    const notification = dom.get('notification');
    if (notification) {
      notification.classList.remove('show');
    }
    if (this.#currentTimeout) {
      clearTimeout(this.#currentTimeout);
      this.#currentTimeout = null;
    }
    this.#isShowing = false;
  }

  static getQueueSize() {
    return this.#queue.length;
  }
}

// ==================== 📊 SISTEMA DE ANALYTICS MELHORADO ====================
class Analytics {
  static #events = [];
  static #sessionId = this.#generateSessionId();
  static #startTime = Date.now();
  static #pageViews = 0;

  static trackEvent(eventName, data = {}) {
    if (!eventName) {
      Logger.warn('Nome de evento vazio');
      return;
    }

    const event = {
      name: eventName,
      data,
      timestamp: new Date().toISOString(),
      sessionId: this.#sessionId,
      sessionDuration: Date.now() - this.#startTime,
      url: window.location.href,
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    };

    this.#events.push(event);
    
    // Limita histórico de eventos
    if (this.#events.length > 1000) {
      this.#events = this.#events.slice(-500);
    }

    Logger.log(`📊 Event: ${eventName}`, data);
    this.#sendToAnalytics(event);
  }

  static trackPageView() {
    this.#pageViews++;
    this.trackEvent('page_view', {
      pageViews: this.#pageViews,
      referrer: document.referrer,
    });
  }

  static trackPlanSelection(planData) {
    this.trackEvent('plan_selected', planData);
  }

  static trackPaymentSuccess(planData) {
    this.trackEvent('payment_success', planData);
    this.#trackConversion(planData);
  }

  static trackPaymentError(error) {
    this.trackEvent('payment_error', error);
  }

  static trackFormInteraction(field, action) {
    this.trackEvent('form_interaction', { field, action });
  }

  static trackPerformance(metrics) {
    this.trackEvent('performance_metrics', metrics);
  }

  static getSessionEvents() {
    return [...this.#events];
  }

  static getSessionId() {
    return this.#sessionId;
  }

  static getSessionDuration() {
    return Date.now() - this.#startTime;
  }

  static clearSession() {
    this.#events = [];
    this.#sessionId = this.#generateSessionId();
    this.#startTime = Date.now();
    this.#pageViews = 0;
  }

  static exportData() {
    return {
      sessionId: this.#sessionId,
      startTime: new Date(this.#startTime).toISOString(),
      duration: this.getSessionDuration(),
      pageViews: this.#pageViews,
      events: this.#events,
    };
  }

  static #generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static #sendToAnalytics(event) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
      try {
        gtag('event', event.name, event.data);
      } catch (error) {
        Logger.error('Erro ao enviar para GA4:', error);
      }
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      try {
        fbq('track', event.name, event.data);
      } catch (error) {
        Logger.error('Erro ao enviar para Facebook Pixel:', error);
      }
    }

    // Salva no localStorage para debug
    try {
      const storageKey = 'analytics_events';
      const stored = JSON.parse(localStorage.getItem(storageKey) || '[]');
      stored.push(event);
      
      // Mantém apenas os últimos 100 eventos
      if (stored.length > 100) {
        stored.splice(0, stored.length - 100);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(stored));
    } catch (error) {
      Logger.error('Erro ao salvar analytics:', error);
    }
  }

  static #trackConversion(planData) {
    Logger.log('🎯 Conversão registrada:', planData);
    
    // Google Ads Conversion
    if (typeof gtag !== 'undefined') {
      try {
        const value = parseFloat(planData.price?.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
        gtag('event', 'conversion', {
          send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL',
          value,
          currency: 'BRL',
          transaction_id: this.#sessionId,
        });
      } catch (error) {
        Logger.error('Erro ao rastrear conversão:', error);
      }
    }
  }
}

// ==================== 🪵 LOGGER AVANÇADO MELHORADO ====================
class Logger {
  static #logs = [];
  static #maxLogs = 100;
  static #isDevelopment = APP_CONFIG.ENV === 'development';
  static #logLevels = { log: 0, warn: 1, error: 2 };
  static #minLevel = 0;

  static log(message, ...args) {
    this.#addLog('log', message, args);
    
    if (!this.#isDevelopment) return;

    if (args.length > 0) {
      console.log(`%c${message}`, 'color: #10b981; font-weight: bold;', ...args);
    } else {
      console.log(`%c${message}`, 'color: #10b981; font-weight: bold;');
    }
  }

  static warn(message, ...args) {
    this.#addLog('warn', message, args);
    console.warn(`⚠️ ${message}`, ...args);
  }

  static error(message, ...args) {
    this.#addLog('error', message, args);
    console.error(`❌ ${message}`, ...args);
  }

  static init() {
    if (!this.#isDevelopment) return;

    console.log('%c🌱 ValidaDelivery - Sistema de Passes v' + APP_CONFIG.VERSION, 'color: #6ea56f; font-size: 20px; font-weight: bold;');
    console.log('%c💳 Recursos Ativados:', 'color: #f28c00; font-size: 16px; font-weight: bold; margin-top: 10px;');
    
    const features = [
      '✅ Validação de cartão (Algoritmo de Luhn)',
      '✅ Detecção automática de bandeira (Visa, Mastercard, Amex, etc)',
      '✅ Formatação inteligente de campos',
      '✅ Validação em tempo real com debounce',
      '✅ Feedback visual de erros e sucessos',
      '✅ Gerenciamento de estado com histórico',
      '✅ Sistema de analytics integrado',
      '✅ Retry automático em falhas',
      '✅ Focus trap no modal',
      '✅ Acessibilidade WCAG 2.1 AA',
      '✅ Performance otimizada',
      '✅ Tratamento robusto de erros',
      '✅ Mutation Observer para DOM',
      '✅ Cancelamento de pagamento',
      '✅ Arquitetura modular escalável',
    ];

    features.forEach(feature => {
      console.log(`%c  ${feature}`, 'color: #667eea; font-size: 13px;');
    });

    console.log('%c\n💡 Dicas:', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
    console.log('%c  • Digite Logger.getLogs() para ver todos os logs', 'color: #9ca3af; font-size: 12px;');
    console.log('%c  • Digite Analytics.exportData() para exportar dados', 'color: #9ca3af; font-size: 12px;');
    console.log('%c  • Digite state.getAll() para ver o estado atual', 'color: #9ca3af; font-size: 12px;');
    console.log('%c  • Digite PerformanceMonitor.getMetrics() para métricas', 'color: #9ca3af; font-size: 12px;');
  }

  static getLogs(level = null) {
    if (!level) return [...this.#logs];
    return this.#logs.filter(log => log.level === level);
  }

  static clearLogs() {
    this.#logs = [];
    console.clear();
  }

  static exportLogs() {
    return {
      logs: this.#logs,
      count: this.#logs.length,
      exported: new Date().toISOString(),
    };
  }

  static setMinLevel(level) {
    if (this.#logLevels[level] !== undefined) {
      this.#minLevel = this.#logLevels[level];
    }
  }

  static #addLog(level, message, args) {
    if (this.#logLevels[level] < this.#minLevel) return;

    const logEntry = {
      level,
      message,
      args,
      timestamp: new Date().toISOString(),
      stack: new Error().stack,
    };

    this.#logs.push(logEntry);
    this.#trimLogs();
  }

  static #trimLogs() {
    if (this.#logs.length > this.#maxLogs) {
      this.#logs = this.#logs.slice(-this.#maxLogs);
    }
  }
}

// ==================== 🎯 INICIALIZADOR DE EVENTOS MELHORADO ====================
class EventInitializer {
  static #initialized = false;

  static init() {
    if (this.#initialized) {
      Logger.warn('Eventos já foram inicializados');
      return;
    }

    try {
      this.#initPurchaseButtons();
      this.#initModalClose();
      this.#initEscapeKey();
      this.#initFormSubmit();
      this.#initFieldFormatting();
      this.#initCardTypeDetection();
      FormManager.setupRealtimeValidation();
      this.#initKeyboardShortcuts();
      this.#initScrollEffects();
      this.#initVisibilityChange();
      this.#initOnlineOffline();
      
      this.#initialized = true;
      Logger.log('✅ Eventos inicializados com sucesso');
    } catch (error) {
      Logger.error('❌ Erro ao inicializar eventos:', error);
      throw error;
    }
  }

  static #initPurchaseButtons() {
    const buttons = dom.getAll('purchaseButtons');
    
    if (buttons.length === 0) {
      Logger.warn('Nenhum botão de compra encontrado');
      return;
    }

    buttons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        try {
          const { plan, price, type } = e.currentTarget.dataset;
          
          if (!plan || !price || !type) {
            Logger.error('Dados do plano incompletos');
            return;
          }

          ModalManager.open(plan, price, type);
          Analytics.trackPlanSelection({ plan, price, type });
        } catch (error) {
          Logger.error('Erro ao processar clique no botão:', error);
        }
      });
    });

    Logger.log(`✅ ${buttons.length} botões de compra configurados`);
  }

  static #initModalClose() {
    const closeBtn = dom.get('modalClose');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        try {
          ModalManager.close();
        } catch (error) {
          Logger.error('Erro ao fechar modal:', error);
        }
      });
    }

    const overlay = dom.get('modalOverlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        try {
          if (e.target === overlay) {
            ModalManager.close();
          }
        } catch (error) {
          Logger.error('Erro ao fechar modal por clique no overlay:', error);
        }
      });
    }
  }

  static #initEscapeKey() {
    document.addEventListener('keydown', (e) => {
      try {
        if (e.key === 'Escape' && ModalManager.isOpen()) {
          ModalManager.close();
        }
      } catch (error) {
        Logger.error('Erro ao processar tecla Escape:', error);
      }
    });
  }

  static #initFormSubmit() {
    const form = dom.get('paymentForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        try {
          PaymentProcessor.process(e);
        } catch (error) {
          Logger.error('Erro ao processar formulário:', error);
          NotificationManager.show('Erro ao processar pagamento', 'error');
        }
      });
    }

    const btnConfirm = dom.get('btnConfirm');
    if (btnConfirm) {
      btnConfirm.addEventListener('click', (e) => {
        try {
          if (state.isFree() || !dom.get('paymentForm')?.checkValidity()) {
            PaymentProcessor.process(e);
          }
        } catch (error) {
          Logger.error('Erro ao processar confirmação:', error);
          NotificationManager.show('Erro ao processar pagamento', 'error');
        }
      });
    }
  }

  static #initFieldFormatting() {
    const fields = [
      { id: 'cardNumber', formatter: FieldFormatter.formatCardNumber },
      { id: 'cardExpiry', formatter: FieldFormatter.formatExpiry },
      { id: 'cardCVV', formatter: FieldFormatter.formatCVV },
      { id: 'cardName', formatter: FieldFormatter.formatName },
    ];

    fields.forEach(({ id, formatter }) => {
      const element = dom.get(id);
      if (!element) return;

      element.addEventListener('input', (e) => {
        try {
          const cursorPosition = e.target.selectionStart;
          const oldValue = e.target.value;
          const newValue = formatter(oldValue);
          
          e.target.value = newValue;

          // Mantém a posição do cursor após formatação
          const diff = newValue.length - oldValue.length;
          const newPosition = Math.max(0, Math.min(newValue.length, cursorPosition + diff));
          e.target.setSelectionRange(newPosition, newPosition);

          Analytics.trackFormInteraction(id, 'input');
        } catch (error) {
          Logger.error(`Erro ao formatar campo ${id}:`, error);
        }
      });

      element.addEventListener('paste', (e) => {
        try {
          e.preventDefault();
          const pastedText = (e.clipboardData || window.clipboardData).getData('text');
          const formattedText = formatter(pastedText);
          e.target.value = formattedText;
          
          Analytics.trackFormInteraction(id, 'paste');
        } catch (error) {
          Logger.error(`Erro ao processar paste em ${id}:`, error);
        }
      });
    });
  }

  static #initCardTypeDetection() {
    const cardNumberInput = dom.get('cardNumber');
    if (!cardNumberInput) return;

    let currentCardType = 'unknown';

    cardNumberInput.addEventListener('input', (e) => {
      try {
        const cardType = FieldFormatter.detectCardType(e.target.value);
        
        if (cardType !== currentCardType) {
          currentCardType = cardType;
          this.#updateCardIcon(cardType);
          
          // Atualiza o comprimento esperado do CVV
          const cvvInput = dom.get('cardCVV');
          if (cvvInput) {
            const maxLength = cardType === 'amex' ? 4 : 3;
            cvvInput.setAttribute('maxlength', maxLength);
            cvvInput.setAttribute('placeholder', cardType === 'amex' ? '1234' : '123');
          }

          const brand = FieldFormatter.getCardBrand(e.target.value);
          Logger.log(`💳 Cartão detectado: ${brand} (${cardType})`);
          Analytics.trackEvent('card_type_detected', { type: cardType, brand });
        }
      } catch (error) {
        Logger.error('Erro na detecção do tipo de cartão:', error);
      }
    });
  }

  static #updateCardIcon(cardType) {
    try {
      const cardNumberInput = dom.get('cardNumber');
      if (!cardNumberInput) return;

      const icon = FieldFormatter.getCardIcon(cardType);
      const existingIcon = cardNumberInput.parentElement.querySelector('.card-type-icon');

      if (existingIcon) {
        existingIcon.className = `card-type-icon ${icon}`;
      } else {
        const iconElement = document.createElement('i');
        iconElement.className = `card-type-icon ${icon}`;
        iconElement.setAttribute('aria-hidden', 'true');
        cardNumberInput.parentElement.style.position = 'relative';
        iconElement.style.cssText = `
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24px;
          color: var(--primary-500);
          pointer-events: none;
          transition: all 0.3s ease;
          z-index: 10;
        `;
        cardNumberInput.parentElement.appendChild(iconElement);
      }
    } catch (error) {
      Logger.error('Erro ao atualizar ícone do cartão:', error);
    }
  }

  static #initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      try {
        // Ctrl/Cmd + K para abrir modal Pro
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
          e.preventDefault();
          if (!ModalManager.isOpen()) {
            const proButton = document.querySelector('[data-plan="Pro"]');
            if (proButton) {
              proButton.click();
            }
          }
        }

        // Ctrl/Cmd + Shift + K para limpar formulário
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'K') {
          e.preventDefault();
          FormManager.clear();
          NotificationManager.show('Formulário limpo', 'info');
        }

        // Ctrl/Cmd + Shift + D para abrir debug info
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
          e.preventDefault();
          console.log('=== DEBUG INFO ===');
          console.log('State:', state.getAll());
          console.log('Analytics:', Analytics.exportData());
          console.log('Logs:', Logger.getLogs());
          console.log('Performance:', PerformanceMonitor.getMetrics());
        }
      } catch (error) {
        Logger.error('Erro ao processar atalho de teclado:', error);
      }
    });
  }

  static #initScrollEffects() {
    let lastScroll = 0;
    const header = document.querySelector('header');
    
    if (!header) return;

    const throttledScroll = Utils.throttle(() => {
      try {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
      } catch (error) {
        Logger.error('Erro no efeito de scroll:', error);
      }
    }, APP_CONFIG.THROTTLE_DELAY);

    window.addEventListener('scroll', throttledScroll, { passive: true });
  }

  static #initVisibilityChange() {
    document.addEventListener('visibilitychange', () => {
      try {
        if (document.hidden) {
          Analytics.trackEvent('page_hidden');
        } else {
          Analytics.trackEvent('page_visible');
        }
      } catch (error) {
        Logger.error('Erro ao processar mudança de visibilidade:', error);
      }
    });
  }

  static #initOnlineOffline() {
    window.addEventListener('online', () => {
      try {
        NotificationManager.show('Conexão restaurada', 'success');
        Logger.log('🌐 Conectado à internet');
        Analytics.trackEvent('connection_restored');
      } catch (error) {
        Logger.error('Erro ao processar evento online:', error);
      }
    });

    window.addEventListener('offline', () => {
      try {
        NotificationManager.show('Sem conexão com a internet', 'warning');
        Logger.warn('🌐 Desconectado da internet');
        Analytics.trackEvent('connection_lost');
      } catch (error) {
        Logger.error('Erro ao processar evento offline:', error);
      }
    });
  }
}

// ==================== 🔧 UTILIDADES MELHORADAS ====================
class Utils {
  static formatCurrency(value) {
    try {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
    } catch (error) {
      Logger.error('Erro ao formatar moeda:', error);
      return `R$ ${value}`;
    }
  }

  static formatDate(date) {
    try {
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(date));
    } catch (error) {
      Logger.error('Erro ao formatar data:', error);
      return String(date);
    }
  }

  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      NotificationManager.show('Copiado para área de transferência', 'success');
      return true;
    } catch (error) {
      Logger.error('Erro ao copiar:', error);
      
      // Fallback method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        NotificationManager.show('Copiado para área de transferência', 'success');
        return true;
      } catch (fallbackError) {
        Logger.error('Erro no fallback de cópia:', fallbackError);
        return false;
      }
    }
  }

  static async share(data) {
    if (!navigator.share) {
      Logger.warn('Web Share API não suportada');
      return false;
    }

    try {
      await navigator.share(data);
      Analytics.trackEvent('content_shared', data);
      return true;
    } catch (error) {
      if (error.name !== 'AbortError') {
        Logger.error('Erro ao compartilhar:', error);
      }
      return false;
    }
  }

  static isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  static isOnline() {
    return navigator.onLine;
  }

  static getBrowserInfo() {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
      platform: navigator.platform,
      online: navigator.onLine,
      cookiesEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      maxTouchPoints: navigator.maxTouchPoints,
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: navigator.deviceMemory,
      connection: navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
      } : null,
    };
  }

  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  static generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.replace(/[<>\"']/g, '');
  }
}

// ==================== 🎬 PERFORMANCE MONITOR MELHORADO ====================
class PerformanceMonitor {
  static #marks = new Map();
  static #measures = [];

  static mark(name) {
    try {
      this.#marks.set(name, performance.now());
      if (typeof performance.mark === 'function') {
        performance.mark(name);
      }
    } catch (error) {
      Logger.error('Erro ao criar mark:', error);
    }
  }

  static measure(name, startMark) {
    try {
      const start = this.#marks.get(startMark);
      if (!start) {
        Logger.warn(`Mark não encontrado: ${startMark}`);
        return 0;
      }

      const duration = performance.now() - start;
      const measure = {
        name,
        startMark,
        duration: duration.toFixed(2),
        timestamp: new Date().toISOString(),
      };

      this.#measures.push(measure);
      Logger.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      
      if (duration > APP_CONFIG.PERFORMANCE_THRESHOLD) {
        Logger.warn(`⚠️ Performance lenta detectada: ${name} levou ${duration.toFixed(2)}ms`);
      }

      Analytics.trackPerformance(measure);

      return duration;
    } catch (error) {
      Logger.error('Erro ao medir performance:', error);
      return 0;
    }
  }

  static getMetrics() {
    try {
      if (!window.performance) return null;

      const navigation = performance.getEntriesByType('navigation')[0];
      const paint = performance.getEntriesByType('paint');
      const memory = performance.memory;

      return {
        navigation: {
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
          domInteractive: navigation?.domInteractive,
          type: navigation?.type,
        },
        paint: {
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime,
        },
        memory: memory ? {
          used: (memory.usedJSHeapSize / 1048576).toFixed(2) + ' MB',
          total: (memory.totalJSHeapSize / 1048576).toFixed(2) + ' MB',
          limit: (memory.jsHeapSizeLimit / 1048576).toFixed(2) + ' MB',
          usedPercentage: ((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100).toFixed(2) + '%',
        } : null,
        customMeasures: this.#measures,
      };
    } catch (error) {
      Logger.error('Erro ao obter métricas:', error);
      return null;
    }
  }

  static logMetrics() {
    const metrics = this.getMetrics();
    if (metrics) {
      Logger.log('📊 Performance Metrics:', metrics);
    }
  }

  static clearMeasures() {
    this.#measures = [];
    this.#marks.clear();
  }
}

// ==================== 🚀 INICIALIZAÇÃO DA APLICAÇÃO MELHORADA ====================
class App {
  static #initialized = false;

  static async init() {
    if (this.#initialized) {
      Logger.warn('Aplicação já foi inicializada');
      return;
    }

    try {
      PerformanceMonitor.mark('app_init_start');

      Logger.init();
      Logger.log('🚀 Iniciando aplicação...');
      
      if (!this.#checkBrowserSupport()) {
        NotificationManager.show('Navegador não suportado. Por favor, atualize seu navegador.', 'error');
        Logger.error('Navegador não suportado');
        return;
      }

      dom.init();
      EventInitializer.init();
      this.#setupGlobalListeners();
      this.#checkPerformance();

      PerformanceMonitor.measure('App Initialization', 'app_init_start');
      
      Logger.log('%c💳 Sistema de Passes Carregado com Sucesso!', 'color: #10b981; font-size: 18px; font-weight: bold;');
      
      if (APP_CONFIG.ENV === 'development') {
        Logger.log('🌐 Browser Info:', Utils.getBrowserInfo());
        setTimeout(() => PerformanceMonitor.logMetrics(), 3000);
      }

      Analytics.trackEvent('app_initialized', {
        version: APP_CONFIG.VERSION,
        isMobile: Utils.isMobile(),
      });

      this.#initialized = true;
    } catch (error) {
      Logger.error('❌ Erro crítico na inicialização:', error);
      NotificationManager.show('Erro ao carregar a aplicação. Por favor, recarregue a página.', 'error');
      throw error;
    }
  }

  static #checkBrowserSupport() {
    const requiredFeatures = [
      'Promise',
      'fetch',
      'localStorage',
      'sessionStorage',
      'classList',
      'addEventListener',
    ];

    const supported = requiredFeatures.every(feature => {
      switch (feature) {
        case 'Promise': return typeof Promise !== 'undefined';
        case 'fetch': return typeof fetch !== 'undefined';
        case 'localStorage': return typeof localStorage !== 'undefined';
        case 'sessionStorage': return typeof sessionStorage !== 'undefined';
        default: return true;
      }
    });

    if (!supported) {
      Logger.error('Navegador não suporta recursos necessários:', {
        promise: typeof Promise !== 'undefined',
        fetch: typeof fetch !== 'undefined',
        storage: typeof localStorage !== 'undefined',
      });
    }

    return supported;
  }

  static #setupGlobalListeners() {
    window.addEventListener('error', (event) => {
      Logger.error('Erro não tratado:', event.error);
      Analytics.trackEvent('unhandled_error', {
        message: event.error?.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      Logger.error('Promise rejeitada não tratada:', event.reason);
      Analytics.trackEvent('unhandled_rejection', {
        reason: String(event.reason),
      });
    });

    window.addEventListener('beforeunload', (event) => {
      if (state.isProcessing()) {
        event.preventDefault();
        event.returnValue = 'Há um pagamento em andamento. Deseja realmente sair?';
        return event.returnValue;
      }
    });
  }

  static #checkPerformance() {
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (entry.duration > APP_CONFIG.PERFORMANCE_THRESHOLD) {
              Logger.warn(`⚠️ Operação lenta detectada: ${entry.name} (${entry.duration.toFixed(2)}ms)`);
              Analytics.trackEvent('slow_operation', {
                name: entry.name,
                duration: entry.duration,
                type: entry.entryType,
              });
            }
          }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation'] });
      } catch (error) {
        Logger.error('Erro ao configurar Performance Observer:', error);
      }
    }
  }

  static destroy() {
    try {
      dom.destroy();
      Analytics.clearSession();
      Logger.clearLogs();
      this.#initialized = false;
      Logger.log('🔄 Aplicação destruída');
    } catch (error) {
      Logger.error('Erro ao destruir aplicação:', error);
    }
  }
}

// ==================== 🎬 PONTO DE ENTRADA ====================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      App.init();
    } catch (error) {
      console.error('Erro fatal ao inicializar:', error);
    }
  });
} else {
  try {
    App.init();
  } catch (error) {
    console.error('Erro fatal ao inicializar:', error);
  }
}

// ==================== 🔍 EXPORTS PARA DEBUG ====================
if (APP_CONFIG.ENV === 'development') {
  window.ValidaDelivery = {
    state,
    dom,
    Logger,
    Analytics,
    ModalManager,
    FormManager,
    PaymentProcessor,
    NotificationManager,
    Utils,
    PerformanceMonitor,
    FieldFormatter,
    Validator,
    ErrorManager,
    App,
    version: APP_CONFIG.VERSION,
    config: APP_CONFIG,
  };

  console.log('%c🔧 Debug Mode Ativado', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
  console.log('%cAcesse window.ValidaDelivery para ferramentas de debug', 'color: #9ca3af; font-size: 12px;');
  console.log('%cComandos disponíveis:', 'color: #9ca3af; font-size: 12px;');
  console.log('%c  • state.getAll() - Ver estado', 'color: #6b7280; font-size: 11px;');
  console.log('%c  • Analytics.exportData() - Exportar analytics', 'color: #6b7280; font-size: 11px;');
  console.log('%c  • Logger.getLogs() - Ver logs', 'color: #6b7280; font-size: 11px;');
  console.log('%c  • PerformanceMonitor.getMetrics() - Métricas', 'color: #6b7280; font-size: 11px;');
}

// ==================== ✨ FIM DO JAVASCRIPT OTIMIZADO v2.2.0 ==================== //