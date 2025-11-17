import { FileEdit, FolderOpen, Package, PackageCheck, CheckCircle2, Truck, CheckCheck, XCircle } from "lucide-react";

export const BATCH_STATUS_CONFIG = {
  draft: {
    label: "Draft",
    color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dotColor: "bg-slate-500",
    icon: FileEdit,
  },
  open: {
    label: "Open",
    color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    dotColor: "bg-gray-500",
    icon: FolderOpen,
  },
  picking: {
    label: "Picking",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    dotColor: "bg-blue-500",
    icon: Package,
  },
  packing: {
    label: "Packing",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
    dotColor: "bg-purple-500",
    icon: PackageCheck,
  },
  ready: {
    label: "Ready",
    color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300",
    dotColor: "bg-cyan-500",
    icon: CheckCircle2,
  },
  shipped: {
    label: "Shipped",
    color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300",
    dotColor: "bg-indigo-500",
    icon: Truck,
  },
  completed: {
    label: "Completed",
    color: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    dotColor: "bg-green-500",
    icon: CheckCheck,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    dotColor: "bg-red-500",
    icon: XCircle,
  },
} as const;

export const BATCH_PRIORITY_CONFIG = {
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
