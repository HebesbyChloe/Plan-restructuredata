import { Warehouse, Weight, Box } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { WAREHOUSE_CONFIG } from "../utils/constants";
import type { ShipmentData } from "../types";

interface WarehouseColumnProps {
  shipment: ShipmentData;
}

export function WarehouseColumn({ shipment }: WarehouseColumnProps) {
  const warehouseConfig = WAREHOUSE_CONFIG[shipment.warehouse];

  return (
    <div className="min-w-[140px] space-y-2">
      <div className="flex items-center gap-2">
        <Warehouse className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{warehouseConfig.icon} {warehouseConfig.label}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Weight className="w-3 h-3" />
        <span>{shipment.packageWeight} kg</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Box className="w-3 h-3" />
        <span>
          {shipment.packageDimensions.length}×{shipment.packageDimensions.width}×{shipment.packageDimensions.height} cm
        </span>
      </div>
    </div>
  );
}
