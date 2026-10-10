const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {createServer}=require('./serve.cjs');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),out=process.env.AUDIT_DIR||'/tmp/yufuin-verification';
fs.mkdirSync(out,{recursive:true});
let release=1;
const server=createServer(root,(file,bytes)=>{
 let text;
 if(release===0){
   if(file==='sw.js') return fs.readFileSync(path.join(__dirname,'fixtures/legacy-sw.js'));
   if(file==='app.js') return Buffer.from("navigator.serviceWorker.register('./sw.js');");
   if(file==='index.html') return Buffer.from('<!doctype html><html lang="ja"><title>Legacy v2 without update UI</title><body>Legacy v2<script src="app.js"></script></body></html>');
 }
 if(file==='sw.js') {text=bytes.toString().replace(/(const CACHE_NAME = CACHE_PREFIX \+ '[^']+)';/,`$1-test${release}';`);return Buffer.from(text);}
 if(file==='index.html')return Buffer.from(bytes.toString().replace('<body ',`<body data-test-release="${release}" `));
 return bytes;
});
const results={checks:[],viewports:[],errors:[]};
const passed=name=>{results.checks.push(name);console.log('PASS '+name);};
(async()=>{
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const base=`http://127.0.0.1:${server.address().port}/yufuin/`;
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try {
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  // Only external map documents are stubbed; all first-party assets and SW requests are real.
  await context.route(/https:\/\/(www|maps)\.google\./,route=>route.fulfill({contentType:'text/html',body:'<title>Map test placeholder</title>'}));
  const page=await context.newPage();page.on('pageerror',e=>results.errors.push(e.message));
  await page.goto(base+'README.md');
  await page.evaluate(async()=>{
    localStorage.setItem('trip-plan','b');localStorage.setItem('shopping-item-0','1');localStorage.setItem('field-family-memo','旧メモ');
    await caches.open('unrelated-site-test');await caches.open('yufuin-bbq-shiori-old');
  });
  await page.addInitScript(()=>{window.cspViolations=[];document.addEventListener('securitypolicyviolation',e=>window.cspViolations.push(e.violatedDirective));});
  await page.goto(base);await page.evaluate(()=>navigator.serviceWorker.ready);await page.waitForFunction(()=>!!navigator.serviceWorker.controller);
  let keys=await page.evaluate(()=>caches.keys());
  assert(keys.includes('unrelated-site-test'));assert(!keys.includes('yufuin-bbq-shiori-old'));
  passed('Unrelated cache survives activation; only old Yufuin cache removed');
  assert.equal(await page.locator('#shop-beef').isChecked(),true);assert.equal(await page.locator('#family-memo').inputValue(),'旧メモ');
  assert.match(await page.locator('[data-trip=yatsushiro]').first().innerText(),/09:30/);
  assert.equal(await page.locator('[data-plan-button=b]').getAttribute('aria-pressed'),'true');
  passed('Legacy plan, checklist and memo migrated to namespaced stable keys');
  await page.locator('[data-plan-button=a]').click();assert.match(await page.locator('[data-trip=bbq]').first().innerText(),/18:00/);
  await page.locator('[data-plan-button=b]').click();assert.match(await page.locator('[data-trip=bbq]').first().innerText(),/18:30/);
  await page.locator('#family-memo').fill('確認用 <img src=x onerror=alert(1)>');
  await page.locator('[data-item-id=beef] summary').click();await page.locator('#allocation-beef').fill('八代車500g、不足200g');
  await page.evaluate(()=>{Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async text=>{window.copied=text;}}});});
  await page.locator('#copy-update').click();
  const copied=await page.evaluate(()=>window.copied);assert.match(copied,/09:30/);assert.match(copied,/11:30/);assert.match(copied,/18:30/);assert.match(copied,/現地で幹事に支払い/);assert.match(copied,/八代車500g/);
  passed('Plan A/B, all departure bindings and copied summary agree');
  await page.reload();assert.equal(await page.locator('#shop-beef').isChecked(),true);assert.match(await page.locator('#allocation-beef').inputValue(),/500g/);
  await page.locator('#shopping-search').fill('存在しない検索語');assert.equal(await page.locator('#shopping-empty').isVisible(),true);
  await page.locator('#shopping-search').fill('');await page.locator('#shopping-filter').selectOption('pending');assert.equal(await page.locator('[data-item-id=beef]').isVisible(),false);
  await page.locator('#shopping-filter').selectOption('all');passed('Checks and quantity notes persist; empty search and pending filter work');
  for(const width of [320,390,768,1280]){
    await page.setViewportSize({width,height:900});await page.evaluate(()=>scrollTo(0,0));
    const dimensions=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
    results.viewports.push(dimensions);assert(dimensions.scrollWidth<=width,`Overflow at ${width}: ${dimensions.scrollWidth}`);
    await page.screenshot({path:path.join(out,`top-${width}.png`)});
  }
  passed('No page overflow at 320, 390, 768, 1280px');
  await page.setViewportSize({width:390,height:844});await page.locator('.mobile-nav a[href="#shopping"]').click();
  const target=await page.locator('#shopping').boundingBox(),header=await page.locator('.topbar').boundingBox();assert(target.y>=header.y+header.height-2);
  await page.screenshot({path:path.join(out,'shopping-390.png')});passed('Shopping navigation lands below sticky header');
  await page.goto(base+'links.html');assert.match(await page.locator('[data-trip=yatsushiro]').first().innerText(),/09:30/);assert.equal(await page.locator('#links-container a').count(),19);
  await page.goto(base+'print.html?plan=b');assert.match(await page.locator('#print-summary').innerText(),/18:30/);assert.match(await page.locator('[data-print-item=beef]').innerText(),/☑/);assert.match(await page.locator('[data-print-item=beef]').innerText(),/500g/);
  assert.equal(await page.locator('[data-print-item]').count(),57);assert.equal(await page.locator('#print-summary img').count(),0);
  await page.emulateMedia({media:'print'});await page.pdf({path:path.join(out,'print-plan-b.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
  passed('Links and print use selected plan, all 57 items and saved notes');
  await context.setOffline(true);await page.goto(base+'index.html');
  const cdp=await context.newCDPSession(page);
  await cdp.send('Network.enable');await cdp.send('Network.emulateNetworkConditions',{offline:true,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await page.waitForFunction(()=>!navigator.onLine,{},{timeout:5000});
  assert.match(await page.locator('#offline-label').innerText(),/オフライン/);
  assert.equal(await page.locator('#map-offline').isVisible(),true);
  const offline=await page.evaluate(async()=>({asset:await fetch('./assets/photos/kinrin.jpg').then(r=>r.headers.get('content-type')),missing:await fetch('./not-cached.png').then(r=>r.headers.get('content-type')).catch(()=>null)}));
  assert.equal(offline.asset,'image/jpeg');assert.equal(offline.missing,null);passed('Offline text/photo access works; missing images never receive HTML');
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:0,downloadThroughput:-1,uploadThroughput:-1});
  await context.setOffline(false);
  release=2;
  await page.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
  await page.waitForFunction(()=>!document.querySelector('#update-notice').hidden);
  assert.equal(await page.locator('body').getAttribute('data-test-release'),'1');
  await Promise.all([page.waitForEvent('load'),page.locator('#apply-update').click()]);
  await page.waitForFunction(()=>document.body.dataset.testRelease==='2');
  assert.equal(await page.locator('#shop-beef').isChecked(),true);assert.match(await page.locator('#family-memo').inputValue(),/確認用/);
  keys=await page.evaluate(()=>caches.keys());assert(keys.includes('unrelated-site-test'));assert.equal(keys.filter(k=>k.startsWith('yufuin-bbq-shiori-')).length,1);
  passed('New release waits for approval, activates atomically, retains personal data and other cache');
  page.once('dialog',dialog=>dialog.accept());await page.locator('#memo-delete').click();await page.reload();assert.equal(await page.locator('#family-memo').inputValue(),'');
  passed('Explicit memo deletion persists and legacy memo does not reappear');
  assert.deepEqual(await page.evaluate(()=>window.cspViolations),[]);assert.deepEqual(results.errors,[]);passed('No JavaScript errors or unexpected CSP violations');
  await context.close();
  const blocked=await browser.newContext({serviceWorkers:'block'});
  await blocked.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new DOMException('Denied','SecurityError');}});});
  const bp=await blocked.newPage();await bp.goto(base,{waitUntil:'domcontentloaded'});assert.equal(await bp.locator('#storage-status').isVisible(),true);await bp.locator('[data-plan-button=b]').click();assert.match(await bp.locator('[data-trip=bbq]').first().innerText(),/18:30/);await blocked.close();
  passed('Storage denial is visible and does not disable plan controls');
  const nojs=await browser.newContext({javaScriptEnabled:false}),np=await nojs.newPage();await np.goto(base);
  assert.equal(await np.locator('a[data-url]:not([href])').count(),0);assert.equal(await np.locator('[data-check-id]').count(),57);await np.goto(base+'print.html');assert.match(await np.locator('#print-summary').innerText(),/18:00/);await nojs.close();passed('Without JavaScript, static links, checklist and print remain readable');
  release=0;
  const legacy=await browser.newContext();
  await legacy.route(/https:\/\/(www|maps)\.google\./,route=>route.fulfill({contentType:'text/html',body:'<title>Map test placeholder</title>'}));
  const lp=await legacy.newPage();await lp.goto(base);await lp.waitForFunction(()=>!!navigator.serviceWorker.controller,{},{timeout:10000});
  await lp.evaluate(async()=>{await caches.open('unrelated-legacy-test');localStorage.setItem('shopping-item-0','1');localStorage.setItem('field-family-memo','旧版からの引継ぎ');});
  release=3;
  await lp.evaluate(async()=>{const r=await navigator.serviceWorker.getRegistration();await r.update();});
  await lp.waitForFunction(()=>document.body.dataset.testRelease==='3');
  assert.equal(await lp.locator('#shop-beef').isChecked(),true);assert.equal(await lp.locator('#family-memo').inputValue(),'旧版からの引継ぎ');
  const legacyKeys=await lp.evaluate(()=>caches.keys());assert(legacyKeys.includes('unrelated-legacy-test'));assert(!legacyKeys.includes('yufuin-bbq-shiori-v2'));
  await legacy.close();passed('Existing v2 worker upgrades without update UI, reloads once and preserves old data');
 } finally {fs.writeFileSync(path.join(out,'results.json'),JSON.stringify(results,null,2)+'\n');await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
