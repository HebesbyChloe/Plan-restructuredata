import React, { useState, useRef, useEffect } from "react";
import { Plus, AlertTriangle, FileText, Clock } from "lucide-react";
import { Badge } from "../../../../ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../../../ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import { OrderData } from "../../../../../types/modules/crm";
import { toast } from "sonner";
import { calculateOrderAge } from "../utils/helpers";

interface OrderTagsSectionProps {
  order: OrderData;
}

const TAG_COLORS: Record<string, string> = {
  fragile: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  rush: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  gift: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  oversized: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  international: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  heavy: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  "cold-chain": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  hazmat: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  signature: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
  insurance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

const TAG_COLOR_DOTS: Record<string, string> = {
  fragile: "bg-red-500",
  rush: "bg-orange-500",
  gift: "bg-pink-500",
  oversized: "bg-purple-500",
  international: "bg-blue-500",
  heavy: "bg-amber-500",
  "cold-chain": "bg-cyan-500",
  hazmat: "bg-red-600",
  signature: "bg-indigo-500",
  insurance: "bg-emerald-500",
};

export function OrderTagsSection({ order }: OrderTagsSectionProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Check if we need to collapse tags based on container width
    const checkWidth = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Collapse if container is less than 250px (approximate threshold)
        setIsCollapsed(containerWidth < 250);
      }
    };
    
    checkWidth();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', checkWidth);
      return () => window.removeEventListener('resize', checkWidth);
    }
  }, []);
  
  const hasAlerts = order.alerts && Object.keys(order.alerts).some(key => order.alerts[key as keyof typeof order.alerts]);
  
  // Get all tags from order
  const allTags = (order.tags || []).map(tag => ({
    tag,
    label: tag.charAt(0).toUpperCase() + tag.slice(1).replace(/-/g, ' ')
  }));

  // Calculate order age
  const orderAge = calculateOrderAge(order.createdDate);
  
  // Determine age badge color
  const getAgeBadgeColor = (days: number) => {
    if (days <= 1) return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";
    if (days <= 3) return "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
    if (days <= 7) return "bg-amber-100 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
    return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
  };

  return (
    <>
      <div className="border-t border-border" />
      <div ref={containerRef} className="flex items-center justify-between gap-2">
        {/* Tags Section - Left Side */}
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          {isCollapsed ? (
            // Collapsed view - just color dots
            <TooltipProvider>
              <div className="flex items-center gap-1">
                {allTags.map((item, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className={`w-2 h-2 rounded-full ${TAG_COLOR_DOTS[item.tag] || 'bg-gray-500'}`} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-5 h-5 rounded-full border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50 flex items-center justify-center transition-colors ml-1">
                      <Plus className="w-3 h-3 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Fragile' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        <span>Fragile</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Rush Order' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Rush Order</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Gift' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-pink-500" />
                        <span>Gift</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Oversized' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <span>Oversized</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Heavy Package' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span>Heavy Package</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Cold Chain' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <span>Cold Chain</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Tag 'Hazmat' added")}>
                      <div className="flex items-center gap-2 w-full">
                        <div className="w-2 h-2 rounded-full bg-red-600" />
                        <span>Hazmat</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </TooltipProvider>
          ) : (
            // Full view - badges with text
            <>
              {/* Display all tags as badges */}
              {allTags.map((item, index) => (
                <Badge 
                  key={index}
                  className={`h-5 text-xs ${TAG_COLORS[item.tag] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}
                >
                  {item.label}
                </Badge>
              ))}
              {/* Orders don't have priority field, but we can derive from orderStatus */}
              {order.orderStatus === 'Shipping Delay' && (
                <Badge variant="destructive" className="h-5 text-xs">Urgent</Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-5 h-5 rounded-full border border-dashed border-muted-foreground/30 hover:border-muted-foreground/50 hover:bg-muted/50 flex items-center justify-center transition-colors">
                    <Plus className="w-3 h-3 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Fragile' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span>Fragile</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Rush Order' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>Rush Order</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Gift' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-pink-500" />
                      <span>Gift</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Oversized' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Oversized</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Heavy Package' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Heavy Package</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Cold Chain' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                      <span>Cold Chain</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast.success("Tag 'Hazmat' added")}>
                    <div className="flex items-center gap-2 w-full">
                      <div className="w-2 h-2 rounded-full bg-red-600" />
                      <span>Hazmat</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        
        {/* Alerts & Age Section - Right Side */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <TooltipProvider>
            {/* Order Age Badge */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge 
                  variant="outline" 
                  className={`h-6 px-2 text-xs flex items-center gap-1 ${getAgeBadgeColor(orderAge)}`}
                >
                  <Clock className="w-3 h-3" />
                  {orderAge}d
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top">
                <div className="space-y-1">
                  <div className="font-medium">Order Age</div>
                  <div className="text-xs opacity-90">{orderAge} day{orderAge !== 1 ? 's' : ''} since creation</div>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {hasAlerts && (
            <TooltipProvider>
              {/* Exception */}
              {order.orderStatus === 'Shipping Delay' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center justify-center cursor-help">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1">
                      <div className="font-medium">Shipping Delay</div>
                      <div className="text-xs opacity-90">Order experiencing shipping delays</div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}

              {/* Alerts */}
              {order.alerts && Object.keys(order.alerts).length > 0 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 flex items-center justify-center cursor-help">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <div className="space-y-1 text-xs">
                      {order.alerts.customerNote && <div>• Customer note</div>}
                      {order.alerts.addressMissing && <div>• Address incomplete</div>}
                      {order.alerts.imageMissing && <div>• Image missing</div>}
                      {order.alerts.serviceRequest && <div>• Service requested</div>}
                      {order.alerts.linkedOrders && <div>• Linked orders</div>}
                      {order.alerts.late && <div>• {order.alerts.late}d late</div>}
                      {order.alerts.refundRequest && <div>• Refund requested</div>}
                    </div>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>
          )}
        </div>
      </div>
    </>
  );
}
