import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  rightContent?: React.ReactNode;
  actions?: React.ReactNode; // Support both rightContent and actions
}

export function PageHeader({ icon: Icon, title, description, rightContent, actions }: PageHeaderProps) {
  const rightSide = actions || rightContent;
  
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] dark:bg-white/10 flex items-center justify-center backdrop-blur-sm">
            <Icon className="w-5 h-5 text-white dark:text-white" />
          </div>
        )}
        <div>
          <h1 className="mb-0">{title}</h1>
          <p className="opacity-60 mt-0">{description}</p>
        </div>
      </div>
      {rightSide && <div className="text-right">{rightSide}</div>}
    </div>
  );
}
