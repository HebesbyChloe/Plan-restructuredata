import { useState } from "react";
import { motion } from "motion/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../ui/sheet";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, XCircle, CircleSlash, FileEdit, X, MessageSquare } from "lucide-react";
import { TimesheetEntry } from "../../../sampledata/timesheetData";
import { TIMESHEET_STATUSES, ADJUSTMENT_REQUEST_STATUSES, TimesheetStatus, AdjustmentRequestStatus } from "../../../lib/config/constants";
import { generalRequestTypeOptions, GeneralRequestType } from "../../../sampledata/requestOffData";
import { toast } from "sonner";

interface TimesheetTableProps {
  entries: TimesheetEntry[];
  showEmployeeName?: boolean;
}

const shiftTypeColors = {
  Full: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500/30",
  Morning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-500/30",
  Evening: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-500/30",
  Night: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-500/30",
};

// Icon mapping
const statusIcons = {
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  CircleSlash,
};

interface RequestPanelState {
  open: boolean;
  entry: TimesheetEntry | null;
  requestType: GeneralRequestType;
  reason: string;
  requestedHours: string;
}

// Convert old status to new status logic
function getTimesheetStatus(entry: TimesheetEntry): TimesheetStatus {
  const now = new Date();
  const shiftDate = new Date(entry.date);
  const hasClockIn = entry.clockIn && entry.clockIn !== "--";
  const hasClockOut = entry.clockOut && entry.clockOut !== "--";
  
  // If they have clocked in
  if (hasClockIn) {
    // Check if they were late (simple check - you can make this more sophisticated)
    const scheduledStartTime = "09:00"; // This should come from shift schedule
    const isLate = entry.clockIn > scheduledStartTime;
    
    if (hasClockOut) {
      return isLate ? "late" : "completed";
    } else {
      // Still in progress
      return isLate ? "late" : "in-progress";
    }
  }
  
  // No clock in - check if shift is past
  if (shiftDate < now) {
    return "missed";
  }
  
  return "no-show";
}

// Mock adjustment request status (in real app, this would come from the entry data)
function getAdjustmentStatus(entryId: string): AdjustmentRequestStatus {
  // Mock logic - some entries have requests
  const mockRequests: Record<string, AdjustmentRequestStatus> = {
    "ts-1": "approved",
    "ts-3": "pending",
  };
  return mockRequests[entryId] || "none";
}

export function TimesheetTable({ entries, showEmployeeName = false }: TimesheetTableProps) {
  const [requestPanel, setRequestPanel] = useState<RequestPanelState>({
    open: false,
    entry: null,
    requestType: "time-adjustment",
    reason: "",
    requestedHours: "",
  });

  const handleOpenRequest = (entry: TimesheetEntry) => {
    setRequestPanel({
      open: true,
      entry,
      requestType: "time-adjustment",
      reason: "",
      requestedHours: entry.totalHours ? entry.totalHours.toString() : "",
    });
  };

  const submitRequest = () => {
    if (!requestPanel.entry) return;
    if (!requestPanel.reason.trim()) {
      toast.error("Please provide a reason for your request");
      return;
    }

    const requestTypeLabel = generalRequestTypeOptions.find(
      opt => opt.value === requestPanel.requestType
    )?.label || "Request";

    toast.success(`${requestTypeLabel} submitted for ${format(requestPanel.entry.date, "MMM dd, yyyy")}`);
    setRequestPanel({ open: false, entry: null, requestType: "time-adjustment", reason: "", requestedHours: "" });
  };

  if (entries.length === 0) {
    return (
      <Card className="p-12 text-center bg-background/50 backdrop-blur-sm">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No timesheet entries found</p>
      </Card>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden bg-background/50 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Date</TableHead>
                {showEmployeeName && <TableHead className="font-semibold">Employee</TableHead>}
                <TableHead className="font-semibold">Shift Type</TableHead>
                <TableHead className="font-semibold">Clock In</TableHead>
                <TableHead className="font-semibold">Clock Out</TableHead>
                <TableHead className="font-semibold text-center">Break (min)</TableHead>
                <TableHead className="font-semibold text-center">Total Hours</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Action / Review</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry, index) => {
                const timesheetStatus = getTimesheetStatus(entry);
                const statusConfig = TIMESHEET_STATUSES[timesheetStatus];
                const StatusIcon = statusIcons[statusConfig.icon as keyof typeof statusIcons];
                
                const adjustmentStatus = getAdjustmentStatus(entry.id);
                const adjustmentConfig = ADJUSTMENT_REQUEST_STATUSES[adjustmentStatus];
                
                const isToday = entry.date.toDateString() === new Date().toDateString();
                const canRequestAdjustment = timesheetStatus === "completed" || timesheetStatus === "late";
                
                return (
                  <motion.tr
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className={`border-b hover:bg-muted/50 transition-colors ${
                      isToday ? "bg-ai-blue/5" : ""
                    }`}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold">
                          {format(entry.date, "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(entry.date, "EEEE")}
                        </span>
                      </div>
                    </TableCell>
                    
                    {showEmployeeName && (
                      <TableCell className="font-semibold">
                        {entry.employeeName}
                      </TableCell>
                    )}
                    
                    <TableCell>
                      <Badge variant="outline" className={shiftTypeColors[entry.shiftType]}>
                        {entry.shiftType}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="font-mono">
                      {entry.clockIn}
                    </TableCell>
                    
                    <TableCell className="font-mono">
                      {entry.clockOut}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      {entry.status === "completed" ? entry.breakDuration : "--"}
                    </TableCell>
                    
                    <TableCell className="text-center">
                      <span className="font-semibold">
                        {entry.status === "completed" ? `${entry.totalHours.toFixed(2)}h` : "--"}
                      </span>
                    </TableCell>
                    
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${statusConfig.color} flex items-center gap-1 w-fit`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col gap-2">
                        {canRequestAdjustment && adjustmentStatus === "none" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenRequest(entry)}
                            className="hover:bg-ai-blue/10 hover:border-ai-blue/30 w-fit"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Request
                          </Button>
                        )}
                        
                        {adjustmentStatus !== "none" && (
                          <div className="flex flex-col gap-1">
                            <span className={`text-sm font-medium ${adjustmentConfig.color}`}>
                              {adjustmentConfig.label}
                            </span>
                            {entry.notes && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {entry.notes}
                              </p>
                            )}
                          </div>
                        )}
                        
                        {!canRequestAdjustment && adjustmentStatus === "none" && (
                          <span className="text-xs text-muted-foreground">--</span>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Request Panel (Right Side Sheet) */}
      <Sheet open={requestPanel.open} onOpenChange={(open) => setRequestPanel({ ...requestPanel, open })}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle>Submit Timesheet Request</SheetTitle>
            <SheetDescription>
              Request adjustments or submit inquiries about your timesheet
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-6 space-y-6">
            {/* Current Entry Details */}
            {requestPanel.entry && (
              <Card className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold">Entry Details</h4>
                  <Badge variant="outline">
                    {format(requestPanel.entry.date, "MMM dd, yyyy")}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Clock In</p>
                    <p className="font-mono font-semibold">{requestPanel.entry.clockIn}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Clock Out</p>
                    <p className="font-mono font-semibold">{requestPanel.entry.clockOut}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Recorded Hours</p>
                    <p className="font-semibold">{requestPanel.entry.totalHours?.toFixed(2)}h</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Break Duration</p>
                    <p className="font-semibold">{requestPanel.entry.breakDuration} min</p>
                  </div>
                </div>
              </Card>
            )}

            {/* Request Type */}
            <div className="space-y-2">
              <Label>Request Type *</Label>
              <Select 
                value={requestPanel.requestType} 
                onValueChange={(value: GeneralRequestType) => setRequestPanel({ ...requestPanel, requestType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="time-adjustment">Time Adjustment</SelectItem>
                  <SelectItem value="schedule-review">Schedule Review</SelectItem>
                  <SelectItem value="shift-change">Shift Change</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {generalRequestTypeOptions.find(opt => opt.value === requestPanel.requestType)?.description}
              </p>
            </div>

            {/* Requested Hours (for time adjustment) */}
            {requestPanel.requestType === "time-adjustment" && (
              <div className="space-y-2">
                <Label>Requested Hours (optional)</Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  value={requestPanel.requestedHours}
                  onChange={(e) => setRequestPanel({ ...requestPanel, requestedHours: e.target.value })}
                />
              </div>
            )}

            {/* Reason/Details */}
            <div className="space-y-2">
              <Label>Reason / Details *</Label>
              <Textarea
                placeholder="Explain your request in detail (e.g., forgot to clock out, system error, worked extra hours, schedule conflict...)"
                value={requestPanel.reason}
                onChange={(e) => setRequestPanel({ ...requestPanel, reason: e.target.value.slice(0, 500) })}
                rows={6}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mb-0">
                {requestPanel.reason.length} / 500 characters
              </p>
            </div>
          </div>

          {/* Footer with Actions */}
          <SheetFooter className="px-6 py-4 border-t bg-muted/30 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setRequestPanel({ open: false, entry: null, requestType: "time-adjustment", reason: "", requestedHours: "" })}
              className="flex-1 h-11"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={submitRequest}
              disabled={!requestPanel.reason.trim()}
              className="flex-1 h-11 bg-ai-blue hover:bg-ai-blue/90"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
