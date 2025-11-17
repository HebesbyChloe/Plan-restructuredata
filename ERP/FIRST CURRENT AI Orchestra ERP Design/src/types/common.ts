/**
 * Common Types
 * Shared across all modules
 */

// Base entity type
export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

// Date range type (used everywhere)
export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

// Pagination types
export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Sort direction
export type SortDirection = 'asc' | 'desc';

// Generic sort state
export interface SortState {
  column: string;
  direction: SortDirection;
}

// User reference (used in many places)
export interface UserReference {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

// Team types
export type TeamType = 
  | 'Marketing' 
  | 'Sale Team' 
  | 'Operation Team' 
  | 'Administration Team' 
  | 'Master Admin';

// Priority levels
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';

// Generic option type for selects
export interface Option<T = string> {
  label: string;
  value: T;
}
