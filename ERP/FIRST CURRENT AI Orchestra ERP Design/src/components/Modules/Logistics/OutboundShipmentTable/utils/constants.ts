/**
 * Constants: Outbound Shipment Table
 * 
 * Status color mappings for outbound shipments
 * Note: Mock data has been moved to /sampledata/outboundShipments.ts
 */

export const STATUS_COLORS: Record<string, string> = {
  Delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  Shipped: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  Processing: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  Delayed: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  Pending: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};
