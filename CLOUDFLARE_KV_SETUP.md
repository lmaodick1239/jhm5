# Cloudflare Pages with KV Storage Setup Guide

## Problem Solved ✅

The TOD app was returning `404` for `/api/tod/state` because there was no worker to handle the API requests. This has been fixed by:

1. Creating `public/_worker.js` - Cloudflare Pages Functions handler
2. Updating `wrangler.jsonc` - KV namespace bindings
3. Using Wrangler Pages dev server for local testing

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Cloudflare Pages (Static Assets + Edge Functions)      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Static Files:            Worker Function:               │
│  /public/                 /public/_worker.js             │
│  ├─ index.html           (Handles /api/* routes)         │
│  ├─ tod/                                                 │
│  │  ├─ index.html        ┌─────────────────────┐       │
│  │  ├─ assets/           │  GET  /api/tod/state│       │
│  │  └─ kv-storage.js     │  PUT  /api/tod/state│       │
│  ├─ dma/                 │  OPTIONS (CORS)     │       │
│  └─ ...                  └──────────┬──────────┘       │
│                                     │                    │
│                                     ▼                    │
│                          ┌──────────────────────┐       │
│                          │  Cloudflare KV       │       │
│                          │  Namespace: TOD_KV   │       │
│                          │  Key: "tod-state"    │       │
│                          └──────────────────────┘       │
└─────────────────────────────────────────────────────────┘
```

## Files Created/Updated

### 1. `public/_worker.js` (NEW)
- Cloudflare Pages Advanced Mode worker
- Handles `/api/tod/state` endpoint
- Provides GET/PUT/OPTIONS methods
- Validates and sanitizes all data
- Falls back to static asset serving for other routes

### 2. `wrangler.jsonc` (UPDATED)
- Added `kv_namespaces` binding for `TOD_KV`
- Uses the same KV namespace IDs from `src/tod/wrangler.jsonc`

## Local Development

### Method 1: Wrangler Pages Dev (Recommended)
```bash
npx wrangler pages dev public --kv TOD_KV
```

This command:
- Serves static files from `public/`
- Executes `_worker.js` for API routes
- Binds a local KV namespace
- Runs on http://127.0.0.1:8788

**Access the app:** http://127.0.0.1:8788/tod

### Method 2: Regular Serve (No KV - Fallback Mode)
```bash
npm run dev
# or
npx serve public
```

This will serve static files but the app will fall back to localStorage since there's no worker.

## Deployment to Cloudflare Pages

### Prerequisites

1. **Create KV Namespace** (if not already created):
```bash
npx wrangler kv:namespace create TOD_KV
npx wrangler kv:namespace create TOD_KV --preview
```

This will output IDs like:
```
✨ Success!
Add the following to your wrangler.jsonc:
{ binding = "TOD_KV", id = "41a69c0f17014c42a7d9ab630f46fcac" }
```

2. **Update wrangler.jsonc** with your KV namespace IDs (already done):
```jsonc
{
  "kv_namespaces": [
    {
      "binding": "TOD_KV",
      "id": "YOUR_PRODUCTION_ID",
      "preview_id": "YOUR_PREVIEW_ID"
    }
  ]
}
```

### Deploy Command

```bash
npm run deploy
```

This will:
1. Run `npm run generate` - Build all projects and create index
2. Run `npx wrangler pages deploy public` - Deploy to Cloudflare Pages

### Manual Deploy

```bash
# Step 1: Generate static assets
npm run generate

# Step 2: Deploy to Cloudflare Pages
npx wrangler pages deploy public
```

### First-Time Setup on Cloudflare Dashboard

If this is your first deployment:

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages**
3. Find your deployed Pages project
4. Go to **Settings > Functions**
5. Verify **KV Namespace Bindings**:
   - Variable name: `TOD_KV`
   - KV namespace: Select your created namespace

The KV bindings should be automatically configured from `wrangler.jsonc`, but verify them in the dashboard.

## How It Works

### Request Flow

1. **User opens app:** `https://your-site.pages.dev/tod/`
2. **Static HTML served:** Cloudflare Pages serves `public/tod/index.html`
3. **App loads:** React app initializes, calls `/api/tod/state`
4. **Worker intercepts:** `_worker.js` catches the API route
5. **KV read:** Worker reads from `TOD_KV` namespace
6. **Data returned:** JSON response sent to frontend
7. **User edits:** Frontend calls `PUT /api/tod/state`
8. **KV write:** Worker saves updated state to KV

### KV Storage Structure

**Key:** `"tod-state"`

**Value (JSON):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Example Task",
      "status": "To-Do",
      "priority": "High",
      "description": "Task description",
      "tags": ["Work"],
      "deadline": "2025-10-15",
      "createdAt": "2025-10-11T03:21:55.000Z"
    }
  ],
  "tags": ["Work", "Personal"],
  "priorities": ["Low", "Medium", "High"],
  "theme": "light",
  "filterByTags": []
}
```

## Troubleshooting

### Issue: 404 on `/api/tod/state` locally

**Solution:** Use `npx wrangler pages dev public --kv TOD_KV` instead of `npm run dev`

### Issue: KV not found in production

**Check:**
1. KV namespace created: `npx wrangler kv:namespace list`
2. Binding in wrangler.jsonc matches dashboard
3. Redeploy after KV setup changes

### Issue: CORS errors

The `_worker.js` includes proper CORS headers. If you still see errors:
- Check browser console for exact error
- Verify the Origin header is being sent
- Test with curl: `curl -i http://127.0.0.1:8788/api/tod/state`

### Issue: Data not persisting locally

Local KV storage is ephemeral. Each time you restart `wrangler pages dev`, the local KV is cleared. This is expected behavior.

For persistent local testing:
- Use localStorage fallback (the app auto-detects)
- Or deploy to Cloudflare Preview environment

## Key Benefits

✅ **Single Deployment:** One `npm run deploy` deploys everything  
✅ **Auto-scaling:** Cloudflare's global edge network  
✅ **Low Latency:** KV reads are fast worldwide  
✅ **No Backend Server:** Serverless functions only  
✅ **Cost Effective:** Cloudflare Pages free tier is generous  
✅ **Global Sync:** Access tasks from any device  

## Testing Checklist

Before deploying:

- [ ] Run `npx wrangler pages dev public --kv TOD_KV`
- [ ] Test GET: Open http://127.0.0.1:8788/api/tod/state in browser
- [ ] Test TOD app: http://127.0.0.1:8788/tod/
- [ ] Create a task - verify it saves
- [ ] Refresh page - verify task persists
- [ ] Check browser console for errors
- [ ] Test other projects still work: /dma, /maf, etc.

## Next Steps

1. **Test Locally:**
   ```bash
   npx wrangler pages dev public --kv TOD_KV
   ```

2. **Deploy:**
   ```bash
   npm run deploy
   ```

3. **Verify on Cloudflare:**
   - Check deployment status in dashboard
   - Test the live URL: `https://your-project.pages.dev/tod/`
   - Create some tasks to test KV storage

## Notes

- The `_worker.js` file is automatically used by Cloudflare Pages (Advanced Mode)
- All static files are still served normally
- Only `/api/*` routes are handled by the worker
- The same KV namespace can be shared across projects if needed
- KV has eventual consistency (usually < 60 seconds globally)

---

**Status:** ✅ Ready to deploy!
