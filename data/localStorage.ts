import { useState, useEffect } from 'react';
/**
 * Custom hook for safe localStorage access in Next.js
 * Handles server-side rendering by checking if window is available
 * 
 * @param key - The localStorage key
 * @param initialValue - Default value if key doesn't exist
 * @returns [value, setValue] tuple similar to useState
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}

export function getFromLocalStorage(key: string, defaultValue: string = ''): string {
  if (typeof window !== 'undefined') {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return defaultValue;
    }
  }
  return defaultValue;
}

export function setToLocalStorage(key: string, value: string): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting localStorage:', error);
    }
  }
}