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
  REQUEST_TYPE,
  RETURN_WARRANTY_STATUS,
  REFUND_STATUS,
  getReturnWarrantyExtraByOrderNumber 
} from "../../../../../sampledata/returnWarrantyExtraData";
import { 
  calculateDaysBetween,
  formatDaysDisplay,
  getDayBadgeVariant
} from "../utils/returnWarrantyTableHelpers";

// Get array of request types for dropdown
const REQUEST_TYPES = Object.values(REQUEST_TYPE);

// Request Reason Constants
const REQUEST_REASON = {
  DEFECTIVE: "Defective",
  WRONG_ITEM: "Wrong Item",
  NOT_AS_DESCRIBED: "Not as Described",
  CHANGED_MIND: "Changed Mind",
  SIZE_ISSUE: "Size Issue",
  DAMAGED: "Damaged",
  WARRANTY_CLAIM: "Warranty Claim",
  OTHER: "Other",
} as const;

const REQUEST_REASONS = Object.values(REQUEST_REASON);
const PROCESSING_STATUSES = Object.values(RETURN_WARRANTY_STATUS);

export function RequestColumn({ order, onOrderInfoClick }: ColumnProps) {
  // Get extra data mapped by order number
  const extraData = getReturnWarrantyExtraByOrderNumber(order.orderNumber);
  const returnWarrantyDetails = order.returnWarrantyDetails;
  
  // Get request type from extraData or fallback to returnWarrantyDetails
  const requestType = extraData?.requestType || returnWarrantyDetails?.returnType || REQUEST_TYPE.RETURN;
  const requestReason = returnWarrantyDetails?.note || REQUEST_REASON.DEFECTIVE;
  
  // Get processing status data (internal return/warranty status)
  const processingStatus = extraData?.returnWarrantyStatus || RETURN_WARRANTY_STATUS.INQUIRY_START;
  
  // Check if this is a return type to show refund amount
  const isReturn = requestType === REQUEST_TYPE.RETURN;
  const refundAmount = order.amount;
  
  // Get refund status with logic
  const isWarehouseReceived = extraData?.returnWarrantyStatus === RETURN_WARRANTY_STATUS.WAREHOUSE_RECEIVED;
  const isRefunded = order.orderStatus === "Refunded";
  
  // Determine refund status and display text
  let refundStatus: string;
  let refundStatusVariant: "red" | "default";
  
  if (isRefunded) {
    // Order is refunded - show "Processed" in gray
    refundStatus = "Processed";
    refundStatusVariant = "default";
  } else if (isReturn && isWarehouseReceived) {
    // Return reached warehouse but not yet refunded - show "Pending Refund" in red
    refundStatus = "Pending Refund";
    refundStatusVariant = "red";
  } else {
    // Default fallback
    refundStatus = extraData?.refundStatus || order.returnWarrantyDetails?.refundStatus || REFUND_STATUS.PENDING_REFUND;
    refundStatusVariant = refundStatus === REFUND_STATUS.PENDING_REFUND ? "red" : "default";
  }
  
  // Calculate days from order created date to completion date (if completed) or today (if not completed)
  const isCompleted = processingStatus === RETURN_WARRANTY_STATUS.COMPLETED;
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const endDate = isCompleted && extraData?.completedDate ? extraData.completedDate : today;
  
  const daysSinceCreated = order.createdDate && order.createdDate !== "—"
    ? calculateDaysBetween(order.createdDate, endDate)
    : 0;
  
  // Get badge variant based on days and completion status
  const dayBadgeVariant = getDayBadgeVariant(daysSinceCreated, isCompleted);

  // Get badge variant based on REQUEST_TYPE constant
  const getRequestTypeVariant = (type: string) => {
    switch (type) {
      case REQUEST_TYPE.RETURN:
        return "purple" as const;
      case REQUEST_TYPE.WARRANTY:
        return "blue" as const;
      case REQUEST_TYPE.EXCHANGE:
        return "green" as const;
      case REQUEST_TYPE.REPAIR:
        return "orange" as const;
      case REQUEST_TYPE.CANCEL_INQUIRY:
        return "default" as const;
      default:
        return "purple" as const;
    }
  };

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Request Reason - First div - min-h-[28px] */}
        <div className="text-sm text-muted-foreground min-h-[28px] flex items-center hover:text-ai-blue transition-colors">
          {requestReason}
        </div>
        
        {/* Refund Amount + Status - Second div - min-h-[28px] */}
        <div className="min-h-[28px] flex items-center gap-2">
          {isReturn && refundAmount && (
            <>
              <InfoBadge 
                variant="red"
                size="sm"
                className="w-fit"
              >
                Refund: ${refundAmount}
              </InfoBadge>
              <InfoBadge 
                variant={refundStatusVariant}
                size="sm"
                className="w-fit"
              >
                {refundStatus}
              </InfoBadge>
            </>
          )}
        </div>
        
        {/* Request Type Dropdown + Days Badge - Third div - min-h-[28px] */}
        <div className="min-h-[28px] flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="w-1/2">
                <InfoBadge 
                  variant={getRequestTypeVariant(requestType)}
                  size="md"
                  className="w-full hover:opacity-80 transition-opacity"
                >
                  {requestType}
                </InfoBadge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {REQUEST_TYPES.map((type) => (
                <DropdownMenuItem key={type}>{type}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          {daysSinceCreated > 0 && (
            <InfoBadge 
              variant={dayBadgeVariant}
              size="sm"
              className="whitespace-nowrap flex-shrink-0"
            >
              {formatDaysDisplay(daysSinceCreated)}
            </InfoBadge>
          )}
        </div>
      </div>
    </TableCell>
  );
}
