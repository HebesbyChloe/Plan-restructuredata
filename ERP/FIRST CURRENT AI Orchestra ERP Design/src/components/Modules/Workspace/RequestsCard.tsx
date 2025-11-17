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
import { Calendar, Clock, X, ArrowRight, User, FileText } from "lucide-react";
import { format } from "date-fns";
import {
  ScheduleRequest,
  RequestStatus,
  requestTypeConfig,
  requestStatusConfig,
} from "../../../sampledata/SampleRequestSchedule";

interface RequestsCardProps {
  requests: ScheduleRequest[];
  onCancel?: (requestId: string) => void;
  showCancelButton?: boolean;
  currentUserId?: string;
  onRequestClick?: (request: ScheduleRequest) => void;
}

export function RequestsCard({
  requests,
  onCancel,
  showCancelButton = true,
  currentUserId,
  onRequestClick,
}: RequestsCardProps) {
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  // Filter requests based on status
  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((r) => r.status === statusFilter);

  // Count requests by status
  const statusCounts = {
    all: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    "under-review": requests.filter((r) => r.status === "under-review").length,
    "needs-info": requests.filter((r) => r.status === "needs-info").length,
  };

  if (requests.length === 0) {
    return (
      <Card className="p-6 bg-background/50 backdrop-blur-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <FileText className="w-5 h-5 text-ai-blue" />
          Requests
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No requests
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

        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={(value: RequestStatus | "all") => setStatusFilter(value)}>
            <SelectTrigger className="w-[160px] h-8">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                All ({statusCounts.all})
              </SelectItem>
              <SelectItem value="pending">
                Pending ({statusCounts.pending})
              </SelectItem>
              <SelectItem value="under-review">
                Under Review ({statusCounts["under-review"]})
              </SelectItem>
              <SelectItem value="needs-info">
                Needs Info ({statusCounts["needs-info"]})
              </SelectItem>
              <SelectItem value="approved">
                Approved ({statusCounts.approved})
              </SelectItem>
              <SelectItem value="rejected">
                Rejected ({statusCounts.rejected})
              </SelectItem>
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
            No requests with this status
          </p>
        ) : (
          filteredRequests.map((request, index) => {
            const typeConfig = requestTypeConfig[request.type];
            const statusConfig = requestStatusConfig[request.status];
            const isIncoming = currentUserId && request.targetId === currentUserId;

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
                  } ${onRequestClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}`}
                  onClick={() => onRequestClick && onRequestClick(request)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header with badges */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {isIncoming ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <p className="font-semibold mb-0">{request.requesterName}</p>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground mb-0">You</p>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <p className="font-semibold mb-0">{request.targetName}</p>
                          </div>
                        )}

                        <Badge variant="outline" className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                        <Badge variant="outline" className={typeConfig.color}>
                          {typeConfig.label}
                        </Badge>
                      </div>

                      {/* Title */}
                      <p className="font-semibold text-sm mb-2">{request.title}</p>

                      {/* Date Information */}
                      <div className="space-y-1 mb-2">
                        {(request.startDate || request.relatedDate) && (
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
                        )}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Submitted {format(request.submittedAt, "MMM dd, yyyy")}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-0 line-clamp-2">
                        {request.description}
                      </p>

                      {/* Response message if exists */}
                      {request.responseMessage && (
                        <div className="mt-2 p-2 bg-muted/50 rounded text-sm">
                          <p className="font-semibold text-xs text-muted-foreground mb-1">
                            Response:
                          </p>
                          <p className="mb-0">{request.responseMessage}</p>
                        </div>
                      )}

                      {/* Direction indicator */}
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          {request.direction === "employee-to-manager"
                            ? "↑ To Manager"
                            : request.direction === "manager-to-employee"
                            ? "↓ From Manager"
                            : "↔ Peer"}
                        </Badge>
                      </div>
                    </div>

                    {showCancelButton &&
                      onCancel &&
                      request.status === "pending" &&
                      (!currentUserId || request.requesterId === currentUserId) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCancel(request.id)}
                          className="hover:bg-destructive/10 hover:text-destructive shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
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
