/**
 * AIControlsCardModule
 * 
 * AI Orchestration control panel with toggle switches for:
 * - AI Orchestration (master switch)
 * - Auto-allocate inventory
 * - Auto-assign shipping service
 * - Auto-send notifications
 */

import { Card } from "../../../ui/card";
import { Switch } from "../../../ui/switch";
import { Brain, Package, Truck, Mail } from "lucide-react";
import { motion } from "motion/react";

// Types
interface AIControlsCardProps {
  aiEnabled: boolean;
  onAiEnabledChange: (value: boolean) => void;
  autoAllocateInventory: boolean;
  onAutoAllocateInventoryChange: (value: boolean) => void;
  autoAssignShipping: boolean;
  onAutoAssignShippingChange: (value: boolean) => void;
  autoSendNotifications: boolean;
  onAutoSendNotificationsChange: (value: boolean) => void;
}

export function AIControlsCardModule({
  aiEnabled,
  onAiEnabledChange,
  autoAllocateInventory,
  onAutoAllocateInventoryChange,
  autoAssignShipping,
  onAutoAssignShippingChange,
  autoSendNotifications,
  onAutoSendNotificationsChange,
}: AIControlsCardProps) {
  return (
    <Card className="p-5 glass-card border-[#4B6BFB]/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#4B6BFB] flex items-center justify-center shadow-md shadow-[#4B6BFB]/20">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="mb-0">AI Orchestration</h3>
            <p className="text-sm text-muted-foreground mb-0">
              Let AI automatically manage your fulfillment workflows
            </p>
          </div>
        </div>
        <Switch checked={aiEnabled} onCheckedChange={onAiEnabledChange} />
      </div>

      {aiEnabled && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2 pt-3 border-t border-border/50"
        >
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4 text-[#4B6BFB]" />
              <span className="text-sm">Auto-allocate inventory</span>
            </div>
            <Switch
              checked={autoAllocateInventory}
              onCheckedChange={onAutoAllocateInventoryChange}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Truck className="w-4 h-4 text-[#4B6BFB]" />
              <span className="text-sm">Auto-assign shipping service</span>
            </div>
            <Switch
              checked={autoAssignShipping}
              onCheckedChange={onAutoAssignShippingChange}
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent transition-colors">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#4B6BFB]" />
              <span className="text-sm">Auto-send notifications</span>
            </div>
            <Switch
              checked={autoSendNotifications}
              onCheckedChange={onAutoSendNotificationsChange}
            />
          </div>
        </motion.div>
      )}
    </Card>
  );
}
