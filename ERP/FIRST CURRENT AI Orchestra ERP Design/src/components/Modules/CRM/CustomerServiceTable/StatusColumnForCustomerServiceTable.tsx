import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { CustomerServiceColumnProps } from "../../../../types/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";
import { SERVICE_STATUS, getServiceStatusVariant, calculateDaysBetween, formatDaysDisplay, getAlertDayBadgeVariant } from "../../../../utils/modules/crm";

const SERVICE_STATUS_LIST = Object.values(SERVICE_STATUS);

export function StatusColumnForCustomerServiceTable({ ticket, onTicketInfoClick }: CustomerServiceColumnProps) {
  // Calculate days since ticket was created
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const isResolved = ticket.status === SERVICE_STATUS.RESOLVED || ticket.status === SERVICE_STATUS.CLOSED;
  
  const daysSinceCreated = ticket.createdDate && ticket.createdDate !== "—"
    ? calculateDaysBetween(ticket.createdDate, ticket.lastUpdate)
    : 0;
  
  // Get badge variant based on days and resolution status
  const alertDayBadgeVariant = getAlertDayBadgeVariant(daysSinceCreated, isResolved);

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTicketInfoClick?.(ticket);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Date and Person Updated - First div - min-h-[28px] */}
        <div className="text-sm text-muted-foreground min-h-[28px] flex items-center hover:text-ai-blue transition-colors">
          <span>{ticket.lastUpdate}</span>
          {ticket.updatedBy && ticket.updatedBy !== "—" && (
            <>
              <span className="mx-1.5">•</span>
              <span>{ticket.updatedBy}</span>
            </>
          )}
        </div>
        
        {/* Alert Day Badge - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          {daysSinceCreated > 0 && (
            <InfoBadge 
              variant={alertDayBadgeVariant}
              size="sm"
              className="w-full"
            >
              {formatDaysDisplay(daysSinceCreated)}
            </InfoBadge>
          )}
        </div>
        
        {/* Service Status Dropdown - Third div - h-8 */}
        <div className="h-8 flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <div className="w-full">
                <InfoBadge 
                  variant={getServiceStatusVariant(ticket.status)}
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
      </div>
    </TableCell>
  );
}
