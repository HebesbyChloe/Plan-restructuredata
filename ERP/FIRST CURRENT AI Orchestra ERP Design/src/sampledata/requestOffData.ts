export type RequestOffType = "holiday" | "sick" | "personal" | "emergency" | "supplement";

export type GeneralRequestType = 
  | "day-off" 
  | "prefer-day" 
  | "shift-change" 
  | "time-adjustment"
  | "schedule-review"
  | "other";

export interface DayOffRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  requestType: RequestOffType;
  status: "pending" | "approved" | "rejected";
  submittedAt: Date;
}

// Sample day off requests
export const dayOffRequests: DayOffRequest[] = [
  {
    id: "req001",
    employeeId: "usr001",
    employeeName: "Anna Thompson",
    startDate: new Date(2025, 10, 5), // Nov 5, 2025
    endDate: new Date(2025, 10, 7),   // Nov 7, 2025
    reason: "Family vacation - pre-planned trip to visit relatives",
    requestType: "holiday",
    status: "pending",
    submittedAt: new Date(2025, 9, 20),
  },
  {
    id: "req002",
    employeeId: "usr004",
    employeeName: "Emily Rodriguez",
    startDate: new Date(2025, 10, 12),
    endDate: new Date(2025, 10, 12),
    reason: "Medical appointment - annual checkup",
    requestType: "sick",
    status: "pending",
    submittedAt: new Date(2025, 9, 25),
  },
  {
    id: "req003",
    employeeId: "usr006",
    employeeName: "Jessica Martinez",
    startDate: new Date(2025, 10, 15),
    endDate: new Date(2025, 10, 16),
    reason: "Personal matters - need to attend to urgent family business",
    requestType: "personal",
    status: "pending",
    submittedAt: new Date(2025, 9, 28),
  },
  {
    id: "req004",
    employeeId: "usr001",
    employeeName: "Anna Thompson",
    startDate: new Date(2025, 9, 10),
    endDate: new Date(2025, 9, 10),
    reason: "Supplement leave for overtime compensation",
    requestType: "supplement",
    status: "approved",
    submittedAt: new Date(2025, 8, 28),
  },
  {
    id: "req005",
    employeeId: "usr005",
    employeeName: "David Park",
    startDate: new Date(2025, 9, 15),
    endDate: new Date(2025, 9, 15),
    reason: "Emergency - Family member hospitalized",
    requestType: "emergency",
    status: "approved",
    submittedAt: new Date(2025, 9, 14),
  },
];

// Request type configurations
export const requestTypeOptions = [
  { value: "holiday", label: "Holiday" },
  { value: "sick", label: "Sick Leave" },
  { value: "personal", label: "Personal Leave" },
  { value: "emergency", label: "Emergency" },
  { value: "supplement", label: "Supplement Leave" },
] as const;

export const generalRequestTypeOptions = [
  { 
    value: "day-off", 
    label: "Day Off Request",
    description: "Request time off (holiday, sick leave, personal)",
    icon: "CalendarOff",
    requiresDateRange: true
  },
  { 
    value: "prefer-day", 
    label: "Preferred Day/Shift",
    description: "Request specific days or shift preferences",
    icon: "Heart",
    requiresDateRange: false
  },
  { 
    value: "shift-change", 
    label: "Shift Change/Swap",
    description: "Request to change or swap shifts",
    icon: "Repeat",
    requiresDateRange: false
  },
  { 
    value: "time-adjustment", 
    label: "Time Adjustment",
    description: "Request timesheet or hours adjustment",
    icon: "Clock",
    requiresDateRange: false
  },
  { 
    value: "schedule-review", 
    label: "Schedule Review",
    description: "Request review of schedule or conflicts",
    icon: "Calendar",
    requiresDateRange: false
  },
  { 
    value: "other", 
    label: "Other Request",
    description: "General workplace request",
    icon: "MessageSquare",
    requiresDateRange: false
  },
] as const;

export const requestTypeLabels: Record<RequestOffType, string> = {
  holiday: "Holiday",
  sick: "Sick Leave",
  personal: "Personal",
  emergency: "Emergency",
  supplement: "Supplement",
};

export const requestTypeColors: Record<RequestOffType, string> = {
  holiday: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500/30",
  sick: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-500/30",
  personal: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-500/30",
  emergency: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-500/30",
  supplement: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-500/30",
};

// Helper functions
export function getRequestsByEmployeeId(employeeId: string): DayOffRequest[] {
  return dayOffRequests.filter(req => req.employeeId === employeeId);
}

export function getPendingRequestsByEmployeeId(employeeId: string): DayOffRequest[] {
  return dayOffRequests.filter(req => req.employeeId === employeeId && req.status === "pending");
}

export function getAllPendingRequests(): DayOffRequest[] {
  return dayOffRequests.filter(req => req.status === "pending");
}
