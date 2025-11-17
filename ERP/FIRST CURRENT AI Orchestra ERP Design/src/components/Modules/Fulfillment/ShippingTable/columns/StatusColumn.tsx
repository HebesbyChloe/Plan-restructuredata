import { Badge } from "../../../../ui/badge";
import { PRIORITY_CONFIG } from "../utils/constants";
import type { ShipmentData } from "../types";

interface StatusColumnProps {
  shipment: ShipmentData;
}

// Format status for display
const formatStatus = (status: string): string => {
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Get color based on status
const getStatusColor = (status: ShipmentData["status"]): string => {
  const colorMap: Record<ShipmentData["status"], string> = {
    "pending": "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
    "picking": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "picked": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "packing": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "packed": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    "ready": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "label-printed": "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
    "shipped": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    "in-transit": "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
    "out-for-delivery": "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
    "delivered": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    "exception": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    "returned": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
  };
  return colorMap[status] || "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
};

// Get dot color based on status
const getDotColor = (status: ShipmentData["status"]): string => {
  const colorMap: Record<ShipmentData["status"], string> = {
    "pending": "bg-gray-500",
    "picking": "bg-blue-500",
    "picked": "bg-blue-500",
    "packing": "bg-purple-500",
    "packed": "bg-purple-500",
    "ready": "bg-green-500",
    "label-printed": "bg-cyan-500",
    "shipped": "bg-blue-500",
    "in-transit": "bg-indigo-500",
    "out-for-delivery": "bg-violet-500",
    "delivered": "bg-green-500",
    "exception": "bg-red-500",
    "returned": "bg-orange-500"
  };
  return colorMap[status] || "bg-gray-500";
};

export function StatusColumn({ shipment }: StatusColumnProps) {
  const priorityConfig = PRIORITY_CONFIG[shipment.priority];

  return (
    <div className="min-w-[140px] space-y-2">
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${getDotColor(shipment.status)}`} />
        <Badge variant="secondary" className={getStatusColor(shipment.status)}>
          {formatStatus(shipment.status)}
        </Badge>
      </div>
      
      {shipment.priority !== "normal" && (
        <Badge variant="outline" className={priorityConfig.color}>
          {priorityConfig.label}
        </Badge>
      )}
    </div>
  );
}
