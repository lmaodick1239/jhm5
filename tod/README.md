# Vanilla To-Do (tod)

Migrated on 2025-09-20 from the React implementation located in `tdl/` to a single-page, framework-free HTML/CSS/JS version.

## Features

- Task CRUD with title, description, priority, due date, tags
- Kanban style columns: To-Do, In Progress, Done
- Sorting (deadline, priority, title)
- Filtering by status and multiple tags
- Custom tag & priority management (Settings view)
- Basic statistics (counts + simple SVG bar charts) without external libraries
- Light/Dark theme toggle (persisted)
- Cloudflare KV persistence for tasks, tags, priorities, theme, tag filters
- Accessible keyboard navigation for sidebar and form inputs

## Files

- `index.html` – Fully self-contained HTML file with inlined CSS and JavaScript (structure, styling, logic)

## How to Use

Serve `tod/index.html` from the same origin as the Worker (or expose the Worker at `window.TOD_API_URL`) so the app can call `/api/tod/state`. No build tooling is required, but a deployed Worker with the `TOD_KV` binding must be available.

> Legacy note: `styles.css` and `app.js` remain in the directory for reference but are no longer loaded—`index.html` now contains the complete app inline.

## Data Persistence

State is stored in the `TOD_KV` namespace via the Cloudflare Worker located in `ttx/worker/index.ts`. The Worker exposes two routes:

- `GET /api/tod/state` – returns the normalized state JSON
- `PUT /api/tod/state` – replaces the stored state (validated + sanitized server-side)

> Tip: For local development you can run `wrangler dev --local` inside `ttx/` to spin up the Worker and then open `tod/index.html` from a simple static server pointed at the same origin (or set `window.TOD_API_URL` before the script runs).

## Cloudflare Setup

1. Create a Cloudflare KV namespace (e.g. `tod-state`) and note both the production and preview IDs.
2. Update `ttx/wrangler.jsonc` with those IDs under the `TOD_KV` binding.
3. Deploy the Worker (`wrangler deploy`) so the `/api/tod/state` endpoint is available to the app.
4. Optionally set `window.TOD_API_URL = "https://<your-worker-domain>/api/tod/state";` before loading the script if the Worker lives on a different origin.

## Differences from React Version

- No external charting library; replaced Recharts with lightweight inline SVG bar charts
- All UI rendering done via direct DOM manipulation
- No per-column collapse toggle (could be added similarly if needed)
- Form validation logic ported closely with minimal changes

## Possible Enhancements

- Drag & drop for changing task status
- Column collapse/expand state persistence
- Improved accessibility for modal focus trap
- Export/import data (JSON download)

Enjoy!
