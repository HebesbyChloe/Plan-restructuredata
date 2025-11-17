import { Card } from "../../../ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { motion } from "motion/react";
import { useState } from "react";
import { CustomerServiceTicket } from "../../../../sampledata/customerServiceData";
import { DEFAULT_STAFF_LIST } from "../../../../utils/modules/crm";
import { CustomerServiceTableModuleProps } from "../../../../types/modules/crm";
import { CustomerColumnForCustomerServiceTable } from "./CustomerColumnForCustomerServiceTable";
import { TicketInfoColumnForCustomerServiceTable } from "./TicketInfoColumnForCustomerServiceTable";
import { IssueColumnForCustomerServiceTable } from "./IssueColumnForCustomerServiceTable";
import { StatusColumnForCustomerServiceTable } from "./StatusColumnForCustomerServiceTable";

export function CustomerServiceTableModule({ 
  tickets, 
  onTicketClick, 
  onCustomerClick,
  onOrderClick,
  staffList = DEFAULT_STAFF_LIST 
}: CustomerServiceTableModuleProps) {
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);

  // Handle ticket info click - opens ticket detail panel
  const handleTicketInfoClick = (ticket: any) => {
    setSelectedTicket(ticket.id);
    onTicketClick?.(ticket);
  };

  // Handle customer click - opens customer detail panel
  const handleCustomerClick = (ticket: any) => {
    onCustomerClick?.(ticket);
  };

  // Handle order click - opens order detail panel
  const handleOrderClick = (ticket: any) => {
    if (ticket.orderId) {
      onOrderClick?.(ticket);
    }
  };

  return (
    <Card className="p-4 sm:p-6 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 border-b border-border">
              <TableHead className="w-[30%] px-5 py-4">Customer</TableHead>
              <TableHead className="w-[30%] px-5 py-4">Ticket Info</TableHead>
              <TableHead className="w-[40%] px-5 py-4">Issue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.map((ticket, index) => (
              <motion.tr
                key={ticket.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`border-b border-border/50 hover:bg-muted/20 transition-colors ${
                  selectedTicket === ticket.id ? "bg-ai-blue/5" : ""
                }`}
              >
                <CustomerColumnForCustomerServiceTable ticket={ticket} onCustomerClick={handleCustomerClick} />
                <TicketInfoColumnForCustomerServiceTable 
                  ticket={ticket} 
                  onTicketInfoClick={handleTicketInfoClick}
                  onOrderClick={handleOrderClick}
                />
                <IssueColumnForCustomerServiceTable ticket={ticket} onTicketInfoClick={handleTicketInfoClick} />
              </motion.tr>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
