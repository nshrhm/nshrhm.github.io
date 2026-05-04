(() => {
  const root = document.documentElement;
  const body = document.body;

  function updateScroll(){
    const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll', Math.round((window.scrollY / h) * 100));
  }
  updateScroll(); window.addEventListener('scroll', updateScroll, {passive:true});

  const updateOnline = () => body.classList.toggle('offline', !navigator.onLine);
  window.addEventListener('online', updateOnline); window.addEventListener('offline', updateOnline); updateOnline();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
  }

  let deferredPrompt;
  const installButtons = document.querySelectorAll('.install-btn');
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault(); deferredPrompt = e;
    installButtons.forEach(btn => btn.classList.add('is-ready'));
  });
  installButtons.forEach(btn => btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt(); await deferredPrompt.userChoice;
    deferredPrompt = null; installButtons.forEach(b => b.classList.remove('is-ready'));
  }));

  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      try { await navigator.clipboard.writeText(text); btn.textContent = 'コピー済み'; setTimeout(()=>btn.textContent='コピー',1500); }
      catch { alert(text); }
    });
  });

  document.querySelectorAll('.check-item').forEach(input => {
    const id = input.dataset.id;
    input.checked = localStorage.getItem('check:' + id) === '1';
    const card = input.closest('.time-card'); if (input.checked && card) card.classList.add('done');
    input.addEventListener('change', () => {
      localStorage.setItem('check:' + id, input.checked ? '1' : '0');
      const c = input.closest('.time-card'); if (c) c.classList.toggle('done', input.checked);
    });
  });

  const tabs = document.querySelectorAll('[data-plan-tab]');
  const panels = document.querySelectorAll('[data-plan-panel]');
  function activatePlan(name){
    tabs.forEach(t => t.classList.toggle('active', t.dataset.planTab === name));
    panels.forEach(p => p.classList.toggle('active', p.dataset.planPanel === name));
    localStorage.setItem('selectedPlan', name);
  }
  tabs.forEach(t => t.addEventListener('click', () => activatePlan(t.dataset.planTab)));
  const savedPlan = localStorage.getItem('selectedPlan');
  if (savedPlan && tabs.length) activatePlan(savedPlan);

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.08});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add('visible'));

  // Highlight the next itinerary card on the travel day. Outside the day, show first unchecked item.
  const cards = Array.from(document.querySelectorAll('.time-card[data-time]'));
  if (cards.length) {
    const now = new Date();
    const isTravelDay = now.getFullYear() === 2026 && now.getMonth() === 4 && now.getDate() === 9;
    let next;
    if (isTravelDay) {
      const minutes = now.getHours() * 60 + now.getMinutes();
      next = cards.find(card => {
        const [h,m] = card.dataset.time.split(':').map(Number);
        return h * 60 + m >= minutes;
      });
    }
    if (!next) next = cards.find(card => !card.classList.contains('done')) || cards[0];
    if (next) next.classList.add('is-next');
  }

  const today = document.getElementById('generated-date');
  if (today) today.textContent = new Intl.DateTimeFormat('ja-JP', { dateStyle:'medium' }).format(new Date(2026,4,4));

  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const data = {title: document.title, text: '門司港レトロ旅のしおり', url: location.href};
      if (navigator.share) await navigator.share(data); else if (navigator.clipboard) { await navigator.clipboard.writeText(location.href); btn.textContent = 'URLコピー済み'; }
    });
  });
})();