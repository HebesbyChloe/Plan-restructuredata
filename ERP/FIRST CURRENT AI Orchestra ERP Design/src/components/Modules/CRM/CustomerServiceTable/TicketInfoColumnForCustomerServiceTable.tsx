import { TableCell } from "../../../ui/table";
import { CustomerServiceColumnProps } from "../../../../types/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";
import { SERVICE_STATUS, PRIORITY, calculateDaysSinceOpened, getServiceStatusVariant, getPriorityVariant } from "../../../../utils/modules/crm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { AlertCircle } from "lucide-react";

const SERVICE_STATUS_LIST = Object.values(SERVICE_STATUS);
const PRIORITY_LIST = Object.values(PRIORITY);

export function TicketInfoColumnForCustomerServiceTable({ ticket, onTicketInfoClick, onOrderClick }: CustomerServiceColumnProps) {
  // Calculate days since ticket was opened (will be used by IssueColumn now)
  const isResolved = ticket.status === SERVICE_STATUS.RESOLVED || ticket.status === SERVICE_STATUS.CLOSED;
  calculateDaysSinceOpened(ticket.createdDate, ticket.lastUpdate, isResolved);
  
  const priorityVariant = getPriorityVariant(ticket.priority);
  
  // Map priority variant to icon color
  const getPriorityIconColor = () => {
    switch (priorityVariant) {
      case "red":
        return "text-red-500";
      case "orange":
        return "text-orange-500";
      case "green":
        return "text-green-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTicketInfoClick?.(ticket);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Row 1: Ticket Number + Date Created (far right) */}
        <div className="min-h-[28px] flex items-center justify-between">
          <span className="text-xl hover:text-ai-blue transition-colors">
            {ticket.id}
          </span>
          <span className="text-sm text-muted-foreground hover:text-ai-blue transition-colors">
            {ticket.createdDate}
          </span>
        </div>
        
        {/* Row 2: Order Number Badge (1/2 width) + Order Date (far right) */}
        <div className="h-8 flex items-center gap-2">
          {ticket.orderId ? (
            <>
              {/* Order Badge - 1/2 width */}
              <div className="flex-1 flex items-center">
                <InfoBadge 
                  variant="default" 
                  size="md" 
                  className="w-full hover:opacity-80 transition-opacity cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOrderClick?.(ticket);
                  }}
                >
                  {ticket.orderId}
                </InfoBadge>
              </div>
              {/* Order Date - 1/2 width, far right */}
              <div className="flex-1 flex items-center justify-end">
                {ticket.orderDate && (
                  <span className="text-sm text-muted-foreground hover:text-ai-blue transition-colors">
                    {ticket.orderDate}
                  </span>
                )}
              </div>
            </>
          ) : (
            <InfoBadge 
              variant="default" 
              size="md" 
              className="w-full opacity-50"
            >
              No Order
            </InfoBadge>
          )}
        </div>

        {/* Row 3: Service Status Badge + Priority Icon (far right) */}
        <div className="flex items-center justify-between">
          {/* Status Badge */}
          <div className="h-8 flex items-center" style={{ width: '50%' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <div className="w-full">
                  <InfoBadge 
                    variant={getPriorityVariant(ticket.priority)}
                    size="md"
                    className="w-full hover:opacity-80 transition-opacity"
                  >
                    {ticket.status}
                  </InfoBadge>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {SERVICE_STATUS_LIST.map((status) => (
                  <DropdownMenuItem key={status}>{status}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Priority Icon - Far Right */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className={`flex items-center gap-1.5 hover:opacity-80 transition-opacity ${getPriorityIconColor()}`}>
                <AlertCircle className="w-4 h-4" />
                <span className="text-xs">{ticket.priority}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {PRIORITY_LIST.map((priority) => (
                <DropdownMenuItem key={priority}>{priority}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TableCell>
  );
}
