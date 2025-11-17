import React from "react";
import { Package, MapPin, Image as ImageIcon } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { OrderData } from "../../../../../types/modules/crm";

interface LineItemsSectionProps {
  order: OrderData;
  onImageClick?: (imageUrl: string) => void;
}

export function LineItemsSection({ order, onImageClick }: LineItemsSectionProps) {
  const lineItems = order.lineItems || [];
  const totalItems = order.totalItems || 0;
  
  if (lineItems.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Package className="w-3.5 h-3.5" />
        <span>Items ({totalItems})</span>
      </div>
      
      <div className="space-y-2">
        {lineItems.map((item, idx) => (
          <div key={item.id || idx} className="flex items-start gap-2 pl-5">
            {/* Product Image */}
            {item.image ? (
              <div 
                className="w-10 h-10 rounded border border-border flex-shrink-0 overflow-hidden bg-accent cursor-pointer hover:ring-2 hover:ring-[#4B6BFB]/50 transition-all"
                onClick={() => onImageClick?.(item.image!)}
              >
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded border border-border flex-shrink-0 bg-accent flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
              </div>
            )}
            
            {/* Product Info */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="text-xs truncate">{item.name}</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>SKU: {item.sku}</span>
                <span>•</span>
                <span>Qty: {item.quantity}</span>
                {item.warehouseLocation && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{item.warehouseLocation}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
