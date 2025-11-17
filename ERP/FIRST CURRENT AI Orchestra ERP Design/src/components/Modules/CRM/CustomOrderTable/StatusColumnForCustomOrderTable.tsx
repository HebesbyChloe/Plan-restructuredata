import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../ui/popover";
import { Calendar as CalendarComponent } from "../../../ui/calendar";
import { Calendar } from "lucide-react";
import { CustomOrderColumnProps } from "../../../../types/modules/crm";
import { 
  CUSTOMIZE_STATUS, 
  getCustomizeOrderExtraByOrderNumber 
} from "../../../../sampledata/customizeOrderExtraData";
import { getStatusColor } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";
import { useState } from "react";

const CUSTOMIZE_STATUSES = Object.values(CUSTOMIZE_STATUS);

// Helper to get customize status badge variant
const getCustomizeStatusVariant = (status: string): "default" | "purple" | "blue" | "green" | "amber" => {
  switch (status) {
    case "Design Approved":
      return "blue";
    case "Production Ready":
      return "purple";
    case "In Transit":
      return "amber";
    case "Ready to Ship":
      return "green";
    default:
      return "default";
  }
};

export function StatusColumnForCustomOrderTable({ order, onOrderInfoClick }: CustomOrderColumnProps) {
  // Get customize status and est date from extra data mapped by order number
  const extraData = getCustomizeOrderExtraByOrderNumber(order.orderNumber);
  const customizeStatus = extraData?.customizeStatus || "Design Approved";
  const estDate = extraData?.estDate || "—";
  
  // State for date picker
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    estDate !== "—" ? new Date(estDate) : undefined
  );

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Date Created - First Row - min-h-[28px] for text-xl */}
        <div className="text-xl leading-tight min-h-[28px] hover:text-ai-blue transition-colors">
          {order.createdDate}
        </div>
        
        {/* Order Status + Customize Status Badge - Second Row - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center gap-2">
          {/* Order Status Badge - 1/2 width */}
          <div className={`h-7 px-2 flex-1 flex items-center justify-center rounded text-xs ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
          </div>
          
          {/* Customize Status Dropdown - 1/2 width */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="flex-1">
                <InfoBadge 
                  variant={getCustomizeStatusVariant(customizeStatus)}
                  size="sm"
                  className="w-full hover:opacity-80 transition-opacity"
                >
                  {customizeStatus}
                </InfoBadge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {CUSTOMIZE_STATUSES.map((status) => (
                <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Est Date with Calendar Icon - Third Row - h-8 */}
        <div className="h-8 flex items-center">
          <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
            <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="w-full">
                <InfoBadge 
                  variant="default" 
                  size="md" 
                  icon={<Calendar className="w-4 h-4" />}
                  className="w-full cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {estDate}
                </InfoBadge>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setIsDateOpen(false);
                  // Here you can add logic to save the date
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </TableCell>
  );
}
