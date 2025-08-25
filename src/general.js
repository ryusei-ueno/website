// menu の開閉状態をブレークポイントと同期
const menu    = document.querySelector('details.menu');
const summary = menu.querySelector('summary');
const mq      = window.matchMedia('(max-width: 600px)');

function syncAria() {
    summary.setAttribute('aria-expanded', menu.open ? 'true' : 'false');
}

function applyMode() {
    if (mq.matches) {
        // Close for mobile
        menu.removeAttribute('open');
    } else {
        // Open for desktop
        menu.setAttribute('open', '');
    }
    syncAria();
}

// Initialization
applyMode();
mq.addEventListener('change', applyMode);

// Close with click or Esc
document.addEventListener('click', (e) => {
    if (mq.matches && menu.open && !menu.contains(e.target)) {
        menu.open = false; syncAria();
    }
    });
    document.addEventListener('keydown', (e) => {
    if (mq.matches && e.key === 'Escape') {
        menu.open = false; syncAria();
    }
});

menu.addEventListener('toggle', syncAria);