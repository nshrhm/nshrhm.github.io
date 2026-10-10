// Rasterize the SVG originals with the same Chromium used by check-browser.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const zlib=require('node:zlib');
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const root=path.resolve(__dirname,'..'),dir=path.join(root,'assets/icons');
function compressPNG(bytes){
 const chunks=[],data=[];
 for(let p=8;p<bytes.length;){const n=bytes.readUInt32BE(p),type=bytes.toString('ascii',p+4,p+8);chunks.push({type,bytes:bytes.subarray(p,p+n+12)});if(type==='IDAT')data.push(bytes.subarray(p+8,p+8+n));p+=n+12;}
 const compressed=zlib.deflateSync(zlib.inflateSync(Buffer.concat(data)),{level:9});
 const idat=Buffer.alloc(compressed.length+12);idat.writeUInt32BE(compressed.length);idat.write('IDAT',4);compressed.copy(idat,8);idat.writeUInt32BE(zlib.crc32(idat.subarray(4,-4)),idat.length-4);
 let written=false;
 return Buffer.concat([bytes.subarray(0,8),...chunks.flatMap(c=>c.type!=='IDAT'?[c.bytes]:written?[]:(written=true,[idat]))]);
}
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_EXECUTABLE?{executablePath:process.env.CHROMIUM_EXECUTABLE}:{}),args:['--no-sandbox']});
 try {
  const page=await browser.newPage(),files={};
  async function raster(source,size,maskable=false){
   let svg=fs.readFileSync(path.join(dir,source),'utf8');
   if(maskable)svg=svg.replace('<g id="emblem">','<g id="emblem" transform="translate(256 256) scale(.9) translate(-256 -256)">');
   return compressPNG(Buffer.from(await page.evaluate(async({svg,size})=>{
    const img=new Image();img.src='data:image/svg+xml;base64,'+btoa(svg.replace(/<title>.*?<\/title>/,''));await img.decode();
    const canvas=document.createElement('canvas');canvas.width=canvas.height=size;canvas.getContext('2d').drawImage(img,0,0,size,size);
    return canvas.toDataURL('image/png').split(',')[1];
   },{svg,size}),'base64'));
  }
  for(const [file,size,source,maskable] of [
   ['icon-192.png',192,'yufuin.svg'],['icon-512.png',512,'yufuin.svg'],
   ['apple-touch-icon.png',180,'yufuin.svg'],['maskable-512.png',512,'yufuin.svg',true],
   ['favicon-16.png',16,'favicon.svg'],['favicon-32.png',32,'favicon.svg']
  ])files[file]=await raster(source,size,maskable);
  const sizes=[16,32,48],images=await Promise.all(sizes.map(size=>raster('favicon.svg',size))),header=Buffer.alloc(6+16*sizes.length);
  header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
  sizes.forEach((size,i)=>{const p=6+16*i;header[p]=header[p+1]=size;header.writeUInt16LE(1,p+4);header.writeUInt16LE(32,p+6);header.writeUInt32LE(images[i].length,p+8);header.writeUInt32LE(offset,p+12);offset+=images[i].length;});
  files['favicon.ico']=Buffer.concat([header,...images]);
  for(const [file,bytes] of Object.entries(files))fs.writeFileSync(path.join(dir,file),bytes);
  const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
  fs.writeFileSync(path.join(root,'sources/icons.json'),JSON.stringify({
   renderer:`Chromium ${browser.version()}`,
   sources:Object.fromEntries(['yufuin.svg','favicon.svg'].map(file=>[file,sha(fs.readFileSync(path.join(dir,file)))])),
   outputs:Object.fromEntries(Object.entries(files).map(([file,bytes])=>[file,sha(bytes)]))
  },null,2)+'\n');
  console.log('Generated 7 icon files from 2 SVG originals.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
