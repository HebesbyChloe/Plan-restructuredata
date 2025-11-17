import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Calendar, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  RequestsCard,
  HoursSummaryCards,
  TimesheetTable,
} from "../../Modules/Workspace";
import { ScheduleRequest } from "../../../sampledata/SampleRequestSchedule";
import { TimesheetEntry } from "../../../sampledata/timesheetData";
import { format } from "date-fns";

interface MyTimesheetTabProps {
  myTimesheetDateFilter: string;
  setMyTimesheetDateFilter: (value: string) => void;
  myTimesheetStatusFilter: string;
  setMyTimesheetStatusFilter: (value: string) => void;
  weekStart: Date;
  weekEnd: Date;
  scheduledWeekHours: number;
  weekHours: number;
  monthHours: number;
  userTimesheetEntries: TimesheetEntry[];
  userScheduleRequests: ScheduleRequest[];
  currentLoggedInUserId: string;
  handleCancelRequest: (requestId: string) => void;
  handleRequestClick: (request: ScheduleRequest) => void;
}

export function MyTimesheetTab({
  myTimesheetDateFilter,
  setMyTimesheetDateFilter,
  myTimesheetStatusFilter,
  setMyTimesheetStatusFilter,
  weekStart,
  weekEnd,
  scheduledWeekHours,
  weekHours,
  monthHours,
  userTimesheetEntries,
  userScheduleRequests,
  currentLoggedInUserId,
  handleCancelRequest,
  handleRequestClick,
}: MyTimesheetTabProps) {
  return (
    <div className="space-y-6">
      {/* Hours Summary Cards - This Week */}
      <HoursSummaryCards
        scheduledHours={scheduledWeekHours}
        workedHours={weekHours}
        monthHours={monthHours}
      />

      {/* Filters Bar - My Timesheet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-purple-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left Side - Filters */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold">Filters:</span>
              </div>

              {/* Date Range Filter */}
              <Select value={myTimesheetDateFilter} onValueChange={setMyTimesheetDateFilter}>
                <SelectTrigger className="w-[180px] h-8">
                  <Calendar className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-14-days">Last 14 Days</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={myTimesheetStatusFilter} onValueChange={setMyTimesheetStatusFilter}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right Side - Date Range Display */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Timesheet Table with max 14 rows */}
      <Card className="p-6 bg-background/50 backdrop-blur-sm">
        <div className="max-h-[840px] overflow-y-auto">
          <TimesheetTable entries={userTimesheetEntries.slice(0, 14)} showEmployeeName={false} />
        </div>
        {userTimesheetEntries.length > 14 && (
          <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t">
            Showing 14 of {userTimesheetEntries.length} entries. Scroll to view more.
          </p>
        )}
      </Card>

      {/* Requests - Full Width at Bottom */}
      <RequestsCard
        requests={userScheduleRequests}
        onCancel={handleCancelRequest}
        showCancelButton={true}
        currentUserId={currentLoggedInUserId}
        onRequestClick={handleRequestClick}
      />
    </div>
  );
}
