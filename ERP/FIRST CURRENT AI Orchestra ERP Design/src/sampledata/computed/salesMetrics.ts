// Computed metrics for sales performance and team analytics

export interface SalesKPI {
  id: string;
  title: string;
  value: number;
  goal: number;
  icon: string;
  color: string;
  trend: number[];
  change: number;
}

export interface TeamMemberPerformance {
  name: string;
  revenue: number;
  goal: number;
  newLeads: number;
  potential: number;
  highPotential: number;
  converted: number;
  newCustomerPercent: number;
  returningCustomerPercent: number;
}

export interface BrandPerformance {
  total: TeamMemberPerformance[];
  hebes: TeamMemberPerformance[];
  ritamie: TeamMemberPerformance[];
  livestream: TeamMemberPerformance[];
}

export interface ShiftReport {
  id: string;
  date: string;
  shift: string;
  name: string;
  revenue: number;
  firstOrders: number;
  cartSent: number;
  potential: number;
  newLeads: number;
  contacted: number;
  messages: number;
  status: "submitted" | "pending";
}

// Daily KPI data
export const dailySalesKPIs: SalesKPI[] = [
  {
    id: "revenue",
    title: "Revenue",
    value: 8450,
    goal: 10000,
    icon: "DollarSign",
    color: "#8B5CF6",
    trend: [6000, 6500, 7200, 7800, 8000, 8200, 8450],
    change: 12.5,
  },
  {
    id: "newLeads",
    title: "New Leads",
    value: 23,
    goal: 30,
    icon: "UserPlus",
    color: "#4B6BFB",
    trend: [15, 18, 20, 19, 21, 22, 23],
    change: 8.3,
  },
  {
    id: "contacted",
    title: "Contacted",
    value: 45,
    goal: 50,
    icon: "Phone",
    color: "#10B981",
    trend: [30, 35, 38, 40, 42, 44, 45],
    change: 15.2,
  },
  {
    id: "messages",
    title: "Messages Sent",
    value: 127,
    goal: 150,
    icon: "MessageSquare",
    color: "#9B51E0",
    trend: [90, 95, 105, 110, 115, 120, 127],
    change: 18.7,
  },
  {
    id: "cartSent",
    title: "Cart Sent",
    value: 34,
    goal: 40,
    icon: "ShoppingCart",
    color: "#EC4899",
    trend: [20, 24, 28, 30, 32, 33, 34],
    change: 21.4,
  },
  {
    id: "conversion",
    title: "Conversion Rate",
    value: 28.5,
    goal: 30,
    icon: "Target",
    color: "#10B981",
    trend: [22, 24, 25, 26, 27, 28, 28.5],
    change: 5.6,
  },
];

// Team performance by brand
export const teamPerformanceByBrand: BrandPerformance = {
  total: [
    { name: "Sarah Chen", revenue: 15200, goal: 12000, newLeads: 85, potential: 62, highPotential: 42, converted: 35, newCustomerPercent: 65, returningCustomerPercent: 35 },
    { name: "Mike Johnson", revenue: 14800, goal: 12000, newLeads: 78, potential: 58, highPotential: 38, converted: 32, newCustomerPercent: 58, returningCustomerPercent: 42 },
    { name: "Emily Davis", revenue: 13900, goal: 12000, newLeads: 74, potential: 55, highPotential: 36, converted: 30, newCustomerPercent: 62, returningCustomerPercent: 38 },
    { name: "Alex Kim", revenue: 12500, goal: 12000, newLeads: 70, potential: 48, highPotential: 32, converted: 28, newCustomerPercent: 55, returningCustomerPercent: 45 },
    { name: "John Smith", revenue: 11800, goal: 12000, newLeads: 68, potential: 46, highPotential: 30, converted: 26, newCustomerPercent: 60, returningCustomerPercent: 40 },
    { name: "Lisa Wang", revenue: 10200, goal: 12000, newLeads: 62, potential: 42, highPotential: 28, converted: 24, newCustomerPercent: 52, returningCustomerPercent: 48 },
    { name: "Tom Brown", revenue: 9800, goal: 12000, newLeads: 58, potential: 38, highPotential: 25, converted: 22, newCustomerPercent: 48, returningCustomerPercent: 52 },
    { name: "Anna Lee", revenue: 8900, goal: 12000, newLeads: 55, potential: 36, highPotential: 24, converted: 20, newCustomerPercent: 45, returningCustomerPercent: 55 },
  ],
  hebes: [
    { name: "Sarah Chen", revenue: 8200, goal: 8000, newLeads: 52, potential: 38, highPotential: 26, converted: 22, newCustomerPercent: 68, returningCustomerPercent: 32 },
    { name: "Emily Davis", revenue: 7900, goal: 8000, newLeads: 48, potential: 35, highPotential: 24, converted: 20, newCustomerPercent: 65, returningCustomerPercent: 35 },
    { name: "Lisa Wang", revenue: 6800, goal: 8000, newLeads: 44, potential: 32, highPotential: 22, converted: 18, newCustomerPercent: 58, returningCustomerPercent: 42 },
    { name: "Mike Johnson", revenue: 6500, goal: 8000, newLeads: 42, potential: 30, highPotential: 20, converted: 17, newCustomerPercent: 55, returningCustomerPercent: 45 },
    { name: "Tom Brown", revenue: 5200, goal: 8000, newLeads: 38, potential: 26, highPotential: 18, converted: 15, newCustomerPercent: 50, returningCustomerPercent: 50 },
  ],
  ritamie: [
    { name: "Mike Johnson", revenue: 5200, goal: 5000, newLeads: 46, potential: 34, highPotential: 22, converted: 18, newCustomerPercent: 60, returningCustomerPercent: 40 },
    { name: "Alex Kim", revenue: 4800, goal: 5000, newLeads: 42, potential: 30, highPotential: 20, converted: 16, newCustomerPercent: 55, returningCustomerPercent: 45 },
    { name: "John Smith", revenue: 4500, goal: 5000, newLeads: 40, potential: 28, highPotential: 18, converted: 15, newCustomerPercent: 58, returningCustomerPercent: 42 },
    { name: "Anna Lee", revenue: 3900, goal: 5000, newLeads: 36, potential: 24, highPotential: 16, converted: 13, newCustomerPercent: 48, returningCustomerPercent: 52 },
    { name: "Tom Brown", revenue: 3200, goal: 5000, newLeads: 32, potential: 22, highPotential: 14, converted: 12, newCustomerPercent: 45, returningCustomerPercent: 55 },
  ],
  livestream: [
    { name: "Sarah Chen", revenue: 4500, goal: 4000, newLeads: 58, potential: 42, highPotential: 28, converted: 25, newCustomerPercent: 72, returningCustomerPercent: 28 },
    { name: "Emily Davis", revenue: 3800, goal: 4000, newLeads: 52, potential: 38, highPotential: 24, converted: 21, newCustomerPercent: 68, returningCustomerPercent: 32 },
    { name: "Lisa Wang", revenue: 2900, goal: 4000, newLeads: 46, potential: 32, highPotential: 20, converted: 18, newCustomerPercent: 62, returningCustomerPercent: 38 },
    { name: "Anna Lee", revenue: 2600, goal: 4000, newLeads: 42, potential: 28, highPotential: 18, converted: 16, newCustomerPercent: 55, returningCustomerPercent: 45 },
    { name: "John Smith", revenue: 2100, goal: 4000, newLeads: 38, potential: 26, highPotential: 16, converted: 14, newCustomerPercent: 52, returningCustomerPercent: 48 },
  ],
};

// Shift reports
export const shiftReports: ShiftReport[] = [
  {
    id: "1",
    date: "2025-10-12",
    shift: "Morning",
    name: "John Smith",
    revenue: 8450,
    firstOrders: 12,
    cartSent: 34,
    potential: 67,
    newLeads: 23,
    contacted: 45,
    messages: 127,
    status: "submitted",
  },
  {
    id: "2",
    date: "2025-10-11",
    shift: "Afternoon",
    name: "Sarah Chen",
    revenue: 9200,
    firstOrders: 15,
    cartSent: 38,
    potential: 72,
    newLeads: 28,
    contacted: 52,
    messages: 145,
    status: "submitted",
  },
  {
    id: "3",
    date: "2025-10-11",
    shift: "Morning",
    name: "Mike Johnson",
    revenue: 7800,
    firstOrders: 10,
    cartSent: 30,
    potential: 65,
    newLeads: 20,
    contacted: 42,
    messages: 118,
    status: "submitted",
  },
];

// Sales trend data (7 days)
export const salesTrendData = [
  { day: "Mon", sales: 8500, target: 10000 },
  { day: "Tue", sales: 9200, target: 10000 },
  { day: "Wed", sales: 11500, target: 10000 },
  { day: "Thu", sales: 10800, target: 10000 },
  { day: "Fri", sales: 12300, target: 10000 },
  { day: "Sat", sales: 9800, target: 10000 },
  { day: "Sun", sales: 8450, target: 10000 },
];

// Team comparison
export const teamComparisonData = [
  { team: "US Team", revenue: 125000, color: "#4B6BFB" },
  { team: "VN Team", revenue: 98000, color: "#10B981" },
];

// Sales funnel data
export const salesFunnelData = [
  { stage: "New Leads", count: 250, percentage: 100, color: "#4B6BFB" },
  { stage: "Potential", count: 180, percentage: 72, color: "#F59E0B" },
  { stage: "High Potential (Cart Sent)", count: 105, percentage: 42, color: "#EC4899" },
  { stage: "Converted (Orders)", count: 68, percentage: 27, color: "#10B981" },
];

// Weekly performance
export const weeklyPerformanceData = [
  { week: "Week 1", revenue: 45000, target: 50000 },
  { week: "Week 2", revenue: 52000, target: 50000 },
  { week: "Week 3", revenue: 48000, target: 50000 },
  { week: "Week 4", revenue: 55000, target: 50000 },
];
