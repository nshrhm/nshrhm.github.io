const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const types = {'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.ics':'text/calendar; charset=utf-8'};
function createServer(transform = (file, bytes) => bytes) {
  return http.createServer((req,res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/') { res.writeHead(302,{Location:'/mojiko/'}); res.end(); return; }
    const file = decodeURIComponent(url.pathname.replace(/^\/mojiko\//, '')) || 'index.html';
    const target = path.resolve(root,file);
    if (!url.pathname.startsWith('/mojiko/') || !target.startsWith(root+path.sep)) {res.writeHead(404);res.end();return;}
    try {
      const bytes = transform(file, fs.readFileSync(target));
      res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'text/plain; charset=utf-8','Cache-Control':'no-store'});
      res.end(bytes);
    } catch {res.writeHead(404);res.end('Not found');}
  });
}
module.exports = {createServer};
if (require.main === module) createServer().listen(8000,'127.0.0.1',()=>console.log('http://127.0.0.1:8000/mojiko/'));
