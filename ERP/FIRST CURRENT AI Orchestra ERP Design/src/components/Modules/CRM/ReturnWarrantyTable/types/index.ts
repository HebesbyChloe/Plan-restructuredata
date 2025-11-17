import { OrderData } from "../../OrderTable";

// Using the unified OrderData type for consistency
export interface ReturnWarrantyTableModuleProps {
  orders: OrderData[];
  onOrderClick?: (order: OrderData) => void;
  onCustomerClick?: (order: OrderData) => void;
  staffList?: string[];
}

export interface ColumnProps {
  order: OrderData;
  staffList?: string[];
  onCustomerClick?: (order: OrderData) => void;
  onOrderInfoClick?: (order: OrderData) => void;
}
