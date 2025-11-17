/**
 * Sorting Utilities
 * Comparison and sorting functions
 */

import type { SortDirection } from '../types/common';

/**
 * Generic sort comparator
 */
export function sortBy<T>(
  array: T[],
  key: keyof T,
  direction: SortDirection = 'asc'
): T[] {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal === bVal) return 0;
    
    const comparison = aVal < bVal ? -1 : 1;
    return direction === 'asc' ? comparison : -comparison;
  });
}

/**
 * Sort by multiple keys
 */
export function sortByMultiple<T>(
  array: T[],
  sortKeys: { key: keyof T; direction: SortDirection }[]
): T[] {
  return [...array].sort((a, b) => {
    for (const { key, direction } of sortKeys) {
      const aVal = a[key];
      const bVal = b[key];
      
      if (aVal !== bVal) {
        const comparison = aVal < bVal ? -1 : 1;
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    return 0;
  });
}

/**
 * Sort strings ignoring case
 */
export function sortStrings(a: string, b: string, direction: SortDirection = 'asc'): number {
  const comparison = a.toLowerCase().localeCompare(b.toLowerCase());
  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Sort dates
 */
export function sortDates(a: Date | string, b: Date | string, direction: SortDirection = 'asc'): number {
  const dateA = typeof a === 'string' ? new Date(a) : a;
  const dateB = typeof b === 'string' ? new Date(b) : b;
  
  const comparison = dateA.getTime() - dateB.getTime();
  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Sort numbers
 */
export function sortNumbers(a: number, b: number, direction: SortDirection = 'asc'): number {
  const comparison = a - b;
  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Natural sort (handles numbers in strings correctly)
 */
export function naturalSort(a: string, b: string, direction: SortDirection = 'asc'): number {
  const comparison = a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
  return direction === 'asc' ? comparison : -comparison;
}

/**
 * Sort by status priority (common statuses)
 */
export function sortByStatusPriority(a: string, b: string, direction: SortDirection = 'asc'): number {
  const priorityMap: Record<string, number> = {
    urgent: 0,
    high: 1,
    medium: 2,
    low: 3,
    pending: 0,
    in_progress: 1,
    completed: 2,
    cancelled: 3,
  };
  
  const priorityA = priorityMap[a.toLowerCase()] ?? 999;
  const priorityB = priorityMap[b.toLowerCase()] ?? 999;
  
  const comparison = priorityA - priorityB;
  return direction === 'asc' ? comparison : -comparison;
}
