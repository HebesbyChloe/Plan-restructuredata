import React from "react";
import { ChevronDown, Copy, Check, ExternalLink } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../ui/dropdown-menu";
import { OrderData } from "../../../../../types/modules/crm";
import { formatShippedDate } from "../utils/helpers";
import { toast } from "sonner";

// Shipping Status Icons - Maps to OrderData.orderStatus values
const SHIPPING_STATUS_ICONS: Record<string, string> = {
  "Processing": "⏳",
  "Partial Payment": "💰",
  "Completed": "✅",
  "Shipped": "📮",
  "In Transit": "🚚",
  "Out for Delivery": "🚛",
  "Shipping Delay": "⚠️",
  "Delivered": "✅",
  "Refunded": "↩️"
};

// Display text constants
const SHIPPING_DISPLAY_TEXT = {
  AWAITING_SHIPMENT: "Awaiting shipment",
  MULTIPLE_SHIPMENT: "Multiple Shipment",
  MULTIPLE_SHIPMENT_FOR: "Multiple Shipment for",
};

// Get icon based on order status
const getStatusIcon = (status: string): string => {
  return SHIPPING_STATUS_ICONS[status] || "📦";
};

interface CarrierTrackingSectionProps {
  order: OrderData;
  sameOrders: OrderData[];
  copiedTracking: string | null;
  onOpenTracking: (e: React.MouseEvent, order: OrderData) => void;
  onCopyTracking: (e: React.MouseEvent, order: OrderData) => void;
}

export function CarrierTrackingSection({
  order,
  sameOrders,
  copiedTracking,
  onOpenTracking,
  onCopyTracking,
}: CarrierTrackingSectionProps) {
  const tracking = order.tracking && order.tracking.length > 0 ? order.tracking[0] : null;
  const isShipped = tracking && tracking.trackingNumber && (
    order.orderStatus === "Shipped" || 
    order.orderStatus === "In Transit" || 
    order.orderStatus === "Out for Delivery" || 
    order.orderStatus === "Delivered" || 
    order.orderStatus === "Shipping Delay"
  );

  // Multiple shipment for same order
  if (order.tracking && order.tracking.length > 1) {
    return (
      <div className="flex items-center justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 transition-colors group">
              <span>{SHIPPING_DISPLAY_TEXT.MULTIPLE_SHIPMENT}</span>
              {order.shippingMethod && (
                <span className="text-xs capitalize">({order.shippingMethod})</span>
              )}
              <span>{getStatusIcon(order.tracking[order.tracking.length - 1].status || order.orderStatus)}</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <div className="px-2 py-1.5 text-xs text-muted-foreground border-b border-border">
              {SHIPPING_DISPLAY_TEXT.MULTIPLE_SHIPMENT_FOR} {order.orderNumber}
              {order.shippingMethod && <span className="capitalize"> - {order.shippingMethod}</span>}
            </div>
            {order.tracking.map((t, idx) => (
              <DropdownMenuItem 
                key={idx}
                onClick={(e) => {
                  onOpenTracking(e as any, order);
                }}
                className="flex items-center gap-2 py-2"
              >
                <span className="text-base">{getStatusIcon(t.status || order.orderStatus)}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{t.carrier}</span>
                    {t.dateShipped && <span className="text-xs text-muted-foreground">• {t.dateShipped}</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{t.trackingNumber}</div>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground/50" />
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }
  
  // Single tracking - Shipped with tracking
  if (isShipped && tracking) {
    return (
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <button 
            onClick={(e) => onOpenTracking(e, order)}
            className="flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 transition-colors group"
          >
            <span className="text-base">{getStatusIcon(tracking.status || order.orderStatus)}</span>
            <span>{tracking.carrier}</span>
            {order.shippingMethod && (
              <span className="text-xs capitalize">({order.shippingMethod})</span>
            )}
            {tracking.dateShipped && (
              <span className="text-xs">• {tracking.dateShipped}</span>
            )}
            <ExternalLink className="w-3 h-3 text-muted-foreground/50 group-hover:text-[#4B6BFB]" />
          </button>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={(e) => onCopyTracking(e, order)}
                  className="p-1 hover:bg-accent rounded transition-colors"
                >
                  {copiedTracking === order.id ? (
                    <Check className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy tracking link</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    );
  }
  
  // Not shipped yet - Show shipping method if available
  const shippingMethodDisplay = order.shippingMethod ? (
    <span className="capitalize">{order.shippingMethod}</span>
  ) : null;
  
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <span>{SHIPPING_DISPLAY_TEXT.AWAITING_SHIPMENT}</span>
        {shippingMethodDisplay && (
          <>
            <span>•</span>
            {shippingMethodDisplay}
          </>
        )}
      </div>
    </div>
  );
}
