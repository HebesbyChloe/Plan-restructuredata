/**
 * TypeScript Types: Outbound Filters Module
 */

export interface OutboundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedCarrier?: string;
  onCarrierChange?: (value: string) => void;
  onDateFilter?: () => void;
  onMoreFilters?: () => void;
}
