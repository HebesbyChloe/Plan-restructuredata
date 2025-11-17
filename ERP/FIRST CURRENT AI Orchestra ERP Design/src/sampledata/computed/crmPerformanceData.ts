// CRM Performance Page Data

export const crmConversionMetrics = [
  {
    label: "Lead to Contact",
    value: "234",
    percentage: 78,
    change: 5.2,
    color: "#8B5CF6",
  },
  {
    label: "Contact to Potential",
    value: "156",
    percentage: 67,
    change: -2.1,
    color: "#EC4899",
  },
  {
    label: "Potential to Deal",
    value: "89",
    percentage: 57,
    change: 8.5,
    color: "#10B981",
  },
  {
    label: "Deal to Close",
    value: "42",
    percentage: 47,
    change: 3.4,
    color: "#F59E0B",
  },
];

export const crmWeeklyMomentumData = [
  { day: "Mon", value: 1200, target: 1500 },
  { day: "Tue", value: 1450, target: 1500 },
  { day: "Wed", value: 1680, target: 1500 },
  { day: "Thu", value: 1520, target: 1500 },
  { day: "Fri", value: 1890, target: 1500 },
  { day: "Sat", value: 2100, target: 1500 },
  { day: "Sun", value: 1760, target: 1500 },
];

export const crmMonthlyMomentumData = [
  { day: "Week 1", value: 8200, target: 10000 },
  { day: "Week 2", value: 9450, target: 10000 },
  { day: "Week 3", value: 10680, target: 10000 },
  { day: "Week 4", value: 11200, target: 10000 },
];

export const crmWeeklyStats = {
  currentValue: 11600,
  targetValue: 10500,
  weekChange: 12.5,
};

export const crmMonthlyStats = {
  currentValue: 39530,
  targetValue: 40000,
  weekChange: 8.3,
};

export const crmTeamMembers = [
  {
    name: "Sarah Chen",
    revenue: 15200,
    goal: 12000,
    newLeads: 85,
    potential: 62,
    highPotential: 42,
    converted: 35,
    newCustomerPercent: 65,
    returningCustomerPercent: 35,
  },
  {
    name: "Mike Johnson",
    revenue: 14800,
    goal: 12000,
    newLeads: 78,
    potential: 58,
    highPotential: 38,
    converted: 32,
    newCustomerPercent: 58,
    returningCustomerPercent: 42,
  },
  {
    name: "Emily Davis",
    revenue: 13900,
    goal: 12000,
    newLeads: 74,
    potential: 55,
    highPotential: 36,
    converted: 30,
    newCustomerPercent: 62,
    returningCustomerPercent: 38,
  },
  {
    name: "Alex Kim",
    revenue: 12500,
    goal: 12000,
    newLeads: 70,
    potential: 48,
    highPotential: 32,
    converted: 28,
    newCustomerPercent: 55,
    returningCustomerPercent: 45,
  },
  {
    name: "John Smith",
    revenue: 11800,
    goal: 12000,
    newLeads: 68,
    potential: 46,
    highPotential: 30,
    converted: 26,
    newCustomerPercent: 60,
    returningCustomerPercent: 40,
  },
  {
    name: "Lisa Wang",
    revenue: 10200,
    goal: 12000,
    newLeads: 62,
    potential: 42,
    highPotential: 28,
    converted: 24,
    newCustomerPercent: 52,
    returningCustomerPercent: 48,
  },
];

// Channel Revenue Data
export const channelRevenueData = {
  channels: [
    {
      channel: "Email",
      revenue: 28500,
      percentage: 32.5,
      change: 12.3,
      color: "#4B6BFB", // AI Blue
    },
    {
      channel: "Instagram",
      revenue: 24800,
      percentage: 28.3,
      change: 8.7,
      color: "#E1306C", // Instagram Pink
    },
    {
      channel: "Facebook",
      revenue: 18200,
      percentage: 20.8,
      change: -3.2,
      color: "#1877F2", // Facebook Blue
    },
    {
      channel: "Direct",
      revenue: 9800,
      percentage: 11.2,
      change: 5.6,
      color: "#10B981", // Green
    },
    {
      channel: "WhatsApp",
      revenue: 4200,
      percentage: 4.8,
      change: 15.4,
      color: "#25D366", // WhatsApp Green
    },
    {
      channel: "Other",
      revenue: 2100,
      percentage: 2.4,
      change: -1.2,
      color: "#94A3B8", // Slate
    },
  ],
  totalRevenue: 87600,
};
