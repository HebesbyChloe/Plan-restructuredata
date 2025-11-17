import { Play, Pause, Clock } from "lucide-react";

export const statusConfig = {
  active: {
    color: "#10B981",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    textColor: "text-green-800 dark:text-green-300",
    icon: Play,
  },
  paused: {
    color: "#F59E0B",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
    textColor: "text-orange-800 dark:text-orange-300",
    icon: Pause,
  },
  requested: {
    color: "#6B7280",
    bgColor: "bg-gray-100 dark:bg-gray-900/30",
    textColor: "text-gray-800 dark:text-gray-300",
    icon: Clock,
  },
};

export const departmentConfig: Record<string, { title: string; description: string }> = {
  Marketing: {
    title: "AI Flow",
    description: "Marketing AI tools across 3 interaction layers"
  },
  CRM: {
    title: "AI Flow",
    description: "Sales & CRM AI automation tools across 3 interaction layers"
  },
  HR: {
    title: "AI Flow",
    description: "HR & People Operations AI tools across 3 interaction layers"
  },
  Finance: {
    title: "AI Flow",
    description: "Finance & Accounting AI automation across 3 interaction layers"
  },
  Fulfilment: {
    title: "AI Flow",
    description: "Fulfillment & Operations AI automation across 3 interaction layers"
  },
  Workspace: {
    title: "AI Flow",
    description: "Personal Workspace AI automation tools across 3 interaction layers"
  }
};
