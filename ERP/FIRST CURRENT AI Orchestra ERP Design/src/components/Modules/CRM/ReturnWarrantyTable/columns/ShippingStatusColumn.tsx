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
import { SHIPPING_STATUSES } from "../utils/returnWarrantyTableConstants";

export function ShippingStatusColumn({ order, onOrderInfoClick }: ColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Shipping Status Dropdown - First div - min-h-[28px] for text-xl */}
        <div className="min-h-[28px] flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="text-lg leading-tight hover:bg-muted/50 hover:text-ai-blue transition-colors">
                {order.shippingStatus}
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {SHIPPING_STATUSES.map((status) => (
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
