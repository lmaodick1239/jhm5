# Vanilla To-Do (tod)

Migrated on 2025-09-20 from the React implementation located in `tdl/` to a single-page, framework-free HTML/CSS/JS version.
Updated on 2025-09-27 to use Cloudflare KV storage instead of browser localStorage.

## Features

- Task CRUD with title, description, priority, due date, tags
- Kanban style columns: To-Do, In Progress, Done
- Sorting (deadline, priority, title)
- Filtering by status and multiple tags
- Custom tag & priority management (Settings view)
- Basic statistics (counts + simple SVG bar charts) without external libraries
- Light/Dark theme toggle (persisted)
- **Cloudflare KV persistence** for tasks, tags, priorities, theme, tag filters
- Accessible keyboard navigation for sidebar and form inputs

## Files

- `index.html` – Structure + modal + root containers
- `styles.css` – Consolidated styling adapted from original React CSS
- `app.js` – All application logic (state, rendering, events, persistence)
- `kv-storage.js` – KV storage service layer for Cloudflare integration
- `worker/index.js` – Cloudflare Worker backend with API endpoints
- `wrangler.jsonc` – Cloudflare Worker configuration
- `package.json` – Dependencies and deployment scripts

## How to Use

### Local Development
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Open browser to the URL shown in terminal

### Deployment
1. Build and deploy: `npm run deploy`
2. Visit your deployed app at the Workers URL

## Data Persistence

Data is now persisted using **Cloudflare KV storage** instead of localStorage:
- Global state accessible across devices and sessions
- API endpoint: `/api/tod/state` (GET/PUT operations)
- Automatic fallback to default state if KV is unavailable
- Async operations with proper error handling

## Differences from React Version

- No external charting library; replaced Recharts with lightweight inline SVG bar charts
- All UI rendering done via direct DOM manipulation
- No per-column collapse toggle (could be added similarly if needed)
- Form validation logic ported closely with minimal changes
- **NEW**: Cloud-based persistence with Cloudflare KV

## Possible Enhancements

- Drag & drop for changing task status
- Column collapse/expand state persistence
- Improved accessibility for modal focus trap
- Export/import data (JSON download)
- User authentication and multi-user support
- Real-time sync across multiple browser tabs

Deployed at: https://tod.despacito777x.workers.dev

Enjoy!
