import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Calendar, Clock, X, Check } from "lucide-react";
import { format } from "date-fns";
import { 
  DayOffRequest, 
  requestTypeLabels, 
  requestTypeColors 
} from "../../../sampledata/requestOffData";
import { toast } from "sonner";

interface PendingRequestsAdminCardProps {
  requests: DayOffRequest[];
  onApprove?: (requestId: string, note: string) => void;
  onReject?: (requestId: string, note: string) => void;
  showActions?: boolean;
}

interface ApprovalDialogState {
  open: boolean;
  request: DayOffRequest | null;
  action: "approve" | "reject" | null;
  note: string;
}

export function PendingRequestsAdminCard({
  requests,
  onApprove,
  onReject,
  showActions = true,
}: PendingRequestsAdminCardProps) {
  const [approvalDialog, setApprovalDialog] = useState<ApprovalDialogState>({
    open: false,
    request: null,
    action: null,
    note: "",
  });

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const handleOpenDialog = (request: DayOffRequest, action: "approve" | "reject") => {
    setApprovalDialog({
      open: true,
      request,
      action,
      note: "",
    });
  };

  const handleConfirm = () => {
    if (!approvalDialog.request || !approvalDialog.action) return;

    if (approvalDialog.action === "approve" && onApprove) {
      onApprove(approvalDialog.request.id, approvalDialog.note);
      toast.success(`Request approved for ${approvalDialog.request.employeeName}`);
    } else if (approvalDialog.action === "reject" && onReject) {
      onReject(approvalDialog.request.id, approvalDialog.note);
      toast.success(`Request rejected for ${approvalDialog.request.employeeName}`);
    }

    setApprovalDialog({ open: false, request: null, action: null, note: "" });
  };

  if (pendingRequests.length === 0) {
    return (
      <Card className="p-6 bg-background/50 backdrop-blur-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ai-blue" />
          Pending Day-Off Requests
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No pending requests
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 bg-background/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold mb-0 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-ai-blue" />
            Pending Day-Off Requests
          </h3>
          <Badge className="bg-ai-blue/10 text-ai-blue border-ai-blue/30">
            {pendingRequests.length} Pending
          </Badge>
        </div>

        <div className="space-y-3">
          {pendingRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="p-4 bg-background/50 border-ai-blue/20">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <p className="font-semibold mb-0">{request.employeeName}</p>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-500/30"
                        >
                          Pending Review
                        </Badge>
                        <Badge
                          variant="outline"
                          className={requestTypeColors[request.requestType]}
                        >
                          {requestTypeLabels[request.requestType]}
                        </Badge>
                      </div>

                      <div className="space-y-1 mb-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>
                            {format(request.startDate, "MMM dd, yyyy")} -{" "}
                            {format(request.endDate, "MMM dd, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Submitted {format(request.submittedAt, "MMM dd, yyyy")}</span>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-3 rounded">
                        <p className="text-xs text-muted-foreground mb-1">Reason:</p>
                        <p className="text-sm mb-0">{request.reason}</p>
                      </div>
                    </div>
                  </div>

                  {showActions && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        size="sm"
                        onClick={() => handleOpenDialog(request, "approve")}
                        className="bg-green-600 hover:bg-green-700 flex-1"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenDialog(request, "reject")}
                        className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 flex-1"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Approval/Rejection Dialog */}
      <Dialog open={approvalDialog.open} onOpenChange={(open) => setApprovalDialog({ ...approvalDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {approvalDialog.action === "approve" ? "Approve Request" : "Reject Request"}
            </DialogTitle>
            <DialogDescription>
              {approvalDialog.action === "approve" ? "Approve" : "Reject"} day-off request for{" "}
              {approvalDialog.request?.employeeName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {approvalDialog.request && (
              <Card className="p-4 bg-muted/30">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-muted-foreground mb-1">Request Type</p>
                    <Badge variant="outline" className={requestTypeColors[approvalDialog.request.requestType]}>
                      {requestTypeLabels[approvalDialog.request.requestType]}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Dates</p>
                    <p className="mb-0">
                      {format(approvalDialog.request.startDate, "MMM dd, yyyy")} -{" "}
                      {format(approvalDialog.request.endDate, "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Reason</p>
                    <p className="mb-0">{approvalDialog.request.reason}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {approvalDialog.action === "approve" ? "Approval" : "Rejection"} Note (Optional)
              </label>
              <Textarea
                placeholder="Add any notes or comments..."
                value={approvalDialog.note}
                onChange={(e) => setApprovalDialog({ ...approvalDialog, note: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setApprovalDialog({ open: false, request: null, action: null, note: "" })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              className={
                approvalDialog.action === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {approvalDialog.action === "approve" ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </>
              ) : (
                <>
                  <X className="w-4 h-4 mr-2" />
                  Reject
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
