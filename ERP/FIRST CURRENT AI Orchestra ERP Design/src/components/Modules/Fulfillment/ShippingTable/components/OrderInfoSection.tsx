import React from "react";
import { Badge } from "../../../../ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import { Sparkles, ChevronDown } from "lucide-react";
import { OrderData } from "../../../../../types/modules/crm";

interface OrderInfoSectionProps {
  order: OrderData;
  showAISuggestions: boolean;
  aiSuggestions: any[];
  onOrderClick?: (e: React.MouseEvent, order: OrderData) => void;
  onToggleAISuggestions: (e: React.MouseEvent) => void;
  itemsExpanded?: boolean;
  onToggleItems?: (e: React.MouseEvent) => void;
}

export function OrderInfoSection({
  order,
  showAISuggestions,
  aiSuggestions,
  onOrderClick,
  onToggleAISuggestions,
  itemsExpanded,
  onToggleItems,
}: OrderInfoSectionProps) {
  return (
    <div className="space-y-2">
      {/* Order Number with Amount */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 flex-1 min-w-0">
          <h3 
            className="text-lg font-semibold text-foreground cursor-pointer hover:text-[#4B6BFB] truncate transition-colors"
            onClick={(e) => onOrderClick?.(e, order)}
          >
            {order.orderNumber}
          </h3>
          {/* AI Suggestions Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onToggleAISuggestions}
                  className="flex items-center gap-1 text-xs text-[#4B6BFB] hover:text-[#4B6BFB]/80 transition-colors"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>AI Suggest</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View AI suggestions for optimization</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-right flex-shrink-0 space-y-1">
          <div className="text-lg text-foreground">
            ${order.amount?.toFixed(2) || '0.00'}
          </div>
          {/* Item Count - Aligned Right */}
          {onToggleItems && (
            <button
              onClick={onToggleItems}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors ml-auto"
            >
              <span>{order.totalItems || order.lineItems?.length || 0} items</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${itemsExpanded ? 'rotate-180' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {showAISuggestions && (
        <div className="p-2 bg-[#4B6BFB]/5 border border-[#4B6BFB]/20 rounded-md space-y-1.5">
          {aiSuggestions.map((suggestion, idx) => (
            <button
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                suggestion.action();
              }}
              className="flex items-start gap-2 text-xs text-left w-full p-1.5 hover:bg-[#4B6BFB]/10 rounded transition-colors"
            >
              <span className="text-[#4B6BFB] mt-0.5">{suggestion.icon}</span>
              <span className="text-muted-foreground flex-1">{suggestion.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
