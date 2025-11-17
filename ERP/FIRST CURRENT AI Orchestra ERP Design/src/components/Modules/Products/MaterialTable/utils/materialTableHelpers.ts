import { Material } from "../types";
import { STATUS_COLORS, CATEGORY_COLORS } from "./materialTableConstants";

export const getStatusColor = (status: Material["status"]): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.out_of_stock;
};

export const getCategoryColor = (category: Material["category"]): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.component;
};

export const isLowStock = (material: Material): boolean => {
  return material.quantityInStock <= material.reorderLevel;
};

export const filterMaterials = (
  materials: Material[],
  searchTerm: string
): Material[] => {
  if (!searchTerm) return materials;
  
  const term = searchTerm.toLowerCase();
  return materials.filter(
    (material) =>
      material.name.toLowerCase().includes(term) ||
      material.sku.toLowerCase().includes(term) ||
      material.type.toLowerCase().includes(term) ||
      material.vendor.toLowerCase().includes(term)
  );
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};
