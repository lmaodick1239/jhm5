import React, { useState } from 'react';

const TaskItem = ({ task, handleStatusChange, handleEdit, handleDelete }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`task-item ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="task-header" onClick={() => setIsExpanded(!isExpanded)}>
        <h3>{task.title}</h3>
        <button className="collapse-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor" className={`toggle-icon ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z"/>
          </svg>
        </button>
      </div>
      {isExpanded ? (
        <div className="task-content">
          <p className="task-description">{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Deadline: {task.deadline}</p>
          <div className="tags">
            {task.tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
          <div className="task-actions">
            <div className="status-buttons">
              {['To-Do', 'In Progress', 'Done'].map(s => (
                <button
                  key={s}
                  className={`status-btn ${task.status === s ? 'active' : ''}`}
                  onClick={() => handleStatusChange(task.id, s)}
                  data-status={s}
                >
                  {s}
                </button>
              ))}
            </div>
            <button onClick={() => handleEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.id)}>Delete</button>
          </div>
        </div>
      ) : (
        <p className="collapsed-description">{task.description}</p>
      )}
    </div>
  );
};

export default TaskItem;
