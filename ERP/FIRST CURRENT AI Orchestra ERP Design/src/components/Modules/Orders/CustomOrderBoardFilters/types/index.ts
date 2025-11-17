/**
 * CustomOrderBoardFilters Types
 */

export interface CustomOrderFilterValues {
  rankFilter: string;
  statusFilter: string;
  storeFilter: string;
  staffFilter: string;
  paymentFilter: string;
  designFilter: string;
  materialFilter: string;
  completionFilter: string;
}

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface CustomOrderBoardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  orderViewTab: "my" | "all";
  onOrderViewTabChange: (value: "my" | "all") => void;
  filterValues: CustomOrderFilterValues;
  onFilterChange: (values: CustomOrderFilterValues) => void;
  filterExpanded: boolean;
  onFilterExpandedChange: (expanded: boolean) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  dateRangeLabel: string;
  onDateRangeLabelChange: (label: string) => void;
  staffList?: string[];
}
