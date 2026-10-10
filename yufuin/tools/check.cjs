const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..'),ctx=vm.createContext({window:{}});
vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),ctx);
const {SHOPPING,PLANS,TRIP}=ctx.window;
assert.equal(new Set(SHOPPING.map(i=>i.id)).size,SHOPPING.length,'stable IDs must be unique');
assert.equal(new Set(SHOPPING.filter(i=>Number.isInteger(i.legacyIndex)).map(i=>i.legacyIndex)).size,51,'legacy migration must preserve all 51 items');
assert.equal(TRIP.bbqPlan,'機材レンタルプラン（予約者確認済み）');
for(const plan of Object.values(PLANS)){
 assert.equal(plan.events[0][0],plan.departures.yatsushiro);
 assert.equal(plan.events[1][0],plan.departures.kokura);
 assert(plan.events.some(e=>e[0]===plan.bbq&&e[1].includes('BBQ')));
}
for(const file of ['index.html','links.html','print.html']){
 const html=fs.readFileSync(path.join(root,file),'utf8'),ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,`${file}: duplicate IDs`);
 assert(html.includes('Content-Security-Policy'),`${file}: CSP`);
 for(const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)){
  const url=match[1];if(/^[a-z]+:/i.test(url))continue;
  assert(fs.existsSync(path.join(root,url.split(/[?#]/)[0])),`${file}: missing ${url}`);
 }
 for(const match of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(match[1]),`${file}: missing fragment ${match[1]}`);
 for(const match of html.matchAll(/<label[^>]*for="([^"]+)"/g))assert(ids.includes(match[1]),`${file}: missing label target`);
 assert(!/<a\b(?=[^>]*data-url=)(?![^>]*href=)/.test(html),`${file}: missing static links`);
 assert(!/保険証\/マイナカード/.test(html),`${file}: obsolete insurance label`);
}
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(index.includes('お酒を飲んだ後の長湯は避けます。'),'preserve approved wording');
for(const place of ['八代市福正町','八代市田中東町','小倉南区葉山町'])assert(index.includes(place),'preserve public itinerary');
for(const photo of JSON.parse(fs.readFileSync(path.join(root,'sources/photos.json'),'utf8'))){
 const bytes=fs.readFileSync(path.join(root,photo.file));
 assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),photo.sha256);
 assert(bytes[0]===255&&bytes[1]===216,'JPEG signature');
}
const icons=JSON.parse(fs.readFileSync(path.join(root,'sources/icons.json'),'utf8'));
for(const [file,hash] of Object.entries({...icons.sources,...icons.outputs})){
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'assets/icons',file))).digest('hex'),hash,`${file}: run make icons after editing icon originals`);
}
for(const icon of JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8')).icons){
 const bytes=fs.readFileSync(path.join(root,icon.src.split('?')[0]));
 assert.equal(bytes.subarray(1,4).toString(),'PNG');
 assert.equal(`${bytes.readUInt32BE(16)}x${bytes.readUInt32BE(20)}`,icon.sizes);
}
console.log(`Checked HTML links, migration IDs, plan consistency, protected wording, photos and icons (${SHOPPING.length} items).`);
