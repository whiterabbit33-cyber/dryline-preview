'use strict';

(() => {
  const button = document.querySelector('.menu-btn');
  const overlay = document.getElementById('mobile-menu');
  if (!button || !overlay) return;

  const mobile = window.matchMedia('(max-width: 768px)');
  let previousScroll = 0;
  const isOpen = () => document.body.classList.contains('menu-open');

  function setOpen(open, restoreFocus = true) {
    open = open && mobile.matches;
    if (open === isOpen()) return;
    if (open) previousScroll = window.scrollY;
    document.body.classList.toggle('menu-open', open);
    button.classList.toggle('close', open);
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    overlay.setAttribute('aria-hidden', String(!open));
    overlay.inert = !open;
    if (open) {
      overlay.querySelector('a').focus({ preventScroll: true });
    } else {
      window.scrollTo(0, previousScroll);
      if (restoreFocus) button.focus({ preventScroll: true });
    }
  }

  button.addEventListener('click', () => setOpen(!isOpen()));
  overlay.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
    }
    if (event.key === 'Tab') {
      const items = [document.querySelector('.logo-link'), button,
        ...overlay.querySelectorAll('a[href]')];
      const index = items.indexOf(document.activeElement);
      const next = event.shiftKey ? index - 1 : index + 1;
      event.preventDefault();
      items[(next + items.length) % items.length].focus();
    }
  });
  mobile.addEventListener('change', () => {
    if (!mobile.matches) setOpen(false, false);
  });
})();
