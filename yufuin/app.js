(function () {
  'use strict';
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
  const prefix = 'yufuin:2026-11:';
  const memory = new Map();
  let storageFailed = false;
  let selectedPlan = 'a';
  let registration;
  function storageWarning() {
    storageFailed = true;
    const el = $('#storage-status');
    if (el) { el.hidden=false; el.textContent='このブラウザでは保存できません。再読込・別ページへの移動前に、必要なメモをコピーしてください。'; }
  }
  const store = {
    get(key, fallback='') {
      if (memory.has(key)) return memory.get(key);
      try { return localStorage.getItem(prefix+key) ?? fallback; }
      catch { storageWarning(); return fallback; }
    },
    set(key, value) {
      memory.set(key,value);
      try { localStorage.setItem(prefix+key,value); }
      catch { storageWarning(); }
    },
    remove(key) {
      memory.set(key,'');
      try { localStorage.removeItem(prefix+key); }
      catch { storageWarning(); }
    }
  };
  function migrate() {
    try {
      if (localStorage.getItem(prefix+'migrated-v2')) return;
      const pairs=[['trip-plan','trip-plan'],['field-family-memo','field-family-memo'],
        ...SHOPPING.filter(i=>Number.isInteger(i.legacyIndex)).map(i=>[`shopping-item-${i.legacyIndex}`,`shopping-${i.id}`])];
      for(const [oldKey,newKey] of pairs) {
        const old=localStorage.getItem(oldKey);
        if(old!==null && localStorage.getItem(prefix+newKey)===null) localStorage.setItem(prefix+newKey,old);
      }
      localStorage.setItem(prefix+'migrated-v2','1');
    } catch { storageWarning(); }
  }
  function applyPlan(value) {
    selectedPlan = value === 'b' ? 'b' : 'a';
    document.body.classList.toggle('show-plan-a',selectedPlan==='a');
    document.body.classList.toggle('show-plan-b',selectedPlan==='b');
    $$('[data-plan-button]').forEach(btn=>{
      const active=btn.dataset.planButton===selectedPlan;
      btn.classList.toggle('active',active); btn.setAttribute('aria-pressed',String(active));
    });
    const values=VIEWS.bindings(TRIP,PLANS,selectedPlan);
    $$('[data-trip]').forEach(el=>{ if(el.dataset.trip in values) el.textContent=values[el.dataset.trip]; });
    $$('a[href^="print.html"]').forEach(a=>{a.href=`print.html?plan=${selectedPlan}`;});
    if($('#print-summary')) $('#print-summary').innerHTML=VIEWS.printSummary(TRIP,PLANS,selectedPlan,ROLES,SAFETY);
  }
  function initPlan() {
    const queryPlan=new URLSearchParams(location.search).get('plan');
    applyPlan(['a','b'].includes(queryPlan)?queryPlan:store.get('trip-plan','a'));
    $$('[data-plan-button]').forEach(btn=>btn.addEventListener('click',()=>{
      applyPlan(btn.dataset.planButton); store.set('trip-plan',selectedPlan);
    }));
  }
  function initCountdown() {
    if(!$('#countdown')) return;
    const target=new Date(TRIP.checkinISO).getTime(),end=new Date(TRIP.checkoutISO).getTime();
    const tick=()=>{
      const now=Date.now(),remaining=Math.max(0,target-now);
      const units={days:Math.floor(remaining/86400000),hours:Math.floor(remaining/3600000)%24,mins:Math.floor(remaining/60000)%60,secs:Math.floor(remaining/1000)%60};
      for(const [name,value] of Object.entries(units)) $(`#cd-${name}`).textContent=name==='days'?value:String(value).padStart(2,'0');
      $('#countdown-title').textContent=now<target?'チェックインまで':now<end?'旅行中です':'旅行の日程は終了しました';
      if(now>=target) $('.countdown-grid').hidden=true;
    };
    tick(); setInterval(tick,1000);
  }
  function updateProgress() {
    const inputs=$$('[data-check-id]'),checked=inputs.filter(i=>i.checked).length;
    if($('#shopping-progress')) {$('#shopping-progress').max=inputs.length; $('#shopping-progress').value=checked;}
    if($('#shopping-progress-label')) $('#shopping-progress-label').textContent=`${checked}/${inputs.length} 準備済み`;
  }
  function filterShopping() {
    const query=($('#shopping-search')?.value||'').trim().toLowerCase(),filter=$('#shopping-filter')?.value||'all';
    let visible=0;
    $$('.shopping-item').forEach(item=>{
      const memo=$('[data-allocation]',item)?.value||'';
      const matches=(!query||(item.dataset.search+' '+memo.toLowerCase()).includes(query)) &&
        (filter==='all'||(filter==='pending'?!$('[data-check-id]',item).checked:item.dataset.supply===filter));
      item.hidden=!matches; if(matches)visible++;
    });
    $$('.check-group').forEach(group=>{group.hidden=$$('.shopping-item',group).every(i=>i.hidden);});
    if($('#shopping-empty')) $('#shopping-empty').hidden=visible!==0;
    if($('#shopping-results')) $('#shopping-results').textContent=`${visible}件を表示`;
  }
  function initShopping() {
    $$('[data-check-id]').forEach(input=>{
      input.checked=store.get(`shopping-${input.dataset.checkId}`)==='1';
      input.closest('.check-item').classList.toggle('done',input.checked);
      input.addEventListener('change',()=>{
        store.set(`shopping-${input.dataset.checkId}`,input.checked?'1':'0');
        input.closest('.check-item').classList.toggle('done',input.checked);updateProgress();filterShopping();
      });
    });
    $$('[data-allocation]').forEach(input=>{
      input.value=store.get(`allocation-${input.dataset.allocation}`);
      input.addEventListener('input',()=>store.set(`allocation-${input.dataset.allocation}`,input.value));
    });
    $('#shopping-search')?.addEventListener('input',filterShopping);
    $('#shopping-filter')?.addEventListener('change',filterShopping);
    $('#shopping-reset')?.addEventListener('click',()=>{
      if(!confirm('準備済みのチェックをすべて戻しますか？担当・数量メモは残ります。'))return;
      $$('[data-check-id]').forEach(input=>{input.checked=false;store.set(`shopping-${input.dataset.checkId}`,'0');input.closest('.check-item').classList.remove('done');});
      updateProgress();filterShopping();
    });
    updateProgress();filterShopping();
    if($('#print-shopping')) $('#print-shopping').innerHTML=VIEWS.printShopping(SHOPPING,key=>store.get(key));
  }
  function initMemo() {
    const memo=$('#family-memo');if(!memo)return;
    memo.value=store.get('field-family-memo');
    memo.addEventListener('input',()=>store.set('field-family-memo',memo.value));
    $('#memo-delete')?.addEventListener('click',()=>{
      if(!confirm('このブラウザの家族メモを削除しますか？'))return;
      store.remove('field-family-memo');memo.value='';
      // The legacy copy belongs to this field; remove it as well on explicit deletion.
      try{localStorage.removeItem('field-family-memo');}catch{storageWarning();}
      $('#share-status').textContent='このブラウザの家族メモを削除しました。';
    });
    $('#copy-update')?.addEventListener('click',async()=>{
      const text=VIEWS.share(TRIP,PLANS,selectedPlan,memo.value.trim(),SHOPPING,key=>store.get(key));
      try {await navigator.clipboard.writeText(text);$('#share-status').textContent='コピーしました。家族LINEへ貼り付けて送信してください。';}
      catch {
        const output=$('#share-fallback');output.hidden=false;output.value=text;output.focus();output.select();
        $('#share-status').textContent='自動コピーできませんでした。下の文章を選択してコピーしてください。';
      }
    });
  }
  function initMap() {
    const iframe=$('#map-frame');if(!iframe)return;
    let card=$('[data-map-embed]');
    function select(next) {
      card=next;
      $$('[data-map-embed]').forEach(el=>{const active=el===card;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
      $('#map-open-current').href=VIEWS.safeURL(MAPS[card.dataset.mapOpen]);
      iframe.title=`Googleマップ：${$('strong',card).textContent}`;
      if(navigator.onLine){iframe.src=MAPS[card.dataset.mapEmbed];iframe.hidden=false;}
      else {iframe.removeAttribute('src');iframe.hidden=true;}
      $('#map-offline').hidden=navigator.onLine;
    }
    $$('[data-map-embed]').forEach(el=>el.addEventListener('click',()=>select(el)));
    window.addEventListener('online',()=>select(card));window.addEventListener('offline',()=>select(card));select(card);
  }
  function initSW() {
    let ready=false;
    function status() {
      const label=$('#offline-label');
      if(label) label.textContent=!navigator.onLine?'オフライン閲覧中':ready?'オフライン保存済み':'オンライン閲覧中';
      $('#offline-dot')?.classList.toggle('ok',ready&&navigator.onLine);
      const help=$('#connection-help');
      if(help) help.textContent=!navigator.onLine?'地図・外部リンクはオンラインで利用できます。保存済みの本文と写真は閲覧できます。':ready?'本文・写真はオフラインでも閲覧できます。地図・外部リンクには通信が必要です。':'初回は通信環境で開き、オフライン保存の完了をお待ちください。';
    }
    function showUpdate() { if(registration?.waiting && navigator.serviceWorker.controller) $('#update-notice').hidden=false; }
    async function checkUpdate() {if(registration&&navigator.onLine)try{await registration.update();showUpdate();}catch{/* Current offline bundle remains usable. */}}
    window.addEventListener('online',()=>{status();checkUpdate();});window.addEventListener('offline',status);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkUpdate();});
    status();
    if(!('serviceWorker' in navigator)||!/^https?:$/.test(location.protocol)) {
      if($('#connection-help')) $('#connection-help').textContent='本文・印刷は利用できます。オフライン保存にはHTTPSまたはlocalhostで開いてください。';
      return;
    }
    let hadController=!!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange',()=>{
      if(hadController) location.reload();
      hadController=true;ready=true;status();
    });
    navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(reg=>{
      registration=reg;
      navigator.serviceWorker.ready.then(()=>{ready=true;status();showUpdate();});
      showUpdate();
      reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed')showUpdate();});});
      checkUpdate();
    }).catch(()=>{if($('#connection-help'))$('#connection-help').textContent='オフライン保存ができませんでした。通信環境で再読込してください。';});
    $('#apply-update')?.addEventListener('click',()=>{
      if(storageFailed&&!confirm('保存できていないメモがある可能性があります。必要な内容をコピー済みなら更新してください。'))return;
      registration?.waiting?.postMessage({type:'ACTIVATE_UPDATE'});
    });
  }
  function initInstall() {
    let prompt;
    window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();prompt=event;$('#install-tip')?.classList.add('show');});
    $('#install-button')?.addEventListener('click',async()=>{if(!prompt)return;await prompt.prompt();prompt=null;$('#install-tip').classList.remove('show');});
    $('#install-close')?.addEventListener('click',()=>$('#install-tip').classList.remove('show'));
  }
  function initNav() {
    const links=$$('.mobile-nav a[href^="#"]');
    if(!links.length||!('IntersectionObserver' in window))return;
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)links.forEach(a=>{const active=a.hash===`#${entry.target.id}`;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    }),{rootMargin:'-20% 0px -55% 0px'});
    links.forEach(a=>{const section=$(a.hash);if(section)observer.observe(section);});
  }
  document.addEventListener('DOMContentLoaded',()=>{
    migrate();initPlan();initCountdown();initShopping();initMemo();initMap();initSW();initInstall();initNav();
    $$('[data-print]').forEach(btn=>btn.addEventListener('click',()=>{
      if($('#print-summary'))window.print();else location.href=`print.html?plan=${selectedPlan}`;
    }));
    window.addEventListener('beforeprint',()=>{
      if($('#print-shopping'))$('#print-shopping').innerHTML=VIEWS.printShopping(SHOPPING,key=>store.get(key));
    });
    window.addEventListener('storage',event=>{
      if(!event.key?.startsWith(prefix))return;
      memory.delete(event.key.slice(prefix.length));
      if(event.key===prefix+'trip-plan')applyPlan(store.get('trip-plan','a'));
    });
  });
})();
