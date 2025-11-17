/**
 * TypeScript Types: Connection Cards List Module
 */

import { APIConnection } from "../../../../../sampledata/automationData";

export interface ConnectionCardsListProps {
  connections: APIConnection[];
  title?: string;
  description?: string;
  addButtonLabel?: string;
  onAddConnection?: () => void;
  onConfigureConnection?: (connectionId: string) => void;
  onSyncConnection?: (connectionId: string) => void;
}

export type { APIConnection };
