import { Button } from "../../../ui/button";
import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { OrderColumnProps } from "../../../../types/modules/crm";
import { CSAT_STATUS, APPROVAL_STATUS } from "../../../../utils/modules/crm";
import { getCSATIcon, getCSATColor, getApprovalColor, getReviewSourceIcon } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

// Helper function to get text color for approval status
const getApprovalTextColor = (status: string) => {
  switch (status) {
    case "Pending Admin Review":
      return "text-slate-600 dark:text-slate-400";
    case "Under Review":
      return "text-amber-600 dark:text-amber-400";
    case "Approved":
      return "text-green-600 dark:text-green-400";
    case "Qualified":
      return "text-blue-600 dark:text-blue-400";
    case "Excellent":
      return "text-emerald-600 dark:text-emerald-400";
    case "Bad":
      return "text-red-600 dark:text-red-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

export function CustomerServiceColumnForOrderTable({ order, onOrderInfoClick }: OrderColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Review Source Icons - First div - min-h-[28px] */}
        <div className="min-h-[28px] flex items-start">
          {order.customerService.reviewSources && order.customerService.reviewSources.length > 0 && (
            <div className="flex items-center gap-2">
              {order.customerService.reviewSources.map((source, idx) => (
                <div key={idx} className="group relative">
                  {getReviewSourceIcon(source)}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    {source}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Approval Status - Second div - min-h-[26px] */}
        <div className="w-full min-h-[26px] flex items-center">
          {order.followUp.approvalStatus ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className={`text-xs hover:opacity-70 transition-opacity ${getApprovalTextColor(order.followUp.approvalStatus)}`}>
                  <span>{order.followUp.approvalStatus}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {APPROVAL_STATUS.map((status) => (
                  <DropdownMenuItem key={status}>
                    {status}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {/* CSAT Status Dropdown - Third div - h-8 */}
        <div className="w-full">
          {order.customerService.csatStatus ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <InfoBadge 
                  variant="default" 
                  size="md" 
                  className="w-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  icon={getCSATIcon(order.customerService.csatStatus)}
                >
                  <span className="truncate">{order.customerService.csatStatus}</span>
                </InfoBadge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {CSAT_STATUS.map((status) => (
                  <DropdownMenuItem key={status}>
                    <div className="flex items-center gap-2">
                      {getCSATIcon(status)}
                      <span>{status}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>
      </div>
    </TableCell>
  );
}
