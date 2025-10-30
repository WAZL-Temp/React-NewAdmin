import { describe, it, expect } from 'vitest';

/**
 * Example utility function tests
 * 
 * This file demonstrates how to test utility functions.
 * These are simple example tests to show the pattern.
 */

// Example utility function
function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

describe('Utility Function Tests Examples', () => {
  describe('formatCurrency', () => {
    it('should format number as USD currency', () => {
      const result = formatCurrency(1234.56);
      expect(result).toBe('$1,234.56');
    });

    it('should format number as EUR currency', () => {
      const result = formatCurrency(1234.56, 'EUR');
      expect(result).toBe('€1,234.56');
    });

    it('should handle zero amount', () => {
      const result = formatCurrency(0);
      expect(result).toBe('$0.00');
    });

    it('should handle negative amounts', () => {
      const result = formatCurrency(-50);
      expect(result).toBe('-$50.00');
    });
  });
});

// Example string utility
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

describe('String Utility Examples', () => {
  describe('truncateText', () => {
    it('should truncate long text', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
    });

    it('should not truncate short text', () => {
      const text = 'Short text';
      const result = truncateText(text, 20);
      expect(result).toBe('Short text');
    });

    it('should handle exact length text', () => {
      const text = 'Exactly twenty chars';
      const result = truncateText(text, 20);
      expect(result).toBe('Exactly twenty chars');
    });
  });
});

// Example array utility
function removeDuplicates<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

describe('Array Utility Examples', () => {
  describe('removeDuplicates', () => {
    it('should remove duplicate numbers', () => {
      const input = [1, 2, 2, 3, 3, 3, 4];
      const result = removeDuplicates(input);
      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should remove duplicate strings', () => {
      const input = ['a', 'b', 'b', 'c'];
      const result = removeDuplicates(input);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should handle empty array', () => {
      const result = removeDuplicates([]);
      expect(result).toEqual([]);
    });

    it('should handle array with no duplicates', () => {
      const input = [1, 2, 3];
      const result = removeDuplicates(input);
      expect(result).toEqual([1, 2, 3]);
    });
  });
});
