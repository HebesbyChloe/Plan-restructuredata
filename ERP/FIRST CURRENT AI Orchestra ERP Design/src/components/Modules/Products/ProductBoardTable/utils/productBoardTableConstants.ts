export const STATUS_COLORS = {
  updated: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  draft: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
} as const;

export const LOW_STOCK_THRESHOLD = 15;

export const COLUMN_WIDTHS = {
  IMAGE: "w-[100px]",
  PRODUCT_INFO: "min-w-[240px]",
  PRICE: "w-[120px]",
  VN_STOCK: "w-[100px]",
  US_STOCK: "w-[100px]",
  TOTAL: "w-[80px]",
  STATUS: "w-[120px]",
  LAST_UPDATE: "w-[140px]",
} as const;
