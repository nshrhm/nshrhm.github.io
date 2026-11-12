const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createServer} = require('./serve.cjs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const out = process.env.AUDIT_DIR || '/tmp/mojiko-verification';
fs.mkdirSync(out,{recursive:true});
let legacy = false;
const server = createServer((file,bytes) => {
  if (!legacy) return bytes;
  if (file === 'service-worker.js') return fs.readFileSync(path.join(__dirname,'fixtures/legacy-worker.js'));
  if (file === 'assets/js/app.js') return Buffer.from("navigator.serviceWorker.register('./service-worker.js');");
  if (file === 'index.html') return Buffer.from('<!doctype html><html lang="ja"><title>Legacy</title><body>Legacy itinerary<script src="assets/js/app.js"></script></body></html>');
  return bytes;
});
const results = {checks:[],viewports:[],errors:[],localHttpErrors:[],externalResources:'Blocked for repeatable offline QA; external websites are verified separately.'};
const pass = text => {results.checks.push(text);console.log('PASS '+text);};
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}/mojiko/`;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 results.browser=browser.version();
 const contextOptions={viewport:{width:390,height:844},timezoneId:'America/Los_Angeles',reducedMotion:'reduce'};
 const prepare=async context=>{
   await context.route(url=>url.origin!==new URL(base).origin,route=>route.abort());
   context.on('page',page=>{
     page.on('pageerror',e=>results.errors.push(e.message));
     page.on('response',r=>{if(r.url().startsWith(base) && r.status()>=400)results.localHttpErrors.push(r.url());});
   });
 };
 try {
  const ctx=await browser.newContext(contextOptions);await prepare(ctx);
  const page=await ctx.newPage();await page.clock.install({time:new Date('2026-11-12T05:00:00Z')});
  await page.goto(base+'README.md');
  await page.evaluate(async()=>{localStorage.setItem('check:a-0800','1');localStorage.setItem('selectedPlan','b');await caches.open('unrelated-site-test');});
  await page.goto(base);await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  assert.equal(await page.locator('[data-id="a-0800"]').isChecked(),false);
  await page.locator('[data-id="a-0800"]').check();await page.reload();
  assert.equal(await page.locator('[data-id="a-0800"]').isChecked(),true);
  await page.goto(base+'plans.html');assert.equal(await page.locator('#tab-a').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('[data-id="a-0800"]').isChecked(),true);
  assert.equal(await page.locator('.is-next').getAttribute('data-time'),'08:45');
  await page.locator('#tab-b').click();assert.equal(await page.locator('#panel-a').isVisible(),false);
  assert.equal(await page.locator('.is-next').getAttribute('data-time'),'08:00');
  await page.locator('[data-id="b-0800"]').check();await page.reload();
  assert.equal(await page.locator('#tab-b').getAttribute('aria-selected'),'true');
  assert.equal(await page.locator('[data-id="b-0800"]').isChecked(),true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('check:a-0800')),'1');
  pass('Old check/plan keys isolated; default A; A/B checklist persists across pages and reloads');
  await page.clock.setFixedTime(new Date('2026-11-13T00:29:00Z'));await page.locator('#tab-a').click();await page.locator('#tab-b').click();
  assert.equal(await page.locator('.is-next').getAttribute('data-time'),'09:30');
  assert.match(await page.locator('#panel-b .next-status').innerText(),/日本時間/);
  await page.locator('[data-id="b-0930"]').check();assert.equal(await page.locator('.is-next').getAttribute('data-time'),'09:35');
  await page.clock.setFixedTime(new Date('2026-11-13T01:59:00Z'));await page.locator('#tab-a').click();
  assert.equal(await page.locator('.is-next').getAttribute('data-time'),'11:00');
  await page.clock.setFixedTime(new Date('2026-11-13T02:01:00Z'));await page.clock.runFor(31000);
  assert.equal(await page.locator('.is-next').getAttribute('data-time'),'11:25');
  await page.clock.setFixedTime(new Date('2026-11-13T07:01:00Z'));await page.clock.runFor(31000);
  assert.equal(await page.locator('.is-next').count(),0);assert.match(await page.locator('#panel-a .next-status').innerText(),/過ぎました/);
  await page.locator('#tab-c').click();assert.equal(await page.locator('.is-next').count(),0);
  await page.locator('#tab-c').press('ArrowLeft');assert.equal(await page.locator('#tab-b').getAttribute('aria-selected'),'true');
  await page.locator('#tab-b').press('Home');assert.equal(await page.locator('#tab-a').getAttribute('aria-selected'),'true');
  pass('Japan-time travel day, automatic next-item refresh, checked skip, end-of-day and keyboard tabs');
  await page.goto(base);await page.evaluate(()=>{Object.defineProperty(navigator,'share',{configurable:true,writable:true,value:async data=>{window.shared=data;}});});
  await page.locator('[data-share]').click();assert.match((await page.evaluate(()=>window.shared)).text,/2026年11月13日/);
  await page.evaluate(()=>{navigator.share=async()=>{throw new DOMException('Canceled','AbortError');};});await page.locator('[data-share]').click();
  await page.evaluate(()=>{navigator.share=undefined;Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copied=text;}}});});
  await page.locator('[data-share]').click();assert.equal(await page.evaluate(()=>window.copied),base);
  await page.evaluate(()=>{const e=new Event('beforeinstallprompt');e.prompt=async()=>{window.installPrompted=true;};e.userChoice=Promise.resolve({outcome:'accepted'});window.dispatchEvent(e);});
  assert.equal(await page.locator('.install-btn').isVisible(),true);await page.locator('.install-btn').click();assert.equal(await page.evaluate(()=>window.installPrompted),true);
  pass('Share payload, share cancellation, clipboard fallback and PWA install prompt handler');
  const pages=['index.html','plans.html','map.html','restaurants.html','story.html','links.html','offline.html'];
  for(const width of [320,390,768,1280]){
   await page.setViewportSize({width,height:900});
   for(const file of pages){
    await page.goto(base+file);await page.locator('h1').waitFor();
    const check=async suffix=>{
     const dims=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}));
     results.viewports.push({file,suffix,...dims});assert(dims.scroll<=width,`${file} ${suffix} overflow at ${width}: ${dims.scroll}`);
     assert.equal(await page.locator('main').isVisible(),true);
    };
    await check('');
    if(file==='plans.html'){for(const p of ['b','c']){await page.locator('#tab-'+p).click();await check(p);}}
    if(width===390 && ['index.html','plans.html','restaurants.html','map.html'].includes(file))await page.screenshot({path:path.join(out,file.replace('.html','')+'-390.png')});
   }
  }
  await page.setViewportSize({width:390,height:844});await page.emulateMedia({colorScheme:'dark'});await page.goto(base+'plans.html');await page.locator('#tab-b').click();await page.locator('#tab-b').scrollIntoViewIfNeeded();await page.screenshot({path:path.join(out,'plan-b-dark.png')});await page.emulateMedia({colorScheme:'light'});
  pass('Seven pages and all plan panels fit 320/390/768/1280px; dark-mode screenshot captured');
  await ctx.setOffline(true);
  for(const file of pages){await page.goto(base+file+'?offline-test=1');assert.equal(await page.locator('h1').isVisible(),true);}
  await page.goto(base+'plans.html');await page.locator('#tab-b').click();assert.equal(await page.locator('#panel-b').isVisible(),true);
  const cached=await page.evaluate(async()=>({manifest:await fetch('manifest.webmanifest').then(r=>r.json()),ics:await fetch('mojiko-ganryujima-daytrip.ics').then(r=>r.text()),keys:await caches.keys()}));
  assert.match(cached.manifest.name,/2026年11月13日/);assert.match(cached.ics,/20261113/);assert(cached.keys.includes('unrelated-site-test'));
  await page.goto(base+'missing-route');assert.match(await page.locator('h1').innerText(),/オフライン/);
  pass('All pages, plan switching, manifest and calendar work offline; unknown page gets fallback; unrelated cache retained');
  await ctx.close();
  const blocked=await browser.newContext({...contextOptions,serviceWorkers:'block'});await prepare(blocked);
  await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Blocked','SecurityError');}}));
  const bp=await blocked.newPage();await bp.goto(base+'plans.html');await bp.locator('#tab-b').click();assert.equal(await bp.locator('#panel-b').isVisible(),true);assert.equal(await bp.locator('#storage-status').isVisible(),true);await blocked.close();
  pass('Storage denial keeps plan switching usable and reports saving limitation');
  legacy=true;
  const old=await browser.newContext(contextOptions);await prepare(old);
  const op=await old.newPage();await op.goto(base);await op.waitForFunction(()=>!!navigator.serviceWorker.controller);
  await op.evaluate(async()=>{localStorage.setItem('check:a-0800','1');localStorage.setItem('selectedPlan','b');await caches.open('unrelated-after-legacy');});
  assert.match(await op.locator('body').innerText(),/Legacy itinerary/);
  legacy=false;
  await op.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
  await op.waitForFunction(()=>document.title.includes('2026年11月13日'),null,{timeout:15000});
  assert.equal(await op.locator('[data-id="a-0800"]').isChecked(),false);
  const keys=await op.evaluate(()=>caches.keys());assert(keys.includes('unrelated-after-legacy'));assert(!keys.includes('mojiko-ganryujima-shiori-v2'));
  await old.setOffline(true);await op.goto(base+'plans.html');assert.equal(await op.locator('#tab-a').getAttribute('aria-selected'),'true');await old.close();
  pass('Actual v2 worker upgrades an open legacy page, removes only its own old cache, resets the new trip and serves new offline pages');
  assert.deepEqual(results.errors,[]);assert.deepEqual(results.localHttpErrors,[]);pass('No JavaScript page errors or failed local HTTP responses');
 } finally {
  fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');
  await browser.close();await new Promise(resolve=>server.close(resolve));
 }
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
