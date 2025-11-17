import { GitMerge, Layers, Split } from "lucide-react";
import type { ShipmentData } from "../types";

export interface AISuggestion {
  icon: React.ReactNode;
  text: string;
  action: () => void;
}

/**
 * Generate AI-powered suggestions for shipment optimization
 */
export const getAISuggestions = (
  shipment: ShipmentData,
  allShipments: ShipmentData[],
  onToast: (message: string) => void
): AISuggestion[] => {
  const suggestions: AISuggestion[] = [];
  const sameOrderShipments = allShipments.filter(s => s.orderNumber === shipment.orderNumber);
  
  // Suggest combining if multiple shipments for same order
  if (sameOrderShipments.length > 1) {
    suggestions.push({
      icon: <GitMerge className="w-3 h-3" />,
      text: `Combine ${sameOrderShipments.length} shipments for this order`,
      action: () => onToast(`AI Suggestion: Combining ${sameOrderShipments.length} shipments for ${shipment.orderNumber}`)
    });
  }
  
  // Suggest batch processing for similar items
  if (shipment.items && shipment.items.length > 3 && shipment.status === 'pending') {
    suggestions.push({
      icon: <Layers className="w-3 h-3" />,
      text: "Move to batch for efficient processing",
      action: () => onToast(`AI Suggestion: Adding ${shipment.orderNumber} to batch processing queue`)
    });
  }
  
  // Suggest splitting for faster processing
  if (shipment.items && shipment.items.length > 5) {
    suggestions.push({
      icon: <Split className="w-3 h-3" />,
      text: "Split into 2 shipments for faster delivery",
      action: () => onToast(`AI Suggestion: Splitting ${shipment.orderNumber} into multiple shipments`)
    });
  }
  
  return suggestions;
};
