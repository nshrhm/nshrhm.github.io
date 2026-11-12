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
  assert(!/2026年5月|20260509|May 9|9:20|10:40|08:00|8:00出発|船なし|推奨A|プランA\/B|巌流島は希望|ハンドメイドデイズ|土日祝の門司港/.test(s),`stale content: ${f}`);
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
        if(url.searchParams.get('travelmode')==='walking') {
          const stops=['origin','destination','waypoints'].map(k=>url.searchParams.get(k)||'');
          if(stops.some(x=>x.includes('巌流島'))) assert(stops.every(x=>!x || x.includes('巌流島')),'walking must stay on the island');
          assert(!stops.some(x=>x.includes('唐戸')),'sea crossing must use a ferry, not a walking route');
        }
      }
    }
  }
}
const plans=read('plans.html'), index=read('index.html');
const extract=(s,p)=>s.match(new RegExp(`<div class="timeline" data-itinerary="${p}">([\\s\\S]*?)(?=<div class="plan-panel"|</section>)`))[1];
const times=s=>[...s.matchAll(/data-time="(\d\d:\d\d)"/g)].map(m=>m[1]);
const a=times(extract(plans,'a')),b=times(extract(plans,'b'));
for (const t of [a,b]) {assert.deepEqual(t,[...t].sort());assert.equal(new Set(t).size,t.length);assert.equal(t[0],'09:00');}
assert.equal(a.at(-2),'15:10');assert.equal(a.at(-1),'16:00');
assert.equal(b.at(-2),'15:50');assert.equal(b.at(-1),'16:40');
assert.deepEqual(times(index),a,'home and main itinerary must agree');
const cards=s=>[...s.matchAll(/data-time="(\d\d:\d\d)"[^]*?class="time-title">([^<]*)<[^]*?class="time-description">([^<]*)</g)].map(m=>({time:m[1],title:m[2],description:m[3]}));
assert.deepEqual(cards(index),cards(extract(plans,'a')),'home and main titles/descriptions must agree');
const minutes=t=>Number(t.slice(0,2))*60+Number(t.slice(3));
// Independently transcribed weekday departures, checked against the operator tables on 2026-11-12.
const official={
  '門司港 → 唐戸（関門連絡船）':['10:10','10:30','10:50','11:10','11:30','11:50'],
  '唐戸 → 巌流島（巌流島連絡船）':['10:25','11:05','11:45','12:25'],
  '巌流島 → 唐戸（巌流島連絡船）':['11:30','12:10','12:50','13:30'],
  '唐戸 → 門司港（関門連絡船）':['12:00','12:20','12:40','13:00','13:20','13:40']
};
for (const [id,expected,transfer] of [['a',['10:30','11:05','12:10','12:40'],30],['b',['11:10','11:45','12:50','13:20'],30]]) {
 const items=cards(extract(plans,id)),boats=items.filter(c=>c.title.includes('連絡船）'));
 assert.deepEqual(boats.map(c=>c.title),Object.keys(official),'four distinct, correctly directed ferry legs');
 assert.deepEqual(boats.map(c=>c.time),expected);
 boats.forEach(c=>assert(official[c.title].includes(c.time),'departure must appear in the correct official table column'));
 const [out,islandOut,islandBack,back]=boats.map(c=>minutes(c.time));
 assert.equal(islandOut-(out+5),transfer);
 assert.equal(islandBack-(islandOut+10),55);
 assert.equal(back-(islandBack+10),20);
 assert.equal(minutes(items.find(c=>c.title==='巌流島に上陸・散策と写真').time),islandOut+10);
 assert.equal(minutes(items.find(c=>c.title==='巌流島の桟橋へ戻り乗船待ち').time),islandBack-10);
 assert.equal(minutes(items.find(c=>c.title.includes('焼きカレー')).time)-(back+5),15);
 assert.equal(minutes(items.at(-1).time)-minutes(items.at(-2).time),50);
}
assert.equal(minutes(a[1])-minutes(a[0]),45);
assert.equal(minutes(a[2])-minutes(a[1]),10+20);
assert.equal(minutes(a[3])-minutes(a[2]),15);
assert.match(plans,/欠航時は上陸条件未達・延期判断/);
assert.match(plans,/16:00頃帰宅は努力目標/);
assert.match(read('restaurants.html'),/2026年8月31日で営業終了/);
assert.match(read('assets/js/app.js'),/mojiko:2026-11-13:v2:/);
assert(index.indexOf('当日の運航情報')<index.indexOf('data-itinerary='));
assert.equal(new Date('2026-11-13T00:00:00+09:00').getUTCDay(),4); // Thursday UTC = Friday JST.
assert.equal(new Intl.DateTimeFormat('en',{timeZone:'Asia/Tokyo',weekday:'long'}).format(new Date('2026-11-13T00:00:00+09:00')),'Friday');
const ics=read('mojiko-ganryujima-daytrip.ics');
assert(!/(?<!\r)\n/.test(ics),'ICS CRLF required');
for(const line of ics.split('\r\n'))assert(Buffer.byteLength(line)<=75,'ICS folding exceeds 75 octets');
const unfolded=ics.replace(/\r\n /g,'');
assert.match(unfolded,/DTSTART:20261113T000000Z/);assert.match(unfolded,/DTEND:20261113T070000Z/);
assert.equal((unfolded.match(/BEGIN:VEVENT/g)||[]).length,1);
assert.match(unfolded,/09:00自宅出発・上陸必須/);
assert.match(unfolded,/SEQUENCE:1/);
for (const time of ['10:30','11:05','12:10','12:40','13:00','14:10']) assert(unfolded.includes(time));
assert.match(unfolded,/努力目標/);
const manifest=JSON.parse(read('manifest.webmanifest'));
assert.match(manifest.name,/2026年11月13日（金）/);
for (const icon of manifest.icons) assert(fs.existsSync(path.join(root,icon.src)));
const sw=read('service-worker.js');
const shell=vm.runInNewContext(sw.slice(0,sw.indexOf("self.addEventListener"))+';({CACHE_NAME, APP_SHELL})');
assert.equal(shell.CACHE_NAME,'mojiko-ganryujima-shiori-2026-11-13-v2');
for (const f of shell.APP_SHELL)assert(fs.existsSync(path.join(root,f)),`missing cache asset ${f}`);
assert(shell.APP_SHELL.includes('./manifest.webmanifest'));
console.log(`PASS: ${pages.length} pages; dates/metadata, links, main/delayed order and ferry arithmetic, calendar, manifest and ${shell.APP_SHELL.length} cache entries`);
