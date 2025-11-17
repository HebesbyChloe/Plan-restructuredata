import { SHIFT_TYPES, type ShiftType } from "../../lib/config/constants";

export type { ShiftType };

export interface DayShift {
  date: Date;
  shifts: ShiftType[];
  customHours?: { start: string; end: string }; // For "Custom" shift type
}

export interface EmployeeSchedule {
  employeeId: string;
  employeeName: string;
  avatar?: string;
  role: string;
  weekSchedule: DayShift[];
}

// Helper to get a date for the current week
function getWeekDate(daysFromMonday: number): Date {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  
  const targetDate = new Date(monday);
  targetDate.setDate(monday.getDate() + daysFromMonday);
  return targetDate;
}

// Generate week schedule for an employee
function generateWeekSchedule(pattern: (ShiftType[] | null)[]): DayShift[] {
  return pattern.map((shifts, index) => ({
    date: getWeekDate(index),
    shifts: shifts || [],
  }));
}

// Simulated logged-in user ID (this would come from auth in real app)
export const currentLoggedInUserId = "usr001"; // Anna Thompson

// Shift type hour definitions - using centralized config
export const shiftHours = Object.fromEntries(
  Object.entries(SHIFT_TYPES).map(([key, config]) => [key, config.duration])
);

// Sample employee schedules
export const employeeSchedules: EmployeeSchedule[] = [
  {
    employeeId: "usr001",
    employeeName: "Anna Thompson",
    role: "Sales Rep",
    weekSchedule: generateWeekSchedule([
      ["Office Hours"],           // Monday
      ["Office Hours", "Evening"], // Tuesday - Both Office Hours AND Evening shift
      ["Office Hours"],           // Wednesday
      ["Evening"],        // Thursday - Evening only
      ["Full"],           // Friday
      null,               // Saturday - Off
      null,               // Sunday - Off
    ]),
  },
  {
    employeeId: "usr002",
    employeeName: "Sarah Chen",
    role: "Sales Rep",
    weekSchedule: generateWeekSchedule([
      ["Office Hours"],      // Monday
      ["Office Hours"],      // Tuesday
      ["Office Hours"],      // Wednesday
      ["Office Hours"],      // Thursday
      ["Office Hours"],      // Friday
      null,          // Saturday - Off
      null,          // Sunday - Off
    ]),
  },
  {
    employeeId: "usr003",
    employeeName: "Michael Johnson",
    role: "Sales Manager",
    weekSchedule: generateWeekSchedule([
      ["Full"],
      ["Full"],
      ["Full"],
      ["Full"],
      ["Morning"],
      null,
      null,
    ]),
  },
  {
    employeeId: "usr004",
    employeeName: "Emily Rodriguez",
    role: "Customer Service",
    weekSchedule: generateWeekSchedule([
      ["Morning"],
      ["Morning"],
      ["Evening"],
      ["Evening"],
      ["Morning"],
      ["Morning"],
      null,
    ]),
  },
  {
    employeeId: "usr005",
    employeeName: "David Park",
    role: "Customer Service",
    weekSchedule: generateWeekSchedule([
      ["Evening"],
      ["Evening"],
      ["Morning", "Evening"], // Double shift
      ["Full"],
      ["Evening"],
      null,
      null,
    ]),
  },
  {
    employeeId: "usr006",
    employeeName: "Jessica Martinez",
    role: "Sales Rep",
    weekSchedule: generateWeekSchedule([
      ["Office Hours"],
      ["Office Hours"],
      null,          // Day off
      ["Office Hours"],
      ["Full"],
      ["Morning"],
      null,
    ]),
  },
  {
    employeeId: "usr007",
    employeeName: "James Wilson",
    role: "Operations",
    weekSchedule: generateWeekSchedule([
      ["Night"],
      ["Night"],
      ["Night"],
      ["Night"],
      ["Night"],
      null,
      null,
    ]),
  },
  {
    employeeId: "usr008",
    employeeName: "Lisa Anderson",
    role: "Marketing",
    weekSchedule: generateWeekSchedule([
      ["Office Hours"],
      ["Office Hours"],
      ["Morning"],
      ["Full"],
      ["Office Hours"],
      null,
      null,
    ]),
  },
  {
    employeeId: "usr009",
    employeeName: "Robert Taylor",
    role: "HR",
    weekSchedule: generateWeekSchedule([
      ["Morning"],
      ["Morning"],
      ["Morning"],
      ["Morning"],
      ["Morning"],
      null,
      null,
    ]),
  },
];

// Team-based schedules (grouped by department)
export const teamSchedules = {
  Sales: employeeSchedules.filter(e => e.role.includes("Sales")),
  "Customer Service": employeeSchedules.filter(e => e.role === "Customer Service"),
  Operations: employeeSchedules.filter(e => e.role === "Operations"),
  Marketing: employeeSchedules.filter(e => e.role === "Marketing"),
  HR: employeeSchedules.filter(e => e.role === "HR"),
  All: employeeSchedules,
};

// Get current week start (Monday)
export function getCurrentWeekStart(): Date {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

// Get user's own schedule based on logged-in user ID
export function getCurrentUserSchedule(userId: string = currentLoggedInUserId): EmployeeSchedule | undefined {
  return employeeSchedules.find(schedule => schedule.employeeId === userId);
}
