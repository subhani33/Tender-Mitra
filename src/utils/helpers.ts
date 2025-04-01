/**
 * Utility functions for EdtoDo Technovations application
 */

/**
 * Format a currency value with proper symbol
 * @param value - Numeric value to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(value);
};

/**
 * Format a date to a readable string
 * @param dateString - ISO date string or Date object
 * @param format - 'relative' | 'short' | 'long' (default: 'short')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string | Date, 
  format: 'relative' | 'short' | 'long' = 'short'
): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  
  // For relative time (e.g., "2 days ago")
  if (format === 'relative') {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 1 ? 'Just now' : `${diffMinutes} minutes ago`;
      }
      return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
    }
    
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  }
  
  // For short format (e.g., "Jan 1, 2023")
  if (format === 'short') {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  }
  
  // For long format (e.g., "January 1, 2023 at 12:00 PM")
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  }).format(date);
};

/**
 * Truncate text to a specific length and add ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length (default: 100)
 * @returns Truncated text
 */
export const truncateText = (text: string, length = 100): string => {
  if (!text) return '';
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Get a color based on status
 * @param status - Status string to get color for
 * @returns Tailwind CSS color class
 */
export const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('open')) return 'text-green-600';
  if (statusLower.includes('closing') || statusLower.includes('soon')) return 'text-amber-600';
  if (statusLower.includes('closed') || statusLower.includes('ended')) return 'text-gray-600';
  if (statusLower.includes('review') || statusLower.includes('pending')) return 'text-blue-600';
  if (statusLower.includes('awarded') || statusLower.includes('success') || statusLower.includes('completed')) return 'text-emerald-600';
  if (statusLower.includes('cancelled') || statusLower.includes('rejected') || statusLower.includes('failed')) return 'text-red-600';
  return 'text-gray-600';
};

/**
 * Generate an array of sequential numbers
 * @param start - Starting number (default: 0)
 * @param end - Ending number (inclusive)
 * @returns Array of numbers from start to end
 */
export const range = (start = 0, end: number): number[] => {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Debounce a function to limit how often it's called
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds (default: 300)
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay = 300): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * Class name utility that combines multiple classes conditionally
 * @param classes - Array of class strings or conditional class objects
 * @returns Combined class string
 */
export const classNames = (...classes: (string | Record<string, boolean> | undefined | null)[]): string => {
  return classes
    .filter(Boolean)
    .map(cls => {
      if (typeof cls === 'string') return cls;
      if (cls && typeof cls === 'object') {
        return Object.entries(cls)
          .filter(([_, value]) => Boolean(value))
          .map(([key]) => key)
          .join(' ');
      }
      return '';
    })
    .join(' ')
    .trim();
}; 