# D&B Trim Carpentry

The D&B Trim Carpentry website — a multi-page static site, ready to deploy on
[Railway](https://railway.com).

## What this is

The site is a set of component-based HTML pages. Each page (`*.dc.html`) shares a
common **Header** and **Footer** via `<dc-import>`, and a small client runtime,
[`support.js`](public/support.js), stitches them together in the browser at load
time. React/ReactDOM are loaded from a CDN (unpkg) at runtime — there is **no
build step and no dependencies to install**.

A tiny zero-dependency Node server ([`server.js`](server.js)) serves the
`public/` directory and binds to the port Railway provides.

## Pages

| URL | File |
| --- | --- |
| `/` → redirects to home | — |
| Home | `public/DandB Homepage.dc.html` |
| Services | `public/Services.dc.html` |
| About | `public/About.dc.html` |
| Contact | `public/Contact.dc.html` |
| Careers | `public/Careers.dc.html` |
| _(shared)_ | `public/Header.dc.html`, `public/Footer.dc.html` |
| Anything missing | `public/404.html` |

Images live in `public/assets/`.

## Run locally

```bash
npm start
# → open http://localhost:3000  (redirects to the home page)
```

Set a custom port with `PORT=8080 npm start`. Serve over HTTP (not by opening the
files directly) so the `dc-import` fetches and the CDN scripts resolve correctly.

## Deploy to Railway

### Option A — from the GitHub repo (recommended)

1. Push this repository to GitHub.
2. In Railway: **New Project → Deploy from GitHub repo** and pick this repo/branch.
3. Railway auto-detects Node via `package.json`, runs `npm start`, and assigns a
   public URL. No environment variables are required.
4. (Optional) Under the service's **Settings → Networking**, add a custom domain.

### Option B — from the CLI

```bash
npm i -g @railway/cli
railway login
railway init      # create/link a project
railway up        # build & deploy
```

## How it works on Railway

- Railway injects `PORT`; `server.js` reads `process.env.PORT` and listens on
  `0.0.0.0`, so the service is reachable.
- `railway.json` points the health check at `/healthz`, which returns `200 ok`.
- Requests to `/` are redirected to the home page so the client runtime always
  boots from a canonical `.dc.html` URL (the same URLs the nav links use).
- Unknown paths return a branded `404.html` (rather than silently serving the
  home page), so a genuinely missing page is visible instead of looking like a
  reload.

## Updating content

Edit the relevant `public/*.dc.html` file (or the shared `Header`/`Footer`) and
redeploy. To add a new page, drop a new `*.dc.html` file in `public/` and link to
it from the Header nav.
