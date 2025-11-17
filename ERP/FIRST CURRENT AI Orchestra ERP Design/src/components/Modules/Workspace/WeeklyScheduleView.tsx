import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Sun, Moon, Sunset, Clock, BriefcaseBusiness, Calendar } from "lucide-react";
import { EmployeeSchedule, ShiftType } from "../../../sampledata/computed/shiftScheduleData";
import { SHIFT_TYPES } from "../../../lib/config/constants";

interface WeeklyScheduleViewProps {
  schedules: EmployeeSchedule[];
  weekStart: Date;
}

const shiftIcons: Record<ShiftType, any> = {
  "Night": Moon,
  "Morning": Sun,
  "Office Hours": BriefcaseBusiness,
  "Full": Clock,
  "Evening": Sunset,
  "Custom": Calendar,
};

const shiftBadgeColors: Record<ShiftType, string> = {
  "Night": "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
  "Morning": "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
  "Office Hours": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  "Full": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  "Evening": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  "Custom": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

export function WeeklyScheduleView({ schedules, weekStart }: WeeklyScheduleViewProps) {
  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  
  const getDateForDay = (dayIndex: number) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + dayIndex);
    return date;
  };

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px]">
        {/* Header Row */}
        <div className="grid grid-cols-8 gap-2 mb-4">
          <div className="font-semibold">Employee</div>
          {daysOfWeek.map((day, index) => {
            const date = getDateForDay(index);
            return (
              <div key={day} className="text-center">
                <div className="font-semibold">{day}</div>
                <div className="text-xs text-muted-foreground">
                  {date.getDate()}/{date.getMonth() + 1}
                </div>
              </div>
            );
          })}
        </div>

        {/* Schedule Rows */}
        <div className="space-y-2">
          {schedules.map((schedule, employeeIndex) => (
            <motion.div
              key={schedule.employeeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: employeeIndex * 0.05 }}
            >
              <Card className="p-3 bg-background/50 backdrop-blur-sm">
                <div className="grid grid-cols-8 gap-2 items-center">
                  {/* Employee Info */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ai-blue/20 to-purple-500/20 flex items-center justify-center">
                      <span className="text-xs font-semibold">
                        {schedule.employeeName.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm mb-0 truncate">
                        {schedule.employeeName}
                      </p>
                      <p className="text-xs text-muted-foreground mb-0 truncate">
                        {schedule.role}
                      </p>
                    </div>
                  </div>

                  {/* Days */}
                  {schedule.weekSchedule.map((dayShift, dayIndex) => (
                    <div key={dayIndex} className="flex flex-col gap-1 items-center justify-center">
                      {dayShift.shifts.length === 0 ? (
                        <div className="text-center text-xs text-muted-foreground py-2">
                          Off
                        </div>
                      ) : (
                        dayShift.shifts.map((shift, shiftIndex) => {
                          const Icon = shiftIcons[shift];
                          const badgeColor = shiftBadgeColors[shift];
                          const displayLabel = shift === "Office Hours" ? "Office" : 
                                             shift === "Custom" ? "Custom" : 
                                             shift.substring(0, 3);
                          return (
                            <Badge
                              key={shiftIndex}
                              className={`${badgeColor} justify-center text-xs py-1 border-0`}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {displayLabel}
                            </Badge>
                          );
                        })
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
