import { useState } from "react";
import { Printer, Eye, MoreVertical, FileText, CheckCircle2, RefreshCw } from "lucide-react";
import { Button } from "../../../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../ui/tooltip";
import { toast } from "sonner";
import type { ShipmentData } from "../types";

interface ActionsColumnProps {
  shipment: ShipmentData;
  onViewDetails: (shipment: ShipmentData) => void;
  onStatusChange?: (shipmentId: string, newStatus: ShipmentData["status"]) => void;
}

export function ActionsColumn({ shipment, onViewDetails, onStatusChange }: ActionsColumnProps) {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintLabel = () => {
    setIsPrinting(true);
    toast.success(`Printing shipping label for ${shipment.orderNumber}`);
    setTimeout(() => setIsPrinting(false), 1000);
  };

  const handlePrintPackingSlip = () => {
    toast.success(`Printing packing slip for ${shipment.orderNumber}`);
  };

  const handleMarkAsShipped = () => {
    if (onStatusChange) {
      onStatusChange(shipment.id, "shipped");
      toast.success("Shipment marked as shipped");
    }
  };

  const handleUpdateTracking = () => {
    toast.info("Tracking update requested");
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewDetails(shipment)}
              className="h-8 w-8 p-0"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>View Details</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {!shipment.labelPrinted && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrintLabel}
                disabled={isPrinting}
                className="h-8 w-8 p-0"
              >
                <Printer className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Print Label</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetails(shipment)}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintLabel}>
            <Printer className="w-4 h-4 mr-2" />
            Print Label
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrintPackingSlip}>
            <FileText className="w-4 h-4 mr-2" />
            Print Packing Slip
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {(shipment.status === "packed" || shipment.status === "picked") && (
            <DropdownMenuItem onClick={handleMarkAsShipped}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Mark as Shipped
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={handleUpdateTracking}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Update Tracking
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
