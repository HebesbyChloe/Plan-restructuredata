// Customize Order Extra Data - mapped by order number
// This file contains additional fields specific to customize orders
// Maps to orders with orderType: "customize" in orderBoardData.ts

export interface CustomizeOrderExtra {
  orderNumber: string;
  estDate?: string;
  customizeStatus: string;
  design3DStatus: string;
  design3DUpdatedDate?: string;
  design3DUpdatedBy?: string;
  materialStatus: string;
  materialUpdatedDate?: string;
  materialUpdatedBy?: string;
  productionStatus: string;
  productionUpdatedDate?: string;
  productionUpdatedBy?: string;
}

// Constants for Customize Order Status Fields
export const CUSTOMIZE_STATUS = {
  DESIGN_APPROVED: "Design Approved",
  PRODUCTION_READY: "Production Ready",
  IN_TRANSIT: "In Transit",
  READY_TO_SHIP: "Ready to Ship",
} as const;

export const DESIGN_3D_STATUS = {
  NOT_STARTED: "Not Started",
  PENDING_REVIEW: "Pending Review",
  APPROVED: "Approved",
  REVISION_NEEDED: "Revision Needed",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
} as const;

export const MATERIAL_STATUS = {
  NOT_ORDERED: "Not Ordered",
  ORDERED: "Ordered",
  IN_STOCK: "In Stock",
  PARTIAL: "Partial",
  BACKORDERED: "Backordered",
  RECEIVED: "Received",
} as const;

export const PRODUCTION_STATUS = {
  NOT_STARTED: "Not Started",
  DESIGN_APPROVAL: "Design Approval",
  PRODUCTION_START: "Production Start",
  IN_PROGRESS: "In Progress",
  QUALITY_CHECK: "Quality Check",
  COMPLETED: "Completed",
  READY_TO_SHIP: "Ready to Ship",
} as const;

// Sample data mapped by order number
export const customizeOrderExtraData: CustomizeOrderExtra[] = [
  {
    orderNumber: "555005163A",
    estDate: "Oct 18, 2025",
    customizeStatus: CUSTOMIZE_STATUS.READY_TO_SHIP,
    design3DStatus: DESIGN_3D_STATUS.APPROVED,
    design3DUpdatedDate: "Oct 12, 2025",
    design3DUpdatedBy: "Hai Lam",
    materialStatus: MATERIAL_STATUS.IN_STOCK,
    materialUpdatedDate: "Oct 13, 2025",
    materialUpdatedBy: "Hang Tran",
    productionStatus: PRODUCTION_STATUS.COMPLETED,
    productionUpdatedDate: "Oct 17, 2025",
    productionUpdatedBy: "Chuyet Vo",
  },
  {
    orderNumber: "555005170F",
    estDate: "Oct 25, 2025",
    customizeStatus: CUSTOMIZE_STATUS.DESIGN_APPROVED,
    design3DStatus: DESIGN_3D_STATUS.PENDING_REVIEW,
    design3DUpdatedDate: "Oct 22, 2025",
    design3DUpdatedBy: "Hai Lam",
    materialStatus: MATERIAL_STATUS.ORDERED,
    materialUpdatedDate: "Oct 23, 2025",
    materialUpdatedBy: "Hang Tran",
    productionStatus: PRODUCTION_STATUS.NOT_STARTED,
  },
  {
    orderNumber: "666021909B",
    estDate: "Nov 2, 2025",
    customizeStatus: CUSTOMIZE_STATUS.PRODUCTION_READY,
    design3DStatus: DESIGN_3D_STATUS.APPROVED,
    design3DUpdatedDate: "Oct 20, 2025",
    design3DUpdatedBy: "Le My Nguyen",
    materialStatus: MATERIAL_STATUS.RECEIVED,
    materialUpdatedDate: "Oct 28, 2025",
    materialUpdatedBy: "Hai Lam",
    productionStatus: PRODUCTION_STATUS.IN_PROGRESS,
    productionUpdatedDate: "Oct 29, 2025",
    productionUpdatedBy: "Chuyet Vo",
  },
  {
    orderNumber: "555005155B",
    estDate: "Nov 5, 2025",
    customizeStatus: CUSTOMIZE_STATUS.IN_TRANSIT,
    design3DStatus: DESIGN_3D_STATUS.COMPLETED,
    design3DUpdatedDate: "Oct 15, 2025",
    design3DUpdatedBy: "Hai Lam",
    materialStatus: MATERIAL_STATUS.IN_STOCK,
    materialUpdatedDate: "Oct 18, 2025",
    materialUpdatedBy: "Hang Tran",
    productionStatus: PRODUCTION_STATUS.READY_TO_SHIP,
    productionUpdatedDate: "Nov 1, 2025",
    productionUpdatedBy: "Le My Nguyen",
  },
  {
    orderNumber: "555005154T",
    estDate: "Nov 10, 2025",
    customizeStatus: CUSTOMIZE_STATUS.DESIGN_APPROVED,
    design3DStatus: DESIGN_3D_STATUS.IN_PROGRESS,
    design3DUpdatedDate: "Oct 26, 2025",
    design3DUpdatedBy: "Chuyet Vo",
    materialStatus: MATERIAL_STATUS.PARTIAL,
    materialUpdatedDate: "Oct 27, 2025",
    materialUpdatedBy: "Hang Tran",
    productionStatus: PRODUCTION_STATUS.DESIGN_APPROVAL,
    productionUpdatedDate: "Oct 28, 2025",
    productionUpdatedBy: "Hai Lam",
  },
  {
    orderNumber: "666021907B",
    estDate: "Nov 8, 2025",
    customizeStatus: CUSTOMIZE_STATUS.PRODUCTION_READY,
    design3DStatus: DESIGN_3D_STATUS.APPROVED,
    design3DUpdatedDate: "Oct 19, 2025",
    design3DUpdatedBy: "Le My Nguyen",
    materialStatus: MATERIAL_STATUS.IN_STOCK,
    materialUpdatedDate: "Oct 24, 2025",
    materialUpdatedBy: "Hang Tran",
    productionStatus: PRODUCTION_STATUS.QUALITY_CHECK,
    productionUpdatedDate: "Oct 30, 2025",
    productionUpdatedBy: "Chuyet Vo",
  },
  {
    orderNumber: "666021984S",
    estDate: "Nov 15, 2025",
    customizeStatus: CUSTOMIZE_STATUS.DESIGN_APPROVED,
    design3DStatus: DESIGN_3D_STATUS.REVISION_NEEDED,
    design3DUpdatedDate: "Oct 28, 2025",
    design3DUpdatedBy: "Hai Lam",
    materialStatus: MATERIAL_STATUS.BACKORDERED,
    materialUpdatedDate: "Oct 29, 2025",
    materialUpdatedBy: "Hang Tran",
    productionStatus: PRODUCTION_STATUS.NOT_STARTED,
  },
];

// Helper function to get customize order extra data by order number
export const getCustomizeOrderExtraByOrderNumber = (
  orderNumber: string
): CustomizeOrderExtra | undefined => {
  return customizeOrderExtraData.find(
    (extra) => extra.orderNumber === orderNumber
  );
};

// Helper function to check if order number has customize extra data
export const hasCustomizeOrderExtra = (orderNumber: string): boolean => {
  return customizeOrderExtraData.some(
    (extra) => extra.orderNumber === orderNumber
  );
};
