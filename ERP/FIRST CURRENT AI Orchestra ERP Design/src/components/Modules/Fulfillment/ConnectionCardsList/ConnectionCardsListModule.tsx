/**
 * ConnectionCardsListModule
 * 
 * Displays API connections list with:
 * - Connection name and platform
 * - Status indicator
 * - Last sync time
 * - Configure and sync actions
 */

import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Store,
  Truck,
  Plus,
  Settings,
  Zap,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { APIConnection } from "../../../../sampledata/automationData";

// Types
interface ConnectionCardsListProps {
  connections: APIConnection[];
  title?: string;
  description?: string;
  addButtonLabel?: string;
  onAddConnection?: () => void;
  onConfigureConnection?: (connectionId: string) => void;
  onSyncConnection?: (connectionId: string) => void;
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

export function ConnectionCardsListModule({
  connections,
  title,
  description,
  addButtonLabel = "Add Connection",
  onAddConnection,
  onConfigureConnection,
  onSyncConnection,
}: ConnectionCardsListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground mb-0">
          {description || "Manage API connections"}
        </p>
        <Button
          size="sm"
          className="gap-2 bg-[#4B6BFB] hover:bg-[#4B6BFB]/90 text-white"
          onClick={onAddConnection}
        >
          <Plus className="w-4 h-4" />
          {addButtonLabel}
        </Button>
      </div>

      {/* Connections List */}
      <div className="space-y-3">
        {connections.map((connection) => {
          const IconComponent = connection.type === "store" ? Store : Truck;

          return (
            <Card
              key={connection.id}
              className="p-4 glass-card hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#4B6BFB] flex items-center justify-center shadow-sm">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="mb-1">{connection.name}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs bg-accent">
                        {connection.platform}
                      </Badge>
                      {connection.lastSync && (
                        <span className="text-xs text-muted-foreground">
                          Last sync: {connection.lastSync}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(connection.status)}>
                    {connection.status === "connected" && (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    )}
                    {connection.status === "error" && (
                      <AlertCircle className="w-3 h-3 mr-1" />
                    )}
                    {connection.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-2"
                    onClick={() => onConfigureConnection?.(connection.id)}
                  >
                    <Settings className="w-4 h-4" />
                    Configure
                  </Button>
                  {connection.status === "connected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2"
                      onClick={() => onSyncConnection?.(connection.id)}
                    >
                      <Zap className="w-4 h-4" />
                      Sync
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
