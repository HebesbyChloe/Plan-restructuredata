/**
 * Status Utilities
 * Status badge variants and helpers
 */

import type { StatusVariant } from '../types/status';

/**
 * Get badge variant for order status
 */
export function getOrderStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    pending: 'warning',
    processing: 'info',
    confirmed: 'info',
    shipped: 'info',
    delivered: 'success',
    cancelled: 'error',
    refunded: 'secondary',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Get badge variant for payment status
 */
export function getPaymentStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    unpaid: 'warning',
    paid: 'success',
    partially_paid: 'info',
    refunded: 'secondary',
    pending: 'warning',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Get badge variant for shipment status
 */
export function getShipmentStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    pending: 'warning',
    processing: 'info',
    in_transit: 'info',
    delivered: 'success',
    failed: 'error',
    cancelled: 'error',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Get badge variant for task status
 */
export function getTaskStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    todo: 'secondary',
    in_progress: 'info',
    in_review: 'warning',
    completed: 'success',
    cancelled: 'error',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Get badge variant for product status
 */
export function getProductStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    draft: 'secondary',
    active: 'success',
    inactive: 'warning',
    archived: 'error',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Get badge variant for inventory status
 */
export function getInventoryStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    in_stock: 'success',
    low_stock: 'warning',
    out_of_stock: 'error',
    discontinued: 'secondary',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Get badge variant for ticket status
 */
export function getTicketStatusVariant(status: string): StatusVariant {
  const statusMap: Record<string, StatusVariant> = {
    open: 'warning',
    in_progress: 'info',
    pending_customer: 'warning',
    resolved: 'success',
    closed: 'secondary',
  };
  return statusMap[status.toLowerCase()] || 'default';
}

/**
 * Generic status variant getter
 */
export function getStatusVariant(
  status: string,
  type?: 'order' | 'payment' | 'shipment' | 'task' | 'product' | 'inventory' | 'ticket'
): StatusVariant {
  switch (type) {
    case 'order':
      return getOrderStatusVariant(status);
    case 'payment':
      return getPaymentStatusVariant(status);
    case 'shipment':
      return getShipmentStatusVariant(status);
    case 'task':
      return getTaskStatusVariant(status);
    case 'product':
      return getProductStatusVariant(status);
    case 'inventory':
      return getInventoryStatusVariant(status);
    case 'ticket':
      return getTicketStatusVariant(status);
    default:
      return 'default';
  }
}

/**
 * Format status text for display
 */
export function formatStatusText(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
