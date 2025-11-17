import * as React from "react";
import { cn } from "./utils";

export interface InfoBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: "default" | "purple" | "blue" | "green" | "amber" | "red" | "indigo" | "teal";
  icon?: React.ReactNode;
  size?: "sm" | "md";
}

const variantStyles = {
  default: "bg-gray-100/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300 border-gray-300/50 dark:border-gray-700/50 backdrop-blur-sm",
  purple: "bg-purple-100/80 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-300/50 dark:border-purple-700/50 backdrop-blur-sm",
  blue: "bg-blue-100/80 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-300/50 dark:border-blue-700/50 backdrop-blur-sm",
  green: "bg-green-100/80 dark:bg-green-950/80 text-green-700 dark:text-green-300 border-green-300/50 dark:border-green-700/50 backdrop-blur-sm",
  amber: "bg-amber-100/80 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300/50 dark:border-amber-700/50 backdrop-blur-sm",
  red: "bg-red-100/80 dark:bg-red-950/80 text-red-700 dark:text-red-300 border-red-300/50 dark:border-red-700/50 backdrop-blur-sm",
  indigo: "bg-indigo-100/80 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border-indigo-300/50 dark:border-indigo-700/50 backdrop-blur-sm",
  teal: "bg-teal-100/80 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 border-teal-300/50 dark:border-teal-700/50 backdrop-blur-sm",
};

const sizeStyles = {
  sm: "h-7 text-xs",
  md: "h-8 text-sm",
};

const InfoBadge = React.forwardRef<HTMLDivElement, InfoBadgeProps>(
  ({ className, variant = "default", icon, size = "sm", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "px-2 flex items-center gap-1.5 w-fit rounded-md border cursor-pointer transition-all duration-200",
          sizeStyles[size],
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </div>
    );
  }
);
InfoBadge.displayName = "InfoBadge";

export { InfoBadge };
