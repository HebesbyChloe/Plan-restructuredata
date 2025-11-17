/**
 * OrderBoardFilters Module - Type Definitions
 */

export interface FilterValues {
  shift: string;
  status: string;
  store: string;
  csat: string;
  approveRft: string;
  staff: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface OrderBoardFiltersProps {
  // Search
  searchTerm: string;
  onSearchChange: (term: string) => void;
  
  // View Tabs
  viewTab: "my" | "all";
  onViewTabChange: (tab: "my" | "all") => void;
  
  // Filters
  filters: FilterValues;
  onFilterChange: (key: keyof FilterValues, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  
  // Date Range
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  dateRangeLabel: string;
  onDatePreset: (preset: "7days" | "thisMonth" | "lastMonth") => void;
  onDateRangeClear: () => void;
  
  // Staff options
  staffOptions: string[];
}
