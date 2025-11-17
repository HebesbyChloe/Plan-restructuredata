/**
 * Filter Types
 * Common filter-related type definitions
 */

import type { DateRange } from './common';

// Base filter props (used by almost every filter component)
export interface BaseFilterProps {
  onFilterChange?: (filters: any) => void;
  onReset?: () => void;
}

// Common filter fields
export interface CommonFilters {
  search?: string;
  status?: string | string[];
  dateRange?: DateRange;
  team?: string;
  assignedTo?: string;
  priority?: string;
  category?: string;
  tags?: string[];
}

// Search filter
export interface SearchFilter {
  query: string;
  fields?: string[];
}

// Multi-select filter
export interface MultiSelectFilter {
  field: string;
  values: string[];
  operator?: 'AND' | 'OR';
}

// Range filter
export interface RangeFilter<T = number> {
  field: string;
  min?: T;
  max?: T;
}

// Date filter options
export type DateFilterOption = 
  | 'today' 
  | 'yesterday' 
  | 'last7days' 
  | 'last30days' 
  | 'thisMonth' 
  | 'lastMonth' 
  | 'thisYear' 
  | 'custom';

// Filter operator
export type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains' 
  | 'startsWith' 
  | 'endsWith' 
  | 'greaterThan' 
  | 'lessThan' 
  | 'between' 
  | 'in' 
  | 'notIn';

// Generic filter rule
export interface FilterRule {
  field: string;
  operator: FilterOperator;
  value: any;
}

// Filter group
export interface FilterGroup {
  logic: 'AND' | 'OR';
  rules: (FilterRule | FilterGroup)[];
}
