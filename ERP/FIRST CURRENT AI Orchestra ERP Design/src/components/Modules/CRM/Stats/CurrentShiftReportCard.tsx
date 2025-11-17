import { motion } from "motion/react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Textarea } from "../../../ui/textarea";
import { Alert, AlertDescription } from "../../../ui/alert";
import { FileText, Send, AlertTriangle, Info, CheckCircle2 } from "lucide-react";

interface ShiftIssue {
  type: "warning" | "info" | "success";
  message: string;
}

interface CurrentShiftPreview {
  newLeads: number;
  converted: number;
  conversations: number;
  messages: number;
  potential: number;
  orders: number;
  waitingPayment: number;
  tasksDone: number;
  totalTasks: number;
  estimatedRevenue: number;
  issues: ShiftIssue[];
}

interface CurrentShiftReportCardProps {
  shiftData: CurrentShiftPreview;
  shiftNotes: string;
  onNotesChange: (notes: string) => void;
  onSubmit: () => void;
}

export function CurrentShiftReportCard({
  shiftData,
  shiftNotes,
  onNotesChange,
  onSubmit,
}: CurrentShiftReportCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <Card className="p-6 bg-gradient-to-br from-ai-blue/10 to-cyan-500/10 backdrop-blur-sm border-ai-blue/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl mb-0 flex items-center gap-2">
            <FileText className="w-5 h-5 text-ai-blue" />
            Current Shift Report
          </h2>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-500/30">
            In Progress
          </Badge>
        </div>

        <div className="space-y-4">
          {/* Shift Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1">Shift Time</p>
              <p className="font-semibold mb-0">08:00 AM - 12:00 PM</p>
            </div>
            <div className="p-3 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="font-semibold mb-0">2h 15m elapsed</p>
            </div>
          </div>

          {/* Current Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Leads & Conversion */}
            <div className="p-3 rounded-lg bg-background/70 border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Leads & Conversion</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">New Leads</span>
                  <span className="font-semibold text-ai-blue">{shiftData.newLeads}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Converted</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {shiftData.converted}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Potential</span>
                  <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                    {shiftData.potential}
                  </span>
                </div>
              </div>
            </div>

            {/* Conversations & Messages */}
            <div className="p-3 rounded-lg bg-background/70 border border-border/50">
              <p className="text-xs text-muted-foreground mb-2">Engagement</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Conversations</span>
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                    {shiftData.conversations}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Messages</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {shiftData.messages}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tasks</span>
                  <span
                    className={`font-semibold ${
                      shiftData.tasksDone === shiftData.totalTasks
                        ? "text-green-600 dark:text-green-400"
                        : ""
                    }`}
                  >
                    {shiftData.tasksDone}/{shiftData.totalTasks}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Orders & Payment Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-background/70 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Orders</span>
                <span className="font-semibold">{shiftData.orders}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-background/70 border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Waiting Payment</span>
                <span className="font-semibold text-amber-600 dark:text-amber-400">
                  {shiftData.waitingPayment}
                </span>
              </div>
            </div>
          </div>

          {/* Revenue Highlight */}
          <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-ai-blue/10 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Estimated Revenue</span>
              <span className="text-2xl font-semibold text-purple-600 dark:text-purple-400">
                ${shiftData.estimatedRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Notification Cards */}
          {shiftData.issues.map((issue, index) => (
            <Alert
              key={index}
              className={`${
                issue.type === "warning"
                  ? "border-amber-500/50 bg-amber-50/50 dark:bg-amber-900/10"
                  : issue.type === "info"
                  ? "border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10"
                  : "border-green-500/50 bg-green-50/50 dark:bg-green-900/10"
              }`}
            >
              {issue.type === "warning" && (
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
              {issue.type === "info" && (
                <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              )}
              {issue.type === "success" && (
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              <AlertDescription
                className={`${
                  issue.type === "warning"
                    ? "text-amber-800 dark:text-amber-300"
                    : issue.type === "info"
                    ? "text-blue-800 dark:text-blue-300"
                    : "text-green-800 dark:text-green-300"
                }`}
              >
                {issue.message}
              </AlertDescription>
            </Alert>
          ))}

          <div>
            <label className="text-sm font-medium mb-2 block">Shift Notes</label>
            <Textarea
              placeholder="Add notes about your shift performance, challenges faced, achievements, etc..."
              value={shiftNotes}
              onChange={(e) => onNotesChange(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>

          <Button onClick={onSubmit} className="w-full bg-ai-blue hover:bg-ai-blue/90">
            <Send className="w-4 h-4 mr-2" />
            Submit End Shift Report
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
