/**
 * ProjectCampaignDetail Helper Functions
 * Utility functions for status colors and data processing
 */

// Get status color classes for project/campaign status
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "active":
    case "in progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    case "planning":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "on hold":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  }
};

// Get activity status color classes
export const getActivityStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800";
    case "redo":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    case "missing":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800";
  }
};

// Get deliverable status color classes
export const getDeliverableStatusColor = (status: string): string => {
  switch (status) {
    case "Approved":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Pending":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Redo":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

// Get deliverable summary color for task row
export const getDeliverableSummaryColor = (approvedCount: number, totalCount: number): string => {
  if (approvedCount === totalCount) {
    return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  } else if (approvedCount > 0) {
    return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300";
  } else {
    return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
  }
};

// Filter members based on search query
export const filterMembers = (
  allMembers: string[],
  searchQuery: string,
  currentMembers: string[]
): string[] => {
  if (!searchQuery.trim()) return [];
  
  return allMembers.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !currentMembers.includes(name)
  );
};
