// Unified Request System for AI Orchestra ERP
// Handles all workplace requests: time-off, adjustments, shifts, bidirectional communications

export type RequestCategory = 
  | "time-off"           // Day off, vacation, sick leave
  | "schedule"           // Shift change, swap, prefer day
  | "timesheet"          // Time adjustment, corrections
  | "inquiry"            // Questions, explanations, documentation
  | "other";             // General requests

export type RequestType = 
  // Time Off Types
  | "day-off-holiday" 
  | "day-off-sick" 
  | "day-off-personal" 
  | "day-off-emergency" 
  | "day-off-supplement"
  
  // Schedule Types
  | "shift-change"
  | "shift-swap"
  | "shift-prefer-day"
  | "shift-prefer-time"
  | "schedule-review"
  
  // Timesheet Types
  | "time-adjustment"
  | "hours-correction"
  | "missed-clock"
  
  // Inquiry Types (Bidirectional - Manager to Employee)
  | "request-explanation"
  | "request-documentation"
  | "report-to-management"
  | "clarification-needed"
  
  // Other
  | "general-request";

export type RequestStatus = 
  | "pending"
  | "approved"
  | "rejected"
  | "under-review"
  | "needs-info"
  | "cancelled";

export type RequestDirection = 
  | "employee-to-manager"
  | "manager-to-employee"
  | "peer-to-peer";

export interface ScheduleRequest {
  id: string;
  
  // Participants
  requesterId: string;
  requesterName: string;
  requesterRole: "employee" | "manager" | "admin";
  
  targetId: string;  // Who needs to respond/approve
  targetName: string;
  targetRole: "employee" | "manager" | "admin";
  
  direction: RequestDirection;
  
  // Request Details
  category: RequestCategory;
  type: RequestType;
  title: string;
  description: string;
  
  // Date/Time Information
  relatedDate?: Date;
  startDate?: Date;
  endDate?: Date;
  requestedHours?: number;
  
  // Status
  status: RequestStatus;
  priority: "low" | "normal" | "high" | "urgent";
  
  // Metadata
  submittedAt: Date;
  respondedAt?: Date;
  responseMessage?: string;
  
  // Links to other data
  relatedTimesheetId?: string;
  relatedShiftId?: string;
  relatedRequirementId?: string;  // Links to shift requirements after approval
  
  // Attachments/Evidence
  attachments?: string[];
  
  // Thread (for bidirectional communication)
  parentRequestId?: string;  // If this is a response to another request
  hasResponses?: boolean;
  responseCount?: number;
}

// Request Type Configurations
export const requestTypeConfig = {
  // Time Off
  "day-off-holiday": {
    category: "time-off" as RequestCategory,
    label: "Holiday Leave",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: "Sun",
    requiresDateRange: true,
    requiresApproval: true,
  },
  "day-off-sick": {
    category: "time-off" as RequestCategory,
    label: "Sick Leave",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: "HeartPulse",
    requiresDateRange: true,
    requiresApproval: true,
  },
  "day-off-personal": {
    category: "time-off" as RequestCategory,
    label: "Personal Leave",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    icon: "User",
    requiresDateRange: true,
    requiresApproval: true,
  },
  "day-off-emergency": {
    category: "time-off" as RequestCategory,
    label: "Emergency Leave",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: "AlertTriangle",
    requiresDateRange: true,
    requiresApproval: true,
  },
  "day-off-supplement": {
    category: "time-off" as RequestCategory,
    label: "Supplement Leave",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: "PlusCircle",
    requiresDateRange: true,
    requiresApproval: true,
  },
  
  // Schedule
  "shift-change": {
    category: "schedule" as RequestCategory,
    label: "Shift Change",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    icon: "Repeat",
    requiresDateRange: false,
    requiresApproval: true,
  },
  "shift-swap": {
    category: "schedule" as RequestCategory,
    label: "Shift Swap",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    icon: "ArrowLeftRight",
    requiresDateRange: false,
    requiresApproval: true,
  },
  "shift-prefer-day": {
    category: "schedule" as RequestCategory,
    label: "Preferred Day",
    color: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
    icon: "Heart",
    requiresDateRange: false,
    requiresApproval: true,
  },
  "shift-prefer-time": {
    category: "schedule" as RequestCategory,
    label: "Preferred Time",
    color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    icon: "Clock",
    requiresDateRange: false,
    requiresApproval: true,
  },
  "schedule-review": {
    category: "schedule" as RequestCategory,
    label: "Schedule Review",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    icon: "Calendar",
    requiresDateRange: false,
    requiresApproval: false,
  },
  
  // Timesheet
  "time-adjustment": {
    category: "timesheet" as RequestCategory,
    label: "Time Adjustment",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    icon: "Clock",
    requiresDateRange: false,
    requiresApproval: true,
  },
  "hours-correction": {
    category: "timesheet" as RequestCategory,
    label: "Hours Correction",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: "Edit",
    requiresDateRange: false,
    requiresApproval: true,
  },
  "missed-clock": {
    category: "timesheet" as RequestCategory,
    label: "Missed Clock In/Out",
    color: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
    icon: "AlertCircle",
    requiresDateRange: false,
    requiresApproval: true,
  },
  
  // Inquiry (Bidirectional)
  "request-explanation": {
    category: "inquiry" as RequestCategory,
    label: "Request Explanation",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
    icon: "MessageCircleQuestion",
    requiresDateRange: false,
    requiresApproval: false,
  },
  "request-documentation": {
    category: "inquiry" as RequestCategory,
    label: "Request Documentation",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    icon: "FileText",
    requiresDateRange: false,
    requiresApproval: false,
  },
  "report-to-management": {
    category: "inquiry" as RequestCategory,
    label: "Report to Management",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: "AlertTriangle",
    requiresDateRange: false,
    requiresApproval: false,
  },
  "clarification-needed": {
    category: "inquiry" as RequestCategory,
    label: "Clarification Needed",
    color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
    icon: "HelpCircle",
    requiresDateRange: false,
    requiresApproval: false,
  },
  
  // Other
  "general-request": {
    category: "other" as RequestCategory,
    label: "General Request",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: "MessageSquare",
    requiresDateRange: false,
    requiresApproval: false,
  },
} as const;

// Sample Requests
export const scheduleRequests: ScheduleRequest[] = [
  // Employee -> Manager: Time Off Request
  {
    id: "req001",
    requesterId: "usr001",
    requesterName: "Anna Thompson",
    requesterRole: "employee",
    targetId: "mgr001",
    targetName: "John Manager",
    targetRole: "manager",
    direction: "employee-to-manager",
    category: "time-off",
    type: "day-off-holiday",
    title: "Holiday Leave Request",
    description: "Family vacation - pre-planned trip to visit relatives",
    startDate: new Date(2025, 10, 5),
    endDate: new Date(2025, 10, 7),
    status: "pending",
    priority: "normal",
    submittedAt: new Date(2025, 9, 20),
  },
  
  // Employee -> Manager: Time Adjustment
  {
    id: "req002",
    requesterId: "usr004",
    requesterName: "Emily Rodriguez",
    requesterRole: "employee",
    targetId: "mgr001",
    targetName: "John Manager",
    targetRole: "manager",
    direction: "employee-to-manager",
    category: "timesheet",
    type: "time-adjustment",
    title: "Timesheet Adjustment - Oct 25",
    description: "Forgot to clock out - worked until 5:30 PM but system shows 5:00 PM",
    relatedDate: new Date(2025, 9, 25),
    requestedHours: 8.5,
    relatedTimesheetId: "ts_125",
    status: "pending",
    priority: "normal",
    submittedAt: new Date(2025, 9, 26),
  },
  
  // Employee -> Manager: Shift Change
  {
    id: "req003",
    requesterId: "usr006",
    requesterName: "Jessica Martinez",
    requesterRole: "employee",
    targetId: "mgr001",
    targetName: "John Manager",
    targetRole: "manager",
    direction: "employee-to-manager",
    category: "schedule",
    type: "shift-change",
    title: "Request to Change Shift - Nov 12",
    description: "Need to change from morning to evening shift due to personal appointment",
    relatedDate: new Date(2025, 10, 12),
    status: "under-review",
    priority: "normal",
    submittedAt: new Date(2025, 10, 1),
  },
  
  // Manager -> Employee: Request Explanation (Bidirectional)
  {
    id: "req004",
    requesterId: "mgr001",
    requesterName: "John Manager",
    requesterRole: "manager",
    targetId: "usr004",
    targetName: "Emily Rodriguez",
    targetRole: "employee",
    direction: "manager-to-employee",
    category: "inquiry",
    type: "request-explanation",
    title: "Explanation Needed - Late Clock In (Oct 28)",
    description: "Please provide explanation for 45-minute late clock-in on October 28th. This is for record keeping purposes.",
    relatedDate: new Date(2025, 9, 28),
    relatedTimesheetId: "ts_128",
    status: "pending",
    priority: "normal",
    submittedAt: new Date(2025, 9, 28),
  },
  
  // Manager -> Employee: Request Documentation
  {
    id: "req005",
    requesterId: "mgr001",
    requesterName: "John Manager",
    requesterRole: "manager",
    targetId: "usr001",
    targetName: "Anna Thompson",
    targetRole: "employee",
    direction: "manager-to-employee",
    category: "inquiry",
    type: "request-documentation",
    title: "Medical Certificate Required",
    description: "Please provide medical certificate for sick leave taken on Oct 15-16",
    relatedDate: new Date(2025, 9, 15),
    status: "needs-info",
    priority: "high",
    submittedAt: new Date(2025, 9, 17),
  },
  
  // Employee -> Manager: Preferred Day Request
  {
    id: "req006",
    requesterId: "usr005",
    requesterName: "David Park",
    requesterRole: "employee",
    targetId: "mgr001",
    targetName: "John Manager",
    targetRole: "manager",
    direction: "employee-to-manager",
    category: "schedule",
    type: "shift-prefer-day",
    title: "Preferred Shift Days - November",
    description: "Would like to work Tuesday-Saturday instead of Monday-Friday for November due to continuing education classes",
    startDate: new Date(2025, 10, 1),
    endDate: new Date(2025, 10, 30),
    status: "approved",
    priority: "normal",
    submittedAt: new Date(2025, 9, 20),
    respondedAt: new Date(2025, 9, 22),
    responseMessage: "Approved - adjusted schedule to accommodate your classes",
    relatedRequirementId: "shift_req_nov_001",
  },
  
  // Approved requests (linked to requirements)
  {
    id: "req007",
    requesterId: "usr001",
    requesterName: "Anna Thompson",
    requesterRole: "employee",
    targetId: "mgr001",
    targetName: "John Manager",
    targetRole: "manager",
    direction: "employee-to-manager",
    category: "time-off",
    type: "day-off-supplement",
    title: "Supplement Leave - Overtime Compensation",
    description: "Supplement leave for overtime worked last month",
    startDate: new Date(2025, 9, 10),
    endDate: new Date(2025, 9, 10),
    status: "approved",
    priority: "normal",
    submittedAt: new Date(2025, 8, 28),
    respondedAt: new Date(2025, 8, 29),
    responseMessage: "Approved - overtime compensation verified",
    relatedRequirementId: "shift_req_oct_001",
  },
  
  // Manager -> Higher Management
  {
    id: "req008",
    requesterId: "mgr001",
    requesterName: "John Manager",
    requesterRole: "manager",
    targetId: "admin001",
    targetName: "Sarah Admin",
    targetRole: "admin",
    direction: "manager-to-employee",
    category: "inquiry",
    type: "report-to-management",
    title: "Escalation - Repeated Tardiness Pattern",
    description: "Employee usr008 has shown repeated pattern of late arrivals (5 instances this month). Requires HR intervention.",
    status: "under-review",
    priority: "urgent",
    submittedAt: new Date(2025, 9, 27),
  },
];

// Helper Functions
export function getRequestsByEmployeeId(employeeId: string): ScheduleRequest[] {
  return scheduleRequests.filter(
    req => req.requesterId === employeeId || req.targetId === employeeId
  );
}

export function getPendingRequestsByEmployeeId(employeeId: string): ScheduleRequest[] {
  return scheduleRequests.filter(
    req => (req.requesterId === employeeId || req.targetId === employeeId) && 
           req.status === "pending"
  );
}

export function getRequestsByStatus(status: RequestStatus): ScheduleRequest[] {
  return scheduleRequests.filter(req => req.status === status);
}

export function getRequestsByCategory(category: RequestCategory): ScheduleRequest[] {
  return scheduleRequests.filter(req => req.category === category);
}

export function getRequestsForManager(managerId: string): ScheduleRequest[] {
  return scheduleRequests.filter(req => req.targetId === managerId);
}

export function getRequestsByDirection(direction: RequestDirection): ScheduleRequest[] {
  return scheduleRequests.filter(req => req.direction === direction);
}

export function getManagerToEmployeeRequests(managerId: string): ScheduleRequest[] {
  return scheduleRequests.filter(
    req => req.requesterId === managerId && req.direction === "manager-to-employee"
  );
}

// Status helpers
export const requestStatusConfig = {
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: "Clock",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    icon: "CheckCircle",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    icon: "XCircle",
  },
  "under-review": {
    label: "Under Review",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    icon: "Eye",
  },
  "needs-info": {
    label: "Needs Info",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
    icon: "AlertCircle",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    icon: "Ban",
  },
} as const;
