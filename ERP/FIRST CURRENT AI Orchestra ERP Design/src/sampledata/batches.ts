export interface BatchOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: number;
  totalValue: number;
  priority: "low" | "normal" | "high" | "urgent";
  shippingMethod: "standard" | "express" | "overnight";
  picked: boolean;
  packed: boolean;
}

export interface Batch {
  id: string;
  name: string;
  status: "open" | "picking" | "packing" | "ready" | "shipped" | "completed";
  warehouse: "US" | "VN";
  orders: BatchOrder[];
  createdDate: string;
  createdBy: string;
  assignedTo?: string;
  startedDate?: string;
  completedDate?: string;
  totalOrders: number;
  totalItems: number;
  totalValue: number;
  priority: "low" | "normal" | "high";
  notes?: string;
  pickListPrinted: boolean;
  packingSlipsPrinted: boolean;
}

export const mockBatches: Batch[] = [
  {
    id: "BATCH-001",
    name: "US1101-01",
    status: "packing",
    warehouse: "US",
    orders: [
      {
        id: "1",
        orderNumber: "ORD-12345",
        customerName: "Sarah Johnson",
        items: 1,
        totalValue: 89.99,
        priority: "high",
        shippingMethod: "express",
        picked: true,
        packed: true,
      },
      {
        id: "2",
        orderNumber: "ORD-12347",
        customerName: "Emily Rodriguez",
        items: 2,
        totalValue: 299.98,
        priority: "urgent",
        shippingMethod: "overnight",
        picked: true,
        packed: true,
      },
      {
        id: "3",
        orderNumber: "ORD-12353",
        customerName: "James Wilson",
        items: 1,
        totalValue: 159.99,
        priority: "high",
        shippingMethod: "express",
        picked: true,
        packed: false,
      },
    ],
    createdDate: "2025-11-01T08:00:00",
    createdBy: "John Smith",
    assignedTo: "Maria Garcia",
    startedDate: "2025-11-01T08:30:00",
    totalOrders: 3,
    totalItems: 4,
    totalValue: 549.96,
    priority: "high",
    pickListPrinted: true,
    packingSlipsPrinted: true,
  },
  {
    id: "BATCH-002",
    name: "US1102-01",
    status: "picking",
    warehouse: "US",
    orders: [
      {
        id: "4",
        orderNumber: "ORD-12349",
        customerName: "David Thompson",
        items: 2,
        totalValue: 189.98,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: false,
      },
      {
        id: "5",
        orderNumber: "ORD-12352",
        customerName: "Amanda White",
        items: 1,
        totalValue: 79.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: false,
        packed: false,
      },
      {
        id: "6",
        orderNumber: "ORD-12354",
        customerName: "Chris Brown",
        items: 3,
        totalValue: 259.97,
        priority: "normal",
        shippingMethod: "standard",
        picked: false,
        packed: false,
      },
      {
        id: "7",
        orderNumber: "ORD-12355",
        customerName: "Lisa Anderson",
        items: 1,
        totalValue: 129.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: false,
      },
    ],
    createdDate: "2025-11-02T09:00:00",
    createdBy: "Sarah Wilson",
    assignedTo: "Tom Martinez",
    startedDate: "2025-11-02T09:15:00",
    totalOrders: 4,
    totalItems: 7,
    totalValue: 659.93,
    priority: "normal",
    pickListPrinted: true,
    packingSlipsPrinted: false,
  },
  {
    id: "BATCH-003",
    name: "VN1101-01",
    status: "ready",
    warehouse: "VN",
    orders: [
      {
        id: "8",
        orderNumber: "ORD-12348",
        customerName: "Nguyen Van A",
        items: 1,
        totalValue: 199.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: true,
      },
      {
        id: "9",
        orderNumber: "ORD-12356",
        customerName: "Tran Thi B",
        items: 2,
        totalValue: 299.98,
        priority: "high",
        shippingMethod: "express",
        picked: true,
        packed: true,
      },
      {
        id: "10",
        orderNumber: "ORD-12357",
        customerName: "Le Van C",
        items: 1,
        totalValue: 149.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: true,
      },
    ],
    createdDate: "2025-11-01T10:00:00",
    createdBy: "Pham Van D",
    assignedTo: "Nguyen Thi E",
    startedDate: "2025-11-01T10:30:00",
    completedDate: "2025-11-01T14:45:00",
    totalOrders: 3,
    totalItems: 4,
    totalValue: 649.96,
    priority: "normal",
    notes: "All items packed and ready for carrier pickup",
    pickListPrinted: true,
    packingSlipsPrinted: true,
  },
  {
    id: "BATCH-004",
    name: "US1102-02",
    status: "open",
    warehouse: "US",
    orders: [
      {
        id: "11",
        orderNumber: "ORD-12358",
        customerName: "Patricia Davis",
        items: 1,
        totalValue: 499.99,
        priority: "urgent",
        shippingMethod: "overnight",
        picked: false,
        packed: false,
      },
      {
        id: "12",
        orderNumber: "ORD-12359",
        customerName: "Kevin Taylor",
        items: 2,
        totalValue: 399.98,
        priority: "urgent",
        shippingMethod: "overnight",
        picked: false,
        packed: false,
      },
    ],
    createdDate: "2025-11-02T13:30:00",
    createdBy: "Admin",
    totalOrders: 2,
    totalItems: 3,
    totalValue: 899.97,
    priority: "high",
    pickListPrinted: false,
    packingSlipsPrinted: false,
  },
  {
    id: "BATCH-005",
    name: "US1028-01",
    status: "completed",
    warehouse: "US",
    orders: [
      {
        id: "13",
        orderNumber: "ORD-12340",
        customerName: "Mary Johnson",
        items: 1,
        totalValue: 119.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: true,
      },
      {
        id: "14",
        orderNumber: "ORD-12341",
        customerName: "Steve Miller",
        items: 2,
        totalValue: 229.98,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: true,
      },
      {
        id: "15",
        orderNumber: "ORD-12342",
        customerName: "Nancy White",
        items: 1,
        totalValue: 89.99,
        priority: "low",
        shippingMethod: "standard",
        picked: true,
        packed: true,
      },
      {
        id: "16",
        orderNumber: "ORD-12343",
        customerName: "Frank Harris",
        items: 3,
        totalValue: 359.97,
        priority: "normal",
        shippingMethod: "express",
        picked: true,
        packed: true,
      },
    ],
    createdDate: "2025-10-28T08:00:00",
    createdBy: "Sarah Wilson",
    assignedTo: "Maria Garcia",
    startedDate: "2025-10-28T08:30:00",
    completedDate: "2025-10-28T16:00:00",
    totalOrders: 4,
    totalItems: 7,
    totalValue: 799.93,
    priority: "normal",
    notes: "Completed ahead of schedule",
    pickListPrinted: true,
    packingSlipsPrinted: true,
  },
];

// Utility functions
export function getBatchesByStatus(status: Batch["status"]) {
  return mockBatches.filter(b => b.status === status);
}

export function getBatchesByWarehouse(warehouse: "US" | "VN") {
  return mockBatches.filter(b => b.warehouse === warehouse);
}

export function getActiveBatches() {
  return mockBatches.filter(b => 
    b.status === "open" || 
    b.status === "picking" || 
    b.status === "packing" ||
    b.status === "ready"
  );
}

export function getBatchProgress(batch: Batch): {
  pickedOrders: number;
  packedOrders: number;
  pickedItems: number;
  packedItems: number;
  percentComplete: number;
} {
  const pickedOrders = batch.orders.filter(o => o.picked).length;
  const packedOrders = batch.orders.filter(o => o.packed).length;
  const pickedItems = batch.orders.filter(o => o.picked).reduce((sum, o) => sum + o.items, 0);
  const packedItems = batch.orders.filter(o => o.packed).reduce((sum, o) => sum + o.items, 0);
  const percentComplete = Math.round((packedOrders / batch.totalOrders) * 100);

  return {
    pickedOrders,
    packedOrders,
    pickedItems,
    packedItems,
    percentComplete,
  };
}
