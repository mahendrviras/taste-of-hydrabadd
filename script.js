document.getElementById('year').textContent = new Date().getFullYear();

gsap.registerPlugin(ScrollTrigger);

const loader = document.getElementById('loader');
const loaderName = document.getElementById('loaderName');
const nameText = 'MAHENDRA';
loaderName.innerHTML = [...nameText].map((char) => `<span class="loader__char">${char}</span>`).join('');

const loaderChars = loaderName.querySelectorAll('.loader__char');
const introTl = gsap.timeline({ defaults: { ease: 'power2.out' } });
introTl
  .to(loaderChars, { opacity: 1, y: 0, stagger: 0.08, duration: 0.4 })
  .to(loaderName, { letterSpacing: '0.45em', duration: 0.5 }, '+=0.2')
  .to(loader, { autoAlpha: 0, duration: 0.55 }, '+=0.35');

gsap.from('#heroLine', { scaleX: 0, duration: 1.1, delay: 0.8, ease: 'power3.out' });

const revealMap = {
  up: { y: 40 },
  left: { x: -45 },
  scale: { scale: 0.92 }
};

document.querySelectorAll('.reveal').forEach((el) => {
  const type = el.dataset.reveal || 'up';
  gsap.fromTo(
    el,
    { opacity: 0, ...(revealMap[type] || revealMap.up) },
    {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      ease: 'power2.out',
      duration: 0.8,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%'
      }
    }
  );
});

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
  gsap.to('.journey-card--past', {
    y: -40,
    rotate: -4,
    scrollTrigger: { trigger: '#journey', start: 'top 70%', end: 'bottom 30%', scrub: 1 }
  });
  gsap.to('.journey-card--present', {
    y: -15,
    rotate: 2.5,
    scrollTrigger: { trigger: '#journey', start: 'top 70%', end: 'bottom 30%', scrub: 1 }
  });
  gsap.to('.journey-card--future', {
    y: 30,
    rotate: -2,
    scrollTrigger: { trigger: '#journey', start: 'top 70%', end: 'bottom 30%', scrub: 1 }
  });
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

  document.querySelectorAll('a, button, .journey-card, .tab-btn, .project').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('active'));
  });
}

document.querySelector('.contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  event.currentTarget.reset();
});
