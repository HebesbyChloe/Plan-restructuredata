import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Calendar, Clock, X } from "lucide-react";
import { format } from "date-fns";
import { 
  DayOffRequest, 
  requestTypeLabels, 
  requestTypeColors 
} from "../../../sampledata/requestOffData";

interface PendingRequestsCardProps {
  requests: DayOffRequest[];
  onCancel?: (requestId: string) => void;
  showCancelButton?: boolean;
}

export function PendingRequestsCard({
  requests,
  onCancel,
  showCancelButton = true,
}: PendingRequestsCardProps) {
  const pendingRequests = requests.filter((r) => r.status === "pending");

  if (pendingRequests.length === 0) {
    return (
      <Card className="p-6 bg-background/50 backdrop-blur-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ai-blue" />
          Pending Requests
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          No pending requests
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold mb-0 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-ai-blue" />
          Pending Requests
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
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <p className="font-semibold mb-0">{request.employeeName}</p>
                    <Badge
                      variant="outline"
                      className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-500/30"
                    >
                      Pending
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

                  <p className="text-sm text-muted-foreground mb-0">
                    {request.reason}
                  </p>
                </div>

                {showCancelButton && onCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCancel(request.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
