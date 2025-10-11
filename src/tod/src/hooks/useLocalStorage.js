import { useState } from 'react';

/**
 * Custom hook for managing localStorage with React state synchronization
 * Provides automatic state updates and persistence across browser sessions
 * @param {string} key - The localStorage key to use for storing data
 * @param {*} initialValue - The initial value to use if no stored value exists
 * @returns {[value, setValue]} - Array containing current value and setter function
 */
function useLocalStorage(key, initialValue) {
  // Initialize state with stored value or default to initialValue
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // Function to update both state and localStorage
  // Accepts either a value or a function (like regular setState)
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      // Persist to localStorage as JSON string
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export default useLocalStorage;
