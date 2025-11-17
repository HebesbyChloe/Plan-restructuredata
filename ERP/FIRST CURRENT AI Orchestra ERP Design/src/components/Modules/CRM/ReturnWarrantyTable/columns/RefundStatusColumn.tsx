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
import { 
  REFUND_STATUS, 
  getReturnWarrantyExtraByOrderNumber,
  REQUEST_TYPE,
  RETURN_WARRANTY_STATUS 
} from "../../../../../sampledata/returnWarrantyExtraData";

// Filter out N/A from refund statuses for dropdown
const REFUND_STATUSES = Object.values(REFUND_STATUS).filter(status => status !== REFUND_STATUS.NOT_APPLICABLE);

export function RefundStatusColumn({ order, onOrderInfoClick }: ColumnProps) {
  // Get refund status from extra data mapped by order number
  const extraData = getReturnWarrantyExtraByOrderNumber(order.orderNumber);
  
  // Determine refund status with logic:
  // If type = return AND status = warehouse received, show "Pending Refund"
  // If order status = "Refunded", show "Processed"
  let refundStatus = extraData?.refundStatus || order.returnWarrantyDetails?.refundStatus || REFUND_STATUS.PENDING_REFUND;
  
  const isReturn = extraData?.requestType === REQUEST_TYPE.RETURN;
  const isWarehouseReceived = extraData?.returnWarrantyStatus === RETURN_WARRANTY_STATUS.WAREHOUSE_RECEIVED;
  const isRefunded = order.orderStatus === "Refunded";
  
  // Override logic based on conditions
  if (isReturn && isWarehouseReceived) {
    refundStatus = REFUND_STATUS.PENDING_REFUND;
  } else if (isRefunded) {
    refundStatus = REFUND_STATUS.COMPLETED;
  }
  
  // Determine if status should be red (Pending Refund)
  const isRefundPending = refundStatus === REFUND_STATUS.PENDING_REFUND;

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Refund Status Dropdown - First div - min-h-[28px] for text-xl */}
        <div className="min-h-[28px] flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-lg leading-tight hover:bg-muted/50 transition-colors ${
                  isRefundPending ? 'text-red-600 hover:text-red-700' : 'hover:text-ai-blue'
                }`}
              >
                {refundStatus}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {REFUND_STATUSES.map((status) => (
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
