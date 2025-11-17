/**
 * Constants: Vendor Table
 * 
 * Status color mappings for vendors
 * Note: Mock data has been moved to /sampledata/vendors.ts
 */

export const STATUS_COLORS = {
  Active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
  Pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
} as const;
