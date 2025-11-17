/**
 * TypeScript Types: Automation Rules List Module
 */

import { AutomationRule } from "../../../../../sampledata/automationData";

export interface AutomationRulesListProps {
  rules: AutomationRule[];
  onNewRule?: () => void;
  onToggleRule?: (ruleId: string) => void;
  onEditRule?: (ruleId: string) => void;
}

export type { AutomationRule };
