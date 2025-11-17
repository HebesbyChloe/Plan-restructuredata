export interface InboundShipment {
  id: string;
  code: string;
  location: "Internal Hub" | "Outbound" | "Main Warehouse" | "Warehouse A" | "Warehouse B";
  status: "Complete" | "Incoming" | "Processing" | "Delayed" | "Cancelled";
  products: number;
  items: number;
  tracking: string;
  estimatedDate: string;
  updateDate: string;
  vendor?: string;
  poNumber?: string;
  note?: string;
}

export interface InboundShipmentTableProps {
  data: InboundShipment[];
  onShipmentClick?: (shipment: InboundShipment) => void;
  searchTerm?: string;
  selectedStatus?: string;
  selectedLocation?: string;
}
