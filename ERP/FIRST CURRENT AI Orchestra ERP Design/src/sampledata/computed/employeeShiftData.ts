// Employee Shift Schedule & Live Performance Data

export interface EmployeeShift {
  employeeId: string;
  name: string;
  shift: "morning" | "afternoon" | "night";
  isOnShift: boolean;
  todayRevenue: number;
  newLeads: number;
  customerConversations: number;
  totalMessages: number;
  reach: number;
  lastActivity: Date;
  targetRevenue: number;
}

// Shift Times
export const SHIFT_TIMES = {
  morning: { start: "08:00", end: "16:00", label: "Morning Shift (8AM - 4PM)" },
  afternoon: { start: "16:00", end: "00:00", label: "Afternoon Shift (4PM - 12AM)" },
  night: { start: "00:00", end: "08:00", label: "Night Shift (12AM - 8AM)" },
};

// Live Employee Performance Data
export const liveEmployeePerformance: EmployeeShift[] = [
  {
    employeeId: "emp-001",
    name: "Lv Ngeurn",
    shift: "morning",
    isOnShift: true,
    todayRevenue: 3830,
    newLeads: 18,
    customerConversations: 12,
    totalMessages: 147,
    reach: 2845,
    lastActivity: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-002",
    name: "Haval Mai",
    shift: "morning",
    isOnShift: true,
    todayRevenue: 110,
    newLeads: 8,
    customerConversations: 6,
    totalMessages: 42,
    reach: 1230,
    lastActivity: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-003",
    name: "Hua Lam",
    shift: "morning",
    isOnShift: true,
    todayRevenue: 0,
    newLeads: 3,
    customerConversations: 2,
    totalMessages: 15,
    reach: 450,
    lastActivity: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-004",
    name: "Hong Tram",
    shift: "morning",
    isOnShift: true,
    todayRevenue: 0,
    newLeads: 5,
    customerConversations: 4,
    totalMessages: 28,
    reach: 680,
    lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-005",
    name: "Sarah Chen",
    shift: "afternoon",
    isOnShift: false,
    todayRevenue: 2450,
    newLeads: 15,
    customerConversations: 10,
    totalMessages: 98,
    reach: 1950,
    lastActivity: new Date(Date.now() - 120 * 60 * 1000), // 2 hours ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-006",
    name: "Mike Johnson",
    shift: "afternoon",
    isOnShift: false,
    todayRevenue: 1890,
    newLeads: 12,
    customerConversations: 8,
    totalMessages: 76,
    reach: 1540,
    lastActivity: new Date(Date.now() - 90 * 60 * 1000), // 1.5 hours ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-007",
    name: "Emily Davis",
    shift: "night",
    isOnShift: false,
    todayRevenue: 890,
    newLeads: 7,
    customerConversations: 5,
    totalMessages: 45,
    reach: 890,
    lastActivity: new Date(Date.now() - 180 * 60 * 1000), // 3 hours ago
    targetRevenue: 5000,
  },
  {
    employeeId: "emp-008",
    name: "Alex Kim",
    shift: "night",
    isOnShift: false,
    todayRevenue: 560,
    newLeads: 4,
    customerConversations: 3,
    totalMessages: 28,
    reach: 620,
    lastActivity: new Date(Date.now() - 210 * 60 * 1000), // 3.5 hours ago
    targetRevenue: 5000,
  },
];

// Helper function to get current shift
export function getCurrentShift(): "morning" | "afternoon" | "night" {
  const hour = new Date().getHours();
  if (hour >= 8 && hour < 16) return "morning";
  if (hour >= 16 || hour < 0) return "afternoon";
  return "night";
}

// Helper function to format time ago
export function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Helper function to sort by recent activity
export function sortByRecentActivity(employees: EmployeeShift[]): EmployeeShift[] {
  return [...employees].sort((a, b) => {
    // On-shift employees first
    if (a.isOnShift && !b.isOnShift) return -1;
    if (!a.isOnShift && b.isOnShift) return 1;
    // Then by most recent activity
    return b.lastActivity.getTime() - a.lastActivity.getTime();
  });
}
