import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { TableCell } from "../../../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Copy, Package } from "lucide-react";
import { PreOrderColumnProps } from "../../../../types/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

// Helper functions for tracking
const getTrackingStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400";
    case "Processing":
      return "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400";
    case "In Transit":
      return "bg-sky-50 dark:bg-sky-950 text-sky-700 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-400";
    case "Label Created":
      return "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-400";
    case "Shipping Delay":
      return "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400";
    default:
      return "bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-400";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400";
    case "Delivered":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Processing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "Partial Payment":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Shipped":
      return "bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400";
    case "In Transit":
      return "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-400";
    case "Out for Delivery":
      return "bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400";
    case "Shipping Delay":
      return "bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400";
    case "Refunded":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard:', text);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};

const getTrackingUrl = (carrier: string, trackingNumber: string): string => {
  const carrierLower = carrier.toLowerCase();
  
  if (carrierLower.includes('ups')) {
    return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  } else if (carrierLower.includes('fedex')) {
    return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  } else if (carrierLower.includes('usps')) {
    return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  } else if (carrierLower.includes('dhl')) {
    return `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`;
  } else {
    return `https://www.google.com/search?q=track+${carrier}+${trackingNumber}`;
  }
};

export function CreatedColumnForPreOrderTable({ order, onOrderInfoClick }: PreOrderColumnProps) {
  const orderStatus = order.orderStatus || order.status || "Processing";
  
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Date Only - First div - min-h-[28px] for text-xl */}
        <div className="min-h-[28px] flex items-center">
          <span className="text-xl leading-tight hover:text-ai-blue transition-colors">
            {order.createdDate}
          </span>
        </div>
        
        {/* Order Status Badge - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          <div className={`h-7 px-2 flex items-center justify-center w-1/2 rounded text-xs ${getStatusColor(orderStatus)}`}>
            {orderStatus}
          </div>
        </div>
        
        {/* Tracking Information - Third div - h-8 */}
        <div className="h-8 flex items-center w-full">
          {order.fulfillmentType === "Store Pickup" ? (
            // Store Pickup
            <InfoBadge variant="default" size="md" className="w-full">
              Store Pick up
            </InfoBadge>
          ) : order.fulfillmentType === "Manual Mark Shipped" ? (
            // Manual Mark Shipped
            <InfoBadge variant="default" size="md" className="w-full">
              Manual Mark Shipped
            </InfoBadge>
          ) : !order.tracking || order.tracking.length === 0 ? (
            // No tracking - empty
            null
          ) : order.tracking.length === 1 ? (
            // Single tracking - carrier - date and copy icon
            <InfoBadge variant="default" size="md" className="w-full flex items-center gap-1.5 flex-wrap">
              <a
                href={getTrackingUrl(order.tracking[0].carrier, order.tracking[0].trackingNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-ai-blue hover:underline cursor-pointer flex items-center gap-1.5"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{order.tracking[0].carrier}</span>
                <span>-</span>
                <span>{order.tracking[0].dateShipped}</span>
              </a>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 p-0 ml-auto hover:bg-muted/50"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(order.tracking[0].trackingNumber);
                }}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </InfoBadge>
          ) : (
            // Multiple tracking - approval status style with popover
            <Popover>
              <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                <InfoBadge variant="default" size="md" icon={<Package className="w-3 h-3" />} className="w-full">
                  Multiple Shipment ({order.tracking.length})
                </InfoBadge>
              </PopoverTrigger>
              <PopoverContent 
                className="w-80 p-3" 
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex flex-col gap-3">
                  {order.tracking.map((track, idx) => (
                    <div key={idx} className="flex flex-col gap-2 pb-3 border-b border-border/50 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <a
                          href={getTrackingUrl(track.carrier, track.trackingNumber)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-muted-foreground hover:text-ai-blue hover:underline cursor-pointer leading-tight"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {track.carrier} - {track.dateShipped}
                        </a>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-auto flex-shrink-0 hover:bg-muted/50"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(track.trackingNumber);
                          }}
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className={`inline-flex items-center justify-center px-2 py-1 rounded text-xs ${getTrackingStatusColor(track.status)}`}>
                        {track.status}
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </TableCell>
  );
}
