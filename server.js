// Gap Cutter: tiny file server for hosts that run Node.js apps (e.g. Hostinger "Web Apps").
// The app itself runs entirely in the browser; this only hands out its files.
// No dependencies. Start with:  npm start
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const FILES = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/index.html': ['index.html', 'text/html; charset=utf-8'],
  '/sw.js': ['sw.js', 'text/javascript; charset=utf-8'],
  '/manifest.json': ['manifest.json', 'application/manifest+json'],
  '/icon-192.png': ['icon-192.png', 'image/png'],
  '/icon-512.png': ['icon-512.png', 'image/png'],
};

http.createServer((req, res) => {
  const p = new URL(req.url, 'http://x').pathname;
  const f = FILES[p];
  if (!f) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
  fs.readFile(path.join(__dirname, f[0]), (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': f[1], 'Cache-Control': p === '/sw.js' ? 'no-cache' : 'public, max-age=300' });
    res.end(data);
  });
}).listen(PORT, () => console.log('Gap Cutter running on port ' + PORT));
