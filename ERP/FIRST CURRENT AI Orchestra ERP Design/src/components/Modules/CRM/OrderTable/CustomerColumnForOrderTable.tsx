import { TableCell } from "../../../ui/table";
import { OrderColumnProps } from "../../../../types/modules/crm";
import { getRankIcon } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

import { Phone } from "lucide-react";

export function CustomerColumnForOrderTable({ order, onCustomerClick }: OrderColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onCustomerClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Customer Name with Rank Icon - First div - min-h-[28px] for text-xl */}
        <div className="min-h-[28px] flex items-center justify-between gap-2">
          <span className="text-xl leading-tight hover:text-ai-blue transition-colors">{order.customerName}</span>
          <div className="group relative flex-shrink-0">
            {getRankIcon(order.customerRank)}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
              {order.customerRank}
            </div>
          </div>
        </div>
        
        {/* Action Badge - Contact - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          <div 
            className="h-7 px-2 flex items-center gap-1.5 w-full justify-center rounded text-xs cursor-pointer bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors" 
            onClick={(e) => e.stopPropagation()}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact</span>
          </div>
        </div>
        
        {/* Sale Rep Main - Third div - h-8 */}
        <InfoBadge variant="default" size="md" className="w-full">
          {order.saleRepMain}
        </InfoBadge>
      </div>
    </TableCell>
  );
}
