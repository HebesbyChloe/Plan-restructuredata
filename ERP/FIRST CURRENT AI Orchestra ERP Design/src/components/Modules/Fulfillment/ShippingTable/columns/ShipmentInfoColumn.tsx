import { Package, Tag, ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import type { ShipmentData } from "../types";

interface ShipmentInfoColumnProps {
  shipment: ShipmentData;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function ShipmentInfoColumn({ shipment, isExpanded, onToggleExpand }: ShipmentInfoColumnProps) {
  return (
    <div className="flex items-start gap-3 min-w-[200px]">
      {onToggleExpand && shipment.items && shipment.items.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-6 h-6 p-0 flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onToggleExpand();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </Button>
      )}
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
        <Package className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm truncate">{shipment.orderNumber}</span>
          {shipment.batchId && (
            <Badge variant="outline" className="text-xs px-1.5 py-0">
              <Tag className="w-3 h-3 mr-1" />
              {shipment.batchId}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {shipment.trackingNumber || "No tracking yet"}
        </p>
        {shipment.items.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {shipment.items.length} {shipment.items.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>
    </div>
  );
}
