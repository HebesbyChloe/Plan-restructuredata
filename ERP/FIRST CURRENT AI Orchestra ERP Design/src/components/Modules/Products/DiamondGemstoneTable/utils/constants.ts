export const DIAMOND_STATUS_COLORS = {
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  reserved: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  sold: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
} as const;

export const GEMSTONE_STATUS_COLORS = {
  available: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  reserved: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  sold: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
} as const;

export const DIAMOND_COLUMN_WIDTHS = {
  SKU: "w-[140px]",
  NAME: "min-w-[200px]",
  SPECS: "w-[180px]",
  SHAPE: "w-[100px]",
  CERT: "w-[100px]",
  PRICE: "w-[120px]",
  STOCK: "w-[80px]",
  STATUS: "w-[120px]",
  LOCATION: "w-[80px]",
} as const;

export const GEMSTONE_COLUMN_WIDTHS = {
  SKU: "w-[140px]",
  NAME: "min-w-[200px]",
  VARIETY: "w-[140px]",
  ORIGIN: "w-[120px]",
  SPECS: "w-[140px]",
  PRICE: "w-[120px]",
  STOCK: "w-[80px]",
  STATUS: "w-[120px]",
  LOCATION: "w-[80px]",
} as const;
