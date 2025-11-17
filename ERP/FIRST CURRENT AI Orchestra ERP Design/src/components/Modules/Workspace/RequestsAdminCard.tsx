import { useState } from "react";
import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Calendar, Clock, CheckCircle, XCircle, ArrowRight, User, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import {
  ScheduleRequest,
  RequestStatus,
  RequestCategory,
  requestTypeConfig,
  requestStatusConfig,
} from "../../../sampledata/SampleRequestSchedule";

interface RequestsAdminCardProps {
  requests: ScheduleRequest[];
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  onRespond?: (requestId: string) => void;
  showActions?: boolean;
  onRequestClick?: (request: ScheduleRequest) => void;
}

export function RequestsAdminCard({
  requests,
  onApprove,
  onReject,
  onRespond,
  showActions = true,
  onRequestClick,
}: RequestsAdminCardProps) {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("pending");
  const [categoryFilter, setCategoryFilter] = useState<RequestCategory | "all">("all");

  // Filter requests
  let filteredRequests = requests;
  if (statusFilter !== "all") {
    filteredRequests = filteredRequests.filter((r) => r.status === statusFilter);
  }
  if (categoryFilter !== "all") {
    filteredRequests = filteredRequests.filter((r) => r.category === categoryFilter);
  }

  // Count requests
  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    "under-review": requests.filter((r) => r.status === "under-review").length,
    "needs-info": requests.filter((r) => r.status === "needs-info").length,
  };

  const categoryCounts = {
    all: requests.length,
    "time-off": requests.filter((r) => r.category === "time-off").length,
    schedule: requests.filter((r) => r.category === "schedule").length,
    timesheet: requests.filter((r) => r.category === "timesheet").length,
    inquiry: requests.filter((r) => r.category === "inquiry").length,
    other: requests.filter((r) => r.category === "other").length,
  };

  if (requests.length === 0) {
    return (
      <Card className="p-6 bg-background/50 backdrop-blur-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-ai-blue" />
          Requests
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No requests to review
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h3 className="font-semibold mb-0 flex items-center gap-2">
          <FileText className="w-5 h-5 text-ai-blue" />
          Requests
        </h3>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <Select
            value={categoryFilter}
            onValueChange={(value: RequestCategory | "all") => setCategoryFilter(value)}
          >
            <SelectTrigger className="w-[140px] h-8">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types ({categoryCounts.all})</SelectItem>
              <SelectItem value="time-off">Time Off ({categoryCounts["time-off"]})</SelectItem>
              <SelectItem value="schedule">Schedule ({categoryCounts.schedule})</SelectItem>
              <SelectItem value="timesheet">Timesheet ({categoryCounts.timesheet})</SelectItem>
              <SelectItem value="inquiry">Inquiry ({categoryCounts.inquiry})</SelectItem>
              <SelectItem value="other">Other ({categoryCounts.other})</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(value: RequestStatus | "all") => setStatusFilter(value)}
          >
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
              <SelectItem value="pending">Pending ({statusCounts.pending})</SelectItem>
              <SelectItem value="under-review">
                Under Review ({statusCounts["under-review"]})
              </SelectItem>
              <SelectItem value="needs-info">
                Needs Info ({statusCounts["needs-info"]})
              </SelectItem>
              <SelectItem value="approved">Approved ({statusCounts.approved})</SelectItem>
              <SelectItem value="rejected">Rejected ({statusCounts.rejected})</SelectItem>
            </SelectContent>
          </Select>

          <Badge className="bg-ai-blue/10 text-ai-blue border-ai-blue/30">
            {filteredRequests.length}
          </Badge>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {filteredRequests.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No requests match the selected filters
          </p>
        ) : (
          filteredRequests.map((request, index) => {
            const typeConfig = requestTypeConfig[request.type];
            const statusConfig = requestStatusConfig[request.status];
            const canApprove = typeConfig.requiresApproval && request.status === "pending";

            return (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className={`p-4 bg-background/50 ${
                    request.status === "pending" || request.status === "needs-info"
                      ? "border-ai-blue/20"
                      : "border-border"
                  } ${onRequestClick && !showActions ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
                  onClick={() => {
                    if (onRequestClick && !showActions) {
                      onRequestClick(request);
                    }
                  }}
                >
                  <div className="space-y-3">
                    {/* Header with user info and badges */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <p className="font-semibold mb-0">{request.requesterName}</p>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-0">
                              {request.targetName}
                            </p>
                          </div>

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
                        </div>

                        {/* Title */}
                        <p className="font-semibold text-sm mb-2">{request.title}</p>

                        {/* Date/Time Information */}
                        <div className="space-y-1 mb-2">
                          {(request.startDate || request.relatedDate) && (
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {request.startDate && request.endDate
                                  ? `${format(request.startDate, "MMM dd, yyyy")} - ${format(
                                      request.endDate,
                                      "MMM dd, yyyy"
                                    )}`
                                  : request.relatedDate
                                  ? format(request.relatedDate, "MMM dd, yyyy")
                                  : ""}
                              </span>
                              {request.requestedHours && (
                                <Badge variant="outline" className="text-xs ml-2">
                                  {request.requestedHours}h requested
                                </Badge>
                              )}
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>Submitted {format(request.submittedAt, "MMM dd, yyyy")}</span>
                            {request.respondedAt && (
                              <span>• Responded {format(request.respondedAt, "MMM dd, yyyy")}</span>
                            )}
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mb-0">{request.description}</p>

                        {/* Response message if exists */}
                        {request.responseMessage && (
                          <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                            <p className="font-semibold text-xs text-muted-foreground mb-1">
                              Response:
                            </p>
                            <p className="mb-0">{request.responseMessage}</p>
                          </div>
                        )}

                        {/* Direction & Category indicator */}
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {request.direction === "employee-to-manager"
                              ? "↑ Employee → Manager"
                              : request.direction === "manager-to-employee"
                              ? "↓ Manager → Employee"
                              : "↔ Peer to Peer"}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {request.category.replace("-", " ")}
                          </Badge>
                          {request.relatedRequirementId && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                              Linked to Schedule
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {showActions && (
                      <div className="flex gap-2 flex-wrap pt-2 border-t">
                        {canApprove && onApprove && (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onApprove(request.id);
                            }}
                            className="bg-green-600 hover:bg-green-700 h-8"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                        {canApprove && onReject && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onReject(request.id);
                            }}
                            className="h-8"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Reject
                          </Button>
                        )}
                        {onRequestClick && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRequestClick(request);
                            }}
                            className="h-8 border-ai-blue/30 hover:bg-ai-blue/10"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" />
                            View & Respond
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {/* Click to View (when no actions shown) */}
                    {!showActions && onRequestClick && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                        <MessageSquare className="w-3 h-3" />
                        <span>Click to view details and respond</span>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </Card>
  );
}
