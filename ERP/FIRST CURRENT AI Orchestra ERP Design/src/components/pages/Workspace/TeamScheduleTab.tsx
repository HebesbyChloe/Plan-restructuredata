import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar, ChevronLeft, ChevronRight, Plus, TableProperties, BarChart3, Users } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  WeeklyScheduleView,
  ShiftTimelineView,
  RequestsAdminCard,
} from "../../Modules/Workspace";
import { ScheduleRequest } from "../../../sampledata/SampleRequestSchedule";
import { EmployeeSchedule } from "../../../sampledata/computed/shiftScheduleData";
import { format } from "date-fns";

interface TeamScheduleTabProps {
  scheduleViewType: "table" | "timeline";
  setScheduleViewType: (type: "table" | "timeline") => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  weekStart: Date;
  weekEnd: Date;
  handlePreviousWeek: () => void;
  handleThisWeek: () => void;
  handleNextWeek: () => void;
  setRequestPanelOpen: (open: boolean) => void;
  scheduleToDisplay: EmployeeSchedule[];
  managerRequests: ScheduleRequest[];
  isAdmin: boolean;
  handleApproveRequest: (requestId: string) => void;
  handleRejectRequest: (requestId: string) => void;
  handleRequestClick: (request: ScheduleRequest) => void;
}

export function TeamScheduleTab({
  scheduleViewType,
  setScheduleViewType,
  selectedTeam,
  setSelectedTeam,
  weekStart,
  weekEnd,
  handlePreviousWeek,
  handleThisWeek,
  handleNextWeek,
  setRequestPanelOpen,
  scheduleToDisplay,
  managerRequests,
  isAdmin,
  handleApproveRequest,
  handleRejectRequest,
  handleRequestClick,
}: TeamScheduleTabProps) {
  return (
    <div className="space-y-6">
      {/* Action Bar - Team Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-purple-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left Side - View Type Toggle, Team Selector, and Request Button */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
                <Button
                  variant={scheduleViewType === "table" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setScheduleViewType("table")}
                  className="h-8"
                >
                  <TableProperties className="w-4 h-4 mr-1" />
                  Table
                </Button>
                <Button
                  variant={scheduleViewType === "timeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setScheduleViewType("timeline")}
                  className="h-8"
                >
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Timeline
                </Button>
              </div>

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

              <Button
                onClick={() => setRequestPanelOpen(true)}
                className="bg-ai-blue hover:bg-ai-blue/90 h-8"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Request
              </Button>
            </div>

            {/* Right Side - Week Navigation */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePreviousWeek}
                  className="h-8"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleThisWeek}
                  className="h-8 px-3"
                >
                  This Week
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextWeek}
                  className="h-8"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {format(weekStart, "MMM dd")} - {format(weekEnd, "MMM dd, yyyy")}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Content */}
      <div className="space-y-6">
        {/* Schedule Table with max 14 rows */}
        <Card className="p-6 bg-background/50 backdrop-blur-sm">
          <div className="max-h-[840px] overflow-y-auto">
            {scheduleToDisplay.length > 0 ? (
              scheduleViewType === "timeline" ? (
                <ShiftTimelineView schedules={scheduleToDisplay.slice(0, 14)} weekStart={weekStart} />
              ) : (
                <WeeklyScheduleView schedules={scheduleToDisplay.slice(0, 14)} weekStart={weekStart} />
              )
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No schedules found for the selected team
                </p>
              </div>
            )}
          </div>
          {scheduleToDisplay.length > 14 && (
            <p className="text-xs text-muted-foreground text-center mt-4 pt-4 border-t">
              Showing 14 of {scheduleToDisplay.length} entries. Scroll to view more.
            </p>
          )}
        </Card>

        {/* Requests - Full Width at Bottom */}
        {isAdmin && (
          <RequestsAdminCard
            requests={managerRequests}
            onApprove={handleApproveRequest}
            onReject={handleRejectRequest}
            showActions={true}
            onRequestClick={handleRequestClick}
          />
        )}
      </div>
    </div>
  );
}
