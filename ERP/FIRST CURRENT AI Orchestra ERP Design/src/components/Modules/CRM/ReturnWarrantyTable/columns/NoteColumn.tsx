import { Button } from "../../../../ui/button";
import { TableCell } from "../../../../ui/table";
import { Edit } from "lucide-react";
import { ColumnProps } from "../types";

export function NoteColumn({ order, onOrderInfoClick }: ColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Note Preview - First div - min-h-[28px] for text-xl */}
        <div className="text-xl leading-tight min-h-[28px] hover:text-ai-blue transition-colors truncate">
          {order.note || "—"}
        </div>
        
        {/* Empty Second div - min-h-[26px] for consistent spacing */}
        <div className="min-h-[26px]"></div>
        
        {/* Edit Button - Third div - h-8 */}
        <div className="h-8 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-7 w-7 p-0 hover:bg-muted/50"
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit note action
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </TableCell>
  );
}
