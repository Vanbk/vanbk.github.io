import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { root } from './build.mjs';

const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.pdf': 'application/pdf', '.bib': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8' };
createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const decoded = decodeURIComponent(url.pathname);
    if (decoded.split(/[\\/]/).some((part) => part.startsWith('.') || part === 'data' || part === 'scripts')) {
      response.writeHead(404).end('Not found');
      return;
    }
    let path = resolve(root, '.' + decoded);
    if (!path.startsWith(root + sep) && path !== root) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    try {
      if ((await stat(path)).isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          response.writeHead(301, { Location: `${url.pathname}/${url.search}` }).end();
          return;
        }
        path = resolve(path, 'index.html');
      }
      const bytes = await readFile(path);
      response.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : bytes);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(await readFile(resolve(root, '404.html')));
    }
  } catch {
    response.writeHead(400).end('Bad request');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
