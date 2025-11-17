import React from "react";
import { AlertCircle } from "lucide-react";
import { OrderData } from "../../../../../types/modules/crm";
import { Badge } from "../../../../ui/badge";

interface ShippingInfoSectionProps {
  order: OrderData;
  onCustomerClick?: (e: React.MouseEvent, customerName: string) => void;
}

export function ShippingInfoSection({ order, onCustomerClick }: ShippingInfoSectionProps) {
  const hasAddress = order.shippingAddress && order.shippingAddress.city;
  
  return (
    <div className="space-y-2 text-sm">
      {/* Customer Name */}
      <div className="flex items-center gap-2">
        <div 
          className="truncate cursor-pointer hover:text-[#4B6BFB] transition-colors"
          onClick={(e) => onCustomerClick?.(e, order.customerName)}
        >
          {order.customerName}
        </div>
        {order.customerRank && (
          <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
            {order.customerRank}
          </Badge>
        )}
      </div>
      
      {/* Shipping Address - City, State, Country only */}
      {hasAddress ? (
        <div className="text-xs text-muted-foreground truncate">
          {order.shippingAddress.city}, {order.shippingAddress.state}, {order.shippingAddress.country}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-3 h-3" />
          <span>Address missing</span>
        </div>
      )}
    </div>
  );
}
