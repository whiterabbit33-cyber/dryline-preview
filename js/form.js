'use strict';

(() => {
  const form = document.getElementById('request-form');
  if (!form) return;
  const fields = document.getElementById('form-fields');
  const success = document.getElementById('mock-success');
  const summary = document.getElementById('form-errors');
  const submit = document.getElementById('request-submit');
  const required = Array.from(form.querySelectorAll('[required]'));
  const kinds = Array.from(form.querySelectorAll('[name="request-kind"]'));

  function clearErrors() {
    summary.textContent = '';
    required.forEach((field) => {
      field.removeAttribute('aria-invalid');
      const error = document.getElementById(`${field.id}-error`);
      error.textContent = '';
      error.hidden = true;
    });
  }

  function updateKind() {
    const repair = kinds.some((kind) => kind.checked && kind.value === 'repair');
    document.getElementById('repair-booking').hidden = !repair;
    const title = repair ? 'Request service or repair' : 'Request a bid';
    document.getElementById('form-title').textContent = title;
    submit.textContent = title;
    document.getElementById('form-intro').textContent = repair
      ? 'For existing customers requesting service or repair. Required fields are marked.'
      : 'For new work or a bid. Required fields are marked.';
    document.getElementById('service').value = repair ? 'Repair' : '';
    clearErrors();
  }

  // Install cancellation before enabling fields; even an invalid request stays local.
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    clearErrors();
    const invalid = [];
    required.forEach((field) => {
      let message = '';
      if (!field.value.trim()) message = 'Please complete this required field.';
      else if (!field.checkValidity()) message = field.type === 'email'
        ? 'Enter a valid email address.' : 'Please check this field.';
      if (!message) return;
      invalid.push(field);
      field.setAttribute('aria-invalid', 'true');
      const error = document.getElementById(`${field.id}-error`);
      error.textContent = message;
      error.hidden = false;
    });
    if (invalid.length) {
      summary.textContent = `Please check ${invalid.length} required field${invalid.length === 1 ? '' : 's'}. Nothing was sent.`;
      invalid[0].focus();
      return;
    }
    // No network, storage, or file-reading operations. Clear local selections as well.
    form.reset();
    form.hidden = true;
    success.hidden = false;
    document.getElementById('success-title').focus();
  });

  function openRepair() {
    form.hidden = false;
    success.hidden = true;
    kinds.forEach((kind) => { kind.checked = kind.value === 'repair'; });
    updateKind();
  }

  function readHash() {
    if (window.location.hash === '#service-repair') openRepair();
  }

  window.addEventListener('hashchange', readHash);
  document.querySelectorAll('a[href*="request-a-bid.html#service-repair"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (window.location.hash !== '#service-repair') window.location.hash = 'service-repair';
      openRepair();
      document.getElementById('request-kind-repair').focus();
    });
  });
  kinds.forEach((kind) => kind.addEventListener('change', updateKind));
  document.getElementById('reset-form').addEventListener('click', (event) => {
    event.preventDefault();
    form.reset();
    updateKind();
    success.hidden = true;
    form.hidden = false;
    document.getElementById('name').focus();
  });
  fields.disabled = false;
  readHash();
})();
