import React from "react";
import { Layers, Check } from "lucide-react";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../ui/dropdown-menu";
import { OrderData } from "../../../../../types/modules/crm";
import { mockBatchesEnhanced } from "../../../../../sampledata/batchesEnhanced";
import { toast } from "sonner";

interface OrderActionsSectionProps {
  order: OrderData;
  onBulkPrintLabels?: (ids: string[]) => void;
}

export function OrderActionsSection({ order, onBulkPrintLabels }: OrderActionsSectionProps) {
  // Get batch info from statusProcess.group
  const batchNumber = order.statusProcess?.group;
  const hasBatch = !!batchNumber;

  const handleBatchSelect = (e: React.MouseEvent, batchName: string, batchId: string) => {
    e.stopPropagation();
    if (batchNumber === batchName) {
      toast.info(`Already assigned to ${batchName}`);
    } else {
      toast.success(`Assigned order ${order.orderNumber} to ${batchName}`);
    }
  };

  const handleRemoveBatch = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Removed order ${order.orderNumber} from ${batchNumber}`);
  };

  // Filter batches that are not shipped or completed
  const availableBatches = mockBatchesEnhanced.filter(
    (b) => b.status !== "shipped" && b.status !== "completed"
  );

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs flex-1 bg-[#4B6BFB]/10 border-[#4B6BFB]/30 text-[#4B6BFB] hover:bg-[#4B6BFB]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <Layers className="w-3 h-3 mr-1.5" />
            {hasBatch ? batchNumber : "Batch"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {availableBatches.map((batch) => (
            <DropdownMenuItem
              key={batch.id}
              onClick={(e) => handleBatchSelect(e, batch.name, batch.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex flex-col">
                <span className="font-medium">{batch.name}</span>
                <span className="text-xs text-muted-foreground">
                  {batch.totalOrders} orders • {batch.status}
                </span>
              </div>
              {batchNumber === batch.name && (
                <Check className="w-4 h-4 text-[#4B6BFB]" />
              )}
            </DropdownMenuItem>
          ))}
          {hasBatch && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleRemoveBatch}
                className="text-red-600 cursor-pointer"
              >
                Remove from batch
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <Badge
        className="flex-1 justify-center py-1.5 h-8 bg-[#4B6BFB]/10 text-[#4B6BFB] border border-[#4B6BFB]/30"
        variant="secondary"
      >
        {order.orderStatus}
      </Badge>
    </div>
  );
}
