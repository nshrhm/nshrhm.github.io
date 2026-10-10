const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
function createServer(root, transform=(_file,bytes)=>bytes){
  return http.createServer((req,res)=>{
    let pathname;
    try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400).end();return;}
    if(pathname==='/') {res.writeHead(302,{Location:'/yufuin/'}).end();return;}
    if(!pathname.startsWith('/yufuin/')){res.writeHead(404).end();return;}
    const relative=pathname.slice('/yufuin/'.length)||'index.html';
    const target=path.resolve(root,relative);
    if(!target.startsWith(root+path.sep)||!fs.existsSync(target)||!fs.statSync(target).isFile()) {res.writeHead(404).end();return;}
    const types={'.md':'text/plain; charset=utf-8','.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.ico':'image/x-icon','.jpg':'image/jpeg','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
    res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(transform(relative,fs.readFileSync(target)));
  });
}
module.exports={createServer};
if(require.main===module){const root=path.resolve(__dirname,'..'),server=createServer(root);server.listen(Number(process.env.PORT||8000),'127.0.0.1',()=>console.log(`http://127.0.0.1:${server.address().port}/yufuin/`));}
