import { PurchaseOrder } from "../types";

export function filterPurchaseOrders(
  orders: PurchaseOrder[],
  searchTerm: string,
  statusFilter: string,
  activeTab: string
): PurchaseOrder[] {
  return orders.filter((po) => {
    // Search filter
    const matchesSearch =
      !searchTerm ||
      po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      po.description?.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter === "all" || po.status === statusFilter;

    // Tab filter
    let matchesTab = true;
    if (activeTab === "urgent") {
      matchesTab = po.isUrgent === true;
    } else if (activeTab === "pending-approval") {
      matchesTab = po.status === "Pending" || po.status === "Planning";
    } else if (activeTab === "in-transit") {
      matchesTab = po.status === "Shipped" || po.status === "Processed";
    }

    return matchesSearch && matchesStatus && matchesTab;
  });
}

export function calculateTotalValue(orders: PurchaseOrder[]): number {
  return orders.reduce((sum, po) => sum + po.totalAmount, 0);
}

export function calculateTotalItems(orders: PurchaseOrder[]): number {
  return orders.reduce((sum, po) => sum + po.items, 0);
}

export function getStatusCounts(orders: PurchaseOrder[]) {
  const counts: Record<string, number> = {
    Planning: 0,
    Pending: 0,
    Approved: 0,
    Processed: 0,
    Shipped: 0,
    Delivered: 0,
    Completed: 0,
    Cancelled: 0,
    Delayed: 0,
  };

  orders.forEach((po) => {
    counts[po.status] = (counts[po.status] || 0) + 1;
  });

  return counts;
}

export function getUrgentCount(orders: PurchaseOrder[]): number {
  return orders.filter((po) => po.isUrgent).length;
}
