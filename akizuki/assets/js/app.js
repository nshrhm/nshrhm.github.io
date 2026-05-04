
(() => {
  const qs = (sel, root=document) => root.querySelector(sel);
  const qsa = (sel, root=document) => [...root.querySelectorAll(sel)];

  const progress = qs('#scrollProgress');
  const setProgress = () => {
    if (!progress) return;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  };
  setProgress(); window.addEventListener('scroll', setProgress, {passive:true});

  qsa('[data-plan-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.planTab;
      qsa('[data-plan-tab]').forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      qsa('[data-plan-panel]').forEach(panel => {
        const active = panel.dataset.planPanel === key;
        panel.classList.toggle('active', active);
        panel.hidden = !active;
      });
      localStorage.setItem('akizuki-plan', key);
    });
  });
  const savedPlan = localStorage.getItem('akizuki-plan');
  if (savedPlan && qs(`[data-plan-tab="${savedPlan}"]`)) qs(`[data-plan-tab="${savedPlan}"]`).click();

  qsa('input[type="checkbox"]').forEach(input => {
    const key = input.dataset.persist || input.id;
    if (!key) return;
    const storeKey = `akizuki-check-${key}`;
    input.checked = localStorage.getItem(storeKey) === '1';
    input.addEventListener('change', () => localStorage.setItem(storeKey, input.checked ? '1' : '0'));
  });

  const navLinks = qsa('.bottom-nav a');
  const page = document.body.dataset.page;
  if (page === 'links') {
    navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === 'links'));
  } else {
    const sections = qsa('.section-anchor');
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.id;
      navLinks.forEach(a => a.classList.toggle('active', a.dataset.nav === id));
    }, {rootMargin:'-35% 0px -55% 0px', threshold:[0.1,0.25,0.5]});
    sections.forEach(s => observer.observe(s));
  }

  let deferredPrompt;
  const installBtn = qs('#installBtn');
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (installBtn) installBtn.hidden = false;
  });
  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    installBtn.hidden = true;
    deferredPrompt = null;
  });

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }
})();
