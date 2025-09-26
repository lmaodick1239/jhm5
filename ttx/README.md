# Cloudflare Worker – To-Do State API

This Worker exposes a tiny JSON API that persists the `tod/` single-page app's state inside a Cloudflare KV namespace. The endpoints are:

- `GET /api/tod/state` – fetch the current task/tag/theme state (normalized and sanitized)
- `PUT /api/tod/state` – overwrite the stored state after validation and normalization

The Worker validates input, guards against malformed data, and performs CORS negotiation so the static HTML app can call it from the browser.

## Prerequisites

- Node.js >= 18
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
- A Cloudflare account with access to KV

## Configure KV Binding

1. Create a KV namespace (e.g. `tod-state`).
1. Copy its production and preview IDs.
1. Update `wrangler.jsonc`:

```jsonc
"kv_namespaces": [
  {
    "binding": "TOD_KV",
    "id": "<YOUR_PRODUCTION_ID>",
    "preview_id": "<YOUR_PREVIEW_ID>"
  }
]
```

1. Commit the updated configuration (do not store secrets in version control).

## Local Development

```bash
wrangler dev --local
```

This serves the Worker on `http://127.0.0.1:8787`. Point a static server hosting `tod/index.html` at the same origin, or set `window.TOD_API_URL` before the script loads to target the Worker URL.

## Deploy

```bash
wrangler deploy
```

After deployment, the Worker will handle persistence for the `tod` app. Ensure the static site is served from the same domain (or configure `window.TOD_API_URL`) so the browser can reach `/api/tod/state`.
