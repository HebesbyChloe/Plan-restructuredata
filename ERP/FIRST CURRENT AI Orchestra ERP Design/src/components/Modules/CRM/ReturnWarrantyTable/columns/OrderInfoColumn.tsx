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
import { DEFAULT_STAFF_LIST } from "../utils/returnWarrantyTableConstants";
import { InfoBadge } from "../../../../ui/info-badge";

export function OrderInfoColumn({ order, staffList = DEFAULT_STAFF_LIST, onOrderInfoClick }: ColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Order Number - First div - min-h-[28px] for text-xl */}
        <div className="text-xl leading-tight min-h-[28px] hover:text-ai-blue transition-colors">
          {order.orderNumber}
        </div>
        
        {/* Amount - Second div - min-h-[26px] for text-lg */}
        <div className="text-lg leading-tight min-h-[26px] hover:text-ai-blue transition-colors">
          ${order.amount}
        </div>
        
        {/* Assigned Staff - Third div - h-8 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <InfoBadge variant="default" size="md" className="w-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="truncate">{order.saleRepMain || "Unassigned"}</span>
            </InfoBadge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {staffList.map((staff) => (
              <DropdownMenuItem key={staff}>
                {staff}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableCell>
  );
}
