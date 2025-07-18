import React, { useState } from 'react';
import './TagsView.css';

const TagsView = ({ tags, setTags }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete));
  };

  return (
    <div className="tags-view">
      <h2>Manage Tags</h2>
      <div className="add-tag-form">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
        />
        <button onClick={handleAddTag} className="add-btn">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
        </button>
      </div>
      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag} className="tag-item">
            <span>{tag}</span>
            <button onClick={() => handleDeleteTag(tag)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagsView;
