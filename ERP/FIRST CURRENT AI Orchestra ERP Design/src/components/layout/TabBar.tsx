import { ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { LucideIcon } from "lucide-react";

export interface TabItem {
  value: string;
  label: string;
  icon?: LucideIcon;
  count?: number;
}

interface TabBarProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
}

export function TabBar({ 
  tabs, 
  defaultValue, 
  value,
  onValueChange, 
  children,
  className = ""
}: TabBarProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
    7: "grid-cols-7",
    8: "grid-cols-8",
  }[tabs.length] || "grid-cols-4";

  return (
    <Tabs 
      defaultValue={defaultValue || tabs[0]?.value} 
      value={value}
      onValueChange={onValueChange}
      className={`w-full ${className}`}
    >
      <TabsList className={`grid w-full ${gridCols} mb-6`}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              {Icon && <Icon className="w-4 h-4" />}
              {tab.label}
              {tab.count !== undefined && ` (${tab.count})`}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {children}
    </Tabs>
  );
}
