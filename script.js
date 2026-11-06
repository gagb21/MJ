// =====================================================
// MJ: lógica del sitio
// =====================================================

const PASSWORD = "rosa"; // se compara sin distinguir mayúsculas
const TARGET_DATE = new Date('2026-11-06T10:15:00-05:00'); // 10:15 a. m. hora de Colombia
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const cover = document.getElementById('cover');
const openSealBtn = document.getElementById('open-seal');
const gateForm = document.getElementById('gate-form');
const passwordInput = document.getElementById('password-input');
const gateError = document.getElementById('gate-form-error');
const musicEl = document.getElementById('background-music');
const contentEl = document.getElementById('content');
const preOpening = document.getElementById('pre-opening');
const fullContent = document.getElementById('full-content');
const countdownEl = document.getElementById('countdown');
const openLetterBtn = document.getElementById('open-letter');
const goBackBtn = document.getElementById('go-back');

/* ---------- Contador y bloqueo por hora ---------- */
function isUnlocked() {
  return Date.now() >= TARGET_DATE.getTime();
}

function plural(n, singular, pluralWord) {
  return `${n} ${n === 1 ? singular : pluralWord}`;
}

function updateCountdown() {
  const diff = TARGET_DATE - new Date();

  if (diff > 0) {
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const parts = [];
    if (days > 0) parts.push(plural(days, 'día', 'días'));
    parts.push(plural(hours, 'hora', 'horas'));
    parts.push(plural(minutes, 'minuto', 'minutos'));
    parts.push(plural(seconds, 'segundo', 'segundos'));

    const last = parts.pop();
    countdownEl.textContent = `Podrás leerla en ${parts.join(', ')} y ${last}`;
    openLetterBtn.disabled = true;
  } else {
    countdownEl.textContent = '¡Ha llegado el momento!';
    openLetterBtn.disabled = false;
    clearInterval(countdownTimer);
  }
}
const countdownTimer = setInterval(updateCountdown, 1000);
updateCountdown();

/* ---------- Puerta de acceso ---------- */
openSealBtn.addEventListener('click', () => {
  if (gateForm.hasAttribute('hidden')) {
    gateForm.removeAttribute('hidden');
    openSealBtn.setAttribute('aria-expanded', 'true');
  }
  passwordInput.focus();
});

gateForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = passwordInput.value.trim().toLowerCase();

  if (value === PASSWORD) {
    gateError.textContent = '';
    openGateSuccess();
  } else {
    gateError.textContent = 'Esa no es la palabra correcta. Intenta de nuevo.';
    passwordInput.value = '';
    passwordInput.focus();
  }
});

function openGateSuccess() {
  if (reduceMotion) {
    cover.setAttribute('hidden', '');
  } else {
    cover.classList.add('is-leaving');
    setTimeout(() => cover.setAttribute('hidden', ''), 700);
  }
  contentEl.style.display = 'flex';
  if (musicEl) {
    musicEl.play().catch(() => { /* el navegador puede bloquear el audio */ });
  }
}

/* ---------- Navegación ---------- */
openLetterBtn.addEventListener('click', () => {
  if (!isUnlocked()) {
    updateCountdown();
    return;
  }
  preOpening.style.display = 'none';
  fullContent.style.display = 'block';
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

goBackBtn.addEventListener('click', () => {
  fullContent.style.display = 'none';
  preOpening.style.display = 'flex';
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ---------- Pétalos de rosa ---------- */
function createPetals() {
  const container = document.getElementById('petals');
  if (!container || reduceMotion) return;

  for (let i = 0; i < 8; i++) {
    const el = document.createElement('span');
    el.className = `petal${i % 4 === 0 ? ' petal--deep' : ''}`;
    el.style.left = `${Math.round(Math.random() * 96) + 2}%`;
    el.style.animationDuration = `${(14 + Math.random() * 10).toFixed(1)}s`;
    el.style.animationDelay = `${(Math.random() * 12).toFixed(1)}s`;
    el.style.setProperty('--drift-x', `${Math.round((Math.random() - 0.5) * 120)}px`);
    container.appendChild(el);
  }
}
createPetals();