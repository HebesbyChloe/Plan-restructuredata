import { motion } from "motion/react";
import { Download, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../../ui/sheet";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import { ReengageBatch, reengageSalesReps } from "../../../../sampledata";
import { getReengageBatchStatusColor } from "../../../../utils/modules/crm";

interface ReengageBatchDetailPanelProps {
  batch: ReengageBatch | null;
  onClose: () => void;
  onStatusUpdate: (batchId: string, newStatus: ReengageBatch["status"]) => void;
  onRepUpdate: (batchId: string, newRep: string) => void;
}

export function ReengageBatchDetailPanel({
  batch,
  onClose,
  onStatusUpdate,
  onRepUpdate,
}: ReengageBatchDetailPanelProps) {
  if (!batch) return null;

  return (
    <Sheet open={batch !== null} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-background p-0" aria-describedby="batch-detail-description">
        <SheetHeader className="sr-only">
          <SheetTitle>{batch.name} - Batch Details</SheetTitle>
        </SheetHeader>
        <p id="batch-detail-description" className="sr-only">
          Detailed batch information including summary, metrics, and customer statistics
        </p>

        {/* Header Section */}
        <div className="border-b border-border p-6 bg-background">
          <div className="space-y-2">
            <h2 className="mb-2">{batch.name}</h2>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 hover:text-foreground transition-colors">
                  <span>{batch.assignedRep}</span>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {reengageSalesReps.map((rep) => (
                    <DropdownMenuItem
                      key={rep}
                      onClick={() => onRepUpdate(batch.id, rep)}
                      className={batch.assignedRep === rep ? "bg-accent" : ""}
                    >
                      {rep}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span>•</span>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2">
                  <Badge className={getReengageBatchStatusColor(batch.status) + " text-xs"}>
                    {batch.status}
                  </Badge>
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "New")}>
                    <Badge className={getReengageBatchStatusColor("New")}>New</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "Assigned")}>
                    <Badge className={getReengageBatchStatusColor("Assigned")}>Assigned</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "In Progress")}>
                    <Badge className={getReengageBatchStatusColor("In Progress")}>In Progress</Badge>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "Done")}>
                    <Badge className={getReengageBatchStatusColor("Done")}>Done</Badge>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <p className="mb-0">Created: {batch.createdDate}</p>
            <p className="mb-0">Assigned: Sep 16, 2024</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Batch Summary */}
          <div>
            <h3 className="mb-4">Batch Summary</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Reactivated Revenue</p>
                <p className="text-2xl text-emerald-900 dark:text-emerald-300 mb-0">
                  ${((batch.historicalValue * batch.conversionRate) / 100).toLocaleString()}
                </p>
              </Card>
              <Card className="p-4 bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800">
                <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">Total Purchased</p>
                <p className="text-2xl text-amber-900 dark:text-amber-300 mb-0">{Math.round((batch.batchSize * batch.conversionRate) / 100)}</p>
              </Card>
            </div>

            <Button className="w-full bg-foreground text-background hover:bg-foreground/90">
              View Batch Customers
            </Button>
          </div>

          {/* Customer Stats */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Contacted</span>
              <span>{batch.batchSize}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Responded</span>
              <span>{Math.round((batch.batchSize * batch.responseRate) / 100)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Re-batch</span>
              <span>{batch.rebatch}</span>
            </div>
          </div>

          {/* Contacted */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Contacted</span>
              <span className="text-blue-600 dark:text-blue-400">{batch.responseRate}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${batch.responseRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Response Rate */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Response Rate</span>
              <span className="text-purple-600 dark:text-purple-400">{batch.responseRate}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-purple-600 dark:bg-purple-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${batch.responseRate}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              />
            </div>
          </div>

          {/* Conversion Rate */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Conversion Rate</span>
              <span className="text-amber-600 dark:text-amber-400">{batch.conversionRate}%</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-amber-600 dark:bg-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${batch.conversionRate}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              />
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <Card className="p-4 bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800">
              <p className="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Historical Value</p>
              <p className="text-xl text-emerald-900 dark:text-emerald-300 mb-0">
                ${batch.historicalValue.toLocaleString()}
              </p>
            </Card>
            <Card className="p-4 bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Batch Size</p>
              <p className="text-xl mb-0">{batch.batchSize}</p>
            </Card>
          </div>

          {/* Export Button */}
          <div className="pt-6 border-t border-border">
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
