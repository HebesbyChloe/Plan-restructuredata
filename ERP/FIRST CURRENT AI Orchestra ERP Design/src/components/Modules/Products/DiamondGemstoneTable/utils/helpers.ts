import { Diamond, Gemstone } from "../types";
import { DIAMOND_STATUS_COLORS, GEMSTONE_STATUS_COLORS } from "./constants";

export const getDiamondStatusColor = (status: Diamond["status"]): string => {
  return DIAMOND_STATUS_COLORS[status] || DIAMOND_STATUS_COLORS.available;
};

export const getGemstoneStatusColor = (status: Gemstone["status"]): string => {
  return GEMSTONE_STATUS_COLORS[status] || GEMSTONE_STATUS_COLORS.available;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const filterDiamonds = (diamonds: Diamond[], searchTerm: string): Diamond[] => {
  if (!searchTerm) return diamonds;
  const term = searchTerm.toLowerCase();
  return diamonds.filter(d =>
    d.name.toLowerCase().includes(term) ||
    d.sku.toLowerCase().includes(term) ||
    d.shape.toLowerCase().includes(term)
  );
};

export const filterGemstones = (gemstones: Gemstone[], searchTerm: string): Gemstone[] => {
  if (!searchTerm) return gemstones;
  const term = searchTerm.toLowerCase();
  return gemstones.filter(g =>
    g.name.toLowerCase().includes(term) ||
    g.sku.toLowerCase().includes(term) ||
    g.variety.toLowerCase().includes(term) ||
    g.origin.toLowerCase().includes(term)
  );
};
