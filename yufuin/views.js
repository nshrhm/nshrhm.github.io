/* Build-time and browser rendering share these views. All dynamic text is escaped. */
(function () {
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function safeURL(value) {
    return /^(https:\/\/|tel:|(?:\.\/)?(?:assets\/|index\.html|links\.html|print\.html))/.test(value) ? value : '#';
  }
  function bindings(trip, plans, selected) {
    const plan = plans[selected];
    return {date:trip.dateLabel, updated:trip.updated, meeting:`${trip.meeting} ${trip.hotel.name}集合`,
      fee:trip.fee, payment:trip.payment, feeNote:trip.feeNote, bbqPlan:trip.bbqPlan,
      selected:plan.label, bbq:`${plan.bbq} BBQ（案）`, yatsushiro:`${plan.departures.yatsushiro}出発目安（案）`,
      kokura:`${plan.departures.kokura}出発目安（案）`, decision:trip.decision};
  }
  function plan(plan) {
    return `<h3>${esc(plan.label)} <span class="chip">案</span></h3><p>${esc(plan.description)}</p>
      <ol class="timeline">${plan.events.map(([time,title,note]) => `<li class="time-item"><div class="time-dot">${esc(time)}</div><div class="time-body"><strong>${esc(title)}</strong><small>${esc(note)}</small></div></li>`).join('')}</ol>`;
  }
  function grouped(items) {
    return items.reduce((groups,item) => { (groups[item.group] ||= []).push(item); return groups; },{});
  }
  function shopping(items) {
    return Object.entries(grouped(items)).map(([group, entries]) => `<section class="check-group"><h3>${esc(group)} <span class="chip">${entries.length}件</span></h3><div class="checklist">${entries.map(item => `
      <div class="shopping-item" data-item-id="${esc(item.id)}" data-supply="${esc(item.supply)}" data-search="${esc([item.item,item.group,item.owner,item.priority,item.supply].join(' ').toLowerCase())}">
        <label class="check-item" for="shop-${esc(item.id)}"><input type="checkbox" id="shop-${esc(item.id)}" data-check-id="${esc(item.id)}"><span><strong>${esc(item.item)} <span class="tag">${esc(item.supply)}</span></strong><small>${esc(item.amount)}｜${esc(item.owner)}｜${esc(item.priority)}</small></span></label>
        <details class="item-notes no-print"><summary>持参量・不足量・担当をメモ</summary><label for="allocation-${esc(item.id)}">${esc(item.item)}の持参予定・不足分・担当</label><input id="allocation-${esc(item.id)}" data-allocation="${esc(item.id)}" type="text" maxlength="180" placeholder="例：八代車が500g持参、不足200gは現地"></details>
      </div>`).join('')}</div></section>`).join('\n');
  }
  function links(groups) {
    return groups.map(group => `<section class="card"><h2>${esc(group.title)}</h2><div class="grid two">${group.items.map(item => `<div class="link-card"><a href="${esc(safeURL(item.url))}" target="_blank" rel="noopener noreferrer">${esc(item.label)} ↗</a><small>${esc(item.note)}</small></div>`).join('')}</div></section>`).join('\n');
  }
  function roles(items) {
    return `<p>担当は家族LINEで前日までに決定します（担当者は未定）。焼き係は30分ごとに交代します。</p><dl class="role-list">${items.map(([name,work]) => `<div><dt>${esc(name)}</dt><dd>${esc(work)}</dd></div>`).join('')}</dl>`;
  }
  function safety(items) { return `<ul class="subtle-list">${items.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`; }
  function printSummary(trip, plans, selected, rolesData, safetyData) {
    const p=plans[selected], h=trip.hotel;
    return `<h1>湯布院お泊りBBQ 旅のしおり</h1><p class="print-meta">最終更新 ${esc(trip.updated)}／選択中：${esc(p.label)}（時刻は案）</p>
      <div class="print-card"><p><strong>${esc(trip.dateLabel)}｜${esc(h.name)}</strong><br>${esc(h.address)}｜電話 ${esc(h.phone)}（${esc(h.reception)}）<br>集合 ${esc(trip.meeting)}／チェックアウト ${esc(h.checkout)}<br>参加費 ${esc(trip.fee)}｜${esc(trip.payment)}<br>${esc(trip.feeNote)}<br>BBQ：${esc(trip.bbqPlan)}<br>予約番号・入室コードは家族内共有メモで確認。</p></div>
      <section class="print-card"><h2>選択中の旅程（案）</h2><p>${esc(p.description)}</p><dl class="print-timeline">${p.events.map(([time,title])=>`<div><dt>${esc(time)}</dt><dd>${esc(title)}</dd></div>`).join('')}</dl></section>
      <section class="print-card"><h2>変更の連絡・翌朝</h2><p>${esc(trip.decision)}</p><p>翌朝は10:00までにチェックアウト。朝霧は希望者のみ早朝に判断。チェックアウト後の観光は一か所まで、雨・疲労時は帰路へ。</p></section>
      <section class="print-card"><h2>役割と安全</h2><p>${rolesData.map(([role,work])=>`${esc(role)}：${esc(work)}`).join(' ／ ')}。担当は家族LINEで前日までに決定。</p>${safety(safetyData)}</section>`;
  }
  function printShopping(items, read = () => '') {
    return Object.entries(grouped(items)).map(([group,entries])=>`<section class="print-shopping-group"><h3>${esc(group)}</h3>${entries.map(item=>`<div class="print-shopping-item" data-print-item="${esc(item.id)}"><span class="print-mark">${read(`shopping-${item.id}`)==='1'?'☑':'□'}</span><div><strong>${esc(item.item)}</strong> <span>${esc(item.amount)}</span><br><small>${esc(item.supply)}｜${esc(item.owner)}</small>${read(`allocation-${item.id}`)?`<br><small>メモ：${esc(read(`allocation-${item.id}`))}</small>`:''}</div></div>`).join('')}</section>`).join('\n');
  }
  function share(trip, plans, selected, memo, items, read) {
    const p=plans[selected];
    const allocations=items.filter(i=>read(`allocation-${i.id}`)).map(i=>`${i.item}：${read(`allocation-${i.id}`)}`);
    return [`湯布院BBQ旅行 共有メモ（更新 ${trip.updated}）`,`日程：${trip.dateLabel}`,`現在の方針（案）：${p.label}`,
      `出発目安：八代2台 ${p.departures.yatsushiro}／小倉南区葉山町 ${p.departures.kokura}`,`集合：${trip.meeting} ${trip.hotel.name}`,`BBQ：${p.bbq}（${trip.bbqPlan}）`,
      `買い出し：${trip.shoppingNote}`,`参加費：${trip.fee}／${trip.payment}`,trip.feeNote,
      `準備済み（この端末）：${items.filter(i=>read(`shopping-${i.id}`)==='1').length}/${items.length}`,
      ...allocations,`メモ：${memo || '特になし'}`,'※アプリの選択・チェックは自動共有されません。変更は家族LINEで連絡。'].join('\n');
  }
  window.VIEWS = {esc,safeURL,bindings,plan,shopping,links,roles,safety,printSummary,printShopping,share};
})();
