const fs=require('node:fs'), path=require('node:path'), vm=require('node:vm'), crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const context=vm.createContext({window:{}});
for(const name of ['data.js','views.js']) vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),context,{filename:name});
const {TRIP,PLANS,SHOPPING,LINK_GROUPS,ROLES,SAFETY,URLS,MAPS,VIEWS:V}=context.window;
const check=process.argv.includes('--check');
function write(file,value){
 const target=path.join(root,file),current=fs.readFileSync(target,'utf8');
 if(current!==value){if(check)throw Error(`${file} is stale; run make build`); fs.writeFileSync(target,value);}
}
const sections={'plan-a':V.plan(PLANS.a),'plan-b':V.plan(PLANS.b),shopping:V.shopping(SHOPPING),links:V.links(LINK_GROUPS),roles:V.roles(ROLES),safety:V.safety(SAFETY),'print-summary':V.printSummary(TRIP,PLANS,'a',ROLES,SAFETY),'print-shopping':V.printShopping(SHOPPING)};
const values=V.bindings(TRIP,PLANS,'a');
const photos=JSON.parse(fs.readFileSync(path.join(root,'sources/photos.json'),'utf8'));
sections.photos=photos.map((p,i)=>`<figure class="photo-card${i===0?' wide':''}"><img loading="lazy" decoding="async" src="${V.esc(p.file)}" width="${p.width}" height="${p.height}" alt="${V.esc(p.title)}"><figcaption>${V.esc(p.title)} / ${V.esc(p.author)} / <a href="${V.esc(p.licenseURL)}" target="_blank" rel="noopener noreferrer">${V.esc(p.license)}</a> · <a href="${V.esc(p.source)}" target="_blank" rel="noopener noreferrer">原典</a></figcaption></figure>`).join('\n');
sections.credits='<ul class="source-list">'+photos.map(p=>`<li>${V.esc(p.title)}：${V.esc(p.author)}。<a href="${V.esc(p.source)}" target="_blank" rel="noopener noreferrer">Wikimedia Commons原典</a>／<a href="${V.esc(p.licenseURL)}" target="_blank" rel="noopener noreferrer">${V.esc(p.license)}</a>。${V.esc(p.changes)}</li>`).join('')+'</ul>';
for(const file of ['index.html','links.html','print.html']){
 let html=fs.readFileSync(path.join(root,file),'utf8');
 html=html.replace(/<!-- generated:([\w-]+) -->[\s\S]*?<!-- \/generated:\1 -->/g,(_,key)=>{
  if(!(key in sections))throw Error(`Unknown section ${key}`);
  return `<!-- generated:${key} -->\n${sections[key]}\n<!-- /generated:${key} -->`;
 });
 html=html.replace(/<([\w]+)([^>]*data-trip="([\w]+)"[^>]*)>[\s\S]*?<\/\1>/g,(_,tag,attrs,key)=>{
  if(!(key in values))throw Error(`Unknown trip binding ${key}`);
  return `<${tag}${attrs}>${V.esc(values[key])}</${tag}>`;
 });
 html=html.replace(/<a\b([^>]*data-url="([\w]+)"[^>]*)>/g,(_,attrs,key)=>{
  const url=URLS[key]||MAPS[key];if(!url)throw Error(`Unknown link ${key}`);
  return `<a${attrs.replace(/\s+href="[^"]*"/g,'')} href="${V.esc(V.safeURL(url))}">`;
 });
 write(file,html);
}
// Any shipped HTML, data, script or asset change creates a new atomic offline bundle.
const core=['./','./index.html','./links.html','./print.html','./styles.css','./data.js','./views.js','./app.js','./manifest.webmanifest'];
function walk(dir){for(const entry of fs.readdirSync(path.join(root,dir),{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const rel=dir+'/'+entry.name;if(entry.isDirectory())walk(rel);else core.push('./'+rel);}}
walk('assets');
const hash=crypto.createHash('sha256');
for(const file of core.filter(f=>f!=='./')){hash.update(file);hash.update(fs.readFileSync(path.join(root,file)));}
hash.update(fs.readFileSync(path.join(root,'tools/sw-template.js')));
const sw=fs.readFileSync(path.join(root,'tools/sw-template.js'),'utf8').replace('__VERSION__',hash.digest('hex').slice(0,16)).replace('__CORE_ASSETS__',JSON.stringify(core,null,2));
write('sw.js',sw);
console.log(check?'Generated pages and offline bundle are current.':'Generated pages and offline bundle updated.');
