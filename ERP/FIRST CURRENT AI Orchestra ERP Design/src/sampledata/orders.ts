export interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  customerEmail: string;
  items: number;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "paid" | "pending" | "refunded";
  shippingMethod: string;
  trackingNumber?: string;
  orderDate: string;
  estimatedDelivery?: string;
  source: "website" | "instagram" | "facebook" | "marketplace";
  assignedTo?: string;
  notes?: string;
}

export const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-51089",
    customer: "Vu Long",
    customerEmail: "vu.long@email.com",
    items: 1,
    total: 150.00,
    status: "delivered",
    paymentStatus: "paid",
    shippingMethod: "Express",
    trackingNumber: "TRK-12345-VN",
    orderDate: "2025-09-29",
    estimatedDelivery: "2025-10-02",
    source: "website",
    assignedTo: "Michael Tran",
    notes: "VIP customer - priority shipping",
  },
  {
    id: "2",
    orderNumber: "ORD-51083",
    customer: "Tran Nam",
    customerEmail: "tran.nam@email.com",
    items: 1,
    total: 155.00,
    status: "pending",
    paymentStatus: "pending",
    shippingMethod: "Standard",
    orderDate: "2025-09-25",
    estimatedDelivery: "2025-10-05",
    source: "instagram",
    assignedTo: "Sarah Nguyen",
    notes: "Customer negotiating price",
  },
  {
    id: "3",
    orderNumber: "ORD-51081",
    customer: "Xuan Xuan",
    customerEmail: "xuan.xuan@email.com",
    items: 1,
    total: 118.00,
    status: "processing",
    paymentStatus: "paid",
    shippingMethod: "Standard",
    orderDate: "2025-10-01",
    estimatedDelivery: "2025-10-08",
    source: "facebook",
    assignedTo: "Sarah Nguyen",
    notes: "Waiting for bracelet size confirmation",
  },
  {
    id: "4",
    orderNumber: "ORD-51090",
    customer: "Le Hoa",
    customerEmail: "le.hoa@email.com",
    items: 2,
    total: 398.00,
    status: "shipped",
    paymentStatus: "paid",
    shippingMethod: "Express",
    trackingNumber: "TRK-12346-VN",
    orderDate: "2025-09-30",
    estimatedDelivery: "2025-10-03",
    source: "website",
    assignedTo: "Michael Tran",
  },
  {
    id: "5",
    orderNumber: "ORD-51078",
    customer: "Nguyen Anh",
    customerEmail: "nguyen.anh@email.com",
    items: 1,
    total: 145.00,
    status: "pending",
    paymentStatus: "pending",
    shippingMethod: "Standard",
    orderDate: "2025-09-28",
    source: "instagram",
    assignedTo: "Sarah Nguyen",
    notes: "Customer considering purchase",
  },
];
