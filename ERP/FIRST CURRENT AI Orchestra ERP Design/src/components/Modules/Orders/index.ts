/**
 * Orders Module - Reusable Order Components
 * 
 * Centralized export for all order-related table components and panels
 * used across the AI Orchestra ERP system.
 * 
 * NOTE: Currently forwarding to CRM module during migration.
 * Files will be physically moved in next phase.
 */

// Temporary: Forward to CRM module during migration
export { OrderTableModule } from "../CRM/OrderTable";
export type { OrderData, OrderTableModuleProps } from "../CRM/OrderTable";
export { OrderDetailPanel } from "../CRM/Panels/OrderDetailPanel";

// Pre-Order Components
export { PreOrderTableModule } from "../CRM/PreOrderTable";
export type { PreOrderData, PreOrderTableModuleProps } from "../CRM/PreOrderTable";

// Custom Order Components
export { CustomOrderTableModule } from "../CRM/CustomOrderTable/CustomOrderTableModule";

// Return & Warranty Components
export { ReturnWarrantyTableModule } from "../CRM/ReturnWarrantyTable/ReturnWarrantyTableModule";

// Customer Service Components
export { CustomerServiceTableModule } from "../CRM/CustomerServiceTable/CustomerServiceTableModule";

// Order Board Components (NEW!)
export { OrderBoardHeaderModule } from "./OrderBoardHeader";
export type { OrderBoardHeaderProps } from "./OrderBoardHeader";

export { OrderBoardFiltersModule } from "./OrderBoardFilters";
export type { OrderBoardFiltersProps, FilterValues, DateRange } from "./OrderBoardFilters";

export { CreateOrderPanelModule } from "./CreateOrderPanel";
export type { CreateOrderPanelProps } from "./CreateOrderPanel";

export { CreateCouponPanelModule } from "./CreateCouponPanel";
export type { CreateCouponPanelProps } from "./CreateCouponPanel";

export { CreateCartPanelModule } from "./CreateCartPanel";
export type { CreateCartPanelProps } from "./CreateCartPanel";

export { CustomOrderBoardHeaderModule } from "./CustomOrderBoardHeader";
export type { CustomOrderBoardHeaderProps } from "./CustomOrderBoardHeader";

export { CustomOrderBoardFiltersModule } from "./CustomOrderBoardFilters";
export type { 
  CustomOrderBoardFiltersProps,
  CustomOrderFilterValues,
} from "./CustomOrderBoardFilters";
