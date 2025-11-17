export interface Task {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in_progress" | "review" | "completed";
  priority: "low" | "medium" | "high" | "urgent";
  assignedTo: string;
  assignedBy: string;
  dueDate: string;
  createdDate: string;
  category: "sales" | "marketing" | "operations" | "admin" | "product";
  tags: string[];
  relatedTo?: {
    type: "customer" | "order" | "campaign" | "product";
    id: string;
    name: string;
  };
}

export const mockTasks: Task[] = [
  {
    id: "1",
    title: "Follow up with Nguyen Anh about Citrine bracelet",
    description: "Customer is considering purchase, need to follow up within 24h",
    status: "todo",
    priority: "high",
    assignedTo: "Sarah Nguyen",
    assignedBy: "System",
    dueDate: "2025-10-01",
    createdDate: "2025-09-30",
    category: "sales",
    tags: ["follow-up", "high-potential"],
    relatedTo: {
      type: "customer",
      id: "1",
      name: "Nguyen Anh",
    },
  },
  {
    id: "2",
    title: "Send product catalog to Le Hoa",
    description: "Customer requested detailed catalog for Rose Quartz collection",
    status: "in_progress",
    priority: "high",
    assignedTo: "Michael Tran",
    assignedBy: "System",
    dueDate: "2025-09-30",
    createdDate: "2025-09-29",
    category: "sales",
    tags: ["catalog", "new-customer"],
    relatedTo: {
      type: "customer",
      id: "2",
      name: "Le Hoa",
    },
  },
  {
    id: "3",
    title: "Escalate pricing issue for Tran Nam",
    description: "Customer needs manager approval for price adjustment",
    status: "todo",
    priority: "urgent",
    assignedTo: "David Chen",
    assignedBy: "Sarah Nguyen",
    dueDate: "2025-09-29",
    createdDate: "2025-09-28",
    category: "sales",
    tags: ["escalation", "pricing"],
    relatedTo: {
      type: "customer",
      id: "3",
      name: "Tran Nam",
    },
  },
  {
    id: "4",
    title: "Get bracelet size from Xuan Xuan",
    description: "Order is paid but need size confirmation to complete",
    status: "todo",
    priority: "high",
    assignedTo: "Sarah Nguyen",
    assignedBy: "System",
    dueDate: "2025-10-02",
    createdDate: "2025-10-01",
    category: "operations",
    tags: ["order-completion", "size"],
    relatedTo: {
      type: "order",
      id: "3",
      name: "ORD-51081",
    },
  },
  {
    id: "5",
    title: "Review Summer Sale campaign performance",
    description: "Analyze ROI and prepare report for next campaign",
    status: "in_progress",
    priority: "medium",
    assignedTo: "Marketing Team",
    assignedBy: "Manager",
    dueDate: "2025-10-05",
    createdDate: "2025-09-28",
    category: "marketing",
    tags: ["analytics", "campaign"],
    relatedTo: {
      type: "campaign",
      id: "1",
      name: "Summer Sale 2025",
    },
  },
  {
    id: "6",
    title: "Update product images for Golden Lotus collection",
    description: "Replace old product photos with new professional shots",
    status: "completed",
    priority: "medium",
    assignedTo: "Product Team",
    assignedBy: "Manager",
    dueDate: "2025-09-25",
    createdDate: "2025-09-20",
    category: "product",
    tags: ["images", "content"],
  },
  {
    id: "7",
    title: "Restock Black Obsidian bracelets",
    description: "Low stock alert - only 5 units remaining",
    status: "todo",
    priority: "high",
    assignedTo: "Operations Team",
    assignedBy: "System",
    dueDate: "2025-10-03",
    createdDate: "2025-10-01",
    category: "operations",
    tags: ["inventory", "restock"],
    relatedTo: {
      type: "product",
      id: "4",
      name: "Black Obsidian Protection Bracelet",
    },
  },
];
