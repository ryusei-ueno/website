// Mark that JS is enabled (used by CSS to hide the fallback)
  document.documentElement.classList.add('js-enabled');

  (function () {
    const el = document.querySelector('.email-line');
    if (!el) return;

    // Pull from data-* so the raw address never lives in the HTML text
    const u = el.getAttribute('data-user');         // "ueno"
    const d = el.getAttribute('data-domain');       // "university.ac.jp"
    const subj = el.getAttribute('data-subject') || '';
    if (!u || !d) return;

    const addr = `${u}@${d}`;
    const a = document.createElement('a');
    a.href = `mailto:${addr}?subject=${encodeURIComponent(subj)}`;
    a.textContent = addr;
    a.setAttribute('aria-label', `Email: ${addr}`);
    el.appendChild(a);
  })();