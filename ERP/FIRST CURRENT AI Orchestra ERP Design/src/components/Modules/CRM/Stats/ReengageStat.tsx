import { Card } from "../../../ui/card";
import { motion } from "motion/react";
import svgPaths from "../../../../imports/svg-ujup985glp";

interface ReengageStatProps {
  totalBatches: number;
  totalCustomers: number;
  totalHistoricalValue: number;
  responseRateAvg: number;
  conversionRateAvg: number;
  totalReactivatedRevenue: number;
}

export function ReengageStat({
  totalBatches,
  totalCustomers,
  totalHistoricalValue,
  responseRateAvg,
  conversionRateAvg,
  totalReactivatedRevenue,
}: ReengageStatProps) {
  return (
    <div className="space-y-6">
      {/* First Row: 4 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Batches */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <g>
                <path d={svgPaths.p25397b80} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.p18e6a68} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.p2241fff0} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.p2c4f400} stroke="#155DFC" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              </g>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Total Batches</p>
            <p className="text-3xl mb-0">{totalBatches}</p>
          </div>
        </div>
      </Card>

      {/* Total Customers */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
              <g clipPath="url(#clip0_22_2694)">
                <path d={svgPaths.p14d24500} stroke="#7F22FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.p240d7000} stroke="#7F22FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                <path d={svgPaths.p25499600} stroke="#7F22FE" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
              </g>
              <defs>
                <clipPath id="clip0_22_2694">
                  <rect fill="white" height="20" width="20" />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Total Customers</p>
            <p className="text-3xl mb-0">{totalCustomers.toLocaleString()}</p>
          </div>
        </div>
      </Card>

      {/* Total Historical Value */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <g>
                <path d="M12 2V22" stroke="#9333EA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d={svgPaths.p2ba0dca0} stroke="#9333EA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Total Historical Value</p>
            <p className="text-3xl mb-0">${(totalHistoricalValue / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </Card>

      {/* Total Reactivated Revenue */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-ai-blue/30 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
              <g>
                <path d="M12 2V22" stroke="#27AE60" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                <path d={svgPaths.p2ba0dca0} stroke="#27AE60" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </g>
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-2">Total Reactivated Revenue</p>
            <p className="text-3xl mb-0">${(totalReactivatedRevenue / 1000).toFixed(0)}k</p>
          </div>
        </div>
      </Card>
    </div>

      {/* Second Row: 2 Cards with Progress Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Response Rate Avg */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <g>
                  <path d={svgPaths.p3ac0b600} stroke="#2F80ED" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.p3c797180} stroke="#2F80ED" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </g>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Response Rate Avg</p>
              <p className="text-3xl text-blue-600 dark:text-blue-400 mb-4">{responseRateAvg}%</p>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-blue-600 dark:bg-blue-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${responseRateAvg}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Conversion Rate */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20">
                <g clipPath="url(#clip0_22_2690)">
                  <path d={svgPaths.p14d24500} stroke="#F2C94C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                  <path d={svgPaths.p3e012060} stroke="#F2C94C" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
                </g>
                <defs>
                  <clipPath id="clip0_22_2690">
                    <rect fill="white" height="20" width="20" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Conversion Rate</p>
              <p className="text-3xl text-amber-600 dark:text-amber-400 mb-4">{conversionRateAvg}%</p>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-amber-600 dark:bg-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${conversionRateAvg}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
    </div>
  );
}
