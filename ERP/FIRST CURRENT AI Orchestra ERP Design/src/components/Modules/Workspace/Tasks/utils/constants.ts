export const emojis = ["😊", "👍", "❤️", "🎉", "🔥", "👏", "✅", "🚀"];

export const getStatusColor = (status: string) => {
  switch (status) {
    case "Todo":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    case "Processing":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "Early":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
    case "Done":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
};
