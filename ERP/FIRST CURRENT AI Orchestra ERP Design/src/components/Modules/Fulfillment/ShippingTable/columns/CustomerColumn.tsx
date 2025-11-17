import { User, MapPin, Phone, Mail } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../../../ui/tooltip";
import type { ShipmentData } from "../types";

interface CustomerColumnProps {
  shipment: ShipmentData;
}

export function CustomerColumn({ shipment }: CustomerColumnProps) {
  const addressSummary = `${shipment.shippingAddress.city}, ${shipment.shippingAddress.state}`;
  const fullAddress = `${shipment.shippingAddress.street}, ${shipment.shippingAddress.city}, ${shipment.shippingAddress.state} ${shipment.shippingAddress.zipCode}, ${shipment.shippingAddress.country}`;

  return (
    <div className="min-w-[220px]">
      <div className="flex items-center gap-2 mb-1">
        <User className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        <span className="text-sm truncate">{shipment.customerName}</span>
      </div>
      
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{addressSummary}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-xs">{fullAddress}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <div className="flex items-center gap-3 mt-1">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                <Phone className="w-3 h-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{shipment.customerPhone}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 text-xs text-muted-foreground cursor-help">
                <Mail className="w-3 h-3" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">{shipment.customerEmail}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
