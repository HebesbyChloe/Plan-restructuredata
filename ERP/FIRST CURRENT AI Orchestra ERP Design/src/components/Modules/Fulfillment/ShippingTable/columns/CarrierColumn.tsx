import { Truck, Zap, Package } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { CARRIER_CONFIG, SHIPPING_METHOD_CONFIG } from "../utils/constants";
import type { ShipmentData } from "../types";

interface CarrierColumnProps {
  shipment: ShipmentData;
}

export function CarrierColumn({ shipment }: CarrierColumnProps) {
  const carrierConfig = CARRIER_CONFIG[shipment.carrier];
  const methodConfig = SHIPPING_METHOD_CONFIG[shipment.shippingMethod];

  return (
    <div className="min-w-[140px] space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-lg">{carrierConfig.icon}</span>
        <span className="text-sm">{carrierConfig.label}</span>
      </div>
      
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {shipment.shippingMethod === "overnight" ? (
          <Zap className="w-3 h-3" />
        ) : shipment.shippingMethod === "express" ? (
          <Truck className="w-3 h-3" />
        ) : (
          <Package className="w-3 h-3" />
        )}
        <span>{methodConfig.label}</span>
      </div>

      {shipment.estimatedDelivery && (
        <p className="text-xs text-muted-foreground">
          ETA: {new Date(shipment.estimatedDelivery).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
