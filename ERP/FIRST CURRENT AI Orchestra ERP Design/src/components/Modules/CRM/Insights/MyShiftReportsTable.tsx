import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Switch } from "../../../ui/switch";
import { Label } from "../../../ui/label";
import { ScrollArea } from "../../../ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Calendar } from "lucide-react";

interface ShiftReport {
  id: string;
  employeeId: string;
  employeeName: string;
  shiftDate: Date;
  shift: "morning" | "afternoon" | "night" | "full-day";
  startTime: string;
  endTime: string;
  totalRevenue: number;
  newLeads: number;
  converted: number;
  customerConversations: number;
  totalMessages: number;
  potential: number;
  orders: number;
  waitingPayment: number;
  returningCustomerRevenue: number;
  newCustomerRevenue: number;
  returningCustomerOrders: number;
  newCustomerOrders: number;
  tasksDone: number;
  totalTasks: number;
  reach: number;
  notes: string;
  challenges: string[];
  achievements: string[];
  submittedAt: Date;
  status: "success" | "failed";
}

interface MyShiftReportsTableProps {
  reports: ShiftReport[];
  showDetailed: boolean;
  onToggleDetailed: (checked: boolean) => void;
}

export function MyShiftReportsTable({
  reports,
  showDetailed,
  onToggleDetailed,
}: MyShiftReportsTableProps) {
  // Aggregate shifts by day
  const aggregatedReports = showDetailed
    ? reports
    : Object.values(
        reports.reduce((acc, report) => {
          const dateKey = report.shiftDate.toDateString();
          if (!acc[dateKey]) {
            acc[dateKey] = {
              ...report,
              id: `daily-${dateKey}`,
              shift: "full-day" as const,
              startTime: "08:00 AM",
              endTime: "08:00 PM",
              notes: "",
              challenges: [],
              achievements: [],
            };
          } else {
            // Aggregate metrics
            acc[dateKey].totalRevenue += report.totalRevenue;
            acc[dateKey].newLeads += report.newLeads;
            acc[dateKey].converted += report.converted;
            acc[dateKey].customerConversations += report.customerConversations;
            acc[dateKey].totalMessages += report.totalMessages;
            acc[dateKey].potential += report.potential;
            acc[dateKey].orders += report.orders;
            acc[dateKey].waitingPayment += report.waitingPayment;
            acc[dateKey].returningCustomerRevenue += report.returningCustomerRevenue;
            acc[dateKey].newCustomerRevenue += report.newCustomerRevenue;
            acc[dateKey].returningCustomerOrders += report.returningCustomerOrders;
            acc[dateKey].newCustomerOrders += report.newCustomerOrders;
            acc[dateKey].tasksDone += report.tasksDone;
            acc[dateKey].totalTasks += report.totalTasks;
            acc[dateKey].reach += report.reach;
            // Use latest submission time
            if (report.submittedAt > acc[dateKey].submittedAt) {
              acc[dateKey].submittedAt = report.submittedAt;
            }
            // If any shift failed, mark the whole day as failed
            if (report.status === "failed") {
              acc[dateKey].status = "failed";
            }
          }
          return acc;
        }, {} as Record<string, ShiftReport>)
      );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl mb-0 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ai-blue" />
          Shift Reports This Month
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              id="detailed-shifts"
              checked={showDetailed}
              onCheckedChange={onToggleDetailed}
            />
            <Label htmlFor="detailed-shifts" className="text-sm cursor-pointer">
              Show Details
            </Label>
          </div>
          <Badge className="bg-background/50 border">
            {aggregatedReports.length} {showDetailed ? "Shifts" : "Days"}
          </Badge>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <ScrollArea className="h-[500px]">
          <Table>
            <TableHeader className="sticky top-0 bg-background z-10">
              <TableRow>
                <TableHead className="w-[100px]">Date</TableHead>
                <TableHead className="w-[90px]">Shift</TableHead>
                <TableHead className="text-right w-[70px]">Leads</TableHead>
                <TableHead className="text-right w-[70px]">Conv.</TableHead>
                <TableHead className="text-right w-[80px]">Messages</TableHead>
                <TableHead className="text-right w-[80px]">Potential</TableHead>
                <TableHead className="text-right w-[70px]">Orders</TableHead>
                <TableHead className="text-right w-[80px]">Waiting</TableHead>
                <TableHead className="text-right w-[80px]">Tasks</TableHead>
                <TableHead className="text-right w-[100px]">Revenue</TableHead>
                <TableHead className="text-center w-[80px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {aggregatedReports.map((report, index) => (
                <TableRow
                  key={report.id}
                  className={`${
                    report.status === "failed"
                      ? "bg-red-50/50 dark:bg-red-900/10"
                      : index % 2 === 0
                      ? "bg-muted/30"
                      : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    {report.shiftDate.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-xs ${
                        report.shift === "morning"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                          : report.shift === "afternoon"
                          ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          : report.shift === "night"
                          ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                          : "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}
                    >
                      {report.shift === "full-day" ? "Full" : report.shift.charAt(0).toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{report.newLeads}</TableCell>
                  <TableCell className="text-right text-green-600 dark:text-green-400">
                    {report.converted}
                  </TableCell>
                  <TableCell className="text-right">{report.totalMessages}</TableCell>
                  <TableCell className="text-right text-cyan-600 dark:text-cyan-400">
                    {report.potential}
                  </TableCell>
                  <TableCell className="text-right font-semibold">{report.orders}</TableCell>
                  <TableCell className="text-right text-amber-600 dark:text-amber-400">
                    {report.waitingPayment}
                  </TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        report.tasksDone === report.totalTasks
                          ? "text-green-600 dark:text-green-400 font-semibold"
                          : "text-muted-foreground"
                      }
                    >
                      {report.tasksDone}/{report.totalTasks}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-ai-blue">
                    ${report.totalRevenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`text-xs ${
                        report.status === "success"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}
