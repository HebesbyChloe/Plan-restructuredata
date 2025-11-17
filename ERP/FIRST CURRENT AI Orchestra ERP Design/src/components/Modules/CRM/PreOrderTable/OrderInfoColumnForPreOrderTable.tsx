import { Button } from "../../../ui/button";
import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { PreOrderColumnProps } from "../../../../types/modules/crm";
import { DEFAULT_STAFF_LIST } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

export function OrderInfoColumnForPreOrderTable({ order, staffList = DEFAULT_STAFF_LIST, onOrderInfoClick }: PreOrderColumnProps) {
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
        <div className="min-h-[28px] flex items-center">
          <span className="text-xl leading-tight hover:text-ai-blue transition-colors">{order.orderNumber}</span>
        </div>
        
        {/* Amount - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          <span className="text-lg leading-tight hover:text-ai-blue transition-colors">
            ${order.amount}
          </span>
        </div>
        
        {/* Staff - Third div - h-8 */}
        <div className="h-8 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <InfoBadge variant="default" size="md" className="w-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <span className="truncate">{order.saleRepMain}</span>
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
      </div>
    </TableCell>
  );
}
