import React from 'react';
import './DashboardView.css';

const DashboardView = ({
  tasks,
  setTasks,
  tags,
  setSortBy,
  setFilterByStatus,
  setFilterByTag,
}) => {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [priority, setPriority] = React.useState('Medium');
  const [deadline, setDeadline] = React.useState('');
  const [taskTags, setTaskTags] = React.useState([]);
  const [editingTask, setEditingTask] = React.useState(null);

  const handleAddTask = () => {
    if (title && deadline) {
      const newTask = {
        id: editingTask ? editingTask.id : Date.now(),
        title,
        description,
        priority,
        status: editingTask ? editingTask.status : 'To-Do',
        deadline,
        tags: taskTags,
      };
      if (editingTask) {
        setTasks(
          tasks.map((task) => (task.id === editingTask.id ? newTask : task))
        );
        setEditingTask(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setDeadline('');
      setTaskTags([]);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDeadline(task.deadline);
    setTaskTags(task.tags);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleStatusChange = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleTagToggle = (tag) => {
    if (taskTags.includes(tag)) {
      setTaskTags(taskTags.filter((t) => t !== tag));
    } else {
      setTaskTags([...taskTags, tag]);
    }
  };

  return (
    <div className="dashboard-view">
      <div className="task-form">
        <h2>{editingTask ? 'Edit Task' : 'Add New Task'}</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <div className="tags-selection">
          {tags.map((tag) => (
            <span
              key={tag}
              className={`tag ${taskTags.includes(tag) ? 'selected' : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              {tag}
            </span>
          ))}
        </div>
        <button onClick={handleAddTask}>
          {editingTask ? 'Update Task' : 'Add Task'}
        </button>
      </div>

      <div className="filters">
        <select onChange={(e) => setSortBy(e.target.value)}>
          <option value="deadline">Sort by Deadline</option>
          <option value="priority">Sort by Priority</option>
        </select>
        <select onChange={(e) => setFilterByStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="To-Do">To-Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select onChange={(e) => setFilterByTag(e.target.value)}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Priority: {task.priority}</p>
            <p>Deadline: {task.deadline}</p>
            <div className="tags">
              {task.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
            <div className="task-actions">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
              >
                <option value="To-Do">To-Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button onClick={() => handleEdit(task)}>Edit</button>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
