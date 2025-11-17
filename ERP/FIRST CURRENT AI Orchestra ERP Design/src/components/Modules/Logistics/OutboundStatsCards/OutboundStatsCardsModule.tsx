/**
 * OutboundStatsCardsModule
 * 
 * Displays quick stats for outbound shipments:
 * - Total Shipments
 * - Pending
 * - Shipped (In Transit)
 * - Delivered
 */

import { Card } from "../../../ui/card";
import { Package, Clock, Truck, CheckCircle2 } from "lucide-react";

// Types
interface OutboundStatsCardsProps {
  totalShipments: number;
  pending: number;
  shipped: number;
  delivered: number;
}

export function OutboundStatsCardsModule({
  totalShipments,
  pending,
  shipped,
  delivered,
}: OutboundStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Shipments */}
      <Card className="p-4 glass-card border-[#DAB785]/20 hover:border-[#DAB785]/40 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Shipments</p>
            <p className="text-2xl mb-0">{totalShipments}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Pending */}
      <Card className="p-4 glass-card border-gray-200/50 dark:border-gray-800/30 hover:border-gray-300 dark:hover:border-gray-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Pending</p>
            <p className="text-2xl mb-0">{pending}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </Card>

      {/* Shipped (In Transit) */}
      <Card className="p-4 glass-card border-blue-200/50 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">In Transit</p>
            <p className="text-2xl mb-0">{shipped}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      {/* Delivered */}
      <Card className="p-4 glass-card border-green-200/50 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Delivered</p>
            <p className="text-2xl mb-0">{delivered}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>
    </div>
  );
}
