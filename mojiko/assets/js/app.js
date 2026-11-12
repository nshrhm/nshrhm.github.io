(() => {
  const root = document.documentElement;
  const body = document.body;
  const storagePrefix = 'mojiko:2026-11-13:v2:';
  const storage = {
    get(key) { try { return localStorage.getItem(storagePrefix + key); } catch { return null; } },
    set(key, value) {
      try { localStorage.setItem(storagePrefix + key, value); }
      catch {
        if (!document.getElementById('storage-status')) {
          const notice = document.createElement('p');
          notice.id = 'storage-status'; notice.className = 'note'; notice.role = 'status';
          notice.textContent = 'このブラウザではチェックを保存できません。この画面を閉じると選択は戻ります。';
          document.getElementById('main').prepend(notice);
        }
      }
    }
  };

  function updateScroll(){
    const h = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll', Math.round((window.scrollY / h) * 100));
  }
  updateScroll(); window.addEventListener('scroll', updateScroll, {passive:true});

  const updateOnline = () => body.classList.toggle('offline', !navigator.onLine);
  window.addEventListener('online', updateOnline); window.addEventListener('offline', updateOnline); updateOnline();

  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js', {updateViaCache: 'none'}).catch(() => {}));
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
    input.checked = storage.get('check:' + id) === '1';
    const card = input.closest('.time-card'); if (input.checked && card) card.classList.add('done');
    input.addEventListener('change', () => {
      storage.set('check:' + id, input.checked ? '1' : '0');
      const c = input.closest('.time-card'); if (c) c.classList.toggle('done', input.checked);
      updateNext();
    });
  });

  const tabs = document.querySelectorAll('[data-plan-tab]');
  const panels = document.querySelectorAll('[data-plan-panel]');
  function activatePlan(name){
    if (!Array.from(tabs).some(t => t.dataset.planTab === name)) name = 'a';
    tabs.forEach(t => {
      const active = t.dataset.planTab === name;
      t.classList.toggle('active', active); t.setAttribute('aria-selected', String(active)); t.tabIndex = active ? 0 : -1;
    });
    panels.forEach(p => {
      const active = p.dataset.planPanel === name;
      p.classList.toggle('active', active); p.hidden = !active;
    });
    storage.set('selectedPlan', name);
    updateNext();
  }
  tabs.forEach(t => t.addEventListener('click', () => activatePlan(t.dataset.planTab)));
  tabs.forEach((tab, index) => tab.addEventListener('keydown', e => {
    const keys = {ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length, Home: 0, End: tabs.length - 1};
    if (!(e.key in keys)) return;
    e.preventDefault(); const target = tabs[keys[e.key]]; activatePlan(target.dataset.planTab); target.focus();
  }));
  document.querySelectorAll('.return-plan-a').forEach(el => el.addEventListener('click', () => { activatePlan('a'); tabs[0].focus(); }));

  const reveal = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } }), {threshold:.08});
    reveal.forEach(el => io.observe(el));
  } else reveal.forEach(el => el.classList.add('visible'));

  // Use Japan time regardless of the device timezone, and only the visible plan.
  function updateNext(){
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date()).map(p => [p.type, p.value]));
    const isTravelDay = `${parts.year}-${parts.month}-${parts.day}` === '2026-11-13';
    const minutes = Number(parts.hour) * 60 + Number(parts.minute);
    document.querySelectorAll('.time-card.is-next').forEach(c => c.classList.remove('is-next'));
    document.querySelectorAll('[data-itinerary]').forEach(timeline => {
      const status = timeline.previousElementSibling;
      if (timeline.closest('[hidden]')) { status.textContent = ''; return; }
      const cards = Array.from(timeline.querySelectorAll('.time-card[data-time]'));
      const pending = cards.filter(c => !c.classList.contains('done'));
      const next = pending.find(c => {
        const [h,m] = c.dataset.time.split(':').map(Number);
        return !isTravelDay || h * 60 + m >= minutes;
      });
      if (next) {
        next.classList.add('is-next');
        status.textContent = `${isTravelDay ? '次の予定（日本時間）' : '未チェックの予定'}：${next.dataset.time} ${next.querySelector('.time-title').textContent}`;
      } else status.textContent = pending.length ? '本日の予定時刻を過ぎました。帰着・未チェックの項目を確認してください。' : 'このプランのチェックはすべて完了しました。';
    });
  }
  if (tabs.length) activatePlan(storage.get('selectedPlan') || 'a'); else updateNext();
  setInterval(updateNext, 30000);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateNext(); });
  window.addEventListener('storage', e => {
    if (!e.key || !e.key.startsWith(storagePrefix)) return;
    document.querySelectorAll('.check-item').forEach(input => {
      input.checked = storage.get('check:' + input.dataset.id) === '1';
      input.closest('.time-card')?.classList.toggle('done', input.checked);
    });
    if (e.key === storagePrefix + 'selectedPlan' && tabs.length) activatePlan(storage.get('selectedPlan'));
    updateNext();
  });

  document.querySelectorAll('[data-share]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const data = {title: document.title, text: '2026年11月13日（金）09:00自宅出発・唐戸経由で巌流島上陸。焼きカレーとプリン、16:00頃帰宅は努力目標。', url: location.href};
      try {
        if (navigator.share) await navigator.share(data);
        else if (navigator.clipboard) { await navigator.clipboard.writeText(location.href); btn.textContent = 'URLコピー済み'; }
        else alert(location.href);
      } catch (error) { if (error.name !== 'AbortError') alert('共有できませんでした。URLをコピーしてください。\n' + location.href); }
    });
  });
})();
