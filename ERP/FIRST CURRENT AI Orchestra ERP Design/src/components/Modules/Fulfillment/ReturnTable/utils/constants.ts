import {
  Clock,
  Package,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Truck,
  PackageCheck,
} from "lucide-react";

export const RETURN_STATUS_CONFIG = {
  "pending": {
    label: "Pending",
    icon: Clock,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    dotColor: "bg-blue-500",
  },
  "approved": {
    label: "Approved",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    dotColor: "bg-green-500",
  },
  "rejected": {
    label: "Rejected",
    icon: X,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    dotColor: "bg-red-500",
  },
  "received": {
    label: "Received",
    icon: CheckCircle2,
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    dotColor: "bg-cyan-500",
  },
  "inspected": {
    label: "Inspected",
    icon: AlertCircle,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    dotColor: "bg-orange-500",
  },
  "refunded": {
    label: "Refunded",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
  },
  "completed": {
    label: "Completed",
    icon: CheckCircle2,
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300",
    dotColor: "bg-emerald-500",
  },
} as const;

export const RETURN_TYPE_CONFIG = {
  return: {
    label: "Return",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  warranty: {
    label: "Warranty",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  exchange: {
    label: "Exchange",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  repair: {
    label: "Repair",
    color: "bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300",
  },
} as const;

export const RETURN_PRIORITY_CONFIG = {
  low: {
    label: "Low",
    color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
  },
  normal: {
    label: "Normal",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400",
  },
  high: {
    label: "High",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400",
  },
  urgent: {
    label: "Urgent",
    color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
  },
} as const;

export const RETURN_SHIPPING_STATUS_CONFIG = {
  "label-created": {
    label: "Created",
    icon: Package,
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  },
  "picked-up": {
    label: "Drop off",
    icon: PackageCheck,
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
  },
  "in-transit": {
    label: "In transit",
    icon: Truck,
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  },
  "out-for-delivery": {
    label: "Out for delivery",
    icon: Truck,
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  },
  "delivered": {
    label: "Delivered",
    icon: CheckCircle2,
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  },
  "delay": {
    label: "Delay",
    icon: Clock,
    color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  },
  "on-hold": {
    label: "On hold",
    icon: AlertCircle,
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  },
} as const;
