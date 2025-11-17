import { Button } from "../../../ui/button";
import { Download, RefreshCw, Headphones } from "lucide-react";
import { CustomerServiceBoardHeaderProps } from "../../../../types/modules/crm";

/**
 * CustomerServiceBoardHeaderModule
 * 
 * Reusable header component for the Customer Service Board page.
 * Features:
 * - Indigo/Purple gradient icon and title
 * - Refresh, Export, and New Ticket action buttons
 * - Consistent styling with other boards
 */
export function CustomerServiceBoardHeaderModule({
  onRefresh,
  onExport,
  onNewTicket,
}: CustomerServiceBoardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Headphones className="w-5 h-5 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-0">
            Customer Service Board
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage customer support tickets and service requests
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button 
          className="gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
          onClick={onNewTicket}
        >
          <Headphones className="w-4 h-4" />
          New Ticket
        </Button>
      </div>
    </div>
  );
}
