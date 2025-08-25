const KEYWORDS = [
    "Sociology of Associations",
    "Actor-Network Theory",
    "Posthumanism",
    "Reassembling the Social",
  ];

  // Keep relative emphasis: each weight is relative to the largest label (28px baseline)
const SIZE_WEIGHTS = [1.00, 24/28, 22/28, 26/28];
// When the container hits its CSS max-width, the largest label targets this px size
const BASE_AT_MAX_WIDTH = 28; // px

function remToPx(rem) {
  const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  return rem * fs;
}

function maxWidthPxOf(el) {
  // Try to read the computed max-width in px; fallback to current width if 'none'
  const mw = getComputedStyle(el).maxWidth;
  return (mw.endsWith('px') ? parseFloat(mw) : width) || 1000;
}

function computeResponsiveSizes() {
  const minPx = remToPx(1);              // minimum size = 1rem
  const maxW = maxWidthPxOf(WRAP);       // e.g., 1000 from CSS
  const scale = Math.min(1, width / maxW); // 0..1 because container ≤ max-width
  const base = Math.max(minPx, BASE_AT_MAX_WIDTH * scale);

  // Clamp each keyword size to ≥ 1rem while preserving relative weights
  return SIZE_WEIGHTS.map(w => Math.max(minPx, Math.round(base * w)));
}

  // Speed range in px/s
  const SPEED_MIN = 40, SPEED_MAX = 85;

  // Font family (as requested)
  const FAMILY = '"Moon", Verdana, Geneva, Tahoma, sans-serif';

  // Text color (pure white)
  const TEXT_COLOR = '#fff';

  // --- Setup ----------------------------------------------------------------
  const WRAP = document.querySelector('.keywords-wrap');
  const CANVAS = document.getElementById('keywordsCanvas');
  const CTX = CANVAS.getContext('2d');
  const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)') ?? { matches: false };

  let width = 0, height = 0, dpr = 1;
  let items = [];
  let rafId = null;
  let last = performance.now();

  function setupCanvas() {
    const rect = WRAP.getBoundingClientRect();
    width  = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    dpr = Math.max(1, window.devicePixelRatio || 1);

    CANVAS.width  = Math.round(width * dpr);
    CANVAS.height = Math.round(height * dpr);
    CANVAS.style.width  = width + 'px';
    CANVAS.style.height = height + 'px';

    // Draw using CSS pixels
    CTX.setTransform(dpr, 0, 0, dpr, 0, 0);
    CTX.textBaseline = 'top';
  }

  function fontFor(sizePx) {
    return `600 ${sizePx}px ${FAMILY}`;
  }

  function computeMetrics(text, sizePx) {
    CTX.font = fontFor(sizePx);
    const m = CTX.measureText(text);
    const w = Math.ceil(m.width);
    const h = Math.ceil((m.actualBoundingBoxAscent ?? sizePx * 0.8) +
                        (m.actualBoundingBoxDescent ?? sizePx * 0.2));
    return { w, h };
  }

  function random(min, max) { return Math.random() * (max - min) + min; }

function initItems() {
  const SIZES = computeResponsiveSizes();
  items = KEYWORDS.map((text, i) => {
    const size = SIZES[i] ?? SIZES[SIZES.length - 1];
    const { w, h } = computeMetrics(text, size);
    const padding = 8;
    const x = random(padding, Math.max(padding, width - w - padding));
    const y = random(padding, Math.max(padding, height - h - padding));
    const speed = random(SPEED_MIN, SPEED_MAX);
    const angle = random(0, Math.PI * 2);
    return {
      idx: i, // keep index to recompute the corresponding size on resize
      text, x, y, w, h, size,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
  });

    // Light initial de-overlap
    for (let k = 0; k < 40; k++) {
      let moved = false;
      for (let i = 0; i < items.length; i++) {
        for (let j = i + 1; j < items.length; j++) {
          if (intersects(items[i], items[j])) {
            separate(items[i], items[j]);
            moved = true;
          }
        }
      }
      if (!moved) break;
    }
  }

  function intersects(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  function separate(a, b) {
    const overlapX = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
    const overlapY = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);
    if (overlapX < overlapY) {
      const dx = overlapX / 2;
      if (a.x < b.x) { a.x -= dx; b.x += dx; } else { a.x += dx; b.x -= dx; }
    } else {
      const dy = overlapY / 2;
      if (a.y < b.y) { a.y -= dy; b.y += dy; } else { a.y += dy; b.y -= dy; }
    }
  }

  function update(dt) {
    for (const it of items) {
      it.x += it.vx * dt;
      it.y += it.vy * dt;

      // Wall reflection (bounce at edges)
      if (it.x <= 0)             { it.x = 0;              it.vx =  Math.abs(it.vx); }
      if (it.x + it.w >= width)  { it.x = width - it.w;   it.vx = -Math.abs(it.vx); }
      if (it.y <= 0)             { it.y = 0;              it.vy =  Math.abs(it.vy); }
      if (it.y + it.h >= height) { it.y = height - it.h;  it.vy = -Math.abs(it.vy); }
    }

    // Simple rectangle collisions: swap velocity components and separate
    for (let i = 0; i < items.length; i++) {
      for (let j = i + 1; j < items.length; j++) {
        const a = items[i], b = items[j];
        if (intersects(a, b)) {
          const overlapX = Math.min(a.x + a.w - b.x, b.x + b.w - a.x);
          const overlapY = Math.min(a.y + a.h - b.y, b.y + b.h - a.y);
          if (overlapX < overlapY) {
            const sign = (a.x < b.x) ? -1 : 1;
            a.x += sign * overlapX / 2; b.x -= sign * overlapX / 2;
            const tmp = a.vx; a.vx = b.vx; b.vx = tmp;
          } else {
            const sign = (a.y < b.y) ? -1 : 1;
            a.y += sign * overlapY / 2; b.y -= sign * overlapY / 2;
            const tmp = a.vy; a.vy = b.vy; b.vy = tmp;
          }
        }
      }
    }
  }

  function draw() {
    CTX.clearRect(0, 0, width, height);

    // No background chips, only white text
    for (const it of items) {
      CTX.font = fontFor(it.size);
      CTX.fillStyle = TEXT_COLOR;
      CTX.fillText(it.text, it.x, it.y);
    }
  }

  function frame(now) {
    const dt = Math.min(0.04, (now - last) / 1000); // Clamp to 40ms for stability
    last = now;
    update(dt);
    draw();
    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (rafId !== null) return;
    last = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    if (rafId != null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
  }

function onResize() {
  const prevW = width, prevH = height;
  setupCanvas();

  const SIZES = computeResponsiveSizes();

  items.forEach((it) => {
    // update size responsively (min 1rem)
    it.size = SIZES[it.idx] ?? it.size;

    // recompute text metrics with the new size
    const m = computeMetrics(it.text, it.size);
    it.w = m.w; it.h = m.h;

    // keep relative positions after resize
    if (prevW && prevH) {
      it.x = it.x * (width / prevW);
      it.y = it.y * (height / prevH);
    }
    it.x = Math.min(Math.max(0, it.x), Math.max(0, width - it.w));
    it.y = Math.min(Math.max(0, it.y), Math.max(0, height - it.h));
  });

  draw();
}

  // Boot
  setupCanvas();
  initItems();
  draw();

  // Respect reduced motion; pause when off-screen
  if (!reduceMotion.matches) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) start(); else stop();
    }, { threshold: 0.1 });
    io.observe(WRAP);
  }

  // Recalculate on resize and when fonts finish loading (for custom "Moon" font)
  window.addEventListener('resize', onResize);
  document.fonts?.ready?.then(() => onResize());

  // Optional: click to reshuffle velocity vectors
  CANVAS.addEventListener('click', () => {
    for (const it of items) {
      const angle = Math.random() * Math.PI * 2;
      const speed = random(SPEED_MIN, SPEED_MAX);
      it.vx = Math.cos(angle) * speed;
      it.vy = Math.sin(angle) * speed;
    }
  });