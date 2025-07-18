import React from 'react';
import TaskItem from './TaskItem';
import './DashboardView.css';

const DashboardView = ({
  tasks,
  setTasks,
  tags,
  setSortBy,
  setFilterByStatus,
  filterByTags,
  setFilterByTags,
  onEditTask,
}) => {
  const [collapsedColumns, setCollapsedColumns] = React.useState({
    'To-Do': false,
    'In Progress': false,
    'Done': false
  });

  const toggleColumn = (status) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [status]: !prev[status]
    }));
  };

  const handleEdit = (task) => {
    if (onEditTask) {
      onEditTask(task);
    }
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const toggleTagFilter = (tag) => {
    if (filterByTags.includes(tag)) {
      setFilterByTags(filterByTags.filter(t => t !== tag));
    } else {
      setFilterByTags([...filterByTags, tag]);
    }
  };

  return (
    <div className="dashboard-view">
      <div className="filters">
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
          <option value="title">Sort by Title</option>
        </select>
        <select onChange={(e) => setFilterByStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <div className="tag-filters">
          <span className="filter-label">Filter by Tags:</span>
          <div className="tag-filter-options">
            {tags.map((tag) => (
              <button
                key={tag}
                className={`tag-filter-btn ${filterByTags.includes(tag) ? 'active' : ''}`}
                onClick={() => toggleTagFilter(tag)}
              >
                {tag}
              </button>
            ))}
            {filterByTags.length > 0 && (
              <button 
                className="clear-tags-btn"
                onClick={() => setFilterByTags([])}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="task-board">
        {['To-Do', 'In Progress', 'Done'].map(status => {
          const statusTasks = tasks.filter(task => task.status === status);
          const count = statusTasks.length;
          const isCollapsed = collapsedColumns[status];
          
          return (
            <div key={status} className={`task-column ${isCollapsed ? 'collapsed' : ''}`}>
              <h2 onClick={() => toggleColumn(status)} className="column-header">
                {status} 
                <span className="task-count">({count})</span>
                <button className="column-toggle-btn" onClick={(e) => { e.stopPropagation(); toggleColumn(status); }}>
                  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className={`toggle-icon ${isCollapsed ? 'collapsed' : 'expanded'}`}>
                    <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
                  </svg>
                </button>
              </h2>
              {!isCollapsed && (
                <div className="task-list">
                  {statusTasks.map(task => (
                    <TaskItem
                      key={task.id}
                      task={task}
                      handleStatusChange={handleStatusChange}
                      handleEdit={handleEdit}
                      handleDelete={handleDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardView;
