import { ProductBoardData } from "../types";
import { STATUS_COLORS, LOW_STOCK_THRESHOLD } from "./productBoardTableConstants";

export const getStatusColor = (status: ProductBoardData["status"]): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.draft;
};

export const isLowStock = (product: ProductBoardData): boolean => {
  return product.vnStock + product.usStock < LOW_STOCK_THRESHOLD;
};

export const getTotalStock = (product: ProductBoardData): number => {
  return product.vnStock + product.usStock;
};

export const filterProducts = (
  products: ProductBoardData[],
  searchTerm: string
): ProductBoardData[] => {
  if (!searchTerm) return products;
  
  const term = searchTerm.toLowerCase();
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(term) ||
      product.sku.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term)
  );
};
