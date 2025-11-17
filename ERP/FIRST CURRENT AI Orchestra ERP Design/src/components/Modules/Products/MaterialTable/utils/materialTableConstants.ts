export const STATUS_COLORS = {
  in_stock: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  low_stock: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  out_of_stock: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
} as const;

export const CATEGORY_COLORS = {
  metal: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  stone: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
  charm: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
  component: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  packaging: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
} as const;

export const COLUMN_WIDTHS = {
  SKU: "w-[140px]",
  NAME: "min-w-[240px]",
  CATEGORY: "w-[120px]",
  TYPE: "w-[160px]",
  COLOR_SIZE: "w-[140px]",
  STOCK: "w-[100px]",
  UNIT_COST: "w-[100px]",
  VENDOR: "w-[180px]",
  STATUS: "w-[120px]",
  LOCATION: "w-[80px]",
} as const;
