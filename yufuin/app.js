(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const store = {
    get(k, fallback='') { try { return localStorage.getItem(k) ?? fallback; } catch { return fallback; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} }
  };

  function setLinks(){
    $$('[data-url]').forEach(el => {
      const key = el.getAttribute('data-url');
      const url = (URLS && URLS[key]) || (MAPS && MAPS[key]) || key;
      if(url) el.setAttribute('href', url);
    });
  }

  function initCountdown(){
    const root = $('#countdown');
    if(!root) return;
    const target = new Date(TRIP.checkinISO).getTime();
    const units = { days: $('#cd-days'), hours: $('#cd-hours'), mins: $('#cd-mins'), secs: $('#cd-secs') };
    function tick(){
      const now = Date.now();
      let diff = Math.max(0, target - now);
      const days = Math.floor(diff / 86400000); diff -= days * 86400000;
      const hours = Math.floor(diff / 3600000); diff -= hours * 3600000;
      const mins = Math.floor(diff / 60000); diff -= mins * 60000;
      const secs = Math.floor(diff / 1000);
      if(units.days) units.days.textContent = days;
      if(units.hours) units.hours.textContent = String(hours).padStart(2,'0');
      if(units.mins) units.mins.textContent = String(mins).padStart(2,'0');
      if(units.secs) units.secs.textContent = String(secs).padStart(2,'0');
    }
    tick(); setInterval(tick, 1000);
  }

  function initPlan(){
    const plan = store.get('trip-plan', 'a');
    document.body.classList.toggle('show-plan-a', plan !== 'b');
    document.body.classList.toggle('show-plan-b', plan === 'b');
    $$('[data-plan-button]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.planButton === plan);
      btn.addEventListener('click', () => {
        const next = btn.dataset.planButton;
        store.set('trip-plan', next);
        document.body.classList.toggle('show-plan-a', next !== 'b');
        document.body.classList.toggle('show-plan-b', next === 'b');
        $$('[data-plan-button]').forEach(b => b.classList.toggle('active', b.dataset.planButton === next));
      });
    });
  }

  function renderShopping(){
    const root = $('#shopping-list');
    if(!root || !window.SHOPPING) return;
    const grouped = SHOPPING.reduce((acc, item, i) => {
      item.id = item.id || `item-${i}`;
      (acc[item.group] ||= []).push(item);
      return acc;
    }, {});
    root.innerHTML = Object.entries(grouped).map(([group, items]) => `
      <section class="check-group" data-group="${escapeHTML(group)}">
        <h3>${escapeHTML(group)} <span class="chip">${items.length}件</span></h3>
        <div class="checklist">
          ${items.map(item => {
            const id = `shop-${item.id}`;
            return `<label class="check-item" data-search="${escapeHTML((item.item+' '+item.group+' '+item.owner+' '+item.priority).toLowerCase())}">
              <input type="checkbox" id="${id}" data-check-id="${item.id}">
              <span><strong>${escapeHTML(item.item)} <span class="tag ${tagClass(item.priority)}">${escapeHTML(item.priority)}</span></strong><small>${escapeHTML(item.amount)}｜${escapeHTML(item.owner)}</small></span>
            </label>`;
          }).join('')}
        </div>
      </section>
    `).join('');
    $$('[data-check-id]', root).forEach(input => {
      const key = `shopping-${input.dataset.checkId}`;
      input.checked = store.get(key, '0') === '1';
      input.closest('.check-item').classList.toggle('done', input.checked);
      input.addEventListener('change', () => {
        store.set(key, input.checked ? '1' : '0');
        input.closest('.check-item').classList.toggle('done', input.checked);
        updateShoppingProgress();
      });
    });
    updateShoppingProgress();
  }

  function tagClass(priority){
    if(/必須|宿になし|お酒/.test(priority)) return 'orange';
    if(/おすすめ|お土産|大分/.test(priority)) return 'gold';
    return '';
  }

  function updateShoppingProgress(){
    const inputs = $$('[data-check-id]');
    if(!inputs.length) return;
    const checked = inputs.filter(i => i.checked).length;
    const pct = Math.round(checked / inputs.length * 100);
    const bar = $('#shopping-progress i');
    const label = $('#shopping-progress-label');
    if(bar) bar.style.width = `${pct}%`;
    if(label) label.textContent = `${checked}/${inputs.length} 完了`;
  }

  function initShoppingSearch(){
    const input = $('#shopping-search');
    if(!input) return;
    input.addEventListener('input', () => {
      const q = input.value.trim().toLowerCase();
      $$('.check-item').forEach(item => {
        item.style.display = !q || item.dataset.search.includes(q) ? '' : 'none';
      });
      $$('.check-group').forEach(group => {
        const any = $$('.check-item', group).some(item => item.style.display !== 'none');
        group.style.display = any ? '' : 'none';
      });
    });
    const reset = $('#shopping-reset');
    if(reset){
      reset.addEventListener('click', () => {
        if(!confirm('買い出しチェックをすべて未完了に戻しますか？')) return;
        $$('[data-check-id]').forEach(input => {
          input.checked = false;
          store.set(`shopping-${input.dataset.checkId}`, '0');
          input.closest('.check-item').classList.remove('done');
        });
        updateShoppingProgress();
      });
    }
  }

  function initSavedFields(){
    $$('[data-save-key]').forEach(el => {
      const key = `field-${el.dataset.saveKey}`;
      const val = store.get(key, '');
      if(val) el.value = val;
      el.addEventListener('input', () => store.set(key, el.value));
    });
  }

  function initMap(){
    const iframe = $('#map-frame');
    const openBtn = $('#map-open-current');
    if(!iframe) return;
    function select(card){
      const embedKey = card.dataset.mapEmbed;
      const openKey = card.dataset.mapOpen;
      if(MAPS[embedKey]) iframe.src = MAPS[embedKey];
      if(openBtn && MAPS[openKey]) openBtn.href = MAPS[openKey];
      $$('.map-card').forEach(c => c.classList.toggle('active', c === card));
    }
    $$('.map-card[data-map-embed]').forEach((card, idx) => {
      card.addEventListener('click', () => select(card));
      if(idx === 0) select(card);
    });
  }

  function initCopyShare(){
    const btn = $('#copy-update');
    if(!btn) return;
    btn.addEventListener('click', async () => {
      const plan = store.get('trip-plan', 'a') === 'b' ? 'プランB（雨・渋滞・体調優先）' : 'プランA（通常）';
      const note = ($('#family-memo')?.value || '').trim();
      const text = `湯布院BBQ旅行 共有メモ\n日程：2026/11/7(土)〜11/8(日)\n現在の方針：${plan}\n集合：13:45 イオン湯布院店 → 15:00 AMBER Yufuinチェックイン\nメモ：${note || '特になし'}\n`;
      try{
        await navigator.clipboard.writeText(text);
        btn.textContent = 'コピーしました';
        setTimeout(()=>btn.textContent='LINE共有文をコピー', 1800);
      } catch {
        alert(text);
      }
    });
  }

  function initPrint(){
    $$('[data-print]').forEach(btn => btn.addEventListener('click', () => window.print()));
  }

  function initInstall(){
    let deferredPrompt = null;
    const tip = $('#install-tip');
    const btn = $('#install-button');
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault(); deferredPrompt = e;
      if(tip) tip.classList.add('show');
    });
    if(btn){
      btn.addEventListener('click', async () => {
        if(!deferredPrompt) return;
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        if(tip) tip.classList.remove('show');
      });
    }
    const close = $('#install-close');
    if(close) close.addEventListener('click', () => tip?.classList.remove('show'));
  }

  function initSW(){
    const dot = $('#offline-dot');
    const label = $('#offline-label');
    function setStatus(ok, text){
      if(dot) dot.classList.toggle('ok', ok);
      if(label) label.textContent = text;
    }
    if('serviceWorker' in navigator && location.protocol.startsWith('http')){
      navigator.serviceWorker.register('./sw.js').then(() => setStatus(true, 'PWA準備OK')).catch(() => setStatus(false, '通常表示'));
    } else {
      setStatus(false, 'ローカル表示');
    }
  }

  function initActiveNav(){
    const links = $$('.mobile-nav a[href^="#"]');
    const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
    if(!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, {rootMargin:'-30% 0px -62% 0px', threshold:0.01});
    sections.forEach(sec => observer.observe(sec));
  }

  function renderLinksPage(){
    const root = $('#links-container');
    if(!root || !window.LINK_GROUPS) return;
    root.innerHTML = LINK_GROUPS.map(group => `
      <section class="card">
        <h2>${escapeHTML(group.title)}</h2>
        <div class="grid two">
          ${group.items.map(item => `<div class="link-card"><a href="${item.url}" target="_blank" rel="noopener">${escapeHTML(item.label)} ↗</a><small>${escapeHTML(item.note)}</small></div>`).join('')}
        </div>
      </section>
    `).join('');
  }

  function escapeHTML(s){
    return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }

  document.addEventListener('DOMContentLoaded', () => {
    setLinks();
    initCountdown();
    initPlan();
    renderShopping();
    initShoppingSearch();
    initSavedFields();
    initMap();
    initCopyShare();
    initPrint();
    initInstall();
    initSW();
    initActiveNav();
    renderLinksPage();
  });
})();
