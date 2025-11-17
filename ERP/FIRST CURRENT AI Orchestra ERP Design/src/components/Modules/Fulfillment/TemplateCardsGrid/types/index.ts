/**
 * TypeScript Types: Template Cards Grid Module
 */

import { Template } from "../../../../../sampledata/automationData";

export interface TemplateCardsGridProps {
  templates: Template[];
  title?: string;
  description?: string;
  onNewTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
  onCopyTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

export type { Template };
