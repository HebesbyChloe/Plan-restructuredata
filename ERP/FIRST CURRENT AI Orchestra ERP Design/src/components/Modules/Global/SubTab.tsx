import React, { ReactNode } from 'react';
import { motion } from 'motion/react';

interface SubTabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface SubTabProps {
  items: SubTabItem[];
  value: string;
  onValueChange: (value: string) => void;
  children?: ReactNode;
}

interface SubTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface SubTabsListProps {
  children: ReactNode;
  className?: string;
}

interface SubTabsTriggerProps {
  value: string;
  children: ReactNode;
  icon?: ReactNode;
  count?: number;
  className?: string;
}

interface SubTabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

// Context for SubTabs
const SubTabsContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
} | null>(null);

// Main SubTabs Container
export function SubTabs({ value, onValueChange, children, className = '' }: SubTabsProps) {
  return (
    <SubTabsContext.Provider value={{ value, onValueChange }}>
      <div className={`w-full ${className}`}>
        {children}
      </div>
    </SubTabsContext.Provider>
  );
}

// SubTabs List (the navigation bar)
export function SubTabsList({ children, className = '' }: SubTabsListProps) {
  return (
    <div className={`flex items-center gap-1 border-b border-white/10 mb-6 overflow-x-auto ${className}`}>
      {children}
    </div>
  );
}

// SubTabs Trigger (individual tab button)
export function SubTabsTrigger({ value, children, icon, count, className = '' }: SubTabsTriggerProps) {
  const context = React.useContext(SubTabsContext);
  
  if (!context) {
    throw new Error('SubTabsTrigger must be used within SubTabs');
  }

  const { value: currentValue, onValueChange } = context;
  const isActive = currentValue === value;

  return (
    <button
      onClick={() => onValueChange(value)}
      className={`
        relative px-4 py-3 
        flex items-center gap-2
        transition-all duration-200
        text-sm
        whitespace-nowrap
        ${isActive 
          ? 'text-[#4B6BFB]' 
          : 'text-gray-600 hover:text-gray-800'
        }
        ${className}
      `}
    >
      {/* Icon */}
      {icon && (
        <span className={`
          transition-all duration-200
          ${isActive ? 'opacity-100' : 'opacity-70'}
        `}>
          {icon}
        </span>
      )}
      
      {/* Label */}
      <span>{children}</span>
      
      {/* Count Badge */}
      {count !== undefined && (
        <span className={`
          px-2 py-0.5 rounded-full text-xs
          transition-all duration-200
          ${isActive 
            ? 'bg-[#4B6BFB]/20 text-[#4B6BFB]' 
            : 'bg-gray-200 text-gray-700'
          }
        `}>
          {count}
        </span>
      )}
      
      {/* Active Indicator - Bottom Border */}
      {isActive && (
        <motion.div
          layoutId="activeSubTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4B6BFB]"
          initial={false}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}
    </button>
  );
}

// SubTabs Content (content area for each tab)
export function SubTabsContent({ value, children, className = '' }: SubTabsContentProps) {
  const context = React.useContext(SubTabsContext);
  
  if (!context) {
    throw new Error('SubTabsContent must be used within SubTabs');
  }

  const { value: currentValue } = context;

  if (currentValue !== value) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Optional: Simplified all-in-one component for quick usage
export default function SubTab({ items, value, onValueChange, children }: SubTabProps) {
  return (
    <SubTabs value={value} onValueChange={onValueChange}>
      <SubTabsList>
        {items.map((item) => (
          <SubTabsTrigger
            key={item.value}
            value={item.value}
            icon={item.icon}
            count={item.count}
          >
            {item.label}
          </SubTabsTrigger>
        ))}
      </SubTabsList>
      {children}
    </SubTabs>
  );
}
