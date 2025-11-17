import { ShipmentEnhanced } from "../../../../../sampledata/shipmentsEnhanced";
import { OrderData } from "../../../../../types/modules/crm";

export type ShipmentData = ShipmentEnhanced;

export interface ShippingTableModuleProps {
  orders: OrderData[];
  onOrderClick: (order: OrderData) => void;
  onStatusChange?: (orderId: string, newStatus: OrderData["orderStatus"]) => void;
  onBulkPrintLabels?: (orderIds: string[]) => void;
  selectedOrders?: string[];
  onSelectionChange?: (orderIds: string[]) => void;
  showImages?: boolean;
  expandedLineItems?: string[];
  onToggleLineItems?: (orderId: string) => void;
  onImageClick?: (imageUrl: string) => void;
}
