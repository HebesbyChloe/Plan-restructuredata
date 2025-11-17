/**
 * TemplateCardsGridModule
 * 
 * Displays templates in a grid layout with:
 * - Template icon and name
 * - Last modified date
 * - Status badge
 * - Edit, copy, delete actions
 */

import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Plus, Edit2, Copy, Trash2, Mail, MessageSquare, FileText, FileCode, Package } from "lucide-react";
import { Template } from "../../../../sampledata/automationData";

// Types
interface TemplateCardsGridProps {
  templates: Template[];
  title?: string;
  description?: string;
  onNewTemplate?: () => void;
  onEditTemplate?: (templateId: string) => void;
  onCopyTemplate?: (templateId: string) => void;
  onDeleteTemplate?: (templateId: string) => void;
}

// Helpers
const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
    case "connected":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800";
    case "paused":
    case "draft":
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800";
    case "error":
    case "disconnected":
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700";
  }
};

const getTemplateIcon = (type: string) => {
  switch (type) {
    case "email":
      return Mail;
    case "sms":
      return MessageSquare;
    case "packing_slip":
      return FileText;
    case "invoice":
      return FileCode;
    case "shipping_label":
      return Package;
    default:
      return FileText;
  }
};

export function TemplateCardsGridModule({
  templates,
  title,
  description,
  onNewTemplate,
  onEditTemplate,
  onCopyTemplate,
  onDeleteTemplate,
}: TemplateCardsGridProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground mb-0">
          {description || "Manage templates"}
        </p>
        <Button
          size="sm"
          className="gap-2 bg-[#4B6BFB] hover:bg-[#4B6BFB]/90 text-white"
          onClick={onNewTemplate}
        >
          <Plus className="w-4 h-4" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((template) => {
          const IconComponent = getTemplateIcon(template.type);

          return (
            <Card
              key={template.id}
              className="p-4 glass-card hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-[#4B6BFB] flex items-center justify-center shadow-sm">
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1">{template.name}</h4>
                    <p className="text-xs text-muted-foreground mb-0">
                      Modified {template.lastModified}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(template.status)}>
                  {template.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => onEditTemplate?.(template.id)}
                >
                  <Edit2 className="w-3 h-3" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2"
                  onClick={() => onCopyTemplate?.(template.id)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                  onClick={() => onDeleteTemplate?.(template.id)}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
