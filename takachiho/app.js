(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

  const bar = $('#scrollbar');
  if (bar) {
    const updateBar = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : '0%';
    };
    updateBar();
    window.addEventListener('scroll', updateBar, { passive: true });
  }

  const tripStatus = $('#tripStatus');
  if (tripStatus) {
    const start = new Date('2026-05-26T06:00:00+09:00');
    const end = new Date('2026-05-28T21:00:00+09:00');
    const now = new Date();
    let text = '';
    if (now < start) {
      const days = Math.ceil((start - now) / 86400000);
      text = `出発まであと ${days} 日`;
    } else if (now <= end) {
      const day = Math.floor((now - start) / 86400000) + 1;
      text = `旅行中：${Math.min(day, 3)}日目`;
    } else {
      text = '旅行完了。おつかれさまでした。';
    }
    tripStatus.textContent = text;
  }

  const navLinks = $$('.bottom-nav a[href^="#"]');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${visible.target.id}`));
    }, { rootMargin: '-35% 0px -50% 0px', threshold: [0.1, 0.25, 0.5] });
    sections.forEach(s => observer.observe(s));
  }

  $$('[data-plan-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const group = button.dataset.planGroup;
      const plan = button.dataset.plan;
      $$(`[data-plan-toggle][data-plan-group="${group}"]`).forEach(b => b.classList.toggle('active', b.dataset.plan === plan));
      $$(`[data-plan-box][data-plan-group="${group}"]`).forEach(box => box.classList.toggle('active', box.dataset.plan === plan));
      localStorage.setItem(`plan:${group}`, plan);
    });
  });
  const groups = new Set($$('[data-plan-toggle]').map(b => b.dataset.planGroup));
  groups.forEach(group => {
    const saved = localStorage.getItem(`plan:${group}`) || 'a';
    const button = $(`[data-plan-toggle][data-plan-group="${group}"][data-plan="${saved}"]`);
    if (button) button.click();
  });

  $$('[data-check]').forEach(input => {
    const key = `check:${input.dataset.check}`;
    input.checked = localStorage.getItem(key) === '1';
    input.addEventListener('change', () => localStorage.setItem(key, input.checked ? '1' : '0'));
  });

  const memo = $('#tripMemo');
  if (memo) {
    memo.value = localStorage.getItem('trip:memo') || '';
    memo.addEventListener('input', () => localStorage.setItem('trip:memo', memo.value));
  }

  $('#printBtn')?.addEventListener('click', () => window.print());

  const offlineBanner = $('#offlineBanner');
  if (offlineBanner && location.protocol === 'file:') {
    offlineBanner.classList.add('show');
  }

  let deferredPrompt = null;
  const installBtn = $('#installBtn');
  if (installBtn) installBtn.style.display = 'none';
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installBtn) installBtn.style.display = 'inline-flex';
  });
  installBtn?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.style.display = 'none';
  });

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
  }
})();
