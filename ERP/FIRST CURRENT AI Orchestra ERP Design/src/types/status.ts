/**
 * Status Types
 * All status-related type definitions
 */

// Order statuses
export type OrderStatus = 
  | 'pending' 
  | 'processing' 
  | 'confirmed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded';

// Payment statuses
export type PaymentStatus = 
  | 'unpaid' 
  | 'paid' 
  | 'partially_paid' 
  | 'refunded' 
  | 'pending';

// Fulfillment statuses
export type FulfillmentStatus = 
  | 'unfulfilled' 
  | 'partially_fulfilled' 
  | 'fulfilled' 
  | 'cancelled';

// Shipment statuses
export type ShipmentStatus = 
  | 'pending' 
  | 'processing' 
  | 'in_transit' 
  | 'delivered' 
  | 'failed' 
  | 'cancelled';

// Return statuses
export type ReturnStatus = 
  | 'requested' 
  | 'approved' 
  | 'rejected' 
  | 'received' 
  | 'refunded' 
  | 'completed';

// Customer service ticket statuses
export type TicketStatus = 
  | 'open' 
  | 'in_progress' 
  | 'pending_customer' 
  | 'resolved' 
  | 'closed';

// Task statuses
export type TaskStatus = 
  | 'todo' 
  | 'in_progress' 
  | 'in_review' 
  | 'completed' 
  | 'cancelled';

// Product statuses
export type ProductStatus = 
  | 'draft' 
  | 'active' 
  | 'inactive' 
  | 'archived';

// Inventory statuses
export type InventoryStatus = 
  | 'in_stock' 
  | 'low_stock' 
  | 'out_of_stock' 
  | 'discontinued';

// Campaign statuses
export type CampaignStatus = 
  | 'draft' 
  | 'scheduled' 
  | 'active' 
  | 'paused' 
  | 'completed' 
  | 'cancelled';

// Generic active status
export type ActiveStatus = 'active' | 'inactive';

// Approval statuses
export type ApprovalStatus = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'cancelled';

// Status badge variant mapping
export type StatusVariant = 
  | 'default' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'info' 
  | 'secondary';
