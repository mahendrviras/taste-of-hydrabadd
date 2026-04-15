document.getElementById('year').textContent = new Date().getFullYear();

const loader = document.getElementById('loader');
const loaderName = document.getElementById('loaderName');
const nameText = 'MAHENDRA';
loaderName.innerHTML = [...nameText].map((char) => `<span class="loader__char">${char}</span>`).join('');

const loaderChars = loaderName.querySelectorAll('.loader__char');
loaderChars.forEach((char, index) => {
  setTimeout(() => {
    char.style.opacity = '1';
    char.style.transform = 'translateY(0)';
  }, index * 90);
});
setTimeout(() => {
  loaderName.style.letterSpacing = '0.45em';
}, 1100);
setTimeout(() => {
  loader.style.opacity = '0';
  loader.style.visibility = 'hidden';
  document.body.classList.add('loaded');
}, 1700);

const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },
  { root: null, threshold: 0.12, rootMargin: '0px 0px -5% 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const journeyCards = [...document.querySelectorAll('.journey-card')];
const setActiveCard = (targetCard) => {
  journeyCards.forEach((card, idx) => {
    const isActive = card === targetCard;
    card.classList.toggle('active', isActive);
    card.style.zIndex = isActive ? '20' : String(idx + 1);
  });
};

journeyCards.forEach((card) => {
  card.addEventListener('click', () => setActiveCard(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveCard(card);
    }
  });
});

if (window.matchMedia('(min-width: 901px)').matches) {
  const journeySection = document.getElementById('journey');
  const applyJourneyParallax = () => {
    const rect = journeySection.getBoundingClientRect();
    const viewport = window.innerHeight;
    const progress = Math.min(Math.max((viewport - rect.top) / (viewport + rect.height), 0), 1);

    const past = document.querySelector('.journey-card--past');
    const present = document.querySelector('.journey-card--present');
    const future = document.querySelector('.journey-card--future');

    if (past) past.style.transform = `translateY(${(-40 * progress).toFixed(2)}px) rotate(${(-3 - progress).toFixed(2)}deg)`;
    if (present) present.style.transform = `translateY(${(-15 * progress).toFixed(2)}px) rotate(${(1.5 + progress).toFixed(2)}deg)`;
    if (future) future.style.transform = `translateY(${(30 * progress).toFixed(2)}px) rotate(${(-1 - progress).toFixed(2)}deg)`;
  };

  applyJourneyParallax();
  window.addEventListener('scroll', applyJourneyParallax, { passive: true });
  window.addEventListener('resize', applyJourneyParallax);
}

const tabButtons = [...document.querySelectorAll('.tab-btn')];
const tabPanels = [...document.querySelectorAll('.tab-panel')];

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.tab;

    tabButtons.forEach((b) => {
      const active = b === btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', String(active));
    });

    tabPanels.forEach((panel) => {
      const active = panel.id === `panel-${key}`;
      panel.classList.toggle('active', active);
    });
  });
});

const hasFinePointer = window.matchMedia('(pointer:fine)').matches;
if (hasFinePointer) {
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  const loop = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(loop);
  };
  loop();

  window.addEventListener('resize', () => {
    mouseX = window.innerWidth / 2;
    mouseY = window.innerHeight / 2;
    ringX = mouseX;
    ringY = mouseY;
  });

  document.querySelectorAll('a, button, .journey-card, .tab-btn, .project').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.reset();
});
