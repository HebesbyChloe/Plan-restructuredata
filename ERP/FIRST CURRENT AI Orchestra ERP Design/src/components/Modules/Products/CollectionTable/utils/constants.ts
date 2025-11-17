export const STATUS_COLORS = {
  active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  scheduled: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  archived: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
} as const;

export const TYPE_COLORS = {
  manual: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  automatic: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  smart: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
} as const;

export const COLUMN_WIDTHS = {
  NAME: "min-w-[240px]",
  TYPE: "w-[120px]",
  PRODUCTS: "w-[100px]",
  FEATURED: "w-[100px]",
  STATUS: "w-[120px]",
  DATES: "w-[180px]",
  UPDATED: "w-[140px]",
} as const;
