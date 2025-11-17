import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Switch } from "../../ui/switch";
import { Calendar, ChevronLeft, ChevronRight, Globe, ChevronDown, Settings2, Users, CalendarOff, Copy } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { SchedulerToolView, RequestsAdminCard } from "../../Modules/Workspace";
import { ScheduleRequest } from "../../../sampledata/SampleRequestSchedule";
import { EmployeeSchedule } from "../../../sampledata/computed/shiftScheduleData";
import { format } from "date-fns";

interface SchedulerToolTabProps {
  showNineDays: boolean;
  setShowNineDays: (show: boolean) => void;
  useUSTimezone: boolean;
  setUseUSTimezone: (use: boolean) => void;
  selectedTeam: string;
  setSelectedTeam: (team: string) => void;
  weekStart: Date;
  weekEnd: Date;
  handlePreviousWeek: () => void;
  handleThisWeek: () => void;
  handleNextWeek: () => void;
  scheduleToDisplay: EmployeeSchedule[];
  managerRequests: ScheduleRequest[];
  handleApproveRequest: (requestId: string) => void;
  handleRejectRequest: (requestId: string) => void;
  handleRequestClick: (request: ScheduleRequest) => void;
  setCustomShiftPanelOpen: (open: boolean) => void;
  openRequirementDialog: () => void;
  setHolidayDialogOpen: (open: boolean) => void;
  handleDuplicateNextWeek: () => void;
  handleDuplicateNext4Weeks: () => void;
}

export function SchedulerToolTab({
  showNineDays,
  setShowNineDays,
  useUSTimezone,
  setUseUSTimezone,
  selectedTeam,
  setSelectedTeam,
  weekStart,
  weekEnd,
  handlePreviousWeek,
  handleThisWeek,
  handleNextWeek,
  scheduleToDisplay,
  managerRequests,
  handleApproveRequest,
  handleRejectRequest,
  handleRequestClick,
  setCustomShiftPanelOpen,
  openRequirementDialog,
  setHolidayDialogOpen,
  handleDuplicateNextWeek,
  handleDuplicateNext4Weeks,
}: SchedulerToolTabProps) {
  return (
    <div className="space-y-6">
      {/* Action Bar - Scheduler Tool */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card className="p-4 bg-gradient-to-br from-ai-blue/5 to-purple-500/5 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Left Side Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-ai-blue hover:bg-ai-blue/90 h-8">
                    Actions
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem onClick={() => setCustomShiftPanelOpen(true)}>
                    <Settings2 className="w-4 h-4 mr-2" />
                    Custom Shift
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={openRequirementDialog}>
                    <Users className="w-4 h-4 mr-2" />
                    Set Requirements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setHolidayDialogOpen(true)}>
                    <CalendarOff className="w-4 h-4 mr-2" />
                    Add Holiday
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleDuplicateNextWeek}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Next Week
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDuplicateNext4Weeks}>
                    <Copy className="w-4 h-4 mr-2" />
                    Duplicate Next 4 Weeks
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* 7/9 Days Toggle */}
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <Label htmlFor="days-toggle" className="text-xs cursor-pointer whitespace-nowrap">
                  {showNineDays ? "9 Days" : "7 Days"}
                </Label>
                <Switch
                  id="days-toggle"
                  checked={showNineDays}
                  onCheckedChange={setShowNineDays}
                />
              </div>

              {/* Timezone Toggle */}
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <Switch
                  checked={useUSTimezone}
                  onCheckedChange={setUseUSTimezone}
                  id="timezone-toggle"
                />
                <Label htmlFor="timezone-toggle" className="text-xs cursor-pointer whitespace-nowrap">
                  {useUSTimezone ? "US Eastern" : "Local Time"}
                </Label>
              </div>

              {/* Team Selector */}
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

      {/* Scheduler Grid - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <Card className="p-6 bg-background/50 backdrop-blur-sm">
          {scheduleToDisplay && scheduleToDisplay.length > 0 ? (
            <SchedulerToolView
              schedules={scheduleToDisplay}
              weekStart={weekStart}
              showNineDays={showNineDays}
              selectedTeam={selectedTeam}
              useUSTimezone={useUSTimezone}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No schedules found for the selected team
              </p>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Pending Requests - Full Width at Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <RequestsAdminCard
          requests={managerRequests}
          onApprove={handleApproveRequest}
          onReject={handleRejectRequest}
          showActions={true}
          onRequestClick={handleRequestClick}
        />
      </motion.div>
    </div>
  );
}
