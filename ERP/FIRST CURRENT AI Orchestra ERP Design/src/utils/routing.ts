/**
 * Routing utility functions for converting between sidebar items and URL slugs
 */

// Mapping of sidebar item names to URL slugs
const SIDEBAR_TO_SLUG: Record<string, string> = {
  // Administration
  "Overview": "overview",
  "User Management": "user-management",
  "Role & Permission": "role-permission",
  "Tenant Management": "tenant-management",
  "Company Settings": "company-settings",
  "AI Agents": "ai-agents",
  "AI Flow": "ai-flow",
  "Automation / Integration": "automation-integration",
  "Audit Logs": "audit-logs",
  
  // Orders
  "Orders": "orders",
  "Pre-Orders": "pre-orders",
  "Customize Orders": "customize-orders",
  "Service Orders": "service-orders",
  "Customer Service": "customer-service",
  "Order Insights": "order-insights",
  
  // Products
  "Product": "product",
  "Material": "material",
  "Diamond & Gemstone": "diamond-gemstone",
  "Attributes & Variants": "attributes-variants",
  "Custom & Bundle": "custom-bundle",
  "Pricing Matrix": "pricing-matrix",
  "Collections Manager": "collections-manager",
  "Product Insights": "product-insights",
  
  // Logistics
  "Inbound Shipments": "inbound-shipments",
  "Outbound Shipments": "outbound-shipments",
  "Purchase Orders": "purchase-orders",
  "Procurement": "procurement",
  "Vendors & Suppliers": "vendors-suppliers",
  "Logistic Insights": "logistic-insights",
  
  // Marketing
  "Campaign Calendar": "campaign-calendar",
  "Campaign": "campaign",
  "Brand Hub": "brand-hub",
  "Promotion": "promotion",
  "Asset Library": "asset-library",
  "Inspiration": "inspiration",
  "Resources": "resources",
  
  // CRM
  "Customer": "customer",
  "Re-Engage": "re-engage",
  "Customer Insights": "customer-insights",
  "Performance": "performance",
  
  // Fulfillment
  "Shipping": "shipping",
  "Return": "return",
  "Automation Control": "automation-control",
  "Fulfilment Insights": "fulfillment-insights",
  
  // Workspace
  "My Work Space": "my-work-space",
  "My Tasks": "my-tasks",
  "Projects & Campaigns": "projects-campaigns",
  "Task Calendar": "task-calendar",
  "Task Analytics": "task-analytics",
  "Shift Schedule": "shift-schedule",
  
  // Reports
  "Reports": "reports",
};

// Reverse mapping: slug to sidebar item
const SLUG_TO_SIDEBAR: Record<string, string> = Object.fromEntries(
  Object.entries(SIDEBAR_TO_SLUG).map(([key, value]) => [value, key])
);

// Category to slug mapping
const CATEGORY_TO_SLUG: Record<string, string> = {
  "Administration": "administration",
  "Orders": "orders",
  "Products": "products",
  "Logistics": "logistics",
  "Marketing": "marketing",
  "CRM": "crm",
  "Fulfilment": "fulfillment",
  "Workspace": "workspace",
  "Reports": "reports",
  "Home": "",
};

// Reverse mapping: slug to category
const SLUG_TO_CATEGORY: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_TO_SLUG).map(([key, value]) => [value, key])
);

/**
 * Convert sidebar item name to URL slug
 */
export function sidebarItemToSlug(item: string): string {
  return SIDEBAR_TO_SLUG[item] || item.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

/**
 * Convert URL slug to sidebar item name
 */
export function slugToSidebarItem(slug: string): string {
  return SLUG_TO_SIDEBAR[slug] || slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

/**
 * Convert category name to URL slug
 */
export function categoryToSlug(category: string): string {
  return CATEGORY_TO_SLUG[category] || category.toLowerCase();
}

/**
 * Convert URL slug to category name
 */
export function slugToCategory(slug: string): string {
  return SLUG_TO_CATEGORY[slug] || slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Generate full route path from category and optional page
 */
export function getRoutePath(category: string, item?: string): string {
  const categorySlug = categoryToSlug(category);
  
  if (!item) {
    return categorySlug ? `/${categorySlug}` : "/";
  }
  
  const itemSlug = sidebarItemToSlug(item);
  
  // Special case: Overview can be omitted or included
  if (itemSlug === "overview") {
    return `/${categorySlug}`;
  }
  
  return `/${categorySlug}/${itemSlug}`;
}

/**
 * Parse URL pathname to extract category and page
 */
export function parseRoutePath(pathname: string): { category: string | null; page: string | null } {
  // Remove leading/trailing slashes and split
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length === 0) {
    return { category: null, page: null };
  }
  
  // First segment is category
  const categorySlug = segments[0];
  const category = slugToCategory(categorySlug);
  
  // Second segment is page (if exists)
  if (segments.length > 1) {
    const pageSlug = segments[1];
    const page = slugToSidebarItem(pageSlug);
    return { category, page };
  }
  
  // Only category, no page
  return { category, page: null };
}

/**
 * Check if a route is a global page (not department-specific)
 */
export function isGlobalRoute(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return true; // Home is global
  
  const globalRoutes = ["ai-flow"];
  return globalRoutes.includes(segments[0]);
}

