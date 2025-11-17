import { useState } from "react";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Badge } from "../../ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../ui/sheet";
import { Separator } from "../../ui/separator";
import { Calendar, Clock, User, ArrowRight, Send, CheckCircle, XCircle, MessageSquare, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  ScheduleRequest,
  requestTypeConfig,
  requestStatusConfig,
} from "../../../sampledata/SampleRequestSchedule";
import { toast } from "sonner";

interface RequestDetailSheetProps {
  request: ScheduleRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onRespond?: (requestId: string, message: string) => void;
}

export function RequestDetailSheet({
  request,
  open,
  onOpenChange,
  currentUserId,
  onApprove,
  onReject,
  onRespond,
}: RequestDetailSheetProps) {
  const [responseMessage, setResponseMessage] = useState("");

  if (!request) return null;

  const typeConfig = requestTypeConfig[request.type];
  const statusConfig = requestStatusConfig[request.status];
  const isRequester = currentUserId === request.requesterId;
  const isTarget = currentUserId === request.targetId;
  const canApprove = typeConfig.requiresApproval && request.status === "pending" && isTarget;
  const canRespond = isTarget && request.status !== "cancelled";

  const handleApprove = () => {
    if (onApprove) {
      onApprove(request.id);
      onOpenChange(false);
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(request.id);
      onOpenChange(false);
    }
  };

  const handleSendResponse = () => {
    if (!responseMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }
    
    if (onRespond) {
      onRespond(request.id, responseMessage);
      setResponseMessage("");
      toast.success("Response sent successfully");
      onOpenChange(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-6 sm:p-8">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-ai-blue" />
            Request Details
          </SheetTitle>
          <SheetDescription>
            View and manage this request
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* Request Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={statusConfig.color}>
                {statusConfig.label}
              </Badge>
              <Badge variant="outline" className={typeConfig.color}>
                {typeConfig.label}
              </Badge>
              {request.priority === "urgent" && (
                <Badge variant="destructive" className="text-xs">
                  Urgent
                </Badge>
              )}
              {request.priority === "high" && (
                <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-500/30">
                  High Priority
                </Badge>
              )}
            </div>

            <h3 className="font-semibold text-lg">{request.title}</h3>

            {/* Participants */}
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">{request.requesterName}</span>
              <ArrowRight className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{request.targetName}</span>
            </div>

            {/* Direction Badge */}
            <Badge variant="outline" className="text-xs w-fit">
              {request.direction === "employee-to-manager"
                ? "↑ Employee → Manager"
                : request.direction === "manager-to-employee"
                ? "↓ Manager → Employee"
                : "↔ Peer to Peer"}
            </Badge>
          </div>

          <Separator />

          {/* Date Information */}
          {(request.startDate || request.relatedDate) && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Date Information</Label>
              <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    {request.startDate && request.endDate
                      ? `${format(request.startDate, "MMM dd, yyyy")} - ${format(request.endDate, "MMM dd, yyyy")}`
                      : request.relatedDate
                      ? format(request.relatedDate, "MMM dd, yyyy")
                      : ""}
                  </span>
                </div>
                {request.requestedHours && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{request.requestedHours} hours requested</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Description</Label>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{request.description}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Timeline</Label>
            <div className="p-3 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Submitted:</span>
                <span className="font-semibold">{format(request.submittedAt, "MMM dd, yyyy 'at' h:mm a")}</span>
              </div>
              {request.respondedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Responded:</span>
                  <span className="font-semibold">{format(request.respondedAt, "MMM dd, yyyy 'at' h:mm a")}</span>
                </div>
              )}
            </div>
          </div>

          {/* Existing Response */}
          {request.responseMessage && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Previous Response</Label>
              <div className="p-3 bg-ai-blue/5 border border-ai-blue/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-ai-blue mt-0.5" />
                  <p className="text-sm whitespace-pre-wrap">{request.responseMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          {(request.relatedTimesheetId || request.relatedShiftId || request.relatedRequirementId) && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Related Items</Label>
              <div className="flex gap-2 flex-wrap">
                {request.relatedTimesheetId && (
                  <Badge variant="outline" className="text-xs">
                    Timesheet: {request.relatedTimesheetId}
                  </Badge>
                )}
                {request.relatedShiftId && (
                  <Badge variant="outline" className="text-xs">
                    Shift: {request.relatedShiftId}
                  </Badge>
                )}
                {request.relatedRequirementId && (
                  <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                    Linked to Schedule: {request.relatedRequirementId}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <Separator />

          {/* Response Form (for managers/targets) */}
          {canRespond && request.status !== "approved" && request.status !== "rejected" && (
            <div className="space-y-3">
              <Label>
                {canApprove ? "Add Response (Optional)" : "Your Response"}
              </Label>
              <Textarea
                placeholder="Type your response or message..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
          )}
        </div>

        <SheetFooter className="gap-2 flex-wrap">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>

          {/* Action Buttons for Managers */}
          {canApprove && (
            <>
              <Button
                variant="destructive"
                onClick={handleReject}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            </>
          )}

          {/* Send Response Button */}
          {canRespond && !canApprove && responseMessage.trim() && (
            <Button
              onClick={handleSendResponse}
              className="bg-ai-blue hover:bg-ai-blue/90"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Response
            </Button>
          )}

          {/* Send Optional Response with Approval */}
          {canApprove && responseMessage.trim() && (
            <Button
              onClick={handleSendResponse}
              variant="outline"
              className="border-ai-blue/30 hover:bg-ai-blue/10"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
