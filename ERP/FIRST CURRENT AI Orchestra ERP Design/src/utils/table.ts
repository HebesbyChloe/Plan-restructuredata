/**
 * Table Utilities
 * Table-specific helper functions
 */

import type { RowSelectionState } from '../types/tables';

/**
 * Get selected row IDs from selection state
 */
export function getSelectedIds(selectionState: RowSelectionState): string[] {
  return Object.keys(selectionState).filter(id => selectionState[id]);
}

/**
 * Get selected rows from data
 */
export function getSelectedRows<T extends { id: string }>(
  data: T[],
  selectionState: RowSelectionState
): T[] {
  const selectedIds = getSelectedIds(selectionState);
  return data.filter(row => selectedIds.includes(row.id));
}

/**
 * Toggle all rows selection
 */
export function toggleAllRows<T extends { id: string }>(
  data: T[],
  currentState: RowSelectionState
): RowSelectionState {
  const allSelected = data.every(row => currentState[row.id]);
  
  if (allSelected) {
    return {};
  }
  
  return data.reduce((acc, row) => {
    acc[row.id] = true;
    return acc;
  }, {} as RowSelectionState);
}

/**
 * Toggle single row selection
 */
export function toggleRow(
  rowId: string,
  currentState: RowSelectionState
): RowSelectionState {
  const newState = { ...currentState };
  
  if (newState[rowId]) {
    delete newState[rowId];
  } else {
    newState[rowId] = true;
  }
  
  return newState;
}

/**
 * Check if all rows are selected
 */
export function areAllRowsSelected<T extends { id: string }>(
  data: T[],
  selectionState: RowSelectionState
): boolean {
  if (data.length === 0) return false;
  return data.every(row => selectionState[row.id]);
}

/**
 * Check if some (but not all) rows are selected
 */
export function areSomeRowsSelected<T extends { id: string }>(
  data: T[],
  selectionState: RowSelectionState
): boolean {
  const selectedCount = getSelectedIds(selectionState).length;
  return selectedCount > 0 && selectedCount < data.length;
}

/**
 * Paginate data
 */
export function paginateData<T>(
  data: T[],
  pageIndex: number,
  pageSize: number
): T[] {
  const start = pageIndex * pageSize;
  const end = start + pageSize;
  return data.slice(start, end);
}

/**
 * Calculate total pages
 */
export function getTotalPages(totalItems: number, pageSize: number): number {
  return Math.ceil(totalItems / pageSize);
}

/**
 * Get page range info
 */
export function getPageRangeInfo(
  totalItems: number,
  pageIndex: number,
  pageSize: number
): { start: number; end: number; total: number } {
  const start = pageIndex * pageSize + 1;
  const end = Math.min((pageIndex + 1) * pageSize, totalItems);
  
  return { start, end, total: totalItems };
}

/**
 * Export table data to CSV
 */
export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string = 'export.csv'
): void {
  if (data.length === 0) return;
  
  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape quotes and wrap in quotes if contains comma
        const stringValue = String(value ?? '');
        return stringValue.includes(',') || stringValue.includes('"')
          ? `"${stringValue.replace(/"/g, '""')}"`
          : stringValue;
      }).join(',')
    )
  ].join('\n');
  
  // Create download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
