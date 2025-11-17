import { Button } from "../../../ui/button";
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
import { ChevronDown } from "lucide-react";
import { OrderColumnProps } from "../../../../types/modules/crm";
import { DEFAULT_SALE_REPS } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

export function OrderInfoColumnForOrderTable({ order, saleReps = DEFAULT_SALE_REPS, onOrderInfoClick }: OrderColumnProps) {
  // Determine if this is a partial payment order
  const isPartialPaymentOrder = order.paidAmount !== undefined || order.dueAmount !== undefined;
  
  // Calculate total amount (original order total)
  const totalAmount = order.amount;
  
  // Calculate paid and due amounts
  const paidAmount = order.paidAmount || 0;
  const dueAmount = order.dueAmount !== undefined 
    ? order.dueAmount 
    : order.paidAmount !== undefined 
      ? totalAmount - order.paidAmount 
      : 0;
  
  // Display amount is the paid amount for partial payment orders
  const displayAmount = isPartialPaymentOrder ? paidAmount : totalAmount;
  
  // Check if fully paid (no due amount but has payment info)
  const isFullyPaid = isPartialPaymentOrder && dueAmount === 0;

  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Order Number - First div - min-h-[28px] for text-xl */}
        <div className="text-xl leading-tight min-h-[28px] hover:text-ai-blue transition-colors">
          {order.orderNumber}
        </div>
        
        {/* Amount + Due/Fully Paid - Second div - min-h-[26px] for text-lg */}
        <div className="min-h-[26px] flex items-center justify-between gap-2">
          <div className="text-lg leading-tight hover:text-ai-blue transition-colors">
            ${displayAmount.toLocaleString()}
          </div>
          {isPartialPaymentOrder && (
            <Popover>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button className={`text-xs transition-colors cursor-pointer whitespace-nowrap ${
                  isFullyPaid 
                    ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300'
                    : 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300'
                }`}>
                  {isFullyPaid ? `Fully Paid: $${totalAmount.toLocaleString()}` : `Due: $${dueAmount.toLocaleString()}`}
                </button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-4" 
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-3">
                  <div className="pb-2 border-b border-border/50">
                    <h4 className="text-sm text-muted-foreground">Payment Details</h4>
                  </div>
                  
                  {/* Summary */}
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Amount:</span>
                      <span className="text-sm">${totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Paid:</span>
                      <span className="text-sm text-green-600 dark:text-green-400">
                        ${paidAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Due:</span>
                      <span className="text-sm text-orange-600 dark:text-orange-400">
                        ${dueAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Breakdown if available */}
                  {order.paymentBreakdown && order.paymentBreakdown.length > 0 && (
                    <>
                      <div className="pt-2 border-t border-border/50">
                        <h4 className="text-sm text-muted-foreground mb-2">Order Breakdown</h4>
                      </div>
                      <div className="flex flex-col gap-2 max-h-48 overflow-y-auto">
                        {order.paymentBreakdown.map((item, idx) => (
                          <div key={idx} className="flex flex-col gap-1 pb-2 border-b border-border/30 last:border-0">
                            <div className="text-sm">{item.orderNumber}</div>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">Amount: ${item.amount.toLocaleString()}</span>
                              <span className="text-green-600 dark:text-green-400">
                                Paid: ${item.paidAmount.toLocaleString()}
                              </span>
                              <span className="text-orange-600 dark:text-orange-400">
                                Due: ${item.dueAmount.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        
        {/* Sale Rep Converted - Third div - h-8 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <InfoBadge variant="default" size="md" className="w-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <span className="truncate">{order.saleRepConverted}</span>
            </InfoBadge>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {saleReps.map((rep) => (
              <DropdownMenuItem key={rep}>
                {rep}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </TableCell>
  );
}
