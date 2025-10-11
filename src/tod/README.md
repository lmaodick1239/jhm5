# Cloudflare To-Do List Application 📝 (React + Cloudflare KV)

**Client Version:** React 19 with Vite  
**Server Version:** Cloudflare Workers + KV Storage

A comprehensive task management application built with React, featuring Kanban-style columns, advanced filtering, statistics, and **cloud-based Cloudflare KV storage** for persistent data across devices.

## ✨ Features

### Task Management
- **Kanban Board**: Three status columns (To Do, In Progress, Done)
- **Drag & Drop**: Move tasks between columns (visual indicator)
- **Rich Task Details**:
  - Title and description
  - Priority levels (customizable)
  - Due dates with calendar picker
  - Multiple tags per task
  - Status tracking

### Cloud Storage (Cloudflare KV)
- **Persistent Storage**: Data saved to Cloudflare's global KV storage
- **Cross-Device Sync**: Access your tasks from any device
- **Automatic Sync**: Real-time sync indicators
- **Fallback to LocalStorage**: Works offline when cloud is unavailable
- **Fast Edge Computing**: Low-latency responses from Cloudflare's network

### Organization Tools
- **Custom Tags**: Create and manage your own tags with color coding
- **Custom Priorities**: Define priority levels that suit your workflow
- **Smart Filtering**:
  - Filter by status (To Do, In Progress, Done)
  - Multi-tag filtering (AND logic)
  - Real-time filter updates
- **Flexible Sorting**:
  - Sort by deadline
  - Sort by priority
  - Sort alphabetically by title

### Insights
- **Statistics Dashboard**: 
  - Task completion rates
  - Priority distribution charts
  - Status breakdown visualization
  - Tag usage analytics
- **Charts**: Beautiful data visualizations using Recharts

### User Experience
- **Dark/Light Theme**: Toggle with persistent preference
- **Collapsible Columns**: Expand/collapse to focus on specific statuses
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Navigation**: Accessible sidebar navigation
- **Form Validation**: Comprehensive validation with helpful error messages
- **Cloud Sync Indicators**: Visual feedback when syncing to cloud

## 🛠️ Technologies

### Frontend
- **React 19** - UI framework
- **Recharts** - Data visualization
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling
- **Cloudflare KV Hook** - Custom React hook for cloud storage

### Backend
- **Cloudflare Workers** - Serverless edge computing
- **Cloudflare KV** - Global key-value storage
- **CORS Support** - Secure cross-origin requests

## 📦 Installation

```bash
npm install
```

## 🚀 Development

### Frontend Development
```bash
npm run dev
```

### Worker Development (Local)
```bash
npm run worker:dev
```

### Combined Development
Run both frontend and worker:
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run worker:dev
```

Open [http://localhost:5173](http://localhost:5173) to manage tasks.

## 🏗️ Build for Production

Build frontend:
```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🌐 Deploy to Cloudflare

### Prerequisites
1. Create a Cloudflare account
2. Create a KV namespace:
   ```bash
   wrangler kv:namespace create TOD_KV
   wrangler kv:namespace create TOD_KV --preview
   ```
3. Update `wrangler.jsonc` with your namespace IDs

### Deploy
Deploy both frontend and worker:
```bash
npm run deploy
```

Or deploy separately:
```bash
# Deploy worker only
npm run worker:deploy

# Then upload built frontend to Cloudflare Pages
npm run build
# Upload dist/ folder to Cloudflare Pages dashboard
```

## ⚙️ Configuration

### Cloudflare KV Setup

Edit `wrangler.jsonc` with your KV namespace IDs:

```jsonc
{
  "name": "tod-worker",
  "main": "worker/index.js",
  "compatibility_date": "2024-01-01",
  "kv_namespaces": [
    {
      "binding": "TOD_KV",
      "id": "YOUR_PRODUCTION_KV_ID",
      "preview_id": "YOUR_PREVIEW_KV_ID"
    }
  ]
}
```

### API Endpoint Configuration

By default, the app uses `/api/tod/state` for the Worker API. To use a custom URL:

```javascript
// In your HTML or before loading the app
window.TOD_API_URL = 'https://your-worker.your-subdomain.workers.dev/api/tod/state';
```

## 📱 Views

### 1. Dashboard
- Main Kanban board with three columns
- Add new tasks with the "+" button
- Click tasks to view/edit details
- Visual priority indicators and tags
- Cloud sync indicator (top-right)

### 2. Statistics
- Overview of task completion
- Charts showing:
  - Tasks by status (bar chart)
  - Tasks by priority (pie chart)
  - Tasks by tag (bar chart)
- Real-time statistics updates

### 3. Settings
- Manage custom tags (add, edit, delete)
- Configure priority levels
- Theme toggle (dark/light mode)
- Persistent settings via Cloudflare KV

## 🎯 How to Use

### Creating a Task
1. Click the "+" button in any column
2. Fill in task details:
   - **Title** (required, 3-100 characters)
   - **Description** (optional, max 500 characters)
   - **Priority** (select from dropdown)
   - **Due Date** (optional, select from calendar)
   - **Tags** (multiple selection)
3. Click "Add Task"
4. Task automatically syncs to Cloudflare KV

### Managing Tasks
- **Edit**: Click on a task card to edit details
- **Move**: Tasks automatically appear in their status column
- **Delete**: Use the delete button when editing a task
- **Change Status**: Edit the task and change its status
- **Sync**: Changes sync automatically to cloud

### Filtering & Sorting
- **Filter by Status**: Use the dropdown to show specific statuses
- **Filter by Tags**: Select multiple tags (shows tasks with ALL selected tags)
- **Sort Tasks**: Choose sort order (deadline, priority, or title)
- **Clear Filters**: Click "Clear All" to reset

### Customization
1. Go to **Settings** view
2. **Tags Management**:
   - Add new tags with custom names
   - Delete unused tags
3. **Priority Management**:
   - Add new priority levels
   - Remove priorities you don't need
4. **Theme**: Toggle between light and dark mode

## 📁 Project Structure

```
src/
├── hooks/
│   ├── useCloudflareKV.js     # Custom hook for KV storage
│   └── useLocalStorage.js     # Fallback localStorage hook
├── components/
│   ├── DashboardView.jsx      # Main Kanban board
│   ├── StatisticsView.jsx     # Analytics and charts
│   ├── SettingsView.jsx       # Configuration panel
│   ├── Sidebar.jsx            # Navigation sidebar
│   ├── TaskColumn.jsx         # Status column component
│   ├── TaskCard.jsx           # Individual task display
│   ├── TaskModal.jsx          # Add/edit task form
│   └── FilterBar.jsx          # Filtering controls
├── App.jsx                    # Main application
├── App.css                    # Global styles
└── main.jsx                   # Entry point

worker/
└── index.js                   # Cloudflare Worker API

wrangler.jsonc                 # Worker configuration
vite.config.js                 # Vite build configuration
package.json                   # Dependencies and scripts
```

## 💾 Data Persistence

All data is stored in **Cloudflare KV storage**:
- **Tasks**: Task list with all details
- **Tags**: Custom tag definitions
- **Priorities**: Custom priority levels
- **Theme**: Dark/light preference
- **Filter State**: Selected tag filters

### Fallback Strategy
If Cloudflare KV is unavailable:
1. App automatically falls back to localStorage
2. "(Local)" indicator appears in header
3. Data syncs to cloud when connection is restored

## ☁️ Cloudflare Worker API

### Endpoints

**GET /api/tod/state**
- Fetches the current state from KV
- Returns normalized and sanitized JSON
- Falls back to default state if empty

**PUT /api/tod/state**
- Updates the entire state
- Validates and normalizes input
- Saves to KV storage

**OPTIONS /api/tod/state**
- CORS preflight handler
- Returns allowed methods and headers

### CORS Support
The Worker supports cross-origin requests with:
- Access-Control-Allow-Origin
- Access-Control-Allow-Methods
- Access-Control-Allow-Headers

## 🔐 Security Features

- **Input Validation**: All data is validated and sanitized
- **Length Limits**: Enforced on titles, descriptions, tags
- **XSS Protection**: String sanitization prevents injection
- **CORS**: Proper CORS headers for secure requests
- **Type Checking**: Ensures data integrity

## ⌨️ Keyboard Shortcuts

- **Tab**: Navigate through sidebar items
- **Enter/Space**: Activate focused sidebar item
- **Esc**: Close modals

## 🎨 Theme

The application supports both light and dark themes:
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for extended use
- **Persistent**: Your choice is synced via Cloudflare KV

## 📊 Statistics Explained

- **Tasks by Status**: Visual breakdown of To Do vs In Progress vs Done
- **Tasks by Priority**: Distribution across your priority levels
- **Tasks by Tag**: See which tags are most commonly used
- **Completion Rate**: Percentage of tasks marked as Done

## 🚀 Performance

- **Edge Computing**: Served from Cloudflare's global network
- **Low Latency**: < 50ms response times worldwide
- **Optimistic Updates**: UI updates immediately, syncs in background
- **Efficient Syncing**: Only changed data is transmitted

## 🆚 Comparison with /tdl

| Feature | /tdl (LocalStorage) | /tod (Cloudflare KV) |
|---------|---------------------|----------------------|
| Storage | Browser localStorage | Cloudflare KV (cloud) |
| Cross-Device | ❌ No | ✅ Yes |
| Data Backup | ❌ No | ✅ Yes |
| Offline Support | ✅ Yes | ✅ Yes (with fallback) |
| Sync Indicator | ❌ No | ✅ Yes |
| Global Access | ❌ No | ✅ Yes |

## 🐛 Troubleshooting

### Worker Not Accessible
- Ensure `wrangler.jsonc` is configured correctly
- Run `npm run worker:dev` to test locally
- Check Cloudflare dashboard for deployment status

### Data Not Syncing
- Check browser console for errors
- Verify API endpoint in network tab
- Ensure KV namespace is created and bound
- Check CORS configuration

### Fallback to LocalStorage
- This is normal if worker is unavailable
- Data will sync when connection is restored
- "(Local)" indicator shows fallback mode

## 📚 Resources

- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare KV](https://developers.cloudflare.com/workers/runtime-apis/kv/)
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/)

---

**Note**: This is a cloud-enhanced version of the to-do application. A localStorage-only version is available in the `/tdl` directory.
