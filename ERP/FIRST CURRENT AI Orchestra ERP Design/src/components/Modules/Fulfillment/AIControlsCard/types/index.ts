/**
 * TypeScript Types: AI Controls Card Module
 */

export interface AIControlsCardProps {
  aiEnabled: boolean;
  onAiEnabledChange: (value: boolean) => void;
  autoAllocateInventory: boolean;
  onAutoAllocateInventoryChange: (value: boolean) => void;
  autoAssignShipping: boolean;
  onAutoAssignShippingChange: (value: boolean) => void;
  autoSendNotifications: boolean;
  onAutoSendNotificationsChange: (value: boolean) => void;
}
