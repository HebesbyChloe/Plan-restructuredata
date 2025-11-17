import { Button } from "../../../ui/button";
import { TableCell } from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  ChevronDown,
  ImageOff,
  MessageSquare,
  MapPin,
  Info,
  AlertCircle,
  Headphones,
  DollarSign,
  Clock,
  Send,
  Bell,
  Star,
  ShoppingBag,
  RotateCcw,
} from "lucide-react";
import { OrderColumnProps } from "../../../../types/modules/crm";
import { STATUS_ORDER_NEXT_ACTION } from "../../../../utils/modules/crm";
import { getFollowUpStatusColor, getStatusProcessColor, getStatusProcessIcon } from "../../../../utils/modules/crm";
import { InfoBadge } from "../../../ui/info-badge";

// Helper function to get icon for next action status
const getNextActionIcon = (status: string) => {
  if (status.toLowerCase().includes("processing")) return <Clock className="w-3.5 h-3.5" />;
  if (status.toLowerCase().includes("tracking")) return <Send className="w-3.5 h-3.5" />;
  if (status.toLowerCase().includes("updated")) return <Bell className="w-3.5 h-3.5" />;
  if (status.toLowerCase().includes("feedback")) return <Star className="w-3.5 h-3.5" />;
  if (status.toLowerCase().includes("cross sale")) return <ShoppingBag className="w-3.5 h-3.5" />;
  if (status.toLowerCase().includes("win back")) return <RotateCcw className="w-3.5 h-3.5" />;
  return null;
};

// Helper function to get variant for next action status
const getNextActionVariant = (status: string): "default" | "purple" | "blue" | "green" | "amber" | "red" | "indigo" | "teal" => {
  if (status.toLowerCase().includes("processing")) return "amber";
  if (status.toLowerCase().includes("tracking")) return "blue";
  if (status.toLowerCase().includes("updated")) return "indigo";
  if (status.toLowerCase().includes("feedback")) return "green";
  if (status.toLowerCase().includes("cross sale")) return "purple";
  if (status.toLowerCase().includes("win back")) return "red";
  return "default";
};

// Helper function to get text color for process status
const getProcessStatusTextColor = (group: string) => {
  switch (group) {
    case "Regular":
      return "text-slate-600 dark:text-slate-400";
    case "Pre Ordered":
      return "text-indigo-600 dark:text-indigo-400";
    case "Service Order":
      return "text-cyan-600 dark:text-cyan-400";
    case "Customize":
      return "text-violet-600 dark:text-violet-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

export function FollowUpColumnForOrderTable({ order, onOrderInfoClick }: OrderColumnProps) {
  return (
    <TableCell 
      className="px-5 py-6 align-top cursor-pointer hover:bg-muted/10 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onOrderInfoClick?.(order);
      }}
    >
      <div className="flex flex-col gap-2.5">
        {/* Alert Icons - First div - min-h-[28px] */}
        <div className="min-h-[28px] flex items-start">
          {(order.alerts.imageMissing || order.alerts.customerNote || order.alerts.addressMissing || order.alerts.linkedOrders || order.alerts.late || order.alerts.serviceRequest || order.alerts.refundRequest) ? (
            <div className="flex items-center gap-2">
              {order.alerts.imageMissing && (
                <div className="group relative">
                  <ImageOff className="w-4 h-4 text-red-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Image Missing
                  </div>
                </div>
              )}
              {order.alerts.customerNote && (
                <div className="group relative">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Customer Note
                  </div>
                </div>
              )}
              {order.alerts.addressMissing && (
                <div className="group relative">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Address Missing
                  </div>
                </div>
              )}
              {order.alerts.linkedOrders && (
                <div className="group relative">
                  <Info className="w-4 h-4 text-purple-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Linked Orders
                  </div>
                </div>
              )}
              {order.alerts.late && (
                <div className="group relative">
                  <AlertCircle className="w-4 h-4 text-orange-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Late ({order.alerts.late} days)
                  </div>
                </div>
              )}
              {order.alerts.serviceRequest && (
                <div className="group relative">
                  <Headphones className="w-4 h-4 text-cyan-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Service Request
                  </div>
                </div>
              )}
              {order.alerts.refundRequest && (
                <div className="group relative">
                  <DollarSign className="w-4 h-4 text-pink-500" />
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-10">
                    Refund Request
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Process Status - Second div - min-h-[26px] - Text Style */}
        <div className="min-h-[26px] flex items-center">
          {order.statusProcess && (
            <div className={`flex items-center gap-1.5 text-xs ${getProcessStatusTextColor(order.statusProcess.group)}`}>
              {getStatusProcessIcon(order.statusProcess.group)}
              <span>{order.statusProcess.currentStatus}</span>
            </div>
          )}
        </div>

        {/* Follow-up Status - Third div - Badge Style */}
        <div className="w-full">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <InfoBadge 
                variant={getNextActionVariant(order.followUp.status)} 
                size="md" 
                icon={getNextActionIcon(order.followUp.status)}
                className="w-full hover:opacity-80 transition-all hover:shadow-sm"
              >
                <span className="truncate">{order.followUp.status}</span>
              </InfoBadge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              {STATUS_ORDER_NEXT_ACTION.map((status) => (
                <DropdownMenuItem key={status} className="gap-2">
                  {getNextActionIcon(status)}
                  <span>{status}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TableCell>
  );
}
