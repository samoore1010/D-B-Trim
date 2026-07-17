'use strict';

/**
 * Minimal zero-dependency static file server for the D&B Trim homepage.
 * Serves the self-contained index.html (and any future static assets) and
 * binds to the port Railway provides via process.env.PORT.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const ROOT = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, body, headers) {
  res.writeHead(status, headers || {});
  res.end(body);
}

const server = http.createServer((req, res) => {
  // Health check endpoint for Railway.
  if (req.url === '/healthz') {
    return send(res, 200, 'ok', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  // Decode and strip query string.
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch (e) {
    return send(res, 400, 'Bad Request');
  }

  if (urlPath === '/') urlPath = '/index.html';

  // Resolve safely inside ROOT to prevent path traversal.
  const resolved = path.normalize(path.join(ROOT, urlPath));
  if (!resolved.startsWith(ROOT)) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(resolved, (err, stats) => {
    // Fall back to the single-page app entry point for unknown routes.
    if (err || !stats.isFile()) {
      const indexPath = path.join(ROOT, 'index.html');
      return fs.readFile(indexPath, (e, data) => {
        if (e) return send(res, 404, 'Not Found');
        send(res, 200, data, { 'Content-Type': MIME_TYPES['.html'] });
      });
    }

    const ext = path.extname(resolved).toLowerCase();
    const type = MIME_TYPES[ext] || 'application/octet-stream';
    fs.readFile(resolved, (e, data) => {
      if (e) return send(res, 500, 'Internal Server Error');
      send(res, 200, data, { 'Content-Type': type });
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`D&B Trim site listening on http://${HOST}:${PORT}`);
});
