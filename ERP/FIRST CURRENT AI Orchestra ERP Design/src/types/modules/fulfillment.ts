/**
 * Fulfillment Module - Centralized Type Definitions
 * All types for Fulfillment modules (Shipping, Batches, Returns, Automation)
 */

import { ShipmentEnhanced, BatchEnhanced, ReturnEnhanced } from "../../sampledata";
import { AutomationRule, IntegrationConnection, AutomationTemplate } from "../../sampledata/automationData";

// Re-export from sampledata
export type { ShipmentEnhanced, BatchEnhanced, ReturnEnhanced, AutomationRule, IntegrationConnection, AutomationTemplate };

// ============================================
// SHIPPING TABLE TYPES
// ============================================

export interface ShippingTableProps {
  shipments: ShipmentEnhanced[];
  onShipmentClick: (shipment: ShipmentEnhanced) => void;
}

// ============================================
// BATCH TABLE TYPES
// ============================================

export interface BatchTableProps {
  batches: BatchEnhanced[];
  onBatchClick: (batch: BatchEnhanced) => void;
}

// ============================================
// RETURN TABLE TYPES
// ============================================

export interface ReturnTableProps {
  returns: ReturnEnhanced[];
  onReturnClick: (return: ReturnEnhanced) => void;
}

// ============================================
// AUTOMATION STATS CARDS TYPES
// ============================================

export interface AutomationStatsCardsProps {
  totalRules: number;
  activeRules: number;
  automatedOrders: number;
  timeSaved: number;
}

// ============================================
// AUTOMATION RULES LIST TYPES
// ============================================

export interface AutomationRulesListProps {
  rules: AutomationRule[];
  onRuleClick: (rule: AutomationRule) => void;
  onRuleToggle: (ruleId: string, enabled: boolean) => void;
}

// ============================================
// AI CONTROLS CARD TYPES
// ============================================

export interface AIControlsCardProps {
  aiEnabled: boolean;
  onAIToggle: (enabled: boolean) => void;
  confidenceLevel: number;
  onConfidenceLevelChange: (level: number) => void;
}

// ============================================
// CONNECTION CARDS LIST TYPES
// ============================================

export interface ConnectionCardsListProps {
  connections: IntegrationConnection[];
  onConnectionClick: (connection: IntegrationConnection) => void;
  onConnectionToggle: (connectionId: string, connected: boolean) => void;
}

// ============================================
// TEMPLATE CARDS GRID TYPES
// ============================================

export interface TemplateCardsGridProps {
  templates: AutomationTemplate[];
  onTemplateClick: (template: AutomationTemplate) => void;
  onTemplateUse: (templateId: string) => void;
}
