/**
 * VendorStatsCardsModule
 * 
 * Displays quick stats for vendors and suppliers:
 * - Total Vendors
 * - Active Suppliers
 * - Total Spent (YTD)
 * - Average Rating
 */

import { Card } from "../../../ui/card";
import { Building, CheckCircle2, DollarSign, Star } from "lucide-react";

// Types
interface VendorStatsCardsProps {
  totalVendors: number;
  activeVendors: number;
  totalSpent: number;
  averageRating: number;
}

export function VendorStatsCardsModule({
  totalVendors,
  activeVendors,
  totalSpent,
  averageRating,
}: VendorStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Vendors */}
      <Card className="p-4 glass-card border-[#DAB785]/20 hover:border-[#DAB785]/40 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Vendors</p>
            <p className="text-2xl mb-0">{totalVendors}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
            <Building className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Active Suppliers */}
      <Card className="p-4 glass-card border-green-200/50 dark:border-green-800/30 hover:border-green-300 dark:hover:border-green-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Active Suppliers</p>
            <p className="text-2xl text-green-600 dark:text-green-400 mb-0">
              {activeVendors}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </Card>

      {/* Total Spent (YTD) */}
      <Card className="p-4 glass-card border-[#DAB785]/20 hover:border-[#DAB785]/40 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Total Spent (YTD)</p>
            <p className="text-2xl text-[#DAB785] mb-0">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-white" />
          </div>
        </div>
      </Card>

      {/* Average Rating */}
      <Card className="p-4 glass-card border-yellow-200/50 dark:border-yellow-800/30 hover:border-yellow-300 dark:hover:border-yellow-700 transition-all">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Avg. Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl mb-0">{averageRating.toFixed(1)}</p>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </Card>
    </div>
  );
}
