/**
 * InboundStatsCardsModule
 * 
 * Displays quick stats for inbound shipments:
 * - Total Shipments
 * - Incoming
 * - Processing
 * - Complete
 */

import { Card } from "../../../ui/card";
import { Package, TrendingUp, Clock, CheckCircle2 } from "lucide-react";

// Types
interface InboundStatsCardsProps {
  totalShipments: number;
  incoming: number;
  processing: number;
  complete: number;
}

export function InboundStatsCardsModule({
  totalShipments,
  incoming,
  processing,
  complete,
}: InboundStatsCardsProps) {
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

      {/* Incoming */}
      <Card className="p-4 glass-card border-yellow-200/50 dark:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Incoming</p>
            <p className="text-2xl mb-0">{incoming}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </Card>

      {/* Processing */}
      <Card className="p-4 glass-card border-blue-200/50 dark:border-blue-800/30 hover:border-blue-300 dark:hover:border-blue-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Processing</p>
            <p className="text-2xl mb-0">{processing}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </Card>

      {/* Complete */}
      <Card className="p-4 glass-card border-green-200/50 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Complete</p>
            <p className="text-2xl mb-0">{complete}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>
    </div>
  );
}
