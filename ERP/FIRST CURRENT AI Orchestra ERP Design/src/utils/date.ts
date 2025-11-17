/**
 * Date Utilities
 * Date formatting and manipulation
 */

import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy'
): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return format(dateObj, formatStr);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format date and time
 */
export function formatDateTime(
  date: string | Date,
  formatStr: string = 'MMM dd, yyyy HH:mm'
): string {
  return formatDate(date, formatStr);
}

/**
 * Format time only
 */
export function formatTime(
  date: string | Date,
  formatStr: string = 'HH:mm'
): string {
  return formatDate(date, formatStr);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(dateObj)) return 'Invalid date';
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
}

/**
 * Get today's date at start of day
 */
export function getToday(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get date range for common periods
 */
export function getDateRange(period: string): { from: Date; to: Date } {
  const now = new Date();
  const today = getToday();
  
  switch (period) {
    case 'today':
      return { from: today, to: now };
    
    case 'yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return { from: yesterday, to: yesterday };
    }
    
    case 'last7days': {
      const from = new Date(today);
      from.setDate(from.getDate() - 7);
      return { from, to: now };
    }
    
    case 'last30days': {
      const from = new Date(today);
      from.setDate(from.getDate() - 30);
      return { from, to: now };
    }
    
    case 'thisMonth': {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from, to: now };
    }
    
    case 'lastMonth': {
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0);
      return { from, to };
    }
    
    case 'thisYear': {
      const from = new Date(now.getFullYear(), 0, 1);
      return { from, to: now };
    }
    
    default:
      return { from: today, to: now };
  }
}

/**
 * Check if date is within range
 */
export function isDateInRange(
  date: Date,
  range: { from?: Date; to?: Date }
): boolean {
  if (range.from && date < range.from) return false;
  if (range.to && date > range.to) return false;
  return true;
}
