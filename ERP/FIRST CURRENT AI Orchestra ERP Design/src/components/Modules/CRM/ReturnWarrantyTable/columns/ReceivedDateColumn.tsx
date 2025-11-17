import { TableCell } from "../../../../ui/table";
import { ColumnProps } from "../types";

export function ReceivedDateColumn({ order, onOrderInfoClick }: ColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Received Date - First div - min-h-[28px] for text-xl */}
        <div className="text-xl leading-tight min-h-[28px] hover:text-ai-blue transition-colors">
          {order.receivedDate || "—"}
        </div>
        
        {/* Empty Second div - min-h-[26px] for consistent spacing */}
        <div className="min-h-[26px]"></div>
        
        {/* Empty Third div - h-8 for consistent spacing */}
        <div className="h-8"></div>
      </div>
    </TableCell>
  );
}
