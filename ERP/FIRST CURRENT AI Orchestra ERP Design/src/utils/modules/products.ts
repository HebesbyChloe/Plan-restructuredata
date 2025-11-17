/**
 * Products Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for Products modules
 */

// ============================================
// CONSTANTS - PRODUCT BOARD TABLE
// ============================================

export const PRODUCT_BOARD_COLUMN_WIDTHS = {
  image: "w-[80px]",
  productInfo: "w-[280px]",
  price: "w-[140px]",
  stock: "w-[140px]",
  totalStock: "w-[100px]",
  status: "w-[120px]",
  lastUpdate: "w-[130px]",
} as const;

export const PRODUCT_STATUSES = ["draft", "updated", "pending"] as const;

// ============================================
// CONSTANTS - COLLECTION TABLE
// ============================================

export const COLLECTION_COLUMN_WIDTHS = {
  name: "w-[220px]",
  type: "w-[140px]",
  products: "w-[100px]",
  status: "w-[120px]",
  featured: "w-[100px]",
  created: "w-[130px]",
} as const;

// ============================================
// CONSTANTS - DIAMOND & GEMSTONE TABLE
// ============================================

export const DIAMOND_COLUMN_WIDTHS = {
  sku: "w-[120px]",
  shape: "w-[110px]",
  carat: "w-[90px]",
  color: "w-[80px]",
  clarity: "w-[90px]",
  cut: "w-[90px]",
  price: "w-[110px]",
  status: "w-[110px]",
} as const;

export const GEMSTONE_COLUMN_WIDTHS = {
  sku: "w-[120px]",
  type: "w-[130px]",
  shape: "w-[110px]",
  carat: "w-[90px]",
  color: "w-[110px]",
  clarity: "w-[90px]",
  price: "w-[110px]",
  status: "w-[110px]",
} as const;

// ============================================
// CONSTANTS - MATERIAL TABLE
// ============================================

export const MATERIAL_COLUMN_WIDTHS = {
  sku: "w-[120px]",
  name: "w-[200px]",
  category: "w-[140px]",
  stock: "w-[120px]",
  price: "w-[110px]",
  status: "w-[110px]",
} as const;

export const MATERIAL_CATEGORIES = [
  "Metal",
  "Stone",
  "Charm",
  "Bead",
  "String",
  "Finding",
  "Packaging",
  "Other",
] as const;

export const MATERIAL_STATUSES = [
  "In Stock",
  "Low Stock",
  "Out of Stock",
  "Discontinued",
] as const;

// ============================================
// HELPERS - PRODUCT BOARD
// ============================================

export const getProductStatusColor = (status: string): string => {
  switch (status) {
    case "draft":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "updated":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getStockStatusColor = (stock: number): string => {
  if (stock === 0) {
    return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
  } else if (stock < 10) {
    return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
  }
  return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
};

export const formatProductPrice = (price: number, salePrice?: number): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  if (salePrice && salePrice < price) {
    return `${formatter.format(salePrice)} (was ${formatter.format(price)})`;
  }
  return formatter.format(price);
};

// ============================================
// HELPERS - COLLECTION TABLE
// ============================================

export const getCollectionStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "inactive":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "draft":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "archived":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getCollectionTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "seasonal":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "themed":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "permanent":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "limited":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// ============================================
// HELPERS - MATERIAL TABLE
// ============================================

export const getMaterialCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case "metal":
      return "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400";
    case "stone":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "charm":
      return "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400";
    case "bead":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "string":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "finding":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "packaging":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getMaterialStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "in stock":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "low stock":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "out of stock":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "discontinued":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// ============================================
// HELPERS - DIAMOND & GEMSTONE
// ============================================

export const getDiamondCutGrade = (cut: string): string => {
  const grades: { [key: string]: string } = {
    Excellent: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
    "Very Good": "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    Good: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    Fair: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
    Poor: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
  };
  return grades[cut] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
};

export const getGemstoneColor = (color: string): string => {
  const colors: { [key: string]: string } = {
    Red: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
    Blue: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
    Green: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400",
    Purple: "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400",
    Pink: "bg-pink-100 text-pink-700 dark:bg-pink-950 dark:text-pink-400",
    Yellow: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400",
    Orange: "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400",
    White: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    Black: "bg-slate-100 text-slate-700 dark:bg-slate-950 dark:text-slate-400",
  };
  return colors[color] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
};

// ============================================
// HELPERS - PRICING RULES
// ============================================

export const getPricingRuleTypeColor = (type: string): string => {
  switch (type.toLowerCase()) {
    case "discount":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "markup":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "fixed":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "tiered":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getPricingRuleStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "inactive":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "scheduled":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "expired":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};
