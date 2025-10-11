import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for Cloudflare KV storage (replaces localStorage)
 * 
 * This hook syncs state with Cloudflare Workers KV storage via API endpoints.
 * Falls back to localStorage if API is unavailable.
 * 
 * @param {string} key - Storage key (not used for KV, all state is in one key)
 * @param {*} initialValue - Initial value if no stored value exists
 * @returns {[value, setValue, { loading, error, syncing }]} - State value, setter, and status
 */
function useCloudflareKV(key, initialValue) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // API endpoint for Cloudflare KV
  const API_URL = window.TOD_API_URL || '/api/tod/state';

  // Initial load from KV
  useEffect(() => {
    const loadFromKV = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load from KV: ${response.status}`);
        }

        const data = await response.json();
        
        // Extract the specific key's value from the global state
        if (data && typeof data === 'object' && key in data) {
          setStoredValue(data[key]);
        } else {
          setStoredValue(initialValue);
        }

        setUseLocalStorage(false);
      } catch (err) {
        console.warn('Failed to load from Cloudflare KV, falling back to localStorage:', err);
        setError(err.message);
        setUseLocalStorage(true);

        // Fallback to localStorage
        try {
          const item = window.localStorage.getItem(key);
          setStoredValue(item ? JSON.parse(item) : initialValue);
        } catch (localErr) {
          console.error('Failed to load from localStorage:', localErr);
          setStoredValue(initialValue);
        }
      } finally {
        setLoading(false);
      }
    };

    loadFromKV();
  }, [key, API_URL]); // Note: initialValue not in deps to avoid re-fetching

  // Save to KV
  const setValue = useCallback(async (value) => {
    try {
      setSyncing(true);
      setError(null);

      // Compute the new value (support function updaters)
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Update local state immediately for responsiveness
      setStoredValue(valueToStore);

      if (useLocalStorage) {
        // Fallback to localStorage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        // First, get the current full state
        const getResponse = await fetch(API_URL, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!getResponse.ok) {
          throw new Error(`Failed to get current state: ${getResponse.status}`);
        }

        const currentState = await getResponse.json();

        // Update only the specific key
        const newState = {
          ...currentState,
          [key]: valueToStore,
        };

        // Save back to KV
        const putResponse = await fetch(API_URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newState),
        });

        if (!putResponse.ok) {
          throw new Error(`Failed to save to KV: ${putResponse.status}`);
        }
      }
    } catch (err) {
      console.error('Failed to save to Cloudflare KV:', err);
      setError(err.message);

      // Try to save to localStorage as backup
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
        setUseLocalStorage(true);
      } catch (localErr) {
        console.error('Failed to save to localStorage backup:', localErr);
      }
    } finally {
      setSyncing(false);
    }
  }, [key, storedValue, API_URL, useLocalStorage]);

  return [storedValue, setValue, { loading, error, syncing, usingLocalStorage: useLocalStorage }];
}

export default useCloudflareKV;
