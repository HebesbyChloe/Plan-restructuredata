import { useState } from "react";
import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Progress } from "../../../ui/progress";
import {
  Search,
  Filter,
  Download,
  Plus,
  Layers,
  Package,
  User,
  Calendar,
  Eye,
  Printer,
  Play,
  CheckCircle2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../ui/tooltip";
import { BATCH_STATUS_CONFIG, BATCH_PRIORITY_CONFIG } from "./utils/constants";
import { getBatchProgress, BatchEnhanced } from "../../../../sampledata/batchesEnhanced";
import { toast } from "sonner";

// Types
type BatchData = BatchEnhanced;

interface BatchTableModuleProps {
  batches: BatchData[];
  onBatchClick: (batch: BatchData) => void;
  onStatusChange?: (batchId: string, newStatus: BatchData["status"]) => void;
  onAssignUser?: (batchId: string, userId: string) => void;
}

export function BatchTableModule({
  batches,
  onBatchClick,
  onStatusChange,
  onAssignUser,
}: BatchTableModuleProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BatchData["status"] | "all">("all");

  // Filter batches
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      searchQuery === "" ||
      batch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || batch.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handlePrintPickList = (batch: BatchData) => {
    toast.success(`Printing pick list for ${batch.name}`);
  };

  const handleStartBatch = (batch: BatchData) => {
    if (onStatusChange) {
      onStatusChange(batch.id, "picking");
      toast.success("Batch started - status set to Picking");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Search */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px] max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search batches..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBatches.length === 0 ? (
          <Card className="col-span-full p-12 text-center glass-card">
            <p className="text-muted-foreground">No batches found</p>
          </Card>
        ) : (
          filteredBatches.map((batch) => {
            const progress = getBatchProgress(batch);
            const statusConfig = BATCH_STATUS_CONFIG[batch.status];
            const priorityConfig = BATCH_PRIORITY_CONFIG[batch.priority];

            return (
              <Card
                key={batch.id}
                className="p-6 glass-card hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => onBatchClick(batch)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="truncate mb-1">{batch.name}</h3>
                      <p className="text-sm text-muted-foreground">{batch.id}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge
                      variant="secondary"
                      className={`${statusConfig.color} whitespace-nowrap`}
                    >
                      <statusConfig.icon className="w-3 h-3 mr-1" />
                      {statusConfig.label}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`${priorityConfig.color} whitespace-nowrap`}
                    >
                      {priorityConfig.label}
                    </Badge>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Orders</p>
                    <p className="text-lg">{batch.totalOrders}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Items</p>
                    <p className="text-lg">{batch.totalItems}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Value</p>
                    <p className="text-lg">${batch.totalValue.toFixed(2)}</p>
                  </div>
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress.percentComplete}%</span>
                  </div>
                  <Progress value={progress.percentComplete} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                      Picked: {progress.pickedShipments}/{batch.totalShipments || 0} ({progress.pickedItems} items)
                    </span>
                    <span>
                      Packed: {progress.packedShipments}/{batch.totalShipments || 0} ({progress.packedItems} items)
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {batch.assignedTo && (
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{batch.assignedTo}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(batch.createdDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <TooltipProvider>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {batch.status === "open" && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartBatch(batch);
                              }}
                            >
                              <Play className="w-4 h-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Start Batch</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrintPickList(batch);
                            }}
                          >
                            <Printer className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Print Pick List</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              onBatchClick(batch);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
