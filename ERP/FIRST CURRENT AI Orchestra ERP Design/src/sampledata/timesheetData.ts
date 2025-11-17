export interface TimesheetEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  clockIn: string; // HH:mm format
  clockOut: string; // HH:mm format
  breakDuration: number; // minutes
  totalHours: number;
  shiftType: "Full" | "Morning" | "Evening" | "Night";
  status: "completed" | "ongoing" | "pending";
  notes?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

// Shift type hour definitions
export const shiftHours = {
  Full: 8,
  Morning: 4,
  Evening: 4,
  Night: 8,
};

// Helper to calculate hours between two times
function calculateHours(clockIn: string, clockOut: string, breakMinutes: number = 0): number {
  const [inHour, inMin] = clockIn.split(':').map(Number);
  const [outHour, outMin] = clockOut.split(':').map(Number);
  
  let totalMinutes = (outHour * 60 + outMin) - (inHour * 60 + inMin);
  
  // Handle overnight shifts
  if (totalMinutes < 0) {
    totalMinutes += 24 * 60;
  }
  
  totalMinutes -= breakMinutes;
  return Math.round((totalMinutes / 60) * 100) / 100; // Round to 2 decimals
}

// Generate timesheet entries for the current month
function generateTimesheetEntries(): TimesheetEntry[] {
  const entries: TimesheetEntry[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  // Get first day of current month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  // Generate entries for Anna Thompson (usr001) - logged in user
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;
    
    // Determine if this is a past, present, or future date
    const isPast = date < today;
    const isToday = date.toDateString() === today.toDateString();
    
    let status: "completed" | "ongoing" | "pending" = "pending";
    let clockIn = "";
    let clockOut = "";
    let breakDuration = 0;
    let shiftType: "Full" | "Morning" | "Evening" | "Night" = "Full";
    
    if (isPast) {
      status = "completed";
      // Vary the shifts based on day patterns
      if (dayOfWeek === 4) { // Thursday - Evening shift
        shiftType = "Evening";
        clockIn = "14:00";
        clockOut = "18:00";
        breakDuration = 0;
      } else if (day === 7) { // One day with double shift
        shiftType = "Full";
        clockIn = "09:00";
        clockOut = "22:00"; // Extended day
        breakDuration = 90; // 1.5 hour break
      } else {
        shiftType = "Full";
        clockIn = "09:00";
        clockOut = "17:30";
        breakDuration = 30;
      }
    } else if (isToday) {
      status = "ongoing";
      shiftType = "Full";
      clockIn = "09:00";
      clockOut = "--:--";
      breakDuration = 0;
    } else {
      // Future dates - pending
      status = "pending";
      shiftType = "Full";
      clockIn = "--:--";
      clockOut = "--:--";
      breakDuration = 0;
    }
    
    const totalHours = status === "completed" 
      ? calculateHours(clockIn, clockOut, breakDuration)
      : status === "ongoing"
        ? 0
        : 0;
    
    entries.push({
      id: `ts_${date.getTime()}`,
      employeeId: "usr001",
      employeeName: "Anna Thompson",
      date,
      clockIn,
      clockOut,
      breakDuration,
      totalHours,
      shiftType,
      status,
      notes: day === 7 ? "Extended shift to cover for team member" : undefined,
      approvedBy: status === "completed" ? "Michael Johnson" : undefined,
      approvedAt: status === "completed" ? new Date(date.getTime() + 86400000) : undefined,
    });
  }
  
  return entries.reverse(); // Most recent first
}

export const timesheetEntries = generateTimesheetEntries();

// Generate team timesheet entries (for all employees)
function generateTeamTimesheetEntries(): TimesheetEntry[] {
  const entries: TimesheetEntry[] = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const employees = [
    { id: "usr001", name: "Anna Thompson" },
    { id: "usr002", name: "John Smith" },
    { id: "usr003", name: "Sarah Chen" },
    { id: "usr004", name: "Mike Johnson" },
    { id: "usr005", name: "Emma Wilson" },
  ];
  
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  
  employees.forEach((employee) => {
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dayOfWeek = date.getDay();
      
      if (dayOfWeek === 0 || dayOfWeek === 6) continue;
      
      const isPast = date < today;
      const isToday = date.toDateString() === today.toDateString();
      
      let status: "completed" | "ongoing" | "pending" = "pending";
      let clockIn = "";
      let clockOut = "";
      let breakDuration = 0;
      let shiftType: "Full" | "Morning" | "Evening" | "Night" = "Full";
      
      if (isPast) {
        status = "completed";
        const variation = (employee.id.charCodeAt(6) + day) % 3;
        
        if (variation === 0) {
          shiftType = "Morning";
          clockIn = "07:00";
          clockOut = "11:00";
          breakDuration = 0;
        } else if (variation === 1) {
          shiftType = "Evening";
          clockIn = "14:00";
          clockOut = "18:00";
          breakDuration = 0;
        } else {
          shiftType = "Full";
          clockIn = "09:00";
          clockOut = "17:30";
          breakDuration = 30;
        }
      } else if (isToday && employee.id !== "usr001") {
        status = "ongoing";
        shiftType = "Full";
        clockIn = "09:00";
        clockOut = "--:--";
        breakDuration = 0;
      } else {
        status = "pending";
        shiftType = "Full";
        clockIn = "--:--";
        clockOut = "--:--";
        breakDuration = 0;
      }
      
      const totalHours = status === "completed" 
        ? calculateHours(clockIn, clockOut, breakDuration)
        : 0;
      
      entries.push({
        id: `ts_${employee.id}_${date.getTime()}`,
        employeeId: employee.id,
        employeeName: employee.name,
        date,
        clockIn,
        clockOut,
        breakDuration,
        totalHours,
        shiftType,
        status,
        notes: undefined,
        approvedBy: status === "completed" ? undefined : undefined,
        approvedAt: undefined,
      });
    }
  });
  
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
}

export const teamTimesheetEntries = generateTeamTimesheetEntries();

// Helper functions
export function getTimesheetByEmployeeId(employeeId: string): TimesheetEntry[] {
  return timesheetEntries.filter(entry => entry.employeeId === employeeId);
}

export function getTimesheetByDateRange(
  employeeId: string,
  startDate: Date,
  endDate: Date
): TimesheetEntry[] {
  return timesheetEntries.filter(
    entry =>
      entry.employeeId === employeeId &&
      entry.date >= startDate &&
      entry.date <= endDate
  );
}

export function calculateTotalHours(entries: TimesheetEntry[]): number {
  return entries
    .filter(e => e.status === "completed")
    .reduce((sum, entry) => sum + entry.totalHours, 0);
}

export function getCurrentWeekHours(employeeId: string): number {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  const weekEntries = getTimesheetByDateRange(employeeId, monday, sunday);
  return calculateTotalHours(weekEntries);
}

export function getCurrentMonthHours(employeeId: string): number {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  const monthEntries = getTimesheetByDateRange(employeeId, firstDay, lastDay);
  return calculateTotalHours(monthEntries);
}

export function getWeeklyStats(employeeId: string) {
  const today = new Date();
  const currentDay = today.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
  const monday = new Date(today);
  monday.setDate(today.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  const weekEntries = getTimesheetByDateRange(employeeId, monday, sunday);
  const completedEntries = weekEntries.filter(e => e.status === "completed");
  const totalHours = calculateTotalHours(weekEntries);
  
  return {
    totalHours,
    daysWorked: completedEntries.length,
    averageHoursPerDay: completedEntries.length > 0 ? totalHours / completedEntries.length : 0,
  };
}

export function getMonthlyStats(employeeId: string) {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  lastDay.setHours(23, 59, 59, 999);
  
  const monthEntries = getTimesheetByDateRange(employeeId, firstDay, lastDay);
  const completedEntries = monthEntries.filter(e => e.status === "completed");
  const totalHours = calculateTotalHours(monthEntries);
  
  return {
    totalHours,
    daysWorked: completedEntries.length,
    averageHoursPerDay: completedEntries.length > 0 ? totalHours / completedEntries.length : 0,
  };
}
