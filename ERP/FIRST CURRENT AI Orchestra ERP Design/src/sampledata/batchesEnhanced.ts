// Enhanced Batch Data Structure
// Links to: Shipments, Orders
// Batches group shipments together for efficient picking and packing

export interface BatchShipment {
  id: string;
  shipmentNumber: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  items: number;
  totalValue: number;
  priority: "low" | "normal" | "high" | "urgent";
  shippingMethod: "standard" | "express" | "overnight" | "international";
  picked: boolean;
  packed: boolean;
  labelPrinted: boolean;
}

export interface BatchEnhanced {
  id: string;
  batchNumber: string;
  name: string;
  // Status
  status: "draft" | "open" | "picking" | "packing" | "ready" | "shipped" | "completed" | "cancelled";
  // Warehouse
  warehouse: "US" | "VN";
  warehouseZone?: string;
  // Shipments in this batch
  shipments: BatchShipment[];
  // Metrics
  totalShipments: number;
  totalOrders: number;
  totalItems: number;
  totalValue: number;
  totalWeight: number; // in kg
  // Progress tracking
  pickedShipments: number;
  packedShipments: number;
  pickedItems: number;
  packedItems: number;
  percentComplete: number;
  // Dates
  createdDate: string;
  startedDate?: string;
  pickCompletedDate?: string;
  packCompletedDate?: string;
  shippedDate?: string;
  completedDate?: string;
  targetCompletionDate?: string;
  // Team
  createdBy: string;
  assignedTo?: string;
  assignedTeam?: string[];
  pickerIds?: string[];
  packerIds?: string[];
  // Priority & Type
  priority: "low" | "normal" | "high" | "urgent";
  batchType: "standard" | "express" | "same-day" | "international" | "mixed";
  // Documents
  pickListPrinted: boolean;
  packingSlipsPrinted: boolean;
  manifestPrinted: boolean;
  // Notes
  notes?: string;
  internalNotes?: string;
  pickingInstructions?: string;
  packingInstructions?: string;
}

export const mockBatchesEnhanced: BatchEnhanced[] = [
  {
    id: "BATCH-001",
    batchNumber: "BATCH-001",
    name: "US1101-01",
    status: "completed",
    warehouse: "US",
    warehouseZone: "Zone-A",
    shipments: [
      {
        id: "SHP-001",
        shipmentNumber: "SHP-001",
        orderId: "ORD-001",
        orderNumber: "ORD-12345",
        customerName: "Sarah Johnson",
        items: 1,
        totalValue: 99.69,
        priority: "high",
        shippingMethod: "express",
        picked: true,
        packed: true,
        labelPrinted: true,
      },
      {
        id: "SHP-002",
        shipmentNumber: "SHP-002",
        orderId: "ORD-003",
        orderNumber: "ORD-12347",
        customerName: "Emily Rodriguez",
        items: 1,
        totalValue: 199.38,
        priority: "urgent",
        shippingMethod: "overnight",
        picked: true,
        packed: true,
        labelPrinted: true,
      },
    ],
    totalShipments: 2,
    totalOrders: 2,
    totalItems: 2,
    totalValue: 299.07,
    totalWeight: 1.3,
    pickedShipments: 2,
    packedShipments: 2,
    pickedItems: 2,
    packedItems: 2,
    percentComplete: 100,
    createdDate: "2025-11-01T08:00:00",
    startedDate: "2025-11-01T08:30:00",
    pickCompletedDate: "2025-11-01T12:00:00",
    packCompletedDate: "2025-11-01T14:30:00",
    shippedDate: "2025-11-01T16:00:00",
    completedDate: "2025-11-03T16:30:00",
    targetCompletionDate: "2025-11-01T16:00:00",
    createdBy: "John Smith",
    assignedTo: "Maria Garcia",
    assignedTeam: ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Lee"],
    pickerIds: ["John Doe", "Mike Johnson"],
    packerIds: ["Jane Smith", "Sarah Lee"],
    priority: "high",
    batchType: "express",
    pickListPrinted: true,
    packingSlipsPrinted: true,
    manifestPrinted: true,
    notes: "All express orders - priority handling",
  },
  {
    id: "BATCH-002",
    batchNumber: "BATCH-002",
    name: "US1102-01",
    status: "packing",
    warehouse: "US",
    warehouseZone: "Zone-B",
    shipments: [
      {
        id: "SHP-003",
        shipmentNumber: "SHP-003",
        orderId: "ORD-002",
        orderNumber: "ORD-12346",
        customerName: "Michael Chen",
        items: 2,
        totalValue: 206.97,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: false,
        labelPrinted: false,
      },
      {
        id: "SHP-004",
        shipmentNumber: "SHP-004",
        orderId: "ORD-005",
        orderNumber: "ORD-12349",
        customerName: "David Thompson",
        items: 2,
        totalValue: 157.47,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: true,
        labelPrinted: false,
      },
      {
        id: "SHP-007",
        shipmentNumber: "SHP-007",
        orderId: "ORD-008",
        orderNumber: "ORD-12352",
        customerName: "Lisa Anderson",
        items: 1,
        totalValue: 129.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: false,
        labelPrinted: false,
      },
    ],
    totalShipments: 3,
    totalOrders: 3,
    totalItems: 5,
    totalValue: 494.43,
    totalWeight: 1.2,
    pickedShipments: 3,
    packedShipments: 1,
    pickedItems: 5,
    packedItems: 2,
    percentComplete: 40,
    createdDate: "2025-11-02T09:00:00",
    startedDate: "2025-11-02T09:15:00",
    pickCompletedDate: "2025-11-02T13:10:00",
    targetCompletionDate: "2025-11-02T16:00:00",
    createdBy: "Sarah Wilson",
    assignedTo: "Tom Martinez",
    assignedTeam: ["Tom Wilson", "Emma Davis", "Alice Brown", "Bob White"],
    pickerIds: ["Tom Wilson", "Alice Brown", "Emma Davis"],
    packerIds: ["Bob White"],
    priority: "normal",
    batchType: "standard",
    pickListPrinted: true,
    packingSlipsPrinted: false,
    manifestPrinted: false,
    packingInstructions: "Standard packing - use appropriate box sizes",
  },
  {
    id: "BATCH-003",
    batchNumber: "BATCH-003",
    name: "VN1028-01",
    status: "completed",
    warehouse: "VN",
    warehouseZone: "Zone-VN-A",
    shipments: [
      {
        id: "SHP-008",
        shipmentNumber: "SHP-008",
        orderId: "ORD-004",
        orderNumber: "ORD-12348",
        customerName: "Nguyen Van A",
        items: 1,
        totalValue: 214.99,
        priority: "normal",
        shippingMethod: "standard",
        picked: true,
        packed: true,
        labelPrinted: true,
      },
    ],
    totalShipments: 1,
    totalOrders: 1,
    totalItems: 1,
    totalValue: 214.99,
    totalWeight: 0.3,
    pickedShipments: 1,
    packedShipments: 1,
    pickedItems: 1,
    packedItems: 1,
    percentComplete: 100,
    createdDate: "2025-10-28T10:00:00",
    startedDate: "2025-10-28T10:30:00",
    pickCompletedDate: "2025-10-28T11:00:00",
    packCompletedDate: "2025-10-28T13:00:00",
    shippedDate: "2025-10-28T15:00:00",
    completedDate: "2025-10-30T11:00:00",
    targetCompletionDate: "2025-10-28T16:00:00",
    createdBy: "Pham Van D",
    assignedTo: "Nguyen Thi E",
    assignedTeam: ["Nguyen Thi E", "Tran Van F"],
    pickerIds: ["Nguyen Thi E"],
    packerIds: ["Tran Van F"],
    priority: "normal",
    batchType: "standard",
    pickListPrinted: true,
    packingSlipsPrinted: true,
    manifestPrinted: true,
    notes: "All items packed and ready for carrier pickup",
  },
  {
    id: "BATCH-004",
    batchNumber: "BATCH-004",
    name: "US1102-02",
    status: "open",
    warehouse: "US",
    warehouseZone: "Zone-A",
    shipments: [],
    totalShipments: 0,
    totalOrders: 0,
    totalItems: 0,
    totalValue: 0,
    totalWeight: 0,
    pickedShipments: 0,
    packedShipments: 0,
    pickedItems: 0,
    packedItems: 0,
    percentComplete: 0,
    createdDate: "2025-11-02T13:30:00",
    targetCompletionDate: "2025-11-02T18:00:00",
    createdBy: "Admin",
    priority: "urgent",
    batchType: "same-day",
    pickListPrinted: false,
    packingSlipsPrinted: false,
    manifestPrinted: false,
    notes: "Same-day delivery orders - urgent processing required",
    pickingInstructions: "Double-check all items before packing",
  },
  {
    id: "BATCH-005",
    batchNumber: "BATCH-005",
    name: "US1103-01",
    status: "picking",
    warehouse: "US",
    warehouseZone: "Zone-C",
    shipments: [
      {
        id: "SHP-009",
        shipmentNumber: "SHP-009",
        orderId: "ORD-009",
        orderNumber: "ORD-12353",
        customerName: "James Wilson",
        items: 3,
        totalValue: 459.97,
        priority: "normal",
        shippingMethod: "international",
        picked: false,
        packed: false,
        labelPrinted: false,
      },
    ],
    totalShipments: 1,
    totalOrders: 1,
    totalItems: 3,
    totalValue: 459.97,
    totalWeight: 1.5,
    pickedShipments: 0,
    packedShipments: 0,
    pickedItems: 0,
    packedItems: 0,
    percentComplete: 0,
    createdDate: "2025-11-03T10:00:00",
    startedDate: "2025-11-03T10:30:00",
    targetCompletionDate: "2025-11-03T15:00:00",
    createdBy: "Lisa Chang",
    assignedTo: "Robert Lee",
    priority: "normal",
    batchType: "international",
    pickListPrinted: true,
    packingSlipsPrinted: false,
    manifestPrinted: false,
    pickingInstructions: "Verify customs documentation for all items",
    packingInstructions: "Use international shipping boxes and include customs forms",
  },
];

// Utility functions
export function getBatchesByStatus(status: BatchEnhanced["status"]): BatchEnhanced[] {
  return mockBatchesEnhanced.filter(b => b.status === status);
}

export function getBatchesByWarehouse(warehouse: "US" | "VN"): BatchEnhanced[] {
  return mockBatchesEnhanced.filter(b => b.warehouse === warehouse);
}

export function getActiveBatches(): BatchEnhanced[] {
  return mockBatchesEnhanced.filter(b => 
    b.status === "open" || 
    b.status === "picking" || 
    b.status === "packing" || 
    b.status === "ready"
  );
}

export function getBatchProgress(batch: BatchEnhanced): {
  pickedShipments: number;
  packedShipments: number;
  pickedItems: number;
  packedItems: number;
  percentComplete: number;
} {
  const pickedShipments = batch.shipments.filter(s => s.picked).length;
  const packedShipments = batch.shipments.filter(s => s.packed).length;
  const pickedItems = batch.shipments.filter(s => s.picked).reduce((sum, s) => sum + s.items, 0);
  const packedItems = batch.shipments.filter(s => s.packed).reduce((sum, s) => sum + s.items, 0);
  const percentComplete = batch.totalShipments > 0 
    ? Math.round((packedShipments / batch.totalShipments) * 100) 
    : 0;

  return {
    pickedShipments,
    packedShipments,
    pickedItems,
    packedItems,
    percentComplete,
  };
}
