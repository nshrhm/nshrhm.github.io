const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const read = f => fs.readFileSync(path.join(root,f),'utf8');
const pages = fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const all = [...pages,'assets/js/app.js','service-worker.js','manifest.webmanifest','mojiko-ganryujima-daytrip.ics'];
for (const f of all) {
  const s = read(f);
  assert(!/2026年5月|20260509|May 9|9:20|10:40|ハンドメイドデイズ|土日祝の門司港/.test(s),`stale content: ${f}`);
  if (!f.endsWith('.html')) continue;
  assert.match(s,/<title>[^<]*2026年11月13日（金）/);
  assert.match(s,/<meta property="og:title" content="[^"\n]*2026年11月13日（金）/);
  const ids = [...s.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`duplicate HTML id: ${f}`);
  const checks = [...s.matchAll(/data-id="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(checks.length,new Set(checks).size,`duplicate checklist id: ${f}`);
  for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const href=m[1].replaceAll('&amp;','&');
    const url = new URL(href,'https://local.invalid/mojiko/'+f);
    if (url.hostname === 'local.invalid') {
      const target = url.pathname.replace('/mojiko/','');
      assert(fs.existsSync(path.join(root,target)),`missing local target ${f}: ${href}`);
      if (url.hash) assert(read(target).includes(`id="${url.hash.slice(1)}"`),`missing anchor: ${href}`);
    } else {
      assert.equal(url.protocol,'https:',`non-HTTPS external URL: ${href}`);
      if (url.pathname === '/maps/dir/') {
        assert.equal(url.searchParams.get('api'),'1');
        assert(url.searchParams.get('origin') && url.searchParams.get('destination'));
        assert((url.searchParams.get('waypoints') || '').split('|').length <= 3,'too many mobile waypoints');
        assert(url.href.length < 2048,'oversized map URL');
      }
    }
  }
}
const plans=read('plans.html'), index=read('index.html');
const extract=(s,p)=>s.match(new RegExp(`<div class="timeline" data-itinerary="${p}">([\\s\\S]*?)(?=<div class="plan-panel"|</section>)`))[1];
const times=s=>[...s.matchAll(/data-time="(\d\d:\d\d)"/g)].map(m=>m[1]);
const a=times(extract(plans,'a')),b=times(extract(plans,'b'));
for (const t of [a,b]) {assert.deepEqual(t,[...t].sort());assert.equal(new Set(t).size,t.length);assert.equal(t[0],'08:00');assert.equal(t.at(-2),'15:10');assert.equal(t.at(-1),'16:00');}
assert.deepEqual(times(index),a,'home and plans A must agree');
// These are the selected weekday departures independently transcribed from the two official tables.
assert(b.includes('09:30') && b.includes('10:25') && b.includes('11:30') && b.includes('12:00'));
assert.match(extract(plans,'b'),/門司港 → 唐戸（関門連絡船）/);
assert.match(extract(plans,'b'),/唐戸 → 巌流島（巌流島連絡船）/);
assert.match(extract(plans,'b'),/巌流島 → 唐戸/);
assert.match(extract(plans,'b'),/唐戸 → 門司港（関門連絡船）/);
assert(!/data-time="09:30"/.test(extract(plans,'a')),'A must not use the ferry');
assert.match(plans,/往路乗継50分、復路20分/);
assert.match(plans,/11:00の橋を14:00へ変更/);
assert.match(read('restaurants.html'),/2026年8月31日で営業終了/);
const minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3));
assert.equal(minutes('10:25')-(minutes('09:30')+5),50);
assert.equal(minutes('11:30')-(minutes('10:25')+10),55);
assert.equal(minutes('12:00')-(minutes('11:30')+10),20);
assert.equal(minutes('15:10')-(minutes('12:00')+5),185);
assert.equal(new Date('2026-11-13T00:00:00+09:00').getUTCDay(),4); // Thursday UTC = Friday JST.
assert.equal(new Intl.DateTimeFormat('en',{timeZone:'Asia/Tokyo',weekday:'long'}).format(new Date('2026-11-13T00:00:00+09:00')),'Friday');
const ics=read('mojiko-ganryujima-daytrip.ics');
assert(!/(?<!\r)\n/.test(ics),'ICS CRLF required');
for(const line of ics.split('\r\n'))assert(Buffer.byteLength(line)<=75,'ICS folding exceeds 75 octets');
const unfolded=ics.replace(/\r\n /g,'');
assert.match(unfolded,/DTSTART:20261112T230000Z/);assert.match(unfolded,/DTEND:20261113T070000Z/);
assert.equal((unfolded.match(/BEGIN:VEVENT/g)||[]).length,1);
assert.match(unfolded,/推奨プランA・船なし/);
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.match(manifest.name,/2026年11月13日（金）/);
for (const icon of manifest.icons) assert(fs.existsSync(path.join(root,icon.src)));
const sw=read('service-worker.js');
const shell=vm.runInNewContext(sw.slice(0,sw.indexOf("self.addEventListener"))+';({CACHE_NAME, APP_SHELL})');
assert.equal(shell.CACHE_NAME,'mojiko-ganryujima-shiori-2026-11-13-v1');
for (const f of shell.APP_SHELL)assert(fs.existsSync(path.join(root,f)),`missing cache asset ${f}`);
assert(shell.APP_SHELL.includes('./manifest.webmanifest'));
console.log(`PASS: ${pages.length} pages; dates/metadata, links, A/B order and ferry arithmetic, calendar, manifest and ${shell.APP_SHELL.length} cache entries`);
