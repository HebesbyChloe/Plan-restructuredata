// Computed metrics for dashboard overviews (Global Dashboard, HomePage, etc.)

export interface DashboardKPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon?: string;
  color?: string;
}

export interface QuickStat {
  title: string;
  value: number;
  unit?: string;
  change: number;
  period: string;
}

// Main dashboard KPIs
export const mainDashboardKPIs: DashboardKPI[] = [
  {
    label: "Total Revenue",
    value: "$125,430",
    change: 12.5,
    trend: "up",
    icon: "DollarSign",
    color: "#10B981",
  },
  {
    label: "Active Orders",
    value: 156,
    change: 8.3,
    trend: "up",
    icon: "ShoppingCart",
    color: "#4B6BFB",
  },
  {
    label: "New Customers",
    value: 89,
    change: 15.7,
    trend: "up",
    icon: "Users",
    color: "#8B5CF6",
  },
  {
    label: "Conversion Rate",
    value: "28.5%",
    change: 3.2,
    trend: "up",
    icon: "TrendingUp",
    color: "#EC4899",
  },
];

// Quick stats for role-specific dashboards
export const salesDashboardStats: QuickStat[] = [
  { title: "Today's Revenue", value: 8450, unit: "$", change: 12.5, period: "vs yesterday" },
  { title: "New Leads", value: 23, change: 8.3, period: "vs yesterday" },
  { title: "Contacted", value: 45, change: 15.2, period: "vs yesterday" },
  { title: "Conversion Rate", value: 28.5, unit: "%", change: 5.6, period: "vs last week" },
];

export const marketingDashboardStats: QuickStat[] = [
  { title: "Campaign ROI", value: 325, unit: "%", change: 18.5, period: "vs last month" },
  { title: "Ad Impressions", value: 125000, change: 22.3, period: "vs last week" },
  { title: "Click Rate", value: 4.2, unit: "%", change: 0.8, period: "vs last week" },
  { title: "Lead Cost", value: 12.5, unit: "$", change: -8.5, period: "vs last month" },
];

export const operationDashboardStats: QuickStat[] = [
  { title: "Orders Processed", value: 156, change: 12.0, period: "vs yesterday" },
  { title: "Pending Shipments", value: 34, change: -5.2, period: "vs yesterday" },
  { title: "Return Rate", value: 2.1, unit: "%", change: -0.3, period: "vs last week" },
  { title: "Avg Fulfillment", value: 1.8, unit: " days", change: -12.5, period: "vs last week" },
];

// Recent activity feed
export const recentActivities = [
  {
    id: "1",
    type: "order",
    message: "New order #51089 from Vu Long",
    timestamp: "2 minutes ago",
    icon: "ShoppingCart",
    color: "#10B981",
  },
  {
    id: "2",
    type: "customer",
    message: "New customer inquiry from Le Hoa",
    timestamp: "15 minutes ago",
    icon: "MessageSquare",
    color: "#4B6BFB",
  },
  {
    id: "3",
    type: "payment",
    message: "Payment received for order #51081",
    timestamp: "1 hour ago",
    icon: "DollarSign",
    color: "#10B981",
  },
  {
    id: "4",
    type: "shipment",
    message: "Order #51078 shipped via Express",
    timestamp: "2 hours ago",
    icon: "Truck",
    color: "#8B5CF6",
  },
  {
    id: "5",
    type: "review",
    message: "New 5-star review from Nguyen Anh",
    timestamp: "3 hours ago",
    icon: "Star",
    color: "#F59E0B",
  },
];

// Alerts and notifications
export const systemAlerts = [
  {
    id: "1",
    type: "warning",
    title: "Low Stock Alert",
    message: "Golden Lotus Bracelet is running low (5 units left)",
    priority: "high",
    timestamp: "30 minutes ago",
  },
  {
    id: "2",
    type: "info",
    title: "Campaign Performance",
    message: "Summer Sale campaign exceeded target by 25%",
    priority: "normal",
    timestamp: "2 hours ago",
  },
  {
    id: "3",
    type: "urgent",
    title: "Payment Issue",
    message: "Order #51083 payment pending for 48+ hours",
    priority: "urgent",
    timestamp: "4 hours ago",
  },
];

// Top performing products (for dashboards)
export const topPerformingProducts = [
  { id: "1", name: "Golden Lotus Bracelet", sales: 145, revenue: 11595, trend: "up" },
  { id: "2", name: "Rose Quartz Ring", sales: 98, revenue: 12734, trend: "up" },
  { id: "3", name: "Black Obsidian Bracelet", sales: 87, revenue: 6953, trend: "neutral" },
  { id: "4", name: "Moonlight Pearl Necklace", sales: 76, revenue: 9879, trend: "up" },
  { id: "5", name: "Jade Protection Pendant", sales: 65, revenue: 5525, trend: "down" },
];
