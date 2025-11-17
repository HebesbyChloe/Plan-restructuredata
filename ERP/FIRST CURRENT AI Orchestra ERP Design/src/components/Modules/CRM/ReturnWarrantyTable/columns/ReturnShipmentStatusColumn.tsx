import { Button } from "../../../../ui/button";
import { TableCell } from "../../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { ColumnProps } from "../types";
import { RETURN_SHIPMENT_STATUS, getReturnWarrantyExtraByOrderNumber } from "../../../../../sampledata/returnWarrantyExtraData";

const RETURN_SHIPMENT_STATUSES = Object.values(RETURN_SHIPMENT_STATUS);

export function ReturnShipmentStatusColumn({ order, onOrderInfoClick }: ColumnProps) {
  // Get return shipment status from extra data mapped by order number
  const extraData = getReturnWarrantyExtraByOrderNumber(order.orderNumber);
  const returnShipmentStatus = extraData?.returnShipmentStatus || "Not Started";

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Return Shipment Status Dropdown - First div - min-h-[28px] for text-xl */}
        <div className="min-h-[28px] flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="text-lg leading-tight hover:bg-muted/50 hover:text-ai-blue transition-colors">
                {returnShipmentStatus}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {RETURN_SHIPMENT_STATUSES.map((status) => (
                <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Empty Second div - min-h-[26px] for consistent spacing */}
        <div className="min-h-[26px]"></div>
        
        {/* Empty Third div - h-8 for consistent spacing */}
        <div className="h-8"></div>
      </div>
    </TableCell>
  );
}
