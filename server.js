'use strict';

/**
 * Minimal zero-dependency static file server for the D&B Trim Carpentry site.
 *
 * The site is a set of ".dc.html" component pages (Header/Footer shared via
 * dc-import) stitched together at load time by support.js. Serving them over
 * HTTP is all that's required — no build step, no dependencies.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const PUBLIC_DIR = path.join(__dirname, 'public');

// The site's entry page (nav links point here; it contains a space).
const HOME_PAGE = 'DandB Homepage.dc.html';

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

function serveFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 500, 'Internal Server Error');
    send(res, 200, data, { 'Content-Type': type });
  });
}

function notFound(res) {
  const custom = path.join(PUBLIC_DIR, '404.html');
  fs.readFile(custom, (err, data) => {
    if (err) return send(res, 404, 'Not Found', { 'Content-Type': 'text/plain; charset=utf-8' });
    send(res, 404, data, { 'Content-Type': MIME_TYPES['.html'] });
  });
}

const server = http.createServer((req, res) => {
  // Health check endpoint for Railway.
  if (req.url === '/healthz') {
    return send(res, 200, 'ok', { 'Content-Type': 'text/plain; charset=utf-8' });
  }

  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);
  } catch (e) {
    return send(res, 400, 'Bad Request');
  }

  // Send the bare root to the canonical home page URL so the client runtime
  // always boots from a real ".dc.html" path (matching the nav links).
  if (urlPath === '/' || urlPath === '') {
    return send(res, 302, null, { Location: '/' + encodeURIComponent(HOME_PAGE) });
  }

  // Resolve safely inside PUBLIC_DIR to prevent path traversal.
  const resolved = path.normalize(path.join(PUBLIC_DIR, urlPath));
  if (resolved !== PUBLIC_DIR && !resolved.startsWith(PUBLIC_DIR + path.sep)) {
    return send(res, 403, 'Forbidden');
  }

  fs.stat(resolved, (err, stats) => {
    if (err || !stats.isFile()) {
      // Honest 404 — do NOT silently fall back to the home page, so a
      // genuinely missing page is visible rather than looking like a reload.
      return notFound(res);
    }
    serveFile(res, resolved);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`D&B Trim Carpentry site listening on http://${HOST}:${PORT}`);
});
