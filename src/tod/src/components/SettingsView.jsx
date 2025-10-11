import React, { useState } from 'react';
import './SettingsView.css';

const SettingsView = ({
  tags,
  setTags,
  priorities,
  setPriorities,
}) => {
  const [newTag, setNewTag] = useState('');
  const [newPriority, setNewPriority] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  const handleAddPriority = () => {
    if (newPriority && !priorities.includes(newPriority)) {
      setPriorities([...priorities, newPriority]);
      setNewPriority('');
    }
  };

  const handleDeletePriority = (priorityToDelete) => {
    if (priorities.length > 1) {
      setPriorities(priorities.filter((p) => p !== priorityToDelete));
    }
  };

  return (
    <div className="settings-view">
      <h2>Settings</h2>
      {/* Tag management section - add, delete, and view all available tags */}
      <div className="settings-section">
        <h3>Manage Tags</h3>
        <div className="add-item-form">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="New tag"
          />
          <button onClick={handleAddTag} className="add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
          </button>
        </div>
        <div className="items-list">
          {tags.map((tag) => (
            <div key={tag} className="item-pill">
              <span>{tag}</span>
              <button onClick={() => handleDeleteTag(tag)} className="delete-btn">×</button>
            </div>
          ))}
        </div>
      </div>

      {/* Priority management section - add, delete, and view all available priorities */}
      <div className="settings-section">
        <h3>Manage Priorities</h3>
        <div className="add-item-form">
          <input
            type="text"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value)}
            placeholder="New priority"
          />
          <button onClick={handleAddPriority} className="add-btn">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
              <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/>
            </svg>
          </button>
        </div>
        <div className="items-list">
          {priorities.map((p) => (
            <div key={p} className="item-pill">
              <span>{p}</span>
              {priorities.length > 1 && (
                <button onClick={() => handleDeletePriority(p)} className="delete-btn">×</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
