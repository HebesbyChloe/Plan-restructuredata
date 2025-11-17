/**
 * Filtering Utilities
 * Filter and search functions
 */

import type { DateRange } from '../types/common';

/**
 * Filter array by search query (searches multiple fields)
 */
export function filterBySearch<T>(
  items: T[],
  query: string,
  searchFields: (keyof T)[]
): T[] {
  if (!query || query.trim() === '') return items;
  
  const lowerQuery = query.toLowerCase();
  
  return items.filter(item =>
    searchFields.some(field => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return String(value).toLowerCase().includes(lowerQuery);
    })
  );
}

/**
 * Filter by status (single or multiple)
 */
export function filterByStatus<T>(
  items: T[],
  statusField: keyof T,
  selectedStatuses: string | string[]
): T[] {
  if (!selectedStatuses || (Array.isArray(selectedStatuses) && selectedStatuses.length === 0)) {
    return items;
  }
  
  const statuses = Array.isArray(selectedStatuses) ? selectedStatuses : [selectedStatuses];
  
  return items.filter(item => {
    const itemStatus = String(item[statusField]);
    return statuses.includes(itemStatus);
  });
}

/**
 * Filter by date range
 */
export function filterByDateRange<T>(
  items: T[],
  dateField: keyof T,
  range: DateRange
): T[] {
  if (!range.from && !range.to) return items;
  
  return items.filter(item => {
    const itemDate = new Date(item[dateField] as any);
    
    if (range.from && itemDate < range.from) return false;
    if (range.to && itemDate > range.to) return false;
    
    return true;
  });
}

/**
 * Filter by multiple fields
 */
export function filterByFields<T>(
  items: T[],
  filters: Partial<Record<keyof T, any>>
): T[] {
  return items.filter(item => {
    return Object.entries(filters).every(([key, value]) => {
      if (value === null || value === undefined || value === '') return true;
      
      const itemValue = item[key as keyof T];
      
      // Array values (multi-select)
      if (Array.isArray(value)) {
        return value.length === 0 || value.includes(itemValue);
      }
      
      // Direct comparison
      return itemValue === value;
    });
  });
}

/**
 * Filter by tag (if item has tags array)
 */
export function filterByTags<T extends { tags?: string[] }>(
  items: T[],
  selectedTags: string[]
): T[] {
  if (selectedTags.length === 0) return items;
  
  return items.filter(item => {
    if (!item.tags || item.tags.length === 0) return false;
    return selectedTags.some(tag => item.tags!.includes(tag));
  });
}

/**
 * Filter by numeric range
 */
export function filterByRange<T>(
  items: T[],
  field: keyof T,
  min?: number,
  max?: number
): T[] {
  return items.filter(item => {
    const value = Number(item[field]);
    if (isNaN(value)) return false;
    
    if (min !== undefined && value < min) return false;
    if (max !== undefined && value > max) return false;
    
    return true;
  });
}

/**
 * Apply multiple filters
 */
export function applyFilters<T>(
  items: T[],
  filters: {
    search?: { query: string; fields: (keyof T)[] };
    status?: { field: keyof T; values: string | string[] };
    dateRange?: { field: keyof T; range: DateRange };
    fields?: Partial<Record<keyof T, any>>;
    range?: { field: keyof T; min?: number; max?: number };
  }
): T[] {
  let result = items;
  
  if (filters.search) {
    result = filterBySearch(result, filters.search.query, filters.search.fields);
  }
  
  if (filters.status) {
    result = filterByStatus(result, filters.status.field, filters.status.values);
  }
  
  if (filters.dateRange) {
    result = filterByDateRange(result, filters.dateRange.field, filters.dateRange.range);
  }
  
  if (filters.fields) {
    result = filterByFields(result, filters.fields);
  }
  
  if (filters.range) {
    result = filterByRange(result, filters.range.field, filters.range.min, filters.range.max);
  }
  
  return result;
}
