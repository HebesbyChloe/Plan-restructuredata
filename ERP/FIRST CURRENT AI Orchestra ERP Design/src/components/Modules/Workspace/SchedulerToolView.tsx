import { useState } from "react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { Card } from "../../ui/card";
import { Switch } from "../../ui/switch";
import { Label } from "../../ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../../ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Input } from "../../ui/input";
import { EmployeeSchedule, ShiftType } from "../../../sampledata/computed/shiftScheduleData";
import { SHIFT_TYPES, SHIFT_REQUIREMENTS, ShiftRequirement } from "../../../lib/config/constants";
import { format, isSameDay, addDays, startOfWeek, addWeeks } from "date-fns";
import { Trash2, Clock, AlertCircle, Copy, CalendarOff, Settings2, ChevronDown, Users } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "../../ui/separator";

interface SchedulerToolViewProps {
  schedules: EmployeeSchedule[];
  weekStart: Date;
  showNineDays?: boolean;
  selectedTeam?: string;
  useUSTimezone?: boolean;
}

interface ShiftAssignment {
  employeeId: string;
  date: Date;
  shift: ShiftType;
  customHours?: { start: string; end: string };
}

interface Holiday {
  date: Date;
  name: string;
  employeeIds?: string[]; // If undefined, applies to all
}

interface CustomShiftDefinition {
  id: string;
  label: string;
  startHour: number;
  endHour: number;
  duration: number;
  color: string;
}

interface EmployeeHourLimits {
  minHours: number;
  maxHours: number;
}

// US Eastern Time offset from local (Vietnam is UTC+7, EST is UTC-5, so difference is -12 hours)
const US_TIMEZONE_OFFSET = -12;

export function SchedulerToolView({
  schedules,
  weekStart,
  showNineDays = false,
  selectedTeam = "All",
  useUSTimezone = false,
}: SchedulerToolViewProps) {
  const [assignments, setAssignments] = useState<ShiftAssignment[]>(() => {
    // Convert existing schedules to assignments
    const initial: ShiftAssignment[] = [];
    schedules.forEach((schedule) => {
      schedule.weekSchedule.forEach((dayShift) => {
        dayShift.shifts.forEach((shift) => {
          initial.push({
            employeeId: schedule.employeeId,
            date: dayShift.date,
            shift,
            customHours: dayShift.customHours,
          });
        });
      });
    });
    return initial;
  });

  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [customShifts, setCustomShifts] = useState<CustomShiftDefinition[]>([]);
  const [shiftRequirements, setShiftRequirements] = useState<Record<string, ShiftRequirement>>(SHIFT_REQUIREMENTS);
  const [employeeHourLimits, setEmployeeHourLimits] = useState<EmployeeHourLimits>({ minHours: 20, maxHours: 40 });
  const [addShiftDialogOpen, setAddShiftDialogOpen] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);
  const [customShiftPanelOpen, setCustomShiftPanelOpen] = useState(false);
  const [requirementDialogOpen, setRequirementDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ employeeId: string; date: Date } | null>(null);
  const [draggedShift, setDraggedShift] = useState<ShiftAssignment | null>(null);

  // Custom shift creation form state
  const [newShiftLabel, setNewShiftLabel] = useState("");
  const [newShiftStart, setNewShiftStart] = useState("09:00");
  const [newShiftEnd, setNewShiftEnd] = useState("17:00");
  const [newShiftColor, setNewShiftColor] = useState("bg-indigo-500");

  // Holiday form state
  const [holidayDate, setHolidayDate] = useState<Date | null>(null);
  const [holidayName, setHolidayName] = useState("");
  const [holidayApplyToAll, setHolidayApplyToAll] = useState(true);
  const [holidayEmployees, setHolidayEmployees] = useState<string[]>([]);

  // Requirement form state
  const [reqMorning, setReqMorning] = useState(4);
  const [reqAfternoon, setReqAfternoon] = useState(4);
  const [reqEvening, setReqEvening] = useState(3);
  const [reqNight, setReqNight] = useState(2);
  const [reqMinHours, setReqMinHours] = useState(20);
  const [reqMaxHours, setReqMaxHours] = useState(40);

  const today = new Date();

  // Calculate start date: if 9 days, start from Sunday; if 7 days, start from Monday
  const getDisplayStartDate = () => {
    if (showNineDays) {
      // Start from Sunday of the week
      return startOfWeek(weekStart, { weekStartsOn: 0 }); // 0 = Sunday
    }
    return weekStart; // Already Monday
  };

  const numDays = showNineDays ? 9 : 7;
  const displayStartDate = getDisplayStartDate();

  // Generate array of dates to display
  const displayDays = Array.from({ length: numDays }, (_, i) => {
    return addDays(displayStartDate, i);
  });

  // Get current requirements for selected team
  const currentRequirements = shiftRequirements[selectedTeam] || shiftRequirements["All"];

  // Check if a day is a holiday
  const isHoliday = (date: Date, employeeId?: string): Holiday | null => {
    return holidays.find((h) => {
      if (!isSameDay(h.date, date)) return false;
      if (!h.employeeIds) return true; // Applies to all
      return employeeId ? h.employeeIds.includes(employeeId) : false;
    }) || null;
  };

  // Calculate which date a shift appears on when considering timezone
  const getShiftDisplayDate = (originalDate: Date, startHour: number): Date => {
    if (!useUSTimezone) return originalDate;
    
    // When converting to US time, calculate day offset
    const usStartHour = startHour + US_TIMEZONE_OFFSET;
    
    // If US hour is negative, shift appears on previous day
    if (usStartHour < 0) {
      return addDays(originalDate, -1);
    }
    // If US hour is >= 24, shift appears on next day
    else if (usStartHour >= 24) {
      return addDays(originalDate, 1);
    }
    
    return originalDate;
  };

  // Calculate shift density distribution for each day (by time period) - based on people count
  const calculateDayDensity = (date: Date): { 
    morning: number; 
    afternoon: number; 
    evening: number; 
    night: number 
  } => {
    // Count unique people per period for this specific date
    const morningPeople = new Set<string>();
    const afternoonPeople = new Set<string>();
    const eveningPeople = new Set<string>();
    const nightPeople = new Set<string>();

    assignments.forEach((assignment) => {
      const config = SHIFT_TYPES[assignment.shift];
      const displayDate = getShiftDisplayDate(assignment.date, config.startHour);
      
      // Only count if this shift appears on the target date
      if (!isSameDay(displayDate, date)) return;

      let startHour = config.startHour;
      const duration = config.duration;

      // Adjust start hour for US timezone
      if (useUSTimezone) {
        startHour = (startHour + US_TIMEZONE_OFFSET) % 24;
        if (startHour < 0) startHour += 24;
      }

      // Check which periods this shift covers
      for (let hour = startHour; hour < startHour + duration; hour++) {
        const actualHour = hour % 24;
        if (actualHour >= 6 && actualHour < 12) {
          morningPeople.add(assignment.employeeId);
        } else if (actualHour >= 12 && actualHour < 18) {
          afternoonPeople.add(assignment.employeeId);
        } else if (actualHour >= 18 && actualHour < 24) {
          eveningPeople.add(assignment.employeeId);
        } else {
          nightPeople.add(assignment.employeeId);
        }
      }
    });

    // Calculate opacity as percentage of requirement (capped at 100%)
    return {
      morning: Math.min((morningPeople.size / currentRequirements.morning) * 100, 100),
      afternoon: Math.min((afternoonPeople.size / currentRequirements.afternoon) * 100, 100),
      evening: Math.min((eveningPeople.size / currentRequirements.evening) * 100, 100),
      night: Math.min((nightPeople.size / currentRequirements.night) * 100, 100),
    };
  };

  // Calculate total hours for an employee
  const calculateEmployeeHours = (employeeId: string): number => {
    return assignments
      .filter((a) => a.employeeId === employeeId)
      .reduce((total, assignment) => {
        const config = SHIFT_TYPES[assignment.shift];
        return total + config.duration;
      }, 0);
  };

  // Get assignments for specific employee and date (considering timezone)
  const getEmployeeShifts = (employeeId: string, date: Date): ShiftAssignment[] => {
    return assignments.filter((a) => {
      if (a.employeeId !== employeeId) return false;
      
      const config = SHIFT_TYPES[a.shift];
      const displayDate = getShiftDisplayDate(a.date, config.startHour);
      
      return isSameDay(displayDate, date);
    });
  };

  // Handle cell click to add shift
  const handleCellClick = (employeeId: string, date: Date) => {
    setSelectedCell({ employeeId, date });
    setAddShiftDialogOpen(true);
  };

  // Add shift from dialog
  const handleAddShift = (shiftType: ShiftType) => {
    if (!selectedCell) return;

    const newAssignment: ShiftAssignment = {
      employeeId: selectedCell.employeeId,
      date: selectedCell.date,
      shift: shiftType,
    };

    setAssignments([...assignments, newAssignment]);
    toast.success("Shift added successfully");
    setAddShiftDialogOpen(false);
    setSelectedCell(null);
  };

  // Remove shift
  const handleRemoveShift = (assignment: ShiftAssignment) => {
    setAssignments(
      assignments.filter(
        (a) =>
          !(
            a.employeeId === assignment.employeeId &&
            isSameDay(a.date, assignment.date) &&
            a.shift === assignment.shift
          )
      )
    );
    toast.success("Shift removed");
  };

  // Create custom shift type
  const handleCreateCustomShift = () => {
    if (!newShiftLabel.trim()) {
      toast.error("Please enter a shift name");
      return;
    }

    const [startH, startM] = newShiftStart.split(":").map(Number);
    const [endH, endM] = newShiftEnd.split(":").map(Number);
    const duration = endH - startH;

    if (duration <= 0) {
      toast.error("End time must be after start time");
      return;
    }

    const newCustomShift: CustomShiftDefinition = {
      id: `custom-${Date.now()}`,
      label: newShiftLabel,
      startHour: startH,
      endHour: endH,
      duration,
      color: newShiftColor,
    };

    setCustomShifts([...customShifts, newCustomShift]);
    toast.success(`Custom shift "${newShiftLabel}" created!`);
    
    // Reset form
    setNewShiftLabel("");
    setNewShiftStart("09:00");
    setNewShiftEnd("17:00");
    setCustomShiftPanelOpen(false);
  };

  // Add holiday
  const handleAddHoliday = () => {
    if (!holidayDate || !holidayName.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newHoliday: Holiday = {
      date: holidayDate,
      name: holidayName,
      employeeIds: holidayApplyToAll ? undefined : holidayEmployees,
    };

    setHolidays([...holidays, newHoliday]);
    
    // Remove all shifts on holiday
    if (holidayApplyToAll) {
      setAssignments(assignments.filter((a) => !isSameDay(a.date, holidayDate)));
    } else {
      setAssignments(
        assignments.filter(
          (a) => !(isSameDay(a.date, holidayDate) && holidayEmployees.includes(a.employeeId))
        )
      );
    }

    toast.success("Holiday added");
    setHolidayDialogOpen(false);
    setHolidayName("");
    setHolidayDate(null);
  };

  // Update shift requirements
  const handleUpdateRequirements = () => {
    const updatedRequirements = {
      ...shiftRequirements,
      [selectedTeam]: {
        team: selectedTeam,
        morning: reqMorning,
        afternoon: reqAfternoon,
        evening: reqEvening,
        night: reqNight,
      },
    };

    setShiftRequirements(updatedRequirements);
    setEmployeeHourLimits({ minHours: reqMinHours, maxHours: reqMaxHours });
    toast.success(`Requirements updated for ${selectedTeam}`);
    setRequirementDialogOpen(false);
  };

  // Open requirement dialog with current values
  const openRequirementDialog = () => {
    const current = currentRequirements;
    setReqMorning(current.morning);
    setReqAfternoon(current.afternoon);
    setReqEvening(current.evening);
    setReqNight(current.night);
    setReqMinHours(employeeHourLimits.minHours);
    setReqMaxHours(employeeHourLimits.maxHours);
    setRequirementDialogOpen(true);
  };

  // Duplicate to next week
  const handleDuplicateNextWeek = () => {
    const nextWeekStart = addWeeks(displayStartDate, 1);
    const newAssignments: ShiftAssignment[] = [];

    displayDays.forEach((day, index) => {
      const dayAssignments = assignments.filter((a) => isSameDay(a.date, day));
      dayAssignments.forEach((assignment) => {
        newAssignments.push({
          ...assignment,
          date: addDays(nextWeekStart, index),
        });
      });
    });

    setAssignments([...assignments, ...newAssignments]);
    toast.success("Schedule duplicated to next week");
  };

  // Duplicate to next 4 weeks
  const handleDuplicateNext4Weeks = () => {
    const newAssignments: ShiftAssignment[] = [...assignments];

    for (let weekOffset = 1; weekOffset <= 4; weekOffset++) {
      const targetWeekStart = addWeeks(displayStartDate, weekOffset);
      
      displayDays.forEach((day, index) => {
        const dayAssignments = assignments.filter((a) => isSameDay(a.date, day));
        dayAssignments.forEach((assignment) => {
          newAssignments.push({
            ...assignment,
            date: addDays(targetWeekStart, index),
          });
        });
      });
    }

    setAssignments(newAssignments);
    toast.success("Schedule duplicated to next 4 weeks");
  };

  // Drag and drop handlers
  const handleDragStart = (assignment: ShiftAssignment) => {
    setDraggedShift(assignment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (employeeId: string, date: Date) => {
    if (!draggedShift) return;

    // Remove old assignment
    const updatedAssignments = assignments.filter(
      (a) =>
        !(
          a.employeeId === draggedShift.employeeId &&
          isSameDay(a.date, draggedShift.date) &&
          a.shift === draggedShift.shift
        )
    );

    // Add new assignment at dropped location
    updatedAssignments.push({
      ...draggedShift,
      employeeId,
      date,
    });

    setAssignments(updatedAssignments);
    setDraggedShift(null);
    toast.success("Shift moved");
  };

  return (
    <div className="space-y-4">
      {/* Schedule Grid */}
      <div className="space-y-2 overflow-x-auto">
        {/* Header with Coverage Indicators */}
        <div className="flex gap-2 min-w-fit">
          <div className="w-[200px] flex-shrink-0">
            <div className="p-2">
              <p className="text-xs text-muted-foreground/60 mb-0">Employee</p>
            </div>
          </div>

          {displayDays.map((day, index) => {
            const isToday = isSameDay(day, today);
            const density = calculateDayDensity(day);
            const dayHoliday = isHoliday(day);
            
            return (
              <div key={index} className="flex-1 min-w-[120px]">
                <div className="text-center space-y-1">
                  <p
                    className={`text-[10px] mb-0 ${
                      isToday ? "text-ai-blue" : dayHoliday ? "text-red-500" : "text-muted-foreground/60"
                    }`}
                  >
                    {format(day, "EEE")}
                  </p>
                  <p
                    className={`text-xs mb-0 ${
                      isToday ? "text-ai-blue" : dayHoliday ? "text-red-500" : "text-muted-foreground/70"
                    }`}
                  >
                    {format(day, "MMM d")}
                  </p>
                  
                  {dayHoliday ? (
                    <div className="px-2">
                      <div className="bg-red-500/10 border border-red-500/20 rounded px-2 py-1">
                        <p className="text-[9px] text-red-600 mb-0">{dayHoliday.name}</p>
                      </div>
                    </div>
                  ) : (
                    /* Coverage Density Bars - No spacing, opacity based on people count */
                    <div className="px-2">
                      <div className="flex h-2.5 rounded overflow-hidden">
                        {/* Morning */}
                        <div
                          className="flex-1 bg-amber-500 transition-opacity"
                          style={{ opacity: density.morning / 100 }}
                          title={`Morning: ${Math.round(density.morning)}% staffed`}
                        />
                        {/* Afternoon */}
                        <div
                          className="flex-1 bg-ai-blue transition-opacity"
                          style={{ opacity: density.afternoon / 100 }}
                          title={`Afternoon: ${Math.round(density.afternoon)}% staffed`}
                        />
                        {/* Evening */}
                        <div
                          className="flex-1 bg-violet-500 transition-opacity"
                          style={{ opacity: density.evening / 100 }}
                          title={`Evening: ${Math.round(density.evening)}% staffed`}
                        />
                        {/* Night */}
                        <div
                          className="flex-1 bg-slate-500 transition-opacity"
                          style={{ opacity: density.night / 100 }}
                          title={`Night: ${Math.round(density.night)}% staffed`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Employee Rows */}
        <div className="space-y-2">
          {schedules.map((schedule, scheduleIdx) => {
            const totalHours = calculateEmployeeHours(schedule.employeeId);
            const isUnderScheduled = totalHours < employeeHourLimits.minHours;
            const isOverScheduled = totalHours > employeeHourLimits.maxHours;
            
            return (
              <motion.div
                key={schedule.employeeId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: scheduleIdx * 0.05 }}
                className="flex gap-2"
              >
                {/* Employee Info */}
                <div className="w-[200px] flex-shrink-0 bg-background/50 rounded-lg p-2 border border-border/50">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={schedule.avatar} alt={schedule.employeeName} />
                      <AvatarFallback className="text-xs">
                        {schedule.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate mb-0">{schedule.employeeName}</p>
                      <p className="text-[10px] text-muted-foreground/60 truncate mb-0">
                        {schedule.role}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-muted-foreground/50" />
                        <p
                          className={`text-[10px] mb-0 ${
                            isOverScheduled
                              ? "text-red-500"
                              : isUnderScheduled
                              ? "text-amber-500"
                              : "text-muted-foreground/70"
                          }`}
                        >
                          {totalHours}h {isOverScheduled && "⚠️"} {isUnderScheduled && "⬇️"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Day Cells */}
                {displayDays.map((day, dayIdx) => {
                  const dayShifts = getEmployeeShifts(schedule.employeeId, day);
                  const isToday = isSameDay(day, today);
                  const cellHoliday = isHoliday(day, schedule.employeeId);

                  return (
                    <div
                      key={dayIdx}
                      className={`flex-1 min-w-[120px] min-h-[70px] rounded-lg border-2 p-2 transition-all cursor-pointer ${
                        cellHoliday
                          ? "border-red-300 bg-red-50/50 dark:bg-red-950/20"
                          : isToday
                          ? "border-ai-blue/30 bg-ai-blue/5 hover:border-ai-blue/50"
                          : "border-dashed border-border/50 bg-background/30 hover:border-ai-blue/30 hover:bg-ai-blue/5"
                      }`}
                      onClick={() => !cellHoliday && handleCellClick(schedule.employeeId, day)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(schedule.employeeId, day)}
                    >
                      {cellHoliday ? (
                        <div className="text-center text-[10px] text-red-500 py-2">
                          Holiday
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {dayShifts.length === 0 ? (
                            <div className="text-center text-[10px] text-muted-foreground/40 py-2">
                              Click to add
                            </div>
                          ) : (
                            dayShifts.map((assignment, shiftIdx) => {
                              const config = SHIFT_TYPES[assignment.shift];
                              
                              return (
                                <div
                                  key={shiftIdx}
                                  draggable
                                  onDragStart={() => handleDragStart(assignment)}
                                  className="group relative cursor-move"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Badge
                                    className={`${config.color} w-full justify-between text-[10px] py-1 px-2 cursor-move hover:opacity-80 transition-opacity`}
                                  >
                                    <span className="truncate">{config.label}</span>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveShift(assignment);
                                      }}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                </div>
                              );
                            })
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-xs text-muted-foreground">Shift Types:</span>
            <div className="flex items-center gap-3 flex-wrap">
              {Object.entries(SHIFT_TYPES).map(([key, config]) => (
                <div key={key} className="flex items-center gap-1.5">
                  <div className={`w-6 h-2 rounded-sm ${config.color}`} />
                  <span className="text-[10px] text-muted-foreground/60">
                    {config.label} ({config.duration}h)
                  </span>
                </div>
              ))}
              {customShifts.map((shift) => (
                <div key={shift.id} className="flex items-center gap-1.5">
                  <div className={`w-6 h-2 rounded-sm ${shift.color}`} />
                  <span className="text-[10px] text-muted-foreground/60">
                    {shift.label} ({shift.duration}h)
                  </span>
                </div>
              ))}
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-6 flex-wrap">
            <span className="text-xs text-muted-foreground">Coverage Density:</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 rounded-sm bg-amber-500" />
                <span className="text-[10px] text-muted-foreground/60">Morning (6-12)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 rounded-sm bg-ai-blue" />
                <span className="text-[10px] text-muted-foreground/60">Afternoon (12-18)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 rounded-sm bg-violet-500" />
                <span className="text-[10px] text-muted-foreground/60">Evening (18-24)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-2 rounded-sm bg-slate-500" />
                <span className="text-[10px] text-muted-foreground/60">Night (0-6)</span>
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground/50 ml-auto">
              Opacity = % of required staff ({selectedTeam}: {currentRequirements.morning}M / {currentRequirements.afternoon}A / {currentRequirements.evening}E / {currentRequirements.night}N) • Hours: {employeeHourLimits.minHours}-{employeeHourLimits.maxHours}/week
            </span>
          </div>
        </div>
      </Card>

      {/* Custom Shift Panel */}
      <Sheet open={customShiftPanelOpen} onOpenChange={setCustomShiftPanelOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Create Custom Shift Type</SheetTitle>
            <SheetDescription>
              Define a new shift type to use in scheduling
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label>Shift Name</Label>
              <Input
                placeholder="e.g., Split Shift"
                value={newShiftLabel}
                onChange={(e) => setNewShiftLabel(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time</Label>
                <Input
                  type="time"
                  value={newShiftStart}
                  onChange={(e) => setNewShiftStart(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Time</Label>
                <Input
                  type="time"
                  value={newShiftEnd}
                  onChange={(e) => setNewShiftEnd(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <Select value={newShiftColor} onValueChange={setNewShiftColor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bg-indigo-500">Indigo</SelectItem>
                  <SelectItem value="bg-purple-500">Purple</SelectItem>
                  <SelectItem value="bg-pink-500">Pink</SelectItem>
                  <SelectItem value="bg-rose-500">Rose</SelectItem>
                  <SelectItem value="bg-cyan-500">Cyan</SelectItem>
                  <SelectItem value="bg-teal-500">Teal</SelectItem>
                  <SelectItem value="bg-lime-500">Lime</SelectItem>
                </SelectContent>
              </Select>
              <div className={`h-8 rounded ${newShiftColor}`} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Registered Custom Shifts</Label>
              {customShifts.length === 0 ? (
                <p className="text-sm text-muted-foreground">No custom shifts yet</p>
              ) : (
                <div className="space-y-1">
                  {customShifts.map((shift) => (
                    <div
                      key={shift.id}
                      className="flex items-center justify-between p-2 rounded bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${shift.color}`} />
                        <span className="text-sm">{shift.label}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {shift.duration}h
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleCreateCustomShift} className="w-full">
              Create Shift Type
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Shift Dialog */}
      <Dialog open={addShiftDialogOpen} onOpenChange={setAddShiftDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Shift Type</DialogTitle>
            <DialogDescription>
              Choose a shift to assign to{" "}
              {selectedCell &&
                schedules.find((s) => s.employeeId === selectedCell.employeeId)?.employeeName}{" "}
              on {selectedCell && format(selectedCell.date, "EEE, MMM dd")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 py-4">
            {Object.entries(SHIFT_TYPES).map(([key, config]) => (
              <Button
                key={key}
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:border-ai-blue hover:bg-ai-blue/5"
                onClick={() => handleAddShift(key as ShiftType)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded ${config.color}`} />
                  <span className="font-semibold text-sm">{config.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">{config.timeRange}</span>
                <span className="text-xs text-muted-foreground">{config.duration} hours</span>
              </Button>
            ))}
            {customShifts.map((shift) => (
              <Button
                key={shift.id}
                variant="outline"
                className="h-auto flex-col items-start p-4 hover:border-ai-blue hover:bg-ai-blue/5"
                onClick={() => handleAddShift(shift.label as ShiftType)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-4 h-4 rounded ${shift.color}`} />
                  <span className="font-semibold text-sm">{shift.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {shift.startHour}:00 - {shift.endHour}:00
                </span>
                <span className="text-xs text-muted-foreground">{shift.duration} hours</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Holiday Dialog */}
      <Dialog open={holidayDialogOpen} onOpenChange={setHolidayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Holiday</DialogTitle>
            <DialogDescription>
              Mark a day as holiday and remove all shifts
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Holiday Name</Label>
              <Input
                placeholder="e.g., Christmas Day"
                value={holidayName}
                onChange={(e) => setHolidayName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Date</Label>
              <Select
                value={holidayDate ? holidayDate.toISOString() : ""}
                onValueChange={(value) => setHolidayDate(new Date(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select date" />
                </SelectTrigger>
                <SelectContent>
                  {displayDays.map((day, idx) => (
                    <SelectItem key={idx} value={day.toISOString()}>
                      {format(day, "EEE, MMM dd, yyyy")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                checked={holidayApplyToAll}
                onCheckedChange={setHolidayApplyToAll}
                id="apply-all"
              />
              <Label htmlFor="apply-all">Apply to all employees</Label>
            </div>

            {!holidayApplyToAll && (
              <div className="space-y-2">
                <Label>Select Employees</Label>
                <div className="max-h-[200px] overflow-y-auto space-y-1 border rounded-lg p-2">
                  {schedules.map((schedule) => (
                    <div key={schedule.employeeId} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={schedule.employeeId}
                        checked={holidayEmployees.includes(schedule.employeeId)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setHolidayEmployees([...holidayEmployees, schedule.employeeId]);
                          } else {
                            setHolidayEmployees(
                              holidayEmployees.filter((id) => id !== schedule.employeeId)
                            );
                          }
                        }}
                        className="rounded"
                      />
                      <label htmlFor={schedule.employeeId} className="text-sm cursor-pointer">
                        {schedule.employeeName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setHolidayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddHoliday} className="bg-ai-blue hover:bg-ai-blue/90">
              Add Holiday
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Set Shift Requirements Dialog */}
      <Dialog open={requirementDialogOpen} onOpenChange={setRequirementDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Set Shift Requirements</DialogTitle>
            <DialogDescription>
              Define staffing needs and employee hour limits for {selectedTeam}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Staffing Requirements */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Staffing Requirements per Time Period</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-amber-500" />
                    Morning Staff (6am-12pm)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={reqMorning}
                    onChange={(e) => setReqMorning(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-ai-blue" />
                    Afternoon Staff (12pm-6pm)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={reqAfternoon}
                    onChange={(e) => setReqAfternoon(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-violet-500" />
                    Evening Staff (6pm-12am)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={reqEvening}
                    onChange={(e) => setReqEvening(parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-slate-500" />
                    Night Staff (12am-6am)
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={reqNight}
                    onChange={(e) => setReqNight(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Employee Hour Limits */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold">Employee Weekly Hour Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Minimum Hours/Week
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={reqMinHours}
                    onChange={(e) => setReqMinHours(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">⬇️ Shows when below minimum</p>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    Maximum Hours/Week
                  </Label>
                  <Input
                    type="number"
                    min="0"
                    value={reqMaxHours}
                    onChange={(e) => setReqMaxHours(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">⚠️ Shows when exceeds maximum</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-muted-foreground bg-muted/30 p-3 rounded">
              <p className="mb-1">Coverage bars show opacity based on staffing requirements.</p>
              <p className="mb-0">Example: If Morning requires 4 people and 2 are assigned = 50% opacity</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRequirementDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateRequirements} className="bg-ai-blue hover:bg-ai-blue/90">
              Update Requirements
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
