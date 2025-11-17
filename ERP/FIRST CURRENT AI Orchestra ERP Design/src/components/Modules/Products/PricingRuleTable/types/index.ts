import { PricingRule } from "@/sampledata";

export interface PricingRuleTableModuleProps {
  rules: PricingRule[];
  selectedRule: PricingRule | null;
  onRuleClick: (rule: PricingRule) => void;
}

export type { PricingRule };
