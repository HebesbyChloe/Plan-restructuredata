/**
 * Orders Module - Centralized Type Definitions
 * All types for Orders modules (OrderBoard, CreateOrder, Coupons, etc.)
 */

// ============================================
// ORDER BOARD FILTERS TYPES
// ============================================

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface OrderBoardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  orderTab: "my" | "all";
  onOrderTabChange: (value: "my" | "all") => void;
  filterValues: {
    statusFilter: string;
    paymentFilter: string;
    approvalFilter: string;
    assignedFilter: string;
  };
  onFilterChange: (values: any) => void;
  filterExpanded: boolean;
  onFilterExpandedChange: (expanded: boolean) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  dateRangeLabel: string;
  onDateRangeLabelChange: (label: string) => void;
  dateRangeOpen: boolean;
  onDateRangeOpenChange: (open: boolean) => void;
  saleReps?: string[];
}

// ============================================
// ORDER BOARD HEADER TYPES
// ============================================

export interface OrderBoardHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onCreateOrder?: () => void;
}

// ============================================
// CUSTOM ORDER BOARD FILTERS TYPES
// ============================================

export interface CustomOrderBoardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  orderTab: "my" | "all";
  onOrderTabChange: (value: "my" | "all") => void;
  filterValues: {
    statusFilter: string;
    designStatusFilter: string;
    materialFilter: string;
  };
  onFilterChange: (values: any) => void;
  filterExpanded: boolean;
  onFilterExpandedChange: (expanded: boolean) => void;
  staffList?: string[];
}

// ============================================
// CUSTOM ORDER BOARD HEADER TYPES
// ============================================

export interface CustomOrderBoardHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
  onCreateOrder?: () => void;
}

// ============================================
// CREATE ORDER PANEL TYPES
// ============================================

export interface CreateOrderPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (orderData: any) => void;
}

// ============================================
// CREATE CART PANEL TYPES
// ============================================

export interface CreateCartPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (cartData: any) => void;
}

// ============================================
// CREATE COUPON PANEL TYPES
// ============================================

export interface CreateCouponPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (couponData: any) => void;
}
