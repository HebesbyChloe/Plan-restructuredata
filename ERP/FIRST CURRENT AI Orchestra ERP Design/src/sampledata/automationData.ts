/**
 * Sample Data: Automation Control
 * 
 * Contains sample data for automation workflows, templates, and API connections
 * Used in: AutomationControlPage
 */

export interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  status: "active" | "paused" | "error";
  lastRun?: string;
  runsToday: number;
}

export interface Template {
  id: string;
  name: string;
  type: "email" | "sms" | "packing_slip" | "invoice" | "shipping_label";
  lastModified: string;
  status: "active" | "draft";
}

export interface APIConnection {
  id: string;
  name: string;
  type: "store" | "shipping";
  platform: string;
  status: "connected" | "disconnected" | "error";
  lastSync?: string;
}

export interface AutomationStats {
  activeFlows: number;
  runsToday: number;
  connections: number;
  templates: number;
}

// Automation Rules
export const mockAutomationRules: AutomationRule[] = [
  {
    id: "1",
    name: "Auto-allocate inventory for new orders",
    trigger: "Order Created",
    action: "Allocate from nearest warehouse",
    status: "active",
    lastRun: "2 min ago",
    runsToday: 47,
  },
  {
    id: "2",
    name: "Auto-assign shipping service",
    trigger: "Order Ready to Ship",
    action: "Select cheapest shipping option",
    status: "paused",
    lastRun: "1 hour ago",
    runsToday: 12,
  },
  {
    id: "3",
    name: "Send tracking notification",
    trigger: "Label Created",
    action: "Email customer with tracking",
    status: "active",
    lastRun: "5 min ago",
    runsToday: 34,
  },
  {
    id: "4",
    name: "Flag high-value orders",
    trigger: "Order Total > $500",
    action: "Add VVIP tag and notify team",
    status: "active",
    lastRun: "15 min ago",
    runsToday: 8,
  },
];

// External Templates (Customer-facing)
export const mockExternalTemplates: Template[] = [
  {
    id: "1",
    name: "Order Confirmation Email",
    type: "email",
    lastModified: "Oct 15 2025",
    status: "active",
  },
  {
    id: "2",
    name: "Shipping Notification SMS",
    type: "sms",
    lastModified: "Oct 14 2025",
    status: "active",
  },
  {
    id: "3",
    name: "Delivery Confirmation Email",
    type: "email",
    lastModified: "Oct 10 2025",
    status: "active",
  },
];

// Internal Templates (Packing and shipping documents)
export const mockInternalTemplates: Template[] = [
  {
    id: "1",
    name: "Standard Packing Slip",
    type: "packing_slip",
    lastModified: "Oct 12 2025",
    status: "active",
  },
  {
    id: "2",
    name: "Gift Packing Slip",
    type: "packing_slip",
    lastModified: "Oct 8 2025",
    status: "active",
  },
  {
    id: "3",
    name: "UPS Shipping Label",
    type: "shipping_label",
    lastModified: "Oct 18 2025",
    status: "active",
  },
  {
    id: "4",
    name: "FedEx Shipping Label",
    type: "shipping_label",
    lastModified: "Oct 18 2025",
    status: "active",
  },
];

// Store Connections
export const mockStoreConnections: APIConnection[] = [
  {
    id: "1",
    name: "Shopify Main Store",
    type: "store",
    platform: "Shopify",
    status: "connected",
    lastSync: "5 min ago",
  },
  {
    id: "2",
    name: "Amazon Seller Central",
    type: "store",
    platform: "Amazon",
    status: "connected",
    lastSync: "10 min ago",
  },
  {
    id: "3",
    name: "Etsy Shop",
    type: "store",
    platform: "Etsy",
    status: "disconnected",
    lastSync: "2 days ago",
  },
  {
    id: "4",
    name: "Instagram Shopping",
    type: "store",
    platform: "Instagram",
    status: "connected",
    lastSync: "1 hour ago",
  },
];

// Shipping Connections
export const mockShippingConnections: APIConnection[] = [
  {
    id: "1",
    name: "UPS Account",
    type: "shipping",
    platform: "UPS",
    status: "connected",
    lastSync: "3 min ago",
  },
  {
    id: "2",
    name: "FedEx Business",
    type: "shipping",
    platform: "FedEx",
    status: "connected",
    lastSync: "8 min ago",
  },
  {
    id: "3",
    name: "USPS Account",
    type: "shipping",
    platform: "USPS",
    status: "connected",
    lastSync: "15 min ago",
  },
  {
    id: "4",
    name: "DHL Express",
    type: "shipping",
    platform: "DHL",
    status: "error",
    lastSync: "1 day ago",
  },
];

// Automation Stats
export const mockAutomationStats: AutomationStats = {
  activeFlows: 12,
  runsToday: 324,
  connections: 8,
  templates: 18,
};
