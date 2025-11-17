export interface POProduct {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image?: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  vendor: string;
  description?: string;
  date: string;
  updatedDate: string;
  items: number;
  totalAmount: number;
  status: "Planning" | "Pending" | "Approved" | "Processed" | "Completed" | "Cancelled" | "Shipped" | "Delivered" | "Delayed";
  shipmentId?: string;
  billId?: string;
  notes?: string;
  paymentTerms?: string;
  leadTime?: string;
  deliveryAddress?: string;
  products: POProduct[];
  isUrgent?: boolean;
  createdBy?: string;
  approvedBy?: string;
  estDeliveredDate?: string;
  shippingMethod?: string;
}

export interface PurchaseOrderTableProps {
  data: PurchaseOrder[];
  onPOClick: (po: PurchaseOrder) => void;
  searchTerm?: string;
  selectedStatus?: string;
}
