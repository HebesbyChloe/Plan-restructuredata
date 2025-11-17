import { TableCell } from "../../../../ui/table";
import { ColumnProps } from "../types";
import { getReturnWarrantyExtraByOrderNumber } from "../../../../../sampledata/returnWarrantyExtraData";
import { Package } from "lucide-react";

export function ReturnShipmentTrackingColumn({ order, onOrderInfoClick }: ColumnProps) {
  // Get return shipment tracking from extra data mapped by order number
  const extraData = getReturnWarrantyExtraByOrderNumber(order.orderNumber);
  const trackingNumber = extraData?.returnShipmentTracking || "";

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Tracking Number - First div - min-h-[28px] for text-xl */}
        <div className="min-h-[28px] flex items-center gap-2">
          {trackingNumber ? (
            <>
              <Package className="w-4 h-4 text-ai-blue" />
              <span className="text-lg leading-tight hover:text-ai-blue transition-colors font-mono">
                {trackingNumber}
              </span>
            </>
          ) : (
            <span className="text-lg leading-tight text-muted-foreground">—</span>
          )}
        </div>
        
        {/* Empty Second div - min-h-[26px] for consistent spacing */}
        <div className="min-h-[26px]"></div>
        
        {/* Empty Third div - h-8 for consistent spacing */}
        <div className="h-8"></div>
      </div>
    </TableCell>
  );
}
