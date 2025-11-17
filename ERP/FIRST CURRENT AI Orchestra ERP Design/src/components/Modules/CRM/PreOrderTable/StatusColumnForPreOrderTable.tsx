import { TableCell } from "../../../ui/table";
import { PreOrderColumnProps } from "../../../../types/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";
import { Calendar, AlertCircle, MessageSquare, Info } from "lucide-react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../ui/popover";
import { Button } from "../../../ui/button";

const getPreOrderStatusColor = (status: string) => {
  switch (status) {
    case "Pending":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "US Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "VN Processing":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "Notify OOS":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Model Change":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Awaiting Batch":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400";
    case "Supplier Sourcing":
      return "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400";
    case "Completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export function StatusColumnForPreOrderTable({ order, onOrderInfoClick }: PreOrderColumnProps) {
  const [estDate, setEstDate] = useState(order.preOrderDetails?.estDate || "Nov 15 2025");
  const [isDateOpen, setIsDateOpen] = useState(false);
  const preorderStatus = order.preOrderDetails?.preorderStatus || "Pending";
  const updatedDate = order.preOrderDetails?.updatedDate || "Oct 09 2025";
  const updatedBy = order.preOrderDetails?.updatedBy || order.saleRepMain || "Hang Tran";
  
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Est Date with Calendar Icon - First div - min-h-[28px] - Same size as order # */}
        <div className="min-h-[28px] flex items-center">
          <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="text-xl leading-tight hover:text-ai-blue transition-colors flex items-center gap-2">
                <span>{estDate}</span>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-3" 
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="text"
                value={estDate}
                onChange={(e) => setEstDate(e.target.value)}
                className="px-2 py-1 border rounded text-sm"
                placeholder="Est Date"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Pre Order Status Badge with Alert Icons - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center gap-2">
          <div className={`h-7 px-2 flex items-center justify-center w-1/2 rounded text-xs ${getPreOrderStatusColor(preorderStatus)}`}>
            {preorderStatus}
          </div>
          <div className="flex items-center gap-2">
            <div className="group relative">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                Late (2 days)
              </div>
            </div>
            <div className="group relative">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                Customer Note
              </div>
            </div>
            <div className="group relative">
              <Info className="w-4 h-4 text-purple-500" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                Special Request
              </div>
            </div>
          </div>
        </div>
        
        {/* Updated Date • Updated By Combined - Third div - h-8 */}
        <div className="h-8 flex items-center">
          <InfoBadge variant="default" size="md" className="w-full">
            <span className="truncate">{updatedDate} • {updatedBy}</span>
          </InfoBadge>
        </div>
      </div>
    </TableCell>
  );
}
