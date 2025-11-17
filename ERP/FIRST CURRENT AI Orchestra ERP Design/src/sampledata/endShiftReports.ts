// End Shift Report Data Sample

export interface EndShiftReport {
  id: string;
  employeeId: string;
  employeeName: string;
  shiftDate: Date;
  shift: "morning" | "afternoon" | "night" | "full-day";
  startTime: string;
  endTime: string;
  totalRevenue: number;
  newLeads: number;
  converted: number;
  customerConversations: number;
  totalMessages: number;
  potential: number;
  orders: number;
  waitingPayment: number;
  returningCustomerRevenue: number;
  newCustomerRevenue: number;
  returningCustomerOrders: number;
  newCustomerOrders: number;
  tasksDone: number;
  totalTasks: number;
  reach: number;
  notes: string;
  challenges: string[];
  achievements: string[];
  submittedAt: Date;
  status: "success" | "failed";
}

export interface PointLog {
  id: string;
  employeeId: string;
  date: Date;
  type: "earned" | "deducted";
  points: number;
  reason: string;
  description: string;
  relatedData?: {
    orderId?: string;
    customerId?: string;
    customerName?: string;
  };
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  reward: number;
  participants: number;
  status: "active" | "completed" | "upcoming";
  type: "individual" | "team";
}

// Sample End Shift Reports for current month
export const endShiftReports: EndShiftReport[] = [
  {
    id: "shift-001",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 27), // October 27, 2025
    shift: "morning",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    totalRevenue: 3830,
    newLeads: 18,
    converted: 3,
    customerConversations: 12,
    totalMessages: 147,
    potential: 8,
    orders: 5,
    waitingPayment: 2,
    returningCustomerRevenue: 2130,
    newCustomerRevenue: 1700,
    returningCustomerOrders: 3,
    newCustomerOrders: 2,
    tasksDone: 8,
    totalTasks: 10,
    reach: 2845,
    notes: "Good shift with high engagement. Closed 3 major deals.",
    challenges: ["Difficult customer negotiation", "System downtime for 15 minutes"],
    achievements: ["Exceeded daily target", "New customer acquisition"],
    submittedAt: new Date(2025, 9, 27, 12, 15),
    status: "success",
  },
  {
    id: "shift-002",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 27), // October 27, 2025 - afternoon shift (same day)
    shift: "afternoon",
    startTime: "04:00 PM",
    endTime: "08:00 PM",
    totalRevenue: 2450,
    newLeads: 12,
    converted: 2,
    customerConversations: 8,
    totalMessages: 98,
    potential: 6,
    orders: 3,
    waitingPayment: 1,
    returningCustomerRevenue: 1450,
    newCustomerRevenue: 1000,
    returningCustomerOrders: 2,
    newCustomerOrders: 1,
    tasksDone: 5,
    totalTasks: 6,
    reach: 1820,
    notes: "Steady afternoon shift. Good follow-ups on morning leads.",
    challenges: [],
    achievements: ["Quick response time"],
    submittedAt: new Date(2025, 9, 27, 20, 10),
    status: "success",
  },
  {
    id: "shift-003",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 26), // October 26, 2025
    shift: "full-day",
    startTime: "08:00 AM",
    endTime: "08:00 PM",
    totalRevenue: 5890,
    newLeads: 25,
    converted: 5,
    customerConversations: 18,
    totalMessages: 215,
    potential: 12,
    orders: 7,
    waitingPayment: 3,
    returningCustomerRevenue: 3450,
    newCustomerRevenue: 2440,
    returningCustomerOrders: 4,
    newCustomerOrders: 3,
    tasksDone: 15,
    totalTasks: 15,
    reach: 3850,
    notes: "Excellent full day performance. Strong lead generation and conversion.",
    challenges: [],
    achievements: ["100% response rate"],
    submittedAt: new Date(2025, 9, 26, 20, 15),
    status: "success",
  },
  {
    id: "shift-004",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 25), // October 25, 2025
    shift: "morning",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    totalRevenue: 1890,
    newLeads: 12,
    converted: 1,
    customerConversations: 8,
    totalMessages: 76,
    potential: 5,
    orders: 2,
    waitingPayment: 1,
    returningCustomerRevenue: 890,
    newCustomerRevenue: 1000,
    returningCustomerOrders: 1,
    newCustomerOrders: 1,
    tasksDone: 4,
    totalTasks: 8,
    reach: 1540,
    notes: "Slower morning, picked up after 10 AM.",
    challenges: ["Low initial traffic"],
    achievements: [],
    submittedAt: new Date(2025, 9, 25, 12, 5),
    status: "failed",
  },
  {
    id: "shift-005",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 24), // October 24, 2025
    shift: "morning",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    totalRevenue: 4120,
    newLeads: 20,
    converted: 4,
    customerConversations: 15,
    totalMessages: 165,
    potential: 9,
    orders: 6,
    waitingPayment: 2,
    returningCustomerRevenue: 2520,
    newCustomerRevenue: 1600,
    returningCustomerOrders: 4,
    newCustomerOrders: 2,
    tasksDone: 10,
    totalTasks: 10,
    reach: 3100,
    notes: "Excellent shift! Multiple high-value conversions.",
    challenges: [],
    achievements: ["Top performer of the day", "5-star customer feedback"],
    submittedAt: new Date(2025, 9, 24, 12, 8),
    status: "success",
  },
  {
    id: "shift-006",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 23), // October 23, 2025
    shift: "afternoon",
    startTime: "04:00 PM",
    endTime: "08:00 PM",
    totalRevenue: 2950,
    newLeads: 14,
    converted: 3,
    customerConversations: 11,
    totalMessages: 112,
    potential: 7,
    orders: 4,
    waitingPayment: 1,
    returningCustomerRevenue: 1650,
    newCustomerRevenue: 1300,
    returningCustomerOrders: 2,
    newCustomerOrders: 2,
    tasksDone: 6,
    totalTasks: 7,
    reach: 2200,
    notes: "Good follow-up on previous leads.",
    challenges: [],
    achievements: ["Closed 2 pending deals"],
    submittedAt: new Date(2025, 9, 23, 20, 12),
    status: "success",
  },
  // Additional shifts for testing scroll
  {
    id: "shift-007",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 22), // October 22, 2025
    shift: "morning",
    startTime: "08:00 AM",
    endTime: "12:00 PM",
    totalRevenue: 3200,
    newLeads: 16,
    converted: 3,
    customerConversations: 13,
    totalMessages: 128,
    potential: 8,
    orders: 4,
    waitingPayment: 2,
    returningCustomerRevenue: 1800,
    newCustomerRevenue: 1400,
    returningCustomerOrders: 2,
    newCustomerOrders: 2,
    tasksDone: 9,
    totalTasks: 10,
    reach: 2400,
    notes: "Consistent performance with good engagement.",
    challenges: [],
    achievements: [],
    submittedAt: new Date(2025, 9, 22, 12, 5),
    status: "success",
  },
  {
    id: "shift-008",
    employeeId: "emp-001",
    employeeName: "Lv Ngeurn",
    shiftDate: new Date(2025, 9, 21), // October 21, 2025
    shift: "full-day",
    startTime: "08:00 AM",
    endTime: "08:00 PM",
    totalRevenue: 6750,
    newLeads: 28,
    converted: 6,
    customerConversations: 21,
    totalMessages: 245,
    potential: 14,
    orders: 9,
    waitingPayment: 3,
    returningCustomerRevenue: 3950,
    newCustomerRevenue: 2800,
    returningCustomerOrders: 5,
    newCustomerOrders: 4,
    tasksDone: 18,
    totalTasks: 18,
    reach: 4200,
    notes: "Exceptional full-day performance. Exceeded all targets.",
    challenges: [],
    achievements: ["Highest revenue of the week", "Perfect conversion rate"],
    submittedAt: new Date(2025, 9, 21, 20, 20),
    status: "success",
  },
];

// Point Logs for current employee
export const pointLogs: PointLog[] = [
  {
    id: "point-001",
    employeeId: "emp-001",
    date: new Date(2025, 9, 27, 12, 48), // Oct 27, 2025 12:48 AM
    type: "deducted",
    points: -20,
    reason: "Not achieved daily target",
    description: "Not achieved daily target(2025-10-26)",
    relatedData: {},
  },
  {
    id: "point-002",
    employeeId: "emp-001",
    date: new Date(2025, 9, 26, 12, 49), // Oct 26, 2025 12:49 AM
    type: "deducted",
    points: -20,
    reason: "Not achieved daily target",
    description: "Not achieved daily target(2025-10-25)",
    relatedData: {},
  },
  {
    id: "point-003",
    employeeId: "emp-001",
    date: new Date(2025, 9, 26, 12, 0), // Oct 26, 2025 12:00 AM
    type: "deducted",
    points: -10,
    reason: "Missed confirm report",
    description: "Missed confirm report(Shift 2: 2025-10-26)",
    relatedData: {},
  },
  {
    id: "point-004",
    employeeId: "emp-001",
    date: new Date(2025, 9, 25, 19, 31), // Oct 25, 2025 07:31 PM
    type: "deducted",
    points: -1,
    reason: "New customer",
    description: "New customer: Hong Nguyen",
    relatedData: {
      customerId: "cust-123",
      customerName: "Hong Nguyen",
    },
  },
  {
    id: "point-005",
    employeeId: "emp-001",
    date: new Date(2025, 9, 25, 10, 29), // Oct 25, 2025 10:29 AM
    type: "earned",
    points: 2,
    reason: "Customer repurchase within 2 weeks",
    description: "Customer repurchase within 2 weeks: +2 points, ID order: 666021978, Customer: Ha Tu Tran",
    relatedData: {
      orderId: "666021978",
      customerId: "cust-456",
      customerName: "Ha Tu Tran",
    },
  },
  {
    id: "point-006",
    employeeId: "emp-001",
    date: new Date(2025, 9, 24, 15, 20),
    type: "earned",
    points: 5,
    reason: "Achieved daily target",
    description: "Achieved daily target with 110% completion",
    relatedData: {},
  },
  {
    id: "point-007",
    employeeId: "emp-001",
    date: new Date(2025, 9, 23, 14, 15),
    type: "earned",
    points: 3,
    reason: "5-star customer feedback",
    description: "Received excellent customer feedback",
    relatedData: {
      customerId: "cust-789",
      customerName: "Mai Linh",
    },
  },
  {
    id: "point-008",
    employeeId: "emp-001",
    date: new Date(2025, 9, 22, 16, 45),
    type: "earned",
    points: 10,
    reason: "Top performer of the week",
    description: "Awarded as top performer for week 42",
    relatedData: {},
  },
  {
    id: "point-009",
    employeeId: "emp-001",
    date: new Date(2025, 9, 21, 11, 30),
    type: "deducted",
    points: -5,
    reason: "Late shift arrival",
    description: "Arrived 15 minutes late for morning shift",
    relatedData: {},
  },
  {
    id: "point-010",
    employeeId: "emp-001",
    date: new Date(2025, 9, 20, 13, 25),
    type: "earned",
    points: 8,
    reason: "Upsell achievement",
    description: "Successfully upsold premium package to 4 customers",
    relatedData: {},
  },
];

// Challenges
export const challenges: Challenge[] = [
  {
    id: "challenge-001",
    title: "Revenue Champion",
    description: "Achieve $25,000 in total revenue this month",
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 31),
    targetMetric: "revenue",
    targetValue: 25000,
    currentValue: 18240,
    reward: 100,
    participants: 12,
    status: "active",
    type: "individual",
  },
  {
    id: "challenge-002",
    title: "Lead Generation Master",
    description: "Generate 200+ new leads this month",
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 31),
    targetMetric: "leads",
    targetValue: 200,
    currentValue: 142,
    reward: 75,
    participants: 18,
    status: "active",
    type: "individual",
  },
  {
    id: "challenge-003",
    title: "Perfect Attendance",
    description: "Complete all shifts without absence",
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 31),
    targetMetric: "attendance",
    targetValue: 20,
    currentValue: 17,
    reward: 50,
    participants: 25,
    status: "active",
    type: "individual",
  },
  {
    id: "challenge-004",
    title: "Team Performance Boost",
    description: "Team achieves 120% of collective target",
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 31),
    targetMetric: "team_revenue",
    targetValue: 150000,
    currentValue: 128500,
    reward: 200,
    participants: 8,
    status: "active",
    type: "team",
  },
  {
    id: "challenge-005",
    title: "Customer Satisfaction Star",
    description: "Maintain 4.8+ average rating",
    startDate: new Date(2025, 9, 1),
    endDate: new Date(2025, 9, 31),
    targetMetric: "rating",
    targetValue: 4.8,
    currentValue: 4.9,
    reward: 60,
    participants: 15,
    status: "active",
    type: "individual",
  },
];

// Current Shift Preview Data (for live shift reporting)
export const currentShiftPreview = {
  newLeads: 18,
  converted: 3,
  conversations: 12,
  messages: 147,
  potential: 8,
  orders: 5,
  waitingPayment: 2,
  tasksDone: 8,
  totalTasks: 10,
  estimatedRevenue: 3830,
  // Validation issues
  issues: [
    {
      type: "warning" as const,
      message: "2 tasks still pending completion before shift end",
    },
    {
      type: "info" as const,
      message: "2 orders waiting for payment confirmation",
    },
  ],
};

// Current Employee Performance Data (for EmployeePerformanceCard)
export const currentEmployeePerformance = {
  employeeId: "emp-001",
  name: "Lv Ngeurn",
  shift: "morning" as const,
  isOnShift: true,
  todayRevenue: 3830,
  newLeads: 18,
  customerConversations: 12,
  totalMessages: 147,
  reach: 2845,
  lastActivity: new Date(Date.now() - 2 * 60 * 1000),
  targetRevenue: 5000,
};

// Current Employee Additional Data (points tracking)
export const currentEmployeePoints = {
  currentPoints: 117,
  monthlyPointsChange: -180,
  totalPointsThisMonth: 297,
};

// Monthly Momentum Summary (calculated from endShiftReports)
export const monthlyMomentumSummary = {
  totalRevenue: 31530,
  totalNewLeads: 145,
  totalConverted: 27,
  totalOrders: 43,
  returningCustomerOrders: 24,
  newCustomerOrders: 19,
  returningCustomerRevenue: 18290,
  newCustomerRevenue: 13240,
  dailyRevenueGoal: 5000,
  monthlyRevenueGoal: 100000,
  conversionRate: 18.6, // (27/145) * 100
  daysWorked: 8,
};
