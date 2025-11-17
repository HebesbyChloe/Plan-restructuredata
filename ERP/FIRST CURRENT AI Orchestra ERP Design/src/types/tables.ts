/**
 * Table Types
 * Common table-related type definitions
 */

import type { SortDirection } from './common';

// Generic table column definition
export interface TableColumn<T = any> {
  id: string;
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string | number;
}

// Table state
export interface TableState {
  sorting: {
    column: string;
    direction: SortDirection;
  }[];
  pagination: {
    pageIndex: number;
    pageSize: number;
  };
  globalFilter: string;
  columnFilters: ColumnFilter[];
}

// Column filter
export interface ColumnFilter {
  id: string;
  value: any;
}

// Row selection state
export interface RowSelectionState {
  [key: string]: boolean;
}

// Table action types
export interface TableAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive' | 'ghost';
  disabled?: (row: T) => boolean;
}

// Bulk action types
export interface BulkAction<T = any> {
  label: string;
  icon?: React.ReactNode;
  onClick: (selectedRows: T[]) => void;
  variant?: 'default' | 'destructive';
  requiresSelection?: boolean;
}

// Table view options
export type TableView = 'table' | 'grid' | 'kanban' | 'calendar';

// Table density
export type TableDensity = 'compact' | 'normal' | 'comfortable';
