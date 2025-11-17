import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { CustomerServiceColumnProps } from "../../../../types/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";
import { ISSUE_TYPE, SERVICE_STATUS, calculateDaysSinceOpened, formatDaysSinceOpened, getAlertDayBadgeVariant } from "../../../../utils/modules/crm";
import { MessageSquare } from "lucide-react";

const ISSUE_TYPE_LIST = Object.values(ISSUE_TYPE);

export function IssueColumnForCustomerServiceTable({ ticket, onTicketInfoClick }: CustomerServiceColumnProps) {
  // Calculate days since ticket was opened, using lastUpdate for resolved/closed tickets
  const isResolved = ticket.status === SERVICE_STATUS.RESOLVED || ticket.status === SERVICE_STATUS.CLOSED;
  const daysSinceOpened = calculateDaysSinceOpened(ticket.createdDate, ticket.lastUpdate, isResolved);
  const alertDayBadgeVariant = getAlertDayBadgeVariant(daysSinceOpened, isResolved);

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onTicketInfoClick?.(ticket);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Row 1: Issue Type (text, bigger) */}
        <div className="flex items-center min-h-[28px]">
          {/* Issue Type - Text with Dropdown, bigger size */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <button className="text-base text-foreground hover:text-ai-blue transition-colors text-left">
                {ticket.issueType}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {ISSUE_TYPE_LIST.map((type) => (
                <DropdownMenuItem key={type}>{type}</DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Issue Detail - Full width, bigger text */}
        <div className="text-base text-foreground min-h-[32px] flex items-center hover:text-ai-blue transition-colors line-clamp-2">
          {ticket.issueDetail}
        </div>
        
        {/* Row 3: Alert Days Badge + Comments Icon with number + Satisfaction Badge (far right) */}
        <div className="flex items-center gap-2">
          {/* Alert Days Badge */}
          <div className="flex items-center">
            {daysSinceOpened >= 0 && (
              <InfoBadge 
                variant={alertDayBadgeVariant}
                size="sm"
                className="text-xs px-2 py-0.5"
              >
                {formatDaysSinceOpened(daysSinceOpened)}
              </InfoBadge>
            )}
          </div>
          
          {/* Comments Icon with number */}
          <div className="flex items-center gap-1.5 text-muted-foreground hover:text-ai-blue transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm">{ticket.messages}</span>
          </div>
          
          {/* Satisfaction Badge - Far Right */}
          <div className="flex-1 flex justify-end">
            {ticket.satisfaction && (
              <InfoBadge 
                variant={
                  ticket.satisfaction === "Excellent" ? "green" :
                  ticket.satisfaction === "Good" ? "blue" :
                  ticket.satisfaction === "Average" ? "orange" :
                  "red"
                }
                size="sm"
                className="text-xs px-2 py-0.5"
              >
                {ticket.satisfaction}
              </InfoBadge>
            )}
          </div>
        </div>
      </div>
    </TableCell>
  );
}
