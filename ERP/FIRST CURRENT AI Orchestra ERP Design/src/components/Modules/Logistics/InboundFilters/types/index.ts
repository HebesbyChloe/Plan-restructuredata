/**
 * TypeScript Types: Inbound Filters Module
 */

export interface InboundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onDateFilter?: () => void;
  onMoreFilters?: () => void;
}
