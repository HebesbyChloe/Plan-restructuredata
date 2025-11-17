"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import { Clock, Settings, ClipboardList, Users } from "lucide-react";
import {
  GeneralRequestPanel,
  RequestDetailSheet,
  ShiftScheduleAICard,
} from "../../Modules/Workspace";
import { MyScheduleTab } from "./MyScheduleTab";
import { MyTimesheetTab } from "./MyTimesheetTab";
import { TeamScheduleTab } from "./TeamScheduleTab";
import { TeamTimesheetPage } from "./TeamTimesheetPage";
import { SchedulerToolTab } from "./SchedulerToolTab";
import {
  employeeSchedules,
  teamSchedules,
  currentLoggedInUserId,
  getCurrentUserSchedule,
  getCurrentWeekStart,
  shiftHours,
} from "../../../sampledata/computed/shiftScheduleData";
import {
  dayOffRequests,
  RequestOffType,
} from "../../../sampledata/requestOffData";
import {
  scheduleRequests,
  getRequestsByEmployeeId,
  getPendingRequestsByEmployeeId,
  getRequestsForManager,
  ScheduleRequest,
} from "../../../sampledata/SampleRequestSchedule";
import {
  timesheetEntries,
  teamTimesheetEntries,
  getTimesheetByEmployeeId,
  getCurrentWeekHours,
  getCurrentMonthHours,
  getWeeklyStats,
  getMonthlyStats,
} from "../../../sampledata/timesheetData";
import { format, addDays, subDays } from "date-fns";
import { toast } from "sonner";

export function ShiftSchedulePage() {
  // Mock admin check - In real app, this would come from auth context
  const isAdmin = true; // Set to true for demo purposes
  
  const [viewMode, setViewMode] = useState<"my-schedule" | "team-schedule" | "my-timesheet" | "team-timesheet" | "scheduler-tool">("my-schedule");
  const [scheduleViewType, setScheduleViewType] = useState<"table" | "timeline">("table");
  const [selectedTeam, setSelectedTeam] = useState<string>("All");
  const [weekStart, setWeekStart] = useState(getCurrentWeekStart());
  const [requestPanelOpen, setRequestPanelOpen] = useState(false);
  const [pendingRequests, setPendingRequests] = useState(dayOffRequests);
  const [allRequests, setAllRequests] = useState<ScheduleRequest[]>(scheduleRequests);
  const [showNineDays, setShowNineDays] = useState(false);
  const [useUSTimezone, setUseUSTimezone] = useState(false);
  
  // Scheduler Tool action states
  const [customShiftPanelOpen, setCustomShiftPanelOpen] = useState(false);
  const [requirementDialogOpen, setRequirementDialogOpen] = useState(false);
  const [holidayDialogOpen, setHolidayDialogOpen] = useState(false);

  // Team Timesheet filters
  const [timesheetSortBy, setTimesheetSortBy] = useState<"employee" | "date" | "status">("date");
  const [selectedEmployee, setSelectedEmployee] = useState<string>("All");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  
  // Request detail sheet
  const [requestDetailOpen, setRequestDetailOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ScheduleRequest | null>(null);
  
  // Date filter for schedules (max 14 days)
  const [scheduleDateFilter, setScheduleDateFilter] = useState<{ start: Date; end: Date }>({
    start: weekStart,
    end: addDays(weekStart, 13), // 14 days max
  });
  
  // Request status filter for My Schedule view
  const [requestStatusFilter, setRequestStatusFilter] = useState<string>("all");
  
  // My Timesheet filters
  const [myTimesheetDateFilter, setMyTimesheetDateFilter] = useState<string>("all");
  const [myTimesheetStatusFilter, setMyTimesheetStatusFilter] = useState<string>("all");

  // Get current logged-in user's schedule
  const currentUserSchedule = getCurrentUserSchedule(currentLoggedInUserId);

  // Get timesheet data
  const userTimesheetEntries = getTimesheetByEmployeeId(currentLoggedInUserId);
  const weekHours = getCurrentWeekHours(currentLoggedInUserId);
  const monthHours = getCurrentMonthHours(currentLoggedInUserId);

  const handlePreviousWeek = () => {
    setWeekStart(subDays(weekStart, 7));
  };

  const handleNextWeek = () => {
    setWeekStart(addDays(weekStart, 7));
  };

  const handleThisWeek = () => {
    setWeekStart(getCurrentWeekStart());
  };

  const handleDayOffRequest = (data: {
    startDate: Date;
    endDate: Date;
    reason: string;
    requestType: RequestOffType;
  }) => {
    if (!currentUserSchedule) {
      toast.error("Unable to find user information");
      return;
    }

    const newRequest = {
      id: `req${Date.now()}`,
      employeeId: currentUserSchedule.employeeId,
      employeeName: currentUserSchedule.employeeName,
      startDate: data.startDate,
      endDate: data.endDate,
      reason: data.reason,
      requestType: data.requestType,
      status: "pending" as const,
      submittedAt: new Date(),
    };
    
    setPendingRequests([...pendingRequests, newRequest]);
    toast.success("Day off request submitted successfully!");
  };

  const handleCancelRequest = (requestId: string) => {
    setPendingRequests(pendingRequests.filter(r => r.id !== requestId));
    setAllRequests(allRequests.map(r => 
      r.id === requestId ? { ...r, status: "cancelled" as const } : r
    ));
    toast.success("Request cancelled");
  };

  const handleApproveRequest = (requestId: string, note?: string) => {
    setPendingRequests(
      pendingRequests.map((r) =>
        r.id === requestId ? { ...r, status: "approved" as const } : r
      )
    );
    setAllRequests(
      allRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "approved" as const,
              respondedAt: new Date(),
              responseMessage: note || "Approved",
            }
          : r
      )
    );
    toast.success("Request approved");
  };

  const handleRejectRequest = (requestId: string, note?: string) => {
    setPendingRequests(
      pendingRequests.map((r) =>
        r.id === requestId ? { ...r, status: "rejected" as const } : r
      )
    );
    setAllRequests(
      allRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "rejected" as const,
              respondedAt: new Date(),
              responseMessage: note || "Rejected",
            }
          : r
      )
    );
    toast.success("Request rejected");
  };

  // Scheduler Tool Actions
  const handleDuplicateNextWeek = () => {
    toast.success("Schedule duplicated to next week");
  };

  const handleDuplicateNext4Weeks = () => {
    toast.success("Schedule duplicated to next 4 weeks");
  };

  const openRequirementDialog = () => {
    setRequirementDialogOpen(true);
  };

  const handleExportTimesheet = () => {
    toast.success("Exporting timesheet data...");
  };
  
  // Handle request click to open detail sheet
  const handleRequestClick = (request: ScheduleRequest) => {
    setSelectedRequest(request);
    setRequestDetailOpen(true);
  };
  
  // Handle response from detail sheet
  const handleRequestRespond = (requestId: string, message: string) => {
    setAllRequests(
      allRequests.map((r) =>
        r.id === requestId
          ? {
              ...r,
              status: "under-review" as const,
              respondedAt: new Date(),
              responseMessage: message,
            }
          : r
      )
    );
    toast.success("Response sent successfully");
  };

  // Calculate scheduled hours for the current week from schedule
  const calculateScheduledWeekHours = () => {
    if (!currentUserSchedule) return 0;
    return currentUserSchedule.weekSchedule.reduce((total, day) => {
      const dayHours = day.shifts.reduce((sum, shift) => sum + shiftHours[shift], 0);
      return total + dayHours;
    }, 0);
  };

  // Determine which schedules to display
  const scheduleToDisplay =
    viewMode === "my-schedule"
      ? currentUserSchedule ? [currentUserSchedule] : []
      : viewMode === "scheduler-tool"
      ? teamSchedules[selectedTeam as keyof typeof teamSchedules]
      : teamSchedules[selectedTeam as keyof typeof teamSchedules];

  const numDays = showNineDays ? 9 : 7;
  const weekEnd = addDays(weekStart, numDays - 1);

  // Get current user's requests (from unified request system)
  const userScheduleRequests = getRequestsByEmployeeId(currentLoggedInUserId);
  
  // Get requests for manager view
  const managerRequests = isAdmin ? allRequests : [];

  const scheduledWeekHours = calculateScheduledWeekHours();

  return (
    <div className="space-y-6 max-w-[1600px]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div>
          <h1 className="mb-2">Shift Schedule</h1>
          <p className="text-muted-foreground">
            {currentUserSchedule 
              ? `Logged in as: ${currentUserSchedule.employeeName} • ${currentUserSchedule.role}`
              : "Manage your work schedule and request time off"}
          </p>
        </div>
      </motion.div>

      {/* AI Capability Card */}
      <ShiftScheduleAICard />

      {/* Tab Selector */}
      <Tabs
        value={viewMode}
        onValueChange={(value) =>
          setViewMode(value as typeof viewMode)
        }
      >
        <TabsList>
          <TabsTrigger value="my-schedule">My Schedule</TabsTrigger>
          <TabsTrigger value="my-timesheet">
            <Clock className="w-4 h-4 mr-2" />
            My Timesheet
          </TabsTrigger>
          <TabsTrigger value="team-schedule">
            <Users className="w-4 h-4 mr-2" />
            Team Schedule
          </TabsTrigger>
          {isAdmin && (
            <>
              <TabsTrigger value="team-timesheet">
                <ClipboardList className="w-4 h-4 mr-2" />
                Team Timesheet
              </TabsTrigger>
              <TabsTrigger value="scheduler-tool">
                <Settings className="w-4 h-4 mr-2" />
                Scheduler Tool
              </TabsTrigger>
            </>
          )}
        </TabsList>
      </Tabs>

      {/* My Schedule View */}
      {viewMode === "my-schedule" && (
        <MyScheduleTab
          scheduleViewType={scheduleViewType}
          setScheduleViewType={setScheduleViewType}
          weekStart={weekStart}
          weekEnd={weekEnd}
          handlePreviousWeek={handlePreviousWeek}
          handleThisWeek={handleThisWeek}
          handleNextWeek={handleNextWeek}
          setRequestPanelOpen={setRequestPanelOpen}
          scheduledWeekHours={scheduledWeekHours}
          weekHours={weekHours}
          monthHours={monthHours}
          scheduleToDisplay={scheduleToDisplay}
          userScheduleRequests={userScheduleRequests}
          currentLoggedInUserId={currentLoggedInUserId}
          handleCancelRequest={handleCancelRequest}
          handleRequestClick={handleRequestClick}
        />
      )}

      {/* My Timesheet View */}
      {viewMode === "my-timesheet" && (
        <MyTimesheetTab
          myTimesheetDateFilter={myTimesheetDateFilter}
          setMyTimesheetDateFilter={setMyTimesheetDateFilter}
          myTimesheetStatusFilter={myTimesheetStatusFilter}
          setMyTimesheetStatusFilter={setMyTimesheetStatusFilter}
          weekStart={weekStart}
          weekEnd={weekEnd}
          scheduledWeekHours={scheduledWeekHours}
          weekHours={weekHours}
          monthHours={monthHours}
          userTimesheetEntries={userTimesheetEntries}
          userScheduleRequests={userScheduleRequests}
          currentLoggedInUserId={currentLoggedInUserId}
          handleCancelRequest={handleCancelRequest}
          handleRequestClick={handleRequestClick}
        />
      )}

      {/* Team Schedule View */}
      {viewMode === "team-schedule" && (
        <TeamScheduleTab
          scheduleViewType={scheduleViewType}
          setScheduleViewType={setScheduleViewType}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          weekStart={weekStart}
          weekEnd={weekEnd}
          handlePreviousWeek={handlePreviousWeek}
          handleThisWeek={handleThisWeek}
          handleNextWeek={handleNextWeek}
          setRequestPanelOpen={setRequestPanelOpen}
          scheduleToDisplay={scheduleToDisplay}
          managerRequests={managerRequests}
          isAdmin={isAdmin}
          handleApproveRequest={handleApproveRequest}
          handleRejectRequest={handleRejectRequest}
          handleRequestClick={handleRequestClick}
        />
      )}

      {/* Team Timesheet View */}
      {viewMode === "team-timesheet" && isAdmin && (
        <TeamTimesheetPage
          timesheetSortBy={timesheetSortBy}
          setTimesheetSortBy={setTimesheetSortBy}
          selectedEmployee={selectedEmployee}
          setSelectedEmployee={setSelectedEmployee}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          weekStart={weekStart}
          weekEnd={weekEnd}
          handleExportTimesheet={handleExportTimesheet}
          teamTimesheetEntries={teamTimesheetEntries}
        />
      )}

      {/* Scheduler Tool View (Admin Only) */}
      {viewMode === "scheduler-tool" && isAdmin && (
        <SchedulerToolTab
          showNineDays={showNineDays}
          setShowNineDays={setShowNineDays}
          useUSTimezone={useUSTimezone}
          setUseUSTimezone={setUseUSTimezone}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
          weekStart={weekStart}
          weekEnd={weekEnd}
          handlePreviousWeek={handlePreviousWeek}
          handleThisWeek={handleThisWeek}
          handleNextWeek={handleNextWeek}
          scheduleToDisplay={scheduleToDisplay}
          managerRequests={managerRequests}
          handleApproveRequest={handleApproveRequest}
          handleRejectRequest={handleRejectRequest}
          handleRequestClick={handleRequestClick}
          setCustomShiftPanelOpen={setCustomShiftPanelOpen}
          openRequirementDialog={openRequirementDialog}
          setHolidayDialogOpen={setHolidayDialogOpen}
          handleDuplicateNextWeek={handleDuplicateNextWeek}
          handleDuplicateNext4Weeks={handleDuplicateNext4Weeks}
        />
      )}

      {/* General Request Panel */}
      <GeneralRequestPanel
        open={requestPanelOpen}
        onOpenChange={setRequestPanelOpen}
      />
      
      {/* Request Detail Sheet */}
      <RequestDetailSheet
        request={selectedRequest}
        open={requestDetailOpen}
        onOpenChange={setRequestDetailOpen}
        currentUserId={currentLoggedInUserId}
        onApprove={handleApproveRequest}
        onReject={handleRejectRequest}
        onRespond={handleRequestRespond}
      />
    </div>
  );
}
