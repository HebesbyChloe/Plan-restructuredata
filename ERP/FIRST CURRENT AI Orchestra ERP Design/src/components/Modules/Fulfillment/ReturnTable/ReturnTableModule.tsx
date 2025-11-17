import { useState } from "react";
import { Badge } from "../../../ui/badge";
import { ChevronDown, ExternalLink } from "lucide-react";
import { ReturnShipmentData } from "../../../../sampledata/returnShipmentsEnhanced";
import { 
  RETURN_STATUS_CONFIG, 
  RETURN_TYPE_CONFIG, 
  RETURN_SHIPPING_STATUS_CONFIG 
} from "./utils/constants";

// Types
interface ReturnTableModuleProps {
  returns: ReturnShipmentData[];
  onReturnClick?: (returnShipment: ReturnShipmentData) => void;
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { RETURN_WARRANTY_STATUS } from "../../../../sampledata/returnWarrantyExtraData";

// Get all return warranty statuses
const ALL_RETURN_STATUSES = Object.values(RETURN_WARRANTY_STATUS);

export function ReturnTableModule({ returns, onReturnClick }: ReturnTableModuleProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleTrackingClick = (trackingNumber: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Navigate to tracking page - placeholder for now
    console.log("Navigate to tracking page for:", trackingNumber);
  };

  const handleStatusChange = (returnId: string, newStatus: string) => {
    // Update status - placeholder for now
    console.log("Change status for return:", returnId, "to:", newStatus);
    // TODO: Implement actual status update logic
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#E5E5E5] dark:border-border">
            <th className="text-left p-4 text-xs text-muted-foreground whitespace-nowrap">RMA#</th>
            <th className="text-left p-4 text-xs text-muted-foreground whitespace-nowrap">Order</th>
            <th className="text-left p-4 text-xs text-muted-foreground whitespace-nowrap">Request</th>
            <th className="text-left p-4 text-xs text-muted-foreground whitespace-nowrap">Tracking</th>
            <th className="text-left p-4 text-xs text-muted-foreground whitespace-nowrap">Refund Amount</th>
            <th className="text-left p-4 text-xs text-muted-foreground whitespace-nowrap">Customer</th>
          </tr>
        </thead>
        <tbody>
          {returns.length === 0 ? (
            <tr>
              <td colSpan={6} className="p-12 text-center text-muted-foreground">
                No returns found
              </td>
            </tr>
          ) : (
            returns.map((returnShipment) => {
              const statusConfig = RETURN_STATUS_CONFIG[returnShipment.returnStatus];
              const typeConfig = RETURN_TYPE_CONFIG[returnShipment.returnType];
              const StatusIcon = statusConfig.icon;
              const isExpanded = expandedRows.has(returnShipment.id);
              const itemsCount = returnShipment.returnItems.length;

              // Get shipping status config if tracking exists
              const shippingStatusConfig = returnShipment.returnShippingStatus
                ? RETURN_SHIPPING_STATUS_CONFIG[returnShipment.returnShippingStatus]
                : null;
              const ShippingStatusIcon = shippingStatusConfig?.icon;

              // Convert RET-2025-001 to RMA-2025-001
              const rmaNumber = returnShipment.returnShipmentNumber.replace('RET-', 'RMA-');

              return (
                <>
                  <tr
                    key={returnShipment.id}
                    className="border-b border-[#E5E5E5] dark:border-border hover:bg-[#F8F8F8] dark:hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onReturnClick?.(returnShipment)}
                  >
                    {/* RMA Number with Date and Status */}
                    <td className="p-4 w-[220px]">
                      <div className="flex items-start gap-2">
                        <button
                          onClick={(e) => toggleRowExpansion(returnShipment.id, e)}
                          className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 flex-shrink-0"
                        >
                          <ChevronDown 
                            className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                        <div className="flex flex-col h-full justify-between min-h-[80px] flex-1 min-w-0">
                          <div className="space-y-0.5">
                            <div className="text-foreground whitespace-nowrap">{rmaNumber}</div>
                            <div className="text-xs text-muted-foreground whitespace-nowrap">{returnShipment.requestDate}</div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                              <button className="w-full mt-auto">
                                <Badge variant="secondary" className={`${statusConfig.color} text-xs w-full justify-start hover:opacity-80 transition-opacity cursor-pointer`}>
                                  <StatusIcon className="w-3 h-3 mr-1 flex-shrink-0" />
                                  <span className="truncate">{statusConfig.label}</span>
                                </Badge>
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" onClick={(e) => e.stopPropagation()}>
                              {ALL_RETURN_STATUSES.map((status) => (
                                <DropdownMenuItem 
                                  key={status}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChange(returnShipment.id, status);
                                  }}
                                >
                                  {status}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </td>

                    {/* Order: Order Number (top), Date, Sales Rep (bottom) */}
                    <td className="p-4 w-[180px]">
                      <div className="flex flex-col h-full justify-between min-h-[80px]">
                        <div className="space-y-0.5">
                          <div className="whitespace-nowrap">{returnShipment.orderNumber}</div>
                          {returnShipment.approvalDate && (
                            <div className="text-xs text-muted-foreground whitespace-nowrap">{returnShipment.approvalDate}</div>
                          )}
                        </div>
                        {returnShipment.salesRepName && (
                          <div className="text-xs text-muted-foreground mt-auto whitespace-nowrap">By: {returnShipment.salesRepName}</div>
                        )}
                      </div>
                    </td>

                    {/* Request: Reason (top), Type Badge (bottom) */}
                    <td className="p-4 min-w-[200px]">
                      <div className="flex flex-col h-full justify-between min-h-[80px]">
                        <div className="text-sm text-muted-foreground">
                          {returnShipment.returnReason}
                        </div>
                        <Badge variant="secondary" className={`${typeConfig.color} w-fit mt-auto`}>
                          {typeConfig.label}
                        </Badge>
                      </div>
                    </td>

                    {/* Tracking - Status and Date */}
                    <td className="p-4 min-w-[220px]">
                      {returnShipment.returnTrackingNumber ? (
                        <div className="flex flex-col h-full justify-between min-h-[80px]">
                          <div className="space-y-1">
                            {/* Tracking Number */}
                            <button
                              onClick={(e) => handleTrackingClick(returnShipment.returnTrackingNumber!, e)}
                              className="flex items-center gap-1.5 text-foreground hover:text-foreground/80 transition-colors group"
                            >
                              <span className="text-sm whitespace-nowrap">{returnShipment.returnTrackingNumber}</span>
                              <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                            </button>
                            
                            {/* Status with Icon and Date */}
                            {shippingStatusConfig && returnShipment.trackingStatusDate && (
                              <div className="text-xs text-muted-foreground">
                                {shippingStatusConfig.label} • {returnShipment.trackingStatusDate}
                              </div>
                            )}
                          </div>
                          
                          {/* Created By - Aligned Bottom */}
                          {returnShipment.trackingCreatedBy && (
                            <div className="text-xs text-muted-foreground mt-auto">
                              By: {returnShipment.trackingCreatedBy}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">No tracking</div>
                      )}
                    </td>

                    {/* Refund Amount (align top) */}
                    <td className="p-4 align-top w-[140px]">
                      {returnShipment.refundAmount !== undefined ? (
                        <div className="whitespace-nowrap">${Math.floor(returnShipment.refundAmount).toLocaleString()}</div>
                      ) : (
                        <div className="text-xs text-muted-foreground">N/A</div>
                      )}
                    </td>

                    {/* Customer (align top) */}
                    <td className="p-4 align-top min-w-[200px]">
                      <div>
                        <div>{returnShipment.customerName}</div>
                        <div className="text-xs text-muted-foreground truncate">{returnShipment.customerEmail}</div>
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Line Items Row */}
                  {isExpanded && (
                    <tr className="border-b border-[#E5E5E5] dark:border-border bg-[#F8F8F8] dark:bg-muted/30">
                      <td colSpan={6} className="p-4">
                        <div className="ml-10 space-y-2">
                          <div className="text-xs text-muted-foreground mb-2">
                            {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'} Returned
                          </div>
                          {returnShipment.returnItems.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 p-3 bg-white dark:bg-card rounded-lg border border-[#E5E5E5] dark:border-border"
                            >
                              {/* Product Image */}
                              {item.image && (
                                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              
                              {/* Product Info */}
                              <div className="flex-1 min-w-0">
                                <div className="text-sm">{item.name}</div>
                                <div className="text-xs text-muted-foreground">SKU: {item.sku}</div>
                              </div>

                              {/* Quantity */}
                              <div className="text-sm text-muted-foreground">
                                Qty: {item.returnQuantity}
                              </div>

                              {/* Price */}
                              <div className="text-sm">
                                ${item.price.toLocaleString()}
                              </div>

                              {/* Total */}
                              <div className="text-sm">
                                ${(item.price * item.returnQuantity).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
