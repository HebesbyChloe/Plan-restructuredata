import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar, Download, ArrowUpDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { TeamTimesheetTable } from "../../Modules/Workspace/TeamTimesheetTable";
import { TimesheetEntry } from "../../../sampledata/timesheetData";
import { format } from "date-fns";

interface TeamTimesheetPageProps {
  timesheetSortBy: "employee" | "date" | "status";
  setTimesheetSortBy: (value: "employee" | "date" | "status") => void;
  selectedEmployee: string;
  setSelectedEmployee: (value: string) => void;
  selectedTeam: string;
  setSelectedTeam: (value: string) => void;
  weekStart: Date;
  weekEnd: Date;
  handleExportTimesheet: () => void;
  teamTimesheetEntries: TimesheetEntry[];
}

export function TeamTimesheetPage({
  timesheetSortBy,
  setTimesheetSortBy,
  selectedEmployee,
  setSelectedEmployee,
  selectedTeam,
  setSelectedTeam,
  weekStart,
  weekEnd,
  handleExportTimesheet,
  teamTimesheetEntries,
}: TeamTimesheetPageProps) {
  return (
    <div className="space-y-6">
      {/* Action Bar - Team Timesheet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-purple-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left Side Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Sort Dropdown */}
              <Select value={timesheetSortBy} onValueChange={(value: "employee" | "date" | "status") => setTimesheetSortBy(value)}>
                <SelectTrigger className="w-[160px] h-8">
                  <ArrowUpDown className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">By Employee</SelectItem>
                  <SelectItem value="date">By Date</SelectItem>
                  <SelectItem value="status">By Status</SelectItem>
                </SelectContent>
              </Select>

              {/* Employee Filter */}
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Filter by employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Employees</SelectItem>
                  <SelectItem value="emp1">Sarah Johnson</SelectItem>
                  <SelectItem value="emp2">Michael Chen</SelectItem>
                  <SelectItem value="emp3">Emily Rodriguez</SelectItem>
                  <SelectItem value="emp4">David Kim</SelectItem>
                  <SelectItem value="emp5">Lisa Anderson</SelectItem>
                </SelectContent>
              </Select>

              {/* Team Filter */}
              <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                <SelectTrigger className="w-[180px] h-8">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Teams</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Customer Service">Customer Service</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Right Side - Date Range & Export */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Date Range */}
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
                </span>
              </div>

              {/* Export Button */}
              <Button
                onClick={handleExportTimesheet}
                size="sm"
                variant="outline"
                className="h-8 border-ai-blue/30 hover:bg-ai-blue/10"
              >
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <TeamTimesheetTable entries={teamTimesheetEntries} teamFilter={selectedTeam} sortBy={timesheetSortBy} />
    </div>
  );
}
