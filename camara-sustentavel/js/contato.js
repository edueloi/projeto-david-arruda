// js/contato.js

document.addEventListener('DOMContentLoaded', function () {
  // --- elementos principais ---
  const contactForm   = document.getElementById('contactForm');
  const successMsgEl  = document.getElementById('successMessage');
  const submitButton  = document.getElementById('submitButton');
  const resetButton   = document.getElementById('resetButton');

  if (!contactForm) return;

  // --- campos do formulário (alguns podem não existir; por isso os "?" mais abaixo) ---
  const nameEl    = document.getElementById('name');
  const emailEl   = document.getElementById('email');
  const phoneEl   = document.getElementById('phone');
  const topicEl   = document.getElementById('topic');
  const messageEl = document.getElementById('message');
  const fileEl    = document.getElementById('file');
  const prefEl    = document.getElementById('pref');
  const lgpdEl    = document.getElementById('lgpd');

  // --- utilidades ---
  const $err = (id) => document.querySelector(`[data-error-for="${id}"]`);
  const showToast = (msg) => {
    const t = document.getElementById('toast');
    if (!t) return; // toast é opcional
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 4000);
  };

  // --- validadores simples ---
  const validators = {
    name:     (v) => (v && v.trim().length > 2) || 'Informe seu nome completo.',
    email:    (v) => (/.+@.+\..+/.test(v)) || 'Informe um e-mail válido.',
    topic:    (v) => (v && String(v).trim().length > 0) || 'Selecione um assunto.',
    message:  (v) => (v && v.trim().length > 10) || 'Conte um pouco mais (mín. 10 caracteres).',
    lgpd:     (v) => (v === true) || 'É necessário concordar com a LGPD.',
  };

  function setError(inputEl, message) {
    if (!inputEl) return;
    // classe visual de erro (reaproveita seu CSS .error/.error-text)
    inputEl.classList.toggle('error', Boolean(message));
    const errEl = $err(inputEl.id);
    if (errEl) errEl.textContent = message || '';
  }

  function getValue(inputEl) {
    if (!inputEl) return '';
    if (inputEl.type === 'checkbox') return inputEl.checked;
    return inputEl.value;
  }

  function validateField(inputEl, key) {
    if (!inputEl || !validators[key]) return true;
    const result = validators[key](getValue(inputEl));
    setError(inputEl, result === true ? '' : result);
    return result === true;
  }

  // --- listeners de validação ao digitar/alterar ---
  nameEl   && nameEl.addEventListener('input', () => validateField(nameEl, 'name'));
  emailEl  && emailEl.addEventListener('input', () => validateField(emailEl, 'email'));
  topicEl  && topicEl.addEventListener('change', () => validateField(topicEl, 'topic'));
  messageEl&& messageEl.addEventListener('input', () => validateField(messageEl, 'message'));
  lgpdEl   && lgpdEl.addEventListener('change', () => validateField(lgpdEl, 'lgpd'));

  // --- máscara leve de telefone (somente UX) ---
  phoneEl && phoneEl.addEventListener('input', () => {
    let v = phoneEl.value.replace(/\D/g, '');
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length > 6) phoneEl.value = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
    else if (v.length > 2) phoneEl.value = `(${v.slice(0,2)}) ${v.slice(2)}`;
    else if (v.length > 0) phoneEl.value = `(${v}`;
  });

  // --- SUBMIT ---
  contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    // valida tudo antes de enviar
    const allOk = [
      validateField(nameEl, 'name'),
      validateField(emailEl, 'email'),
      validateField(topicEl, 'topic'),
      validateField(messageEl, 'message'),
      validateField(lgpdEl, 'lgpd'),
    ].every(Boolean);

    if (!allOk) {
      showToast('Verifique os campos destacados.');
      return;
    }

    // feedback no botão
    const originalHTML = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `Enviando... <i class="fas fa-spinner fa-spin"></i>`;

    // coleta os dados
    const payload = {
      name:    getValue(nameEl),
      email:   getValue(emailEl),
      phone:   getValue(phoneEl) || '',
      topic:   getValue(topicEl) || '',
      message: getValue(messageEl),
      pref:    getValue(prefEl) || '',
      // meta do anexo (não salva arquivo no localStorage)
      file: fileEl && fileEl.files && fileEl.files[0] ? {
        name: fileEl.files[0].name,
        size: fileEl.files[0].size,
        type: fileEl.files[0].type
      } : null,
      timestamp: new Date().toISOString()
    };

    // simula envio/usa localStorage (mantendo seu comportamento)
    setTimeout(() => {
      // lê e grava
      const stored = JSON.parse(localStorage.getItem('contactMessages')) || [];
      stored.push(payload);
      localStorage.setItem('contactMessages', JSON.stringify(stored));

      // sucesso visual
      if (successMsgEl) {
        successMsgEl.textContent = 'Mensagem enviada com sucesso! Agradecemos seu contato.';
        successMsgEl.style.display = 'block';
      }
      showToast('Mensagem enviada com sucesso!');

      // reset
      contactForm.reset();
      // limpa erros
      document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
      document.querySelectorAll('[data-error-for]').forEach(el => el.textContent = '');

      // restaura botão e esconde o aviso após 4s
      setTimeout(() => {
        if (successMsgEl) successMsgEl.style.display = 'none';
        submitButton.disabled = false;
        submitButton.innerHTML = originalHTML;
      }, 4000);

      console.log('Mensagem salva no localStorage:', stored);
    }, 800); // atraso curto para UX
  });

  // --- RESET ---
  resetButton && resetButton.addEventListener('click', () => {
    contactForm.reset();
    document.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    document.querySelectorAll('[data-error-for]').forEach(el => el.textContent = '');
    if (successMsgEl) successMsgEl.style.display = 'none';
  });
});
