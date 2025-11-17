/**
 * Sync Button Component
 * Shows floating sync button when there are unsynced changes
 */

import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Badge } from "../../../../ui/badge";
import { Sparkles, RefreshCw } from "lucide-react";

interface SyncButtonProps {
  isNearBottom: boolean;
  hasUnsyncedChanges: boolean;
  isSyncing: boolean;
  onSync: () => void;
}

export function SyncButton({
  isNearBottom,
  hasUnsyncedChanges,
  isSyncing,
  onSync,
}: SyncButtonProps) {
  // Always show when there are unsynced changes, or when near bottom
  if (!hasUnsyncedChanges && !isNearBottom) return null;

  return (
    <div className="p-4 bg-gradient-to-t from-background via-background to-transparent">
      <Card className={`p-3 bg-gradient-to-r from-[#4B6BFB]/10 to-[#6B8AFF]/10 border-[#4B6BFB]/20 shadow-lg transition-all ${
        hasUnsyncedChanges ? 'animate-in slide-in-from-bottom-5' : ''
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              hasUnsyncedChanges ? 'bg-[#4B6BFB]/20' : 'bg-[#4B6BFB]/10'
            }`}>
              <Sparkles className={`w-4 h-4 ${
                hasUnsyncedChanges ? 'text-[#4B6BFB] animate-pulse' : 'text-[#4B6BFB]'
              }`} />
            </div>
            <div>
              <p className="text-sm mb-0 flex items-center gap-2">
                AI Brief Sync
                {hasUnsyncedChanges && (
                  <Badge variant="outline" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-800 text-xs">
                    Updates pending
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground mb-0">
                {hasUnsyncedChanges ? 'You have unsynced changes' : 'Last synced: Just now'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            disabled={isSyncing}
            className={`gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] hover:to-[#5B7AEF] text-white ${
              isSyncing ? 'opacity-50' : ''
            }`}
            onClick={onSync}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
