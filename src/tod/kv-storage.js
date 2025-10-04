// KV Storage Service - Cloudflare KV integration for to-do app
class KVStorage {
  constructor() {
    this.apiBase = '/api/tod/state';
    this.cache = null;
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const response = await fetch(this.apiBase);
      if (response.ok) {
        this.cache = await response.json();
      } else {
        console.warn('KV storage not available, falling back to default state');
        this.cache = this.getDefaultState();
      }
    } catch (error) {
      console.warn('Failed to connect to KV storage:', error);
      this.cache = this.getDefaultState();
    }
    
    this.initialized = true;
  }

  getDefaultState() {
    return {
      tasks: [],
      tags: ['Work', 'Personal'],
      priorities: ['Low', 'Medium', 'High'],
      theme: 'light',
      filterByTags: []
    };
  }

  async get(key, fallback = null) {
    await this.initialize();
    
    if (key in this.cache) {
      return this.cache[key];
    }
    
    return fallback;
  }

  async set(key, value) {
    await this.initialize();
    
    // Update local cache
    this.cache[key] = value;
    
    // Persist to KV storage
    try {
      const response = await fetch(this.apiBase, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cache)
      });
      
      if (!response.ok) {
        console.error('Failed to save to KV storage:', response.status);
      }
    } catch (error) {
      console.error('Error saving to KV storage:', error);
    }
  }

  async getAll() {
    await this.initialize();
    return { ...this.cache };
  }

  async setAll(state) {
    await this.initialize();
    
    // Update local cache
    this.cache = { ...state };
    
    // Persist to KV storage
    try {
      const response = await fetch(this.apiBase, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.cache)
      });
      
      if (!response.ok) {
        console.error('Failed to save state to KV storage:', response.status);
      }
    } catch (error) {
      console.error('Error saving state to KV storage:', error);
    }
  }
}

// Create a singleton instance
const kvStorage = new KVStorage();

// Export for use in app.js
window.kvStorage = kvStorage;