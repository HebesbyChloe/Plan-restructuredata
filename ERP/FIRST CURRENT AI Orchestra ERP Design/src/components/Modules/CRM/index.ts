/**
 * CRM Module - Reusable CRM Components
 * 
 * Centralized export for all CRM-related components used across
 * the AI Orchestra ERP system.
 * 
 * Organized Structure:
 * - Charts/        - Data visualization components
 * - Stats/         - Statistics and metric cards
 * - Panels/        - Detail panels and dialogs
 * - Filters/       - Filter and search components
 * - Insights/      - Analytics and insights modules
 * - Tables/        - Data table modules (CustomerService, CustomOrder, etc.)
 */

// ======================
// CHARTS
// ======================
export { BehaviorCharts } from "./Charts/BehaviorCharts";
export { CustomerGrowthChart } from "./Charts/CustomerGrowthChart";
export { CustomerJourneyFunnel } from "./Charts/CustomerJourneyFunnel";
export { CustomerSegmentsCharts } from "./Charts/CustomerSegmentsCharts";
export { PurchaseFrequencyChart } from "./Charts/PurchaseFrequencyChart";

// ======================
// STATS CARDS
// ======================
export { ActiveChallengesCard } from "./Stats/ActiveChallengesCard";
export { ClickableStatsCards } from "./Stats/ClickableStatsCards";
export { CurrentShiftReportCard } from "./Stats/CurrentShiftReportCard";
export { JourneyMetricsCards } from "./Stats/JourneyMetricsCards";
export { KeyMetricsCards } from "./Stats/KeyMetricsCards";
export { MonthlyMomentumCard } from "./Stats/MonthlyMomentumCard";
export { PointTrackingCard } from "./Stats/PointTrackingCard";
export { ReengageStat } from "./Stats/ReengageStat";
export { TopProductCategoriesCard } from "./Stats/TopProductCategoriesCard";

// ======================
// PANELS & DIALOGS
// ======================
export { CustomerDetailPanel } from "./Panels/CustomerDetailPanel";
export { CustomerServiceDetailPanel } from "./Panels/CustomerServiceDetailPanel";
export { OrderDetailPanel } from "./Panels/OrderDetailPanel";
export { ReengageBatchDetailPanel } from "./Panels/ReengageBatchDetailPanel";
export { ReengageBatchEditDialog } from "./Panels/ReengageBatchEditDialog";

// ======================
// FILTERS
// ======================
export { CustomerInsightsFilter } from "./Filters/CustomerInsightsFilter";
export { FilterCustomerModule } from "./Filters/FilterCustomerModule";

// ======================
// INSIGHTS & ANALYTICS
// ======================
export { BehaviorInsightsGrid } from "./Insights/BehaviorInsightsGrid";
export { MyShiftReportsTable } from "./Insights/MyShiftReportsTable";
export { TableCustomerModule } from "./Insights/TableCustomerModule";

// ======================
// TABLE MODULES
// ======================

// Customer Service Table
export { CustomerServiceTableModule } from "./CustomerServiceTable/CustomerServiceTableModule";
export { CustomerServiceBoardHeaderModule } from "./CustomerServiceBoardHeader";
export type { CustomerServiceBoardHeaderProps } from "./CustomerServiceBoardHeader";
export { CustomerServiceBoardFiltersModule } from "./CustomerServiceBoardFilters";
export type { 
  CustomerServiceBoardFiltersProps,
  CustomerServiceFilterValues,
} from "./CustomerServiceBoardFilters";

// Custom Order Table
export { CustomOrderTableModule } from "./CustomOrderTable/CustomOrderTableModule";

// Order Table
export { OrderTableModule } from "./OrderTable";
export type { OrderData, OrderTableModuleProps } from "./OrderTable";

// Pre-Order Table
export { PreOrderTableModule } from "./PreOrderTable";
export type { PreOrderData, PreOrderTableModuleProps } from "./PreOrderTable";

// Re-engage Batch Table
export { ReengageBatchTableModule } from "./ReengageBatchTable";
export type { ReengageBatchTableProps, FilterCounts } from "./ReengageBatchTable";

// Return & Warranty Table
export { ReturnWarrantyTableModule } from "./ReturnWarrantyTable/ReturnWarrantyTableModule";
