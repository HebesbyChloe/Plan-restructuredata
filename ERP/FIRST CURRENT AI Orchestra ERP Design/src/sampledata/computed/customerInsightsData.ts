// Customer Insights Page Data

export const customerMetrics = {
  totalCustomers: 1750,
  customerGrowth: 12,
  customersAdded: 210,
  avgLifetimeValue: 842,
  lifetimeValueGrowth: 8,
  lifetimeValueIncrease: 62,
  newCustomers: 298,
  newCustomerGrowth: 18,
  retentionRate: 78,
  retentionChange: -2,
};

export const customerSegmentData = [
  { name: "VIP", value: 234, color: "#4B6BFB" },
  { name: "Active", value: 567, color: "#27AE60" },
  { name: "At Risk", value: 189, color: "#F2C94C" },
  { name: "Dormant", value: 145, color: "#EB5757" },
  { name: "New", value: 298, color: "#9B51E0" },
];

export const monthlyTrendData = [
  { month: "Jan", customers: 1200, revenue: 85000, avgValue: 71 },
  { month: "Feb", customers: 1280, revenue: 92000, avgValue: 72 },
  { month: "Mar", customers: 1350, revenue: 98000, avgValue: 73 },
  { month: "Apr", customers: 1290, revenue: 94000, avgValue: 73 },
  { month: "May", customers: 1420, revenue: 105000, avgValue: 74 },
  { month: "Jun", customers: 1510, revenue: 118000, avgValue: 78 },
  { month: "Jul", customers: 1580, revenue: 125000, avgValue: 79 },
  { month: "Aug", customers: 1620, revenue: 132000, avgValue: 81 },
  { month: "Sep", customers: 1680, revenue: 140000, avgValue: 83 },
  { month: "Oct", customers: 1750, revenue: 148000, avgValue: 85 },
];

export const purchaseFrequencyData = [
  { frequency: "1x", customers: 420 },
  { frequency: "2-3x", customers: 580 },
  { frequency: "4-6x", customers: 340 },
  { frequency: "7-10x", customers: 210 },
  { frequency: "10+", customers: 183 },
];

export const customerJourneyData = [
  { stage: "Awareness", count: 2400 },
  { stage: "Consideration", count: 1800 },
  { stage: "Purchase", count: 1200 },
  { stage: "Retention", count: 890 },
  { stage: "Advocacy", count: 560 },
];

export const behaviorInsights = [
  {
    id: 1,
    title: "Peak Shopping Hours",
    insight: "Most customers shop between 8-10 PM",
    metric: "67%",
    trend: "up" as const,
  },
  {
    id: 2,
    title: "Average Session Time",
    insight: "Users spend 12.5 mins per visit",
    metric: "12.5m",
    trend: "up" as const,
  },
  {
    id: 3,
    title: "Cart Abandonment",
    insight: "28% of carts are abandoned",
    metric: "28%",
    trend: "down" as const,
  },
  {
    id: 4,
    title: "Repeat Purchase Rate",
    insight: "45% customers make repeat purchases",
    metric: "45%",
    trend: "up" as const,
  },
];

export const topProductCategories = [
  { category: "Bracelets", sales: 1420, growth: 12 },
  { category: "Necklaces", sales: 980, growth: 8 },
  { category: "Rings", sales: 756, growth: -3 },
  { category: "Earrings", sales: 642, growth: 15 },
  { category: "Anklets", sales: 423, growth: 5 },
];
