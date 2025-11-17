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
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, XCircle, CircleSlash, MapPin, Smartphone, MessageSquare, X, FileText, Send } from "lucide-react";
import { TimesheetEntry } from "../../../sampledata/timesheetData";
import { toast } from "sonner";
import { TIMESHEET_STATUSES, TimesheetStatus } from "../../../lib/config/constants";

interface TeamTimesheetTableProps {
  entries: TimesheetEntry[];
  teamFilter?: string;
  sortBy?: "employee" | "date" | "status";
}

const shiftTypeColors = {
  Full: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-500/30",
  Morning: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-500/30",
  Evening: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-500/30",
  Night: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-500/30",
};

// Helper to calculate scheduled hours based on shift type
const scheduledHours: Record<string, number> = {
  Full: 8,
  Morning: 4,
  Evening: 4,
  Night: 8,
};

// Mock location and device data
const mockLocations = [
  "Office - Main Floor",
  "Office - 2nd Floor",
  "Remote - Home",
  "Client Site",
  "Warehouse",
];

const mockDevices = [
  "iPhone 14 Pro",
  "Samsung Galaxy S23",
  "Desktop - Station 1",
  "Desktop - Station 2",
  "iPad Pro",
  "MacBook Pro",
];

function getRandomLocation() {
  return mockLocations[Math.floor(Math.random() * mockLocations.length)];
}

function getRandomDevice() {
  return mockDevices[Math.floor(Math.random() * mockDevices.length)];
}

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
  requestType: string;
  message: string;
}

// Convert old status to new status logic
function getTimesheetStatus(entry: TimesheetEntry): TimesheetStatus {
  const now = new Date();
  const shiftDate = new Date(entry.date);
  const hasClockIn = entry.clockIn && entry.clockIn !== "--";
  const hasClockOut = entry.clockOut && entry.clockOut !== "--";
  
  // If they have clocked in
  if (hasClockIn) {
    // Check if they were late (assuming shift starts at the scheduled time)
    const scheduledStartTime = scheduledHours[entry.shiftType] === 8 ? "09:00" : "07:00";
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
    // Past shift with no clock in = missed
    return "missed";
  }
  
  // This shouldn't show up in the filtered list
  return "no-show";
}

export function TeamTimesheetTable({ entries, teamFilter = "All", sortBy = "date" }: TeamTimesheetTableProps) {
  const [requestPanel, setRequestPanel] = useState<RequestPanelState>({
    open: false,
    entry: null,
    requestType: "request-explanation",
    message: "",
  });

  // Filter entries: only show if they have clocked in OR it's a missed/past shift
  const now = new Date();
  const filteredEntries = entries.filter(entry => {
    const hasClockIn = entry.clockIn && entry.clockIn !== "--";
    const shiftDate = new Date(entry.date);
    const isPastShift = shiftDate < now;
    
    return hasClockIn || isPastShift;
  });

  // Sort entries
  const sortedEntries = [...filteredEntries].sort((a, b) => {
    if (sortBy === "employee") {
      return a.employeeName.localeCompare(b.employeeName);
    } else if (sortBy === "status") {
      const statusA = getTimesheetStatus(a);
      const statusB = getTimesheetStatus(b);
      return statusA.localeCompare(statusB);
    } else {
      // Default: sort by date
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleOpenRequest = (entry: TimesheetEntry) => {
    setRequestPanel({
      open: true,
      entry,
      requestType: "request-explanation",
      message: "",
    });
  };

  const handleSubmitRequest = () => {
    if (!requestPanel.message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    toast.success(`Request sent to ${requestPanel.entry?.employeeName}`);
    setRequestPanel({
      open: false,
      entry: null,
      requestType: "request-explanation",
      message: "",
    });
  };



  if (sortedEntries.length === 0) {
    return (
      <div className="border rounded-lg p-12 text-center bg-background/50 backdrop-blur-sm">
        <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No timesheet entries found</p>
      </div>
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
                <TableHead className="font-semibold">Employee</TableHead>
                <TableHead className="font-semibold">Shift Type</TableHead>
                <TableHead className="font-semibold">Clock In</TableHead>
                <TableHead className="font-semibold">Clock Out</TableHead>
                <TableHead className="font-semibold text-center">Scheduled Hours</TableHead>
                <TableHead className="font-semibold text-center">Actual Hours</TableHead>
                <TableHead className="font-semibold">Location</TableHead>
                <TableHead className="font-semibold">Device</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedEntries.map((entry, index) => {
                const timesheetStatus = getTimesheetStatus(entry);
                const statusConfig = TIMESHEET_STATUSES[timesheetStatus];
                const StatusIcon = statusIcons[statusConfig.icon as keyof typeof statusIcons];
                
                const isToday = entry.date.toDateString() === new Date().toDateString();
                const hasClockIn = entry.clockIn && entry.clockIn !== "--";
                const location = hasClockIn ? getRandomLocation() : "--";
                const device = hasClockIn ? getRandomDevice() : "--";
                const scheduled = scheduledHours[entry.shiftType] || 0;

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

                    <TableCell className="font-semibold">
                      {entry.employeeName}
                    </TableCell>

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
                      <span className="text-muted-foreground">
                        {hasClockIn ? `${scheduled}h` : "--"}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span className="font-semibold">
                        {entry.clockOut && entry.clockOut !== "--" ? `${entry.totalHours.toFixed(2)}h` : "--"}
                      </span>
                      {entry.clockOut && entry.clockOut !== "--" && entry.totalHours !== scheduled && (
                        <span className={`ml-1 text-xs ${entry.totalHours > scheduled ? "text-amber-600" : "text-blue-600"}`}>
                          ({entry.totalHours > scheduled ? "+" : ""}{(entry.totalHours - scheduled).toFixed(2)})
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{location}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Smartphone className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{device}</span>
                      </div>
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
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenRequest(entry)}
                        className="hover:bg-ai-blue/10 hover:border-ai-blue/30"
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        Request
                      </Button>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Request Panel */}
      <Sheet open={requestPanel.open} onOpenChange={(open) => setRequestPanel({ ...requestPanel, open })}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Send Request</SheetTitle>
            <SheetDescription>
              Send a request to {requestPanel.entry?.employeeName} regarding their shift on{" "}
              {requestPanel.entry && format(requestPanel.entry.date, "MMM dd, yyyy")}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-6">
            {/* Request Type Selection */}
            <div className="space-y-2">
              <Label htmlFor="request-type">Request Type</Label>
              <Select
                value={requestPanel.requestType}
                onValueChange={(value) => setRequestPanel({ ...requestPanel, requestType: value })}
              >
                <SelectTrigger id="request-type">
                  <SelectValue placeholder="Select request type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="request-explanation">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Request Explanation
                    </div>
                  </SelectItem>
                  <SelectItem value="request-documentation">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Request Documentation
                    </div>
                  </SelectItem>
                  <SelectItem value="time-adjustment">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Request Time Adjustment
                    </div>
                  </SelectItem>
                  <SelectItem value="report-to-management">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Report to Higher Management
                    </div>
                  </SelectItem>
                  <SelectItem value="clarification-needed">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Clarification Needed
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shift Details */}
            {requestPanel.entry && (
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Employee:</span>
                  <span className="font-semibold">{requestPanel.entry.employeeName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Shift Type:</span>
                  <Badge variant="outline" className={shiftTypeColors[requestPanel.entry.shiftType]}>
                    {requestPanel.entry.shiftType}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Clock In:</span>
                  <span className="font-mono">{requestPanel.entry.clockIn}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Clock Out:</span>
                  <span className="font-mono">{requestPanel.entry.clockOut}</span>
                </div>
                {requestPanel.entry.clockOut && requestPanel.entry.clockOut !== "--" && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Hours:</span>
                    <span className="font-semibold">{requestPanel.entry.totalHours.toFixed(2)}h</span>
                  </div>
                )}
              </div>
            )}

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Describe your request in detail..."
                value={requestPanel.message}
                onChange={(e) => setRequestPanel({ ...requestPanel, message: e.target.value })}
                rows={6}
                className="resize-none"
              />
            </div>
          </div>

          <SheetFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() =>
                setRequestPanel({
                  open: false,
                  entry: null,
                  requestType: "request-explanation",
                  message: "",
                })
              }
            >
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} className="bg-ai-blue hover:bg-ai-blue/90">
              <Send className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
