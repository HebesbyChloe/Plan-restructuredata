import React from "react";
import { AlertTriangle, FileText, ShoppingCart, ChevronDown } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import type { ShipmentData } from "../types";

interface OrderAlertsSectionProps {
  shipment: ShipmentData;
  itemsExpanded: boolean;
  onToggleItems: (e: React.MouseEvent) => void;
}

export function OrderAlertsSection({ shipment, itemsExpanded, onToggleItems }: OrderAlertsSectionProps) {
  const hasAlerts = shipment.status === 'exception' || shipment.alerts || shipment.notes || shipment.deliveryInstructions;

  return (
    <>
      <div className="border-t border-border" />
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {hasAlerts && (
            <TooltipProvider>
          {/* Exception */}
          {shipment.status === 'exception' && shipment.exceptionReason && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center justify-center cursor-help">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1">
                  <div className="font-medium">Exception</div>
                  <div className="text-xs opacity-90">{shipment.exceptionReason}</div>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Alerts */}
          {shipment.alerts && Object.keys(shipment.alerts).length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-center cursor-help">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1 text-xs">
                  {shipment.alerts.customerNote && <div>• Customer note</div>}
                  {shipment.alerts.addressMissing && <div>• Address incomplete</div>}
                  {shipment.alerts.imageMissing && <div>• Image missing</div>}
                  {shipment.alerts.serviceRequest && <div>• Service requested</div>}
                  {shipment.alerts.linkedOrders && <div>• Linked orders</div>}
                  {shipment.alerts.late && <div>• {shipment.alerts.late}d late</div>}
                  {shipment.alerts.refundRequest && <div>• Refund requested</div>}
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {/* Notes */}
          {(shipment.notes || shipment.deliveryInstructions) && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 flex items-center justify-center cursor-help">
                  <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <div className="space-y-1 text-xs">
                  {shipment.deliveryInstructions && <div>{shipment.deliveryInstructions}</div>}
                  {shipment.notes && <div className="opacity-90">{shipment.notes}</div>}
                </div>
              </TooltipContent>
            </Tooltip>
          )}
            </TooltipProvider>
          )}
        </div>
        
        {/* Item Count - Aligned Right */}
        <button
          onClick={onToggleItems}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
        >
          <span>{shipment.items?.length || 0} items</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${itemsExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </>
  );
}
