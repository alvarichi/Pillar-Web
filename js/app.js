(function () {
  const e = window.EVENT || {};
  const byId = id => document.getElementById(id);
  const set = (id, text) => { const el = byId(id); if (el) el.textContent = text; };

  set('event-title', e.title);
  set('event-subtitle', e.subtitle);
  set('event-title-status', e.titleStatus);
  set('event-description', e.shortDescription);
  set('organizer', e.organizer);
  set('host', e.host);
  set('event-date', e.date);
  set('event-duration', e.duration);
  set('event-location', e.location);
  set('event-status', e.status);
  set('event-prize', e.prize);
  set('monster-points', e.monsterPoints);
  set('survivor-points', e.survivorPoints);
  set('max-players', e.maxPlayers ? `${e.maxPlayers}` : 'TBD');

  const gameLink = byId('roblox-link');
  if (gameLink && e.robloxUrl) gameLink.href = e.robloxUrl;
  const hostLink = byId('host-link');
  if (hostLink && e.hostUrl) hostLink.href = e.hostUrl;

  document.title = `${e.title || 'Event'} — Pillar Chase`;
  document.querySelectorAll('[data-event-title]').forEach(x => x.textContent = e.title || 'PILLAR CHASE EVENT');

  /* ---------------- Scroll animation system ---------------- */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  document.body.classList.add('motion-ready');
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.prepend(progress);

  const addReveal = (selector, mode = '', stagger = false) => {
    const nodes = Array.from(document.querySelectorAll(selector));
    if (stagger) nodes.forEach((el, i) => el.style.setProperty('--reveal-delay', `${Math.min(i * 75, 375)}ms`));
    nodes.forEach(el => el.classList.add('reveal', mode, stagger ? 'reveal-stagger-item' : ''));
    return nodes;
  };

  // Content appears as it enters the viewport.
  addReveal('.section-head', 'reveal-left');
  addReveal('.grid-3 > *, .grid-2 > *, .accent-card, .score-card, .step, .rule, .notice, .organizers-strip', 'reveal-scale', true);
  addReveal('.host-feature-main', 'reveal-left');
  addReveal('.milestone-card', 'reveal-right');
  addReveal('.event-flow .flow-item', 'reveal-scale', true);
  addReveal('.gallery-placeholder > *', 'reveal-scale', true);
  addReveal('.image-panel', 'reveal-scale');
  addReveal('.page-hero .lead', 'reveal');

  const revealNodes = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  revealNodes.forEach(node => observer.observe(node));

  // Image sheen when the image block becomes visible.
  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.image-placeholder').forEach(el => imageObserver.observe(el));

  // Subtle parallax on hero artwork only — avoids heavy effects on mobile.
  const heroArt = document.querySelector('.hero-art');
  const hero = document.querySelector('.hero');
  let ticking = false;
  let lastY = window.scrollY;
  const updateScrollEffects = () => {
    const y = window.scrollY;
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    progress.style.transform = `scaleX(${Math.min(1, Math.max(0, y / max))})`;

    if (heroArt && window.innerWidth > 700) {
      const rect = heroArt.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const parallaxY = Math.max(-22, Math.min(22, center * -0.055));
      heroArt.style.setProperty('--parallax-y', `${parallaxY.toFixed(1)}px`);
    }
    if (hero) hero.classList.toggle('hero-scrolled', y > 50);
    lastY = y;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollEffects);
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener('resize', updateScrollEffects, { passive: true });
  updateScrollEffects();

  // Follower bar animates once the milestone card is visible.
  const followerBar = byId('follower-progress');
  if (followerBar) {
    const followers = Number(e.currentFollowers || 0);
    const target = Number(e.followerGoal || 500);
    const percent = Math.min(100, Math.max(0, (followers / target) * 100));
    followerBar.dataset.targetWidth = `${percent}%`;
    followerBar.style.width = '0%';
    const barObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(() => { followerBar.style.width = followerBar.dataset.targetWidth; });
        barObserver.unobserve(entry.target);
      });
    }, { threshold: 0.55 });
    barObserver.observe(followerBar);
  }

  // Make leaderboard elements participate in the same motion system.
  const podiumCards = document.querySelectorAll('.podium-card');
  if (podiumCards.length) {
    const podiumObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('podium-visible');
      });
    }, { threshold: 0.25 });
    window.__podiumObserver = podiumObserver;
    podiumCards.forEach(card => podiumObserver.observe(card));
  }
})();
