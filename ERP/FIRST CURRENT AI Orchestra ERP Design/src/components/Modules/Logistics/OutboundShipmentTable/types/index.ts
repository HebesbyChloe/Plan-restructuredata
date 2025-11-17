export interface OutboundShipment {
  id: string;
  code: string;
  idCodeShip?: string;
  storage?: string;
  status: "Delivered" | "Shipped" | "Processing" | "Delayed" | "Pending";
  dateCreated: string;
  updateTime: string;
  shipDate: string;
  deliveryDate: string;
  tracking: string;
  estimatedDate: string;
  updatedBy: string;
  note?: string;
  products?: number;
  items?: number;
  destination?: string;
  carrier?: string;
}

export interface OutboundShipmentTableProps {
  data: OutboundShipment[];
  onShipmentClick?: (shipment: OutboundShipment) => void;
}
