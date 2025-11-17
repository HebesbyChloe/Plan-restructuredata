/**
 * Marketing Module - Centralized Utils & Constants
 * All helpers, constants, and utility functions for Marketing modules
 */

// ============================================
// CONSTANTS - PROJECT CAMPAIGN
// ============================================

export const PROJECT_STATUSES = [
  "Draft",
  "Planning",
  "In Progress",
  "Review",
  "Completed",
  "Archived",
] as const;

export const PROJECT_TYPES = [
  "Email Campaign",
  "Social Media",
  "Content Marketing",
  "SEO",
  "PPC",
  "Events",
  "Product Launch",
] as const;

export const PROJECT_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
] as const;

// ============================================
// CONSTANTS - TASKS
// ============================================

export const TASK_STATUSES = [
  "pending",
  "in-progress",
  "completed",
] as const;

// ============================================
// HELPERS - PROJECT CAMPAIGN
// ============================================

export const getProjectStatusColor = (status: string): string => {
  switch (status) {
    case "Draft":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Planning":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "In Progress":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400";
    case "Review":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Completed":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    case "Archived":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getProjectPriorityColor = (priority: string): string => {
  switch (priority) {
    case "Low":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "Medium":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "High":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400";
    case "Urgent":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case "pending":
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
    case "in-progress":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400";
    case "completed":
      return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
