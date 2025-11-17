// Helper function to get customer tier color
export const getTierColor = (tier: string): string => {
  switch (tier) {
    case "VVIP":
      return "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-400";
    case "VIP":
      return "bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-400";
    case "Repeat":
      return "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-400";
    case "New":
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Helper function to get reason color
export const getReasonColor = (reason: string): string => {
  switch (reason) {
    case "Return":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    case "Warranty":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Exchange":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Helper function to get status color
export const getStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Helper function to get shipping status color
export const getShippingStatusColor = (status: string): string => {
  switch (status) {
    case "Not Yet":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Label Sent":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "In Transit":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Received":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Helper function to get refund status color
export const getRefundStatusColor = (status: string): string => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Processed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "N/A":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Helper function to copy text to clipboard
export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

// Helper function to generate tracking URL based on carrier
export const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
  const carrierLower = carrier.toLowerCase();
  
  if (carrierLower.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  } else if (carrierLower.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  } else if (carrierLower.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  } else if (carrierLower.includes('dhl')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
  } else {
    // Generic tracking search
    return `https://www.google.com/search?q=track+${carrier}+${trackingNumber}`;
  }
};

// Helper function to get tracking status color
export const getTrackingStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400";
    case "Processing":
      return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
    case "In Transit":
      return "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400";
    case "Label Created":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400";
    case "Shipping Delay":
      return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400";
    default:
      return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400";
  }
};

// Helper function to calculate days between two dates
// Both dates should be in format "Oct 11, 2025"
export const calculateDaysBetween = (startDateStr: string, endDateStr: string): number => {
  try {
    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);
    
    // Calculate difference in milliseconds
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    // Convert to days
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (error) {
    return 0;
  }
};

// Helper function to format days display
export const formatDaysDisplay = (days: number): string => {
  if (days === 0) return "0 day";
  if (days === 1) return "1 day";
  return `${days} days`;
};

// Helper function to get day badge variant based on days and completion status
export const getDayBadgeVariant = (days: number, isCompleted: boolean): "default" | "orange" | "red" => {
  if (isCompleted) {
    return "default";
  }
  
  if (days > 14) {
    return "red";
  } else if (days > 7) {
    return "orange";
  }
  
  return "default";
};
