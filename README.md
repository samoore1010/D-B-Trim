# D&B Trim

The D&B Trim marketing homepage, packaged as a static website ready to deploy on
[Railway](https://railway.com).

The site itself is a single self-contained file, `index.html` (React app with all
assets bundled inline). A tiny zero-dependency Node server (`server.js`) serves it
and binds to the port Railway provides.

## Project layout

| File | Purpose |
| --- | --- |
| `index.html` | The complete, self-contained homepage. |
| `server.js` | Zero-dependency static file server (binds to `$PORT`). |
| `package.json` | Defines the `npm start` command Railway runs. |
| `railway.json` | Railway build/deploy config (start command + health check). |
| `.nvmrc` | Pins Node 20 for local development. |

## Run locally

```bash
npm start
# → open http://localhost:3000
```

Set a custom port with `PORT=8080 npm start`.

## Deploy to Railway

### Option A — from the GitHub repo (recommended)

1. Push this repository to GitHub (already done if you're reading this on GitHub).
2. In Railway: **New Project → Deploy from GitHub repo** and pick this repo/branch.
3. Railway auto-detects Node via `package.json`, runs `npm start`, and assigns a
   public URL. No environment variables are required.
4. (Optional) Under the service's **Settings → Networking**, add your custom domain.

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
- There are no runtime dependencies, so the build is just `npm install` (a no-op)
  followed by `npm start`.
