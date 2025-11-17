import { OutboundShipment } from "../types";

export function formatDate(date: string): string {
  if (!date || date === "-") return "-";
  return date;
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case "Delivered":
      return "✅";
    case "Shipped":
      return "🚚";
    case "Processing":
      return "📦";
    case "Delayed":
      return "⚠️";
    case "Pending":
      return "⏳";
    default:
      return "📦";
  }
}

export function sortByStatus(a: OutboundShipment, b: OutboundShipment): number {
  const statusOrder = {
    Delayed: 0,
    Processing: 1,
    Pending: 2,
    Shipped: 3,
    Delivered: 4,
  };
  
  return (
    statusOrder[a.status as keyof typeof statusOrder] -
    statusOrder[b.status as keyof typeof statusOrder]
  );
}
