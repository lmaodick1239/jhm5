# Advanced To-Do List Application 📝

A comprehensive task management application built with React, featuring Kanban-style columns, advanced filtering, statistics, and customizable tags and priorities.

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
- **LocalStorage Persistence**: All data saved automatically

## 🛠️ Technologies

- **React 19** - UI framework
- **Recharts** - Data visualization
- **Vite** - Build tool and dev server
- **CSS Modules** - Scoped styling

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to start managing tasks.

## 🏗️ Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 📱 Views

### 1. Dashboard
- Main Kanban board with three columns
- Add new tasks with the "+" button
- Click tasks to view/edit details
- Visual priority indicators and tags

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
- Persistent settings via localStorage

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

### Managing Tasks
- **Edit**: Click on a task card to edit details
- **Move**: Tasks automatically appear in their status column
- **Delete**: Use the delete button when editing a task
- **Change Status**: Edit the task and change its status

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
├── components/
│   ├── DashboardView.jsx      # Main Kanban board
│   ├── StatisticsView.jsx     # Analytics and charts
│   ├── SettingsView.jsx       # Configuration panel
│   ├── Sidebar.jsx            # Navigation sidebar
│   ├── TaskColumn.jsx         # Status column component
│   ├── TaskCard.jsx           # Individual task display
│   ├── TaskModal.jsx          # Add/edit task form
│   └── FilterBar.jsx          # Filtering controls
├── hooks/
│   └── useLocalStorage.js     # Persistent state hook
├── App.jsx                    # Main application
├── App.css                    # Global styles
└── main.jsx                   # Entry point
```

## 💾 Data Persistence

All data is stored in browser localStorage:
- **Tasks**: Task list with all details
- **Tags**: Custom tag definitions
- **Priorities**: Custom priority levels
- **Theme**: Dark/light preference
- **Filter State**: Selected tag filters

Data persists across browser sessions and page refreshes.

## ⌨️ Keyboard Shortcuts

- **Tab**: Navigate through sidebar items
- **Enter/Space**: Activate focused sidebar item
- **Esc**: Close modals

## 🎨 Theme

The application supports both light and dark themes:
- **Light Theme**: Clean, bright interface
- **Dark Theme**: Easy on the eyes for extended use
- **Persistent**: Your choice is remembered

## 📊 Statistics Explained

- **Tasks by Status**: Visual breakdown of To Do vs In Progress vs Done
- **Tasks by Priority**: Distribution across your priority levels
- **Tasks by Tag**: See which tags are most commonly used
- **Completion Rate**: Percentage of tasks marked as Done

## 🚀 Future Enhancements

Possible features to add:
- Drag-and-drop task reordering
- Task search functionality
- Due date notifications
- Export/import task data
- Subtasks and checklists
- Task history and activity log
- Cloud synchronization
- Collaboration features

---

**Note**: This is a React version of the to-do application. A vanilla JavaScript version is available in the `tod/` directory.
