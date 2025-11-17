import { BatchEnhanced } from "../../../../../sampledata/batchesEnhanced";

export type BatchData = BatchEnhanced;

export interface BatchTableModuleProps {
  batches: BatchData[];
  onBatchClick: (batch: BatchData) => void;
  onStatusChange?: (batchId: string, newStatus: BatchData["status"]) => void;
  onAssignUser?: (batchId: string, userId: string) => void;
}
