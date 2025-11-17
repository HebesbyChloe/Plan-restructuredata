import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { TableCell } from "../../../ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../ui/popover";
import { Copy, Package } from "lucide-react";
import { OrderColumnProps } from "../../../../types/modules/crm";
import { getStatusColor, getTrackingStatusColor, copyToClipboard, getTrackingUrl } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

export function CreatedColumnForOrderTable({ order, onOrderInfoClick }: OrderColumnProps) {
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
        <div className="text-xl leading-tight min-h-[28px] hover:text-ai-blue transition-colors">
          {order.createdDate}
        </div>
        
        {/* Order Status - Second div - min-h-[26px] */}
        <div className="min-h-[26px] flex items-center">
          <div className={`h-7 px-2 flex items-center justify-center w-1/2 rounded text-xs ${getStatusColor(order.orderStatus)}`}>
            {order.orderStatus}
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
          ) : order.tracking.length === 0 ? (
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
