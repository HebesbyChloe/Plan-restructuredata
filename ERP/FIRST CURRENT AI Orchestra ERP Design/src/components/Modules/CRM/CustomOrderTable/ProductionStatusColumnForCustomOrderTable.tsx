import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { CustomOrderColumnProps } from "../../../../types/modules/crm";
import { PRODUCTION_STATUS, getCustomizeOrderExtraByOrderNumber } from "../../../../sampledata/customizeOrderExtraData";
import { calculateDaysBetween, formatDaysDisplay } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

const PRODUCTION_STATUSES = Object.values(PRODUCTION_STATUS);

export function ProductionStatusColumnForCustomOrderTable({ order, onOrderInfoClick }: CustomOrderColumnProps) {
  // Get production status from extra data mapped by order number
  const extraData = getCustomizeOrderExtraByOrderNumber(order.orderNumber);
  const productionStatus = extraData?.productionStatus || order.customizeDetails?.productCompleteStatus || "Not Started";
  const updatedDate = extraData?.productionUpdatedDate || "—";
  const updatedBy = extraData?.productionUpdatedBy || "—";
  
  // Calculate days taken from order created date
  const daysTaken = updatedDate !== "—" && order.createdDate 
    ? calculateDaysBetween(order.createdDate, updatedDate)
    : 0;

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Date and Person on same line - First div - min-h-[28px] */}
        <div className="text-sm text-muted-foreground min-h-[28px] hover:text-ai-blue transition-colors">
          {updatedDate} {updatedBy}
        </div>
        
        {/* Processing Time - Small Badge - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          {updatedDate !== "—" && (
            <div className={`px-2 py-0.5 rounded text-xs ${daysTaken > 5 ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' : 'bg-muted text-muted-foreground'}`}>
              {formatDaysDisplay(daysTaken)}
            </div>
          )}
        </div>
        
        {/* Status Dropdown - Third div - h-8 */}
        <div className="h-8 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="w-full">
                <InfoBadge 
                  variant="default"
                  size="md"
                  className="w-full hover:opacity-80 transition-opacity"
                >
                  {productionStatus}
                </InfoBadge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {PRODUCTION_STATUSES.map((status) => (
                <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TableCell>
  );
}
