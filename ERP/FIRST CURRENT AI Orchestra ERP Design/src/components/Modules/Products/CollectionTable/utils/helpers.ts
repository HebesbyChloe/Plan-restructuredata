import { Collection } from "../types";
import { STATUS_COLORS, TYPE_COLORS } from "./constants";

export const getStatusColor = (status: Collection["status"]): string => {
  return STATUS_COLORS[status] || STATUS_COLORS.draft;
};

export const getTypeColor = (type: Collection["collectionType"]): string => {
  return TYPE_COLORS[type] || TYPE_COLORS.manual;
};

export const filterCollections = (collections: Collection[], searchTerm: string): Collection[] => {
  if (!searchTerm) return collections;
  const term = searchTerm.toLowerCase();
  return collections.filter(c =>
    c.name.toLowerCase().includes(term) ||
    c.slug.toLowerCase().includes(term) ||
    c.description.toLowerCase().includes(term)
  );
};
