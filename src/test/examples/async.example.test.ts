import { describe, it, expect, vi, beforeEach } from 'vitest';

/**
 * Example async function tests
 * 
 * This file demonstrates how to test async functions and mocking.
 */

// Example async API function
async function fetchUserData(userId: string): Promise<{ id: string; name: string }> {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }
  return response.json();
}

// Mock the global fetch
global.fetch = vi.fn();

describe('Async Function Tests Examples', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
  });

  describe('fetchUserData', () => {
    it('should fetch user data successfully', async () => {
      const mockUser = { id: '1', name: 'John Doe' };
      
      // Mock successful response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await fetchUserData('1');
      
      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith('/api/users/1');
    });

    it('should throw error on failed fetch', async () => {
      // Mock failed response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchUserData('1')).rejects.toThrow('Failed to fetch user');
    });
  });
});

// Example async function with delay
async function delayedOperation(value: string, delay: number): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(value.toUpperCase());
    }, delay);
  });
}

describe('Delayed Operation Tests', () => {
  it('should resolve with uppercase value after delay', async () => {
    const result = await delayedOperation('hello', 100);
    expect(result).toBe('HELLO');
  });

  it('should handle multiple concurrent operations', async () => {
    const results = await Promise.all([
      delayedOperation('hello', 50),
      delayedOperation('world', 50),
    ]);
    
    expect(results).toEqual(['HELLO', 'WORLD']);
  });
});

// Example function with localStorage
function saveToStorage(key: string, value: string): void {
  localStorage.setItem(key, value);
}

function getFromStorage(key: string): string | null {
  return localStorage.getItem(key);
}

describe('LocalStorage Tests Examples', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it('should save and retrieve value from localStorage', () => {
    saveToStorage('testKey', 'testValue');
    const result = getFromStorage('testKey');
    
    expect(result).toBe('testValue');
  });

  it('should return null for non-existent key', () => {
    const result = getFromStorage('nonExistentKey');
    expect(result).toBeNull();
  });

  it('should overwrite existing value', () => {
    saveToStorage('testKey', 'value1');
    saveToStorage('testKey', 'value2');
    
    const result = getFromStorage('testKey');
    expect(result).toBe('value2');
  });
});
