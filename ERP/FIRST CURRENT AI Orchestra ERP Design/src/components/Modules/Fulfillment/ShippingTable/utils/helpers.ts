import { OrderData } from "../../../../../types/modules/crm";

/**
 * Generate tracking URL based on carrier and tracking number
 */
export const getTrackingUrl = (carrier: string, trackingNumber: string): string | null => {
  if (!trackingNumber) return null;
  
  const upperCarrier = carrier.toUpperCase();
  const trackingUrls: Record<string, string> = {
    "UPS": `https://www.ups.com/track?tracknum=${trackingNumber}`,
    "USPS": `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    "FEDEX": `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    "DHL": `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    "VN POST": `https://www.vnpost.vn/en-us/dinh-vi/buu-pham?key=${trackingNumber}`,
    "DPD": `https://www.dpd.com/track/${trackingNumber}`,
    "GLS": `https://gls-group.eu/track/${trackingNumber}`,
  };
  
  return trackingUrls[upperCarrier] || null;
};

/**
 * Format date to MM/DD format
 */
export const formatShippedDate = (dateString?: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}/${day}`;
};

/**
 * Get all orders for a specific order number (for linked/split orders)
 */
export const getOrdersByOrderNumber = (orders: OrderData[], orderNumber: string): OrderData[] => {
  return orders.filter(o => o.orderNumber === orderNumber);
};

/**
 * Calculate order age in days from createdDate to today
 */
export const calculateOrderAge = (createdDate: string): number => {
  if (!createdDate) return 0;
  const created = new Date(createdDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - created.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Filter orders based on search and filters
 */
export const filterOrders = (
  orders: OrderData[],
  searchQuery: string,
  statusFilter: string | "all",
  batchFilter: string | "all",
  tagsFilter: string[]
): OrderData[] => {
  return orders.filter((order) => {
    const matchesSearch =
      searchQuery === "" ||
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.tracking && order.tracking.some(t => 
        t.trackingNumber?.toLowerCase().includes(searchQuery.toLowerCase())
      ));

    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;

    // For batch filter, check if order has statusProcess.group (batch assignment)
    const matchesBatch = batchFilter === "all" || 
      (order.statusProcess?.group && order.statusProcess.group === batchFilter);

    // For tags filter, check if order has any of the selected tags
    const matchesTags = tagsFilter.length === 0 || 
      (order.tags && order.tags.some(tag => tagsFilter.includes(tag)));

    return matchesSearch && matchesStatus && matchesBatch && matchesTags;
  });
};
