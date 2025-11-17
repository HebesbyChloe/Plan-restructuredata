import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { EmployeeSchedule, ShiftType } from "../../../sampledata/computed/shiftScheduleData";
import { SHIFT_TYPES } from "../../../lib/config/constants";
import { format, isSameDay } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../ui/tooltip";

interface ShiftTimelineViewProps {
  schedules: EmployeeSchedule[];
  weekStart: Date;
}

function ShiftBar({ shift, customHours }: { shift: ShiftType; customHours?: { start: string; end: string } }) {
  const config = SHIFT_TYPES[shift];
  const leftPosition = (config.startHour / 24) * 100;
  const width = (config.duration / 24) * 100;

  const displayTimeRange = shift === "Custom" && customHours 
    ? `${customHours.start} - ${customHours.end}`
    : config.timeRange;

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`absolute h-full ${config.color} rounded transition-opacity hover:opacity-80 cursor-pointer`}
            style={{
              left: `${leftPosition}%`,
              width: `${width}%`,
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="mb-0">{config.label} Shift</p>
            <p className="text-xs text-muted-foreground mb-0">{displayTimeRange}</p>
            <p className="text-xs text-muted-foreground mb-0">{config.duration}h</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function DayColumn({ 
  dayShift, 
  isToday 
}: { 
  dayShift: { date: Date; shifts: ShiftType[]; customHours?: { start: string; end: string } };
  isToday: boolean;
}) {
  const hasShifts = dayShift.shifts.length > 0;

  return (
    <div className="flex-1 min-w-[70px]">
      <div
        className={`relative h-7 rounded overflow-hidden transition-all ${
          isToday 
            ? "bg-ai-blue/5 ring-1 ring-ai-blue/20" 
            : hasShifts 
            ? "bg-muted/20" 
            : "bg-muted/10"
        }`}
      >
        {hasShifts ? (
          dayShift.shifts.map((shift, idx) => (
            <ShiftBar key={`${shift}-${idx}`} shift={shift} customHours={dayShift.customHours} />
          ))
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-[10px] text-muted-foreground/40">Off</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function ShiftTimelineView({ schedules, weekStart }: ShiftTimelineViewProps) {
  const today = new Date();
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  return (
    <div className="space-y-3">
      {/* Timeline Header */}
      <div className="flex gap-3">
        {/* Employee column header */}
        <div className="w-[180px] flex-shrink-0">
          <p className="text-xs text-muted-foreground/60 mb-0">Employee</p>
        </div>
        
        {/* Day headers */}
        <div className="flex-1 flex gap-2">
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, today);
            return (
              <div key={index} className="flex-1 min-w-[70px]">
                <div className="text-center">
                  <p className={`text-[10px] mb-0 ${isToday ? "text-ai-blue" : "text-muted-foreground/60"}`}>
                    {format(day, "EEE")}
                  </p>
                  <p className={`text-xs mb-0 ${isToday ? "text-ai-blue" : "text-muted-foreground/70"}`}>
                    {format(day, "MMM d")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee Rows */}
      <div className="space-y-2">
        {schedules.map((schedule, scheduleIdx) => (
          <motion.div
            key={schedule.employeeId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: scheduleIdx * 0.05 }}
            className="flex gap-3 items-center"
          >
            {/* Employee Info */}
            <div className="w-[180px] flex-shrink-0 flex items-center gap-2">
              <Avatar className="w-7 h-7">
                <AvatarImage src={schedule.avatar} alt={schedule.employeeName} />
                <AvatarFallback className="text-xs">
                  {schedule.employeeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="truncate mb-0 text-sm">{schedule.employeeName}</p>
                <p className="text-[10px] text-muted-foreground/60 truncate mb-0">{schedule.role}</p>
              </div>
            </div>

            {/* Timeline Days */}
            <div className="flex-1 flex gap-2">
              {schedule.weekSchedule.map((dayShift, dayIdx) => {
                const isToday = isSameDay(dayShift.date, today);
                return (
                  <DayColumn
                    key={dayIdx}
                    dayShift={dayShift}
                    isToday={isToday}
                  />
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 pt-3 mt-1 border-t border-border/30">
        <span className="text-[10px] text-muted-foreground/50">Shift Types:</span>
        <div className="flex items-center gap-3 flex-wrap">
          {Object.entries(SHIFT_TYPES).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={`w-6 h-2 rounded-sm ${config.color}`} />
              <span className="text-[10px] text-muted-foreground/60">
                {config.label} ({config.duration}h)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
