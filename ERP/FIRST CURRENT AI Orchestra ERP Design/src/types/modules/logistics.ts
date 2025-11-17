/**
 * Logistics Module - Centralized Type Definitions
 * All types for Logistics modules (Inbound, Outbound, Vendors, Purchase Orders)
 */

import { InboundShipment, OutboundShipment, PurchaseOrder, Vendor } from "../../sampledata";

// Re-export from sampledata
export type { InboundShipment, OutboundShipment, PurchaseOrder, Vendor };

// ============================================
// INBOUND FILTERS TYPES
// ============================================

export interface InboundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  vendorFilter: string;
  onVendorFilterChange: (value: string) => void;
  vendorList?: string[];
}

// ============================================
// INBOUND STATS CARDS TYPES
// ============================================

export interface InboundStatsCardsProps {
  totalShipments: number;
  inTransit: number;
  received: number;
  delayed: number;
}

// ============================================
// INBOUND SHIPMENT TABLE TYPES
// ============================================

export interface InboundShipmentTableProps {
  shipments: InboundShipment[];
  onShipmentClick: (shipment: InboundShipment) => void;
}

// ============================================
// OUTBOUND FILTERS TYPES
// ============================================

export interface OutboundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  carrierFilter: string;
  onCarrierFilterChange: (value: string) => void;
  carrierList?: string[];
}

// ============================================
// OUTBOUND STATS CARDS TYPES
// ============================================

export interface OutboundStatsCardsProps {
  totalShipments: number;
  inTransit: number;
  delivered: number;
  delayed: number;
}

// ============================================
// OUTBOUND SHIPMENT TABLE TYPES
// ============================================

export interface OutboundShipmentTableProps {
  shipments: OutboundShipment[];
  onShipmentClick: (shipment: OutboundShipment) => void;
}

// ============================================
// VENDOR FILTERS TYPES
// ============================================

export interface VendorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusFilterChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
}

// ============================================
// VENDOR STATS CARDS TYPES
// ============================================

export interface VendorStatsCardsProps {
  totalVendors: number;
  activeVendors: number;
  pendingOrders: number;
  totalSpent: number;
}

// ============================================
// VENDOR TABLE TYPES
// ============================================

export interface VendorTableProps {
  vendors: Vendor[];
  onVendorClick: (vendor: Vendor) => void;
}

// ============================================
// PURCHASE ORDER TABLE TYPES
// ============================================

export interface PurchaseOrderTableProps {
  orders: PurchaseOrder[];
  onOrderClick: (order: PurchaseOrder) => void;
}
