import { TableCell } from "../../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../ui/dropdown-menu";
import { ColumnProps } from "../types";
import { InfoBadge } from "../../../../ui/info-badge";
import { 
  RETURN_WARRANTY_STATUS,
  REFUND_STATUS,
  getReturnWarrantyExtraByOrderNumber 
} from "../../../../../sampledata/returnWarrantyExtraData";

// Use the new Return & Warranty Status constants
const PROCESSING_STATUSES = Object.values(RETURN_WARRANTY_STATUS);
const REFUND_STATUSES = Object.values(REFUND_STATUS);

export function ProcessingStatusColumn({ order, onOrderInfoClick }: ColumnProps) {
  // Get extra data mapped by order number
  const extraData = getReturnWarrantyExtraByOrderNumber(order.orderNumber);
  const returnWarrantyDetails = order.returnWarrantyDetails;
  
  // Get processing data - use the new returnWarrantyStatus field
  const processingStatus = extraData?.returnWarrantyStatus || order.orderStatus || RETURN_WARRANTY_STATUS.INQUIRY_START;
  const refundStatus = extraData?.refundStatus || returnWarrantyDetails?.refundStatus || REFUND_STATUS.PENDING;
  const updatedDate = returnWarrantyDetails?.receivedDate || order.createdDate || "—";
  const updatedBy = order.saleRepMain || "—";

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Date and Person - First div - min-h-[28px] */}
        <div className="text-sm text-muted-foreground min-h-[28px] hover:text-ai-blue transition-colors">
          {updatedDate} {updatedBy}
        </div>
        


      </div>
    </TableCell>
  );
}
