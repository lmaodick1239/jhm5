import React, { useState, useMemo, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import DashboardView from './components/DashboardView.jsx';
import StatisticsView from './components/StatisticsView.jsx';
import SettingsView from './components/SettingsView.jsx';
import './App.css';

function App() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [tags, setTags] = useLocalStorage('tags', ['Work', 'Personal']);
  const [priorities, setPriorities] = useLocalStorage('priorities', ['Low', 'Medium', 'High']);
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const [view, setView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sortBy, setSortBy] = useState('deadline');
  const [filterByStatus, setFilterByStatus] = useState('');
  const [filterByTags, setFilterByTags] = useLocalStorage('filterByTags', []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Comprehensive form validation with multiple field checks and error handling
  const validateForm = (formData) => {
    const errors = {};
    
    // Title validation
    const title = formData.get('title')?.trim();
    if (!title) {
      errors.title = 'Title is required';
    } else if (title.length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    } else if (title.length > 100) {
      errors.title = 'Title must be less than 100 characters';
    }

    // Description validation
    const description = formData.get('description')?.trim();
    if (description && description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    // Priority validation
    const priority = formData.get('priority');
    const validPriorities = ['low', 'medium', 'high'];
    if (!priority || !validPriorities.includes(priority.toLowerCase())) {
      errors.priority = 'Please select a valid priority';
    }

    // Due date validation - ensures date is not in the past using timezone-safe comparison
    const dueDate = formData.get('dueDate');
    if (dueDate) {
      const selectedDate = new Date(dueDate + 'T00:00:00');
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        errors.dueDate = 'Due date cannot be in the past';
      }
    }

    // Tags validation - checks count and individual tag length limits
    const tagsString = formData.get('tags')?.trim();
    if (tagsString) {
      const tagList = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
      if (tagList.length > 10) {
        errors.tags = 'Maximum 10 tags allowed';
      }
      
      // Check for invalid tag lengths
      const invalidTags = tagList.filter(tag => tag.length > 20);
      if (invalidTags.length > 0) {
        errors.tags = 'Each tag must be less than 20 characters';
      }
    }

    return errors;
  };

  const resetForm = () => {
    setFormErrors({});
    setIsSubmitting(false);
  };

  // Generates current date string in YYYY-MM-DD format using local timezone
  // Avoids timezone issues with toISOString() method
  const getCurrentDateString = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowEditTaskModal(true);
    setFormErrors({});
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setSidebarOpen(false); // Close sidebar when changing views
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Complex filtering and sorting logic for task display
  // Handles status filtering, tag filtering, and multiple sort options
  const filteredAndSortedTasks = useMemo(() => {
    let filtered = tasks;
    if (filterByStatus) {
      filtered = filtered.filter((task) => task.status === filterByStatus);
    }
    if (filterByTags.length > 0) {
      filtered = filtered.filter((task) => 
        filterByTags.some(tag => task.tags.includes(tag))
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (sortBy === 'priority') {
        const priorityOrder = priorities.reduce((acc, p, i) => ({ ...acc, [p]: i }), {});
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  }, [tasks, sortBy, filterByStatus, filterByTags, priorities]);

  const renderView = () => {
    switch (view) {
      case 'statistics':
        return <StatisticsView tasks={tasks} />;
      case 'settings':
        return <SettingsView tags={tags} setTags={setTags} priorities={priorities} setPriorities={setPriorities} />;
      default:
        return (
          <DashboardView
            tasks={filteredAndSortedTasks}
            setTasks={setTasks}
            tags={tags}
            setSortBy={setSortBy}
            setFilterByStatus={setFilterByStatus}
            filterByTags={filterByTags}
            setFilterByTags={setFilterByTags}
            onEditTask={handleEditTask}
          />
        );
    }
  };

  return (
    <div className={`app ${theme}`}>
      <header className="app-header">
        <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <svg width="24" height="24" viewBox="0 -960 960 960" fill="currentColor">
            <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
          </svg>
        </div>
        <h1>To-Do List</h1>
        <div className="header-actions">
          <button className="add-task-btn" onClick={() => setShowAddTaskModal(true)}>
            <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
            Add Task
          </button>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? (
              <svg className="theme-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/>
              </svg>
            ) : (
              <svg className="theme-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path d="M440-800v-120h80v120h-80Zm0 760v-120h80v120h-80Zm360-400v-80h120v80H800Zm-760 0v-80h120v80H40Zm708-252-56-56 70-72 58 58-72 70ZM198-140l-58-58 72-70 56 56-70 72Zm564 0-70-72 56-56 72 70-58 58ZM212-692l-72-70 58-58 70 72-56 56Zm268 452q-100 0-170-70t-70-170q0-100 70-170t170-70q100 0 170 70t70 170q0 100-70 170t-170 70Zm0-80q67 0 113.5-46.5T640-480q0-67-46.5-113.5T480-640q-67 0-113.5 46.5T320-480q0 67 46.5 113.5T480-320Zm0-160Z"/>
              </svg>
            )}
          </button>
        </div>
      </header>
      <div className="app-body">
        {sidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)}></div>}
        <nav className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul>
            <li onClick={() => handleViewChange('dashboard')}>Dashboard</li>
            <li onClick={() => handleViewChange('statistics')}>Statistics</li>
            <li onClick={() => handleViewChange('settings')}>Settings</li>
          </ul>
        </nav>
        <main className="main-content">{renderView()}</main>
      </div>
      
      {/* Add Task Modal - Complete form with validation and error handling */}
      {showAddTaskModal && (
        <div className="modal-overlay" onClick={() => { setShowAddTaskModal(false); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button 
                className="modal-close" 
                onClick={() => { setShowAddTaskModal(false); resetForm(); }}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                
                const formData = new FormData(e.target);
                const errors = validateForm(formData);
                
                if (Object.keys(errors).length > 0) {
                  setFormErrors(errors);
                  setIsSubmitting(false);
                  return;
                }
                
                // Process form data and create new task object
                const title = formData.get('title').trim();
                const description = formData.get('description').trim();
                const priority = formData.get('priority');
                const dueDate = formData.get('dueDate');
                const tagsString = formData.get('tags').trim();
                const tagList = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
                
                const newTask = {
                  id: Date.now(),
                  title: title,
                  description: description,
                  status: 'To-Do',
                  priority: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
                  tags: tagList,
                  createdAt: new Date().toISOString(),
                  deadline: dueDate || null
                };
                
                setTasks([...tasks, newTask]);
                setShowAddTaskModal(false);
                resetForm();
                e.target.reset();
              }}>
                <div className="form-group">
                  <label htmlFor="modal-title">Title *</label>
                  <input
                    type="text"
                    id="modal-title"
                    name="title"
                    required
                    placeholder="Enter task title"
                    className={formErrors.title ? 'error' : ''}
                    maxLength="100"
                  />
                  {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="modal-description">Description</label>
                  <textarea
                    id="modal-description"
                    name="description"
                    rows="3"
                    placeholder="Enter task description"
                    className={formErrors.description ? 'error' : ''}
                    maxLength="500"
                  ></textarea>
                  {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="modal-priority">Priority *</label>
                    <select 
                      id="modal-priority" 
                      name="priority" 
                      defaultValue="medium"
                      className={formErrors.priority ? 'error' : ''}
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    {formErrors.priority && <span className="error-message">{formErrors.priority}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="modal-due-date">Due Date</label>
                    <input
                      type="date"
                      id="modal-due-date"
                      name="dueDate"
                      className={formErrors.dueDate ? 'error' : ''}
                      min={getCurrentDateString()}
                      defaultValue={getCurrentDateString()}
                    />
                    {formErrors.dueDate && <span className="error-message">{formErrors.dueDate}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="modal-tags">Tags</label>
                  <input
                    type="text"
                    id="modal-tags"
                    name="tags"
                    placeholder="Enter tags separated by commas (max 10 tags, 20 chars each)"
                    className={formErrors.tags ? 'error' : ''}
                  />
                  {formErrors.tags && <span className="error-message">{formErrors.tags}</span>}
                  <small className="form-help">Separate multiple tags with commas</small>
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => { setShowAddTaskModal(false); resetForm(); }} 
                    className="btn-cancel"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Adding...' : 'Add Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal - Pre-populated form for editing existing tasks */}
      {showEditTaskModal && editingTask && (
        <div className="modal-overlay" onClick={() => { setShowEditTaskModal(false); setEditingTask(null); resetForm(); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Task</h2>
              <button 
                className="modal-close" 
                onClick={() => { setShowEditTaskModal(false); setEditingTask(null); resetForm(); }}
                aria-label="Close modal"
              >
                <svg width="16" height="16" viewBox="0 -960 960 960" fill="currentColor">
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                </svg>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                setIsSubmitting(true);
                
                const formData = new FormData(e.target);
                const errors = validateForm(formData);
                
                if (Object.keys(errors).length > 0) {
                  setFormErrors(errors);
                  setIsSubmitting(false);
                  return;
                }
                
                // Process form data and update existing task
                const title = formData.get('title').trim();
                const description = formData.get('description').trim();
                const priority = formData.get('priority');
                const dueDate = formData.get('dueDate');
                const tagsString = formData.get('tags').trim();
                const tagList = tagsString ? tagsString.split(',').map(tag => tag.trim()).filter(tag => tag) : [];
                
                const updatedTask = {
                  ...editingTask,
                  title: title,
                  description: description,
                  priority: priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase(),
                  tags: tagList,
                  deadline: dueDate || null
                };
                
                setTasks(tasks.map(task => task.id === editingTask.id ? updatedTask : task));
                setShowEditTaskModal(false);
                setEditingTask(null);
                resetForm();
                e.target.reset();
              }}>
                <div className="form-group">
                  <label htmlFor="edit-modal-title">Title *</label>
                  <input
                    type="text"
                    id="edit-modal-title"
                    name="title"
                    required
                    placeholder="Enter task title"
                    defaultValue={editingTask.title}
                    className={formErrors.title ? 'error' : ''}
                    maxLength="100"
                  />
                  {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="edit-modal-description">Description</label>
                  <textarea
                    id="edit-modal-description"
                    name="description"
                    rows="3"
                    placeholder="Enter task description"
                    defaultValue={editingTask.description}
                    className={formErrors.description ? 'error' : ''}
                    maxLength="500"
                  ></textarea>
                  {formErrors.description && <span className="error-message">{formErrors.description}</span>}
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="edit-modal-priority">Priority *</label>
                    <select 
                      id="edit-modal-priority" 
                      name="priority" 
                      defaultValue={editingTask.priority.toLowerCase()}
                      className={formErrors.priority ? 'error' : ''}
                      required
                    >
                      <option value="">Select priority</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    {formErrors.priority && <span className="error-message">{formErrors.priority}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="edit-modal-due-date">Due Date</label>
                    <input
                      type="date"
                      id="edit-modal-due-date"
                      name="dueDate"
                      defaultValue={editingTask.deadline || getCurrentDateString()}
                      className={formErrors.dueDate ? 'error' : ''}
                      min={getCurrentDateString()}
                    />
                    {formErrors.dueDate && <span className="error-message">{formErrors.dueDate}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="edit-modal-tags">Tags</label>
                  <input
                    type="text"
                    id="edit-modal-tags"
                    name="tags"
                    placeholder="Enter tags separated by commas (max 10 tags, 20 chars each)"
                    defaultValue={editingTask.tags.join(', ')}
                    className={formErrors.tags ? 'error' : ''}
                  />
                  {formErrors.tags && <span className="error-message">{formErrors.tags}</span>}
                  <small className="form-help">Separate multiple tags with commas</small>
                </div>
                <div className="modal-actions">
                  <button 
                    type="button" 
                    onClick={() => { setShowEditTaskModal(false); setEditingTask(null); resetForm(); }} 
                    className="btn-cancel"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn-primary"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Task'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
