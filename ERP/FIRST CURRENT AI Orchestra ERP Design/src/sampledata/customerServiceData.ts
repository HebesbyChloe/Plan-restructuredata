// Customer Service Board Sample Data

export interface CustomerServiceTicket {
  id: string;
  customer: {
    name: string;
    tier: string;
    assignedTo: string;
  };
  orderId?: string; // Optional - ticket may not have an order initially
  orderDate?: string; // Optional - order creation date
  issueType: string; // Issue Type (was category)
  issueDetail: string; // Issue Detail (was subject)
  priority: string;
  status: string; // Service Status
  createdDate: string;
  lastUpdate: string;
  updatedBy: string; // Person who last updated
  messages: number;
  satisfaction?: string; // Customer satisfaction rating
}

export const mockCustomerServiceTickets: CustomerServiceTicket[] = [
  {
    id: "CSHC0001",
    customer: { name: "Ha Tu Tran", tier: "VIP", assignedTo: "Hang Tran" },
    orderId: "666021905",
    orderDate: "Oct 11, 2025",
    issueType: "Quality",
    issueDetail: "Product Quality Issue - Item received damaged",
    priority: "High",
    status: "Open",
    createdDate: "Oct 12 2025",
    lastUpdate: "Oct 12 2025",
    updatedBy: "Hang Tran",
    messages: 3,
    satisfaction: "Good",
  },
  {
    id: "CSRM0002",
    customer: { name: "Duy Vo", tier: "VVIP", assignedTo: "Ngoc Vo" },
    orderId: "666021904",
    orderDate: "Oct 8, 2025",
    issueType: "Shipping",
    issueDetail: "Shipping Delay - Package not arrived after 10 days",
    priority: "Medium",
    status: "In Progress",
    createdDate: "Oct 11 2025",
    lastUpdate: "Oct 12 2025",
    updatedBy: "Ngoc Vo",
    messages: 5,
    satisfaction: "Excellent",
  },
  {
    id: "CSHC0003",
    customer: { name: "Hai Lam", tier: "VIP", assignedTo: "Hai Lam" },
    orderId: "555005163A",
    orderDate: "Oct 5, 2025",
    issueType: "General",
    issueDetail: "Product Information Request - Need specifications",
    priority: "Low",
    status: "Resolved",
    createdDate: "Oct 10 2025",
    lastUpdate: "Oct 11 2025",
    updatedBy: "Hai Lam",
    messages: 2,
    satisfaction: "Excellent",
  },
  {
    id: "CSHC0004",
    customer: { name: "Tuyet Le", tier: "Repeat", assignedTo: "Hoang My" },
    orderId: "555005163S",
    orderDate: "Oct 10, 2025",
    issueType: "Payment",
    issueDetail: "Payment Issue - Credit card declined",
    priority: "High",
    status: "Open",
    createdDate: "Oct 12 2025",
    lastUpdate: "Oct 12 2025",
    updatedBy: "Hoang My",
    messages: 1,
    satisfaction: "Average",
  },
  {
    id: "CSRM0005",
    customer: { name: "Arabella Vu...", tier: "VVIP", assignedTo: "Laura Sale" },
    orderId: "555005163Z",
    orderDate: "Oct 9, 2025",
    issueType: "Custom Order",
    issueDetail: "Custom Order Status - Request for design update",
    priority: "Medium",
    status: "In Progress",
    createdDate: "Oct 11 2025",
    lastUpdate: "Oct 12 2025",
    updatedBy: "Laura Sale",
    messages: 4,
    satisfaction: "Good",
  },
  {
    id: "CSHC0006",
    customer: { name: "John Smith", tier: "New", assignedTo: "Hang Tran" },
    issueType: "General",
    issueDetail: "General Inquiry - Product availability question",
    priority: "Low",
    status: "Open",
    createdDate: "Oct 13 2025",
    lastUpdate: "Oct 13 2025",
    updatedBy: "Hang Tran",
    messages: 1,
    satisfaction: "Poor",
  },
];

export const CUSTOMER_SERVICE_STAFF = ["Hang Tran", "Ngoc Vo", "Hai Lam", "Hoang My", "Laura Sale"];
