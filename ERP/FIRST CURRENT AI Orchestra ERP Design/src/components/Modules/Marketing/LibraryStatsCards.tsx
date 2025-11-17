import { Card } from "../../ui/card";
import { FolderOpen, Folder, Sparkles, Clock, Package } from "lucide-react";

interface LibraryStatsCardsProps {
  totalFolders: number;
  totalItems: number;
  aiOptimizedCount: number;
  recentUpdate?: string;
}

export function LibraryStatsCards({
  totalFolders,
  totalItems,
  aiOptimizedCount,
  recentUpdate = "Today",
}: LibraryStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#4B6BFB]/10">
            <FolderOpen className="w-5 h-5 text-[#4B6BFB]" />
          </div>
          <div>
            <div className="opacity-60">Total Folders</div>
            <div>{totalFolders}</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Folder className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <div className="opacity-60">Total Items</div>
            <div>{totalItems}</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10">
            <Sparkles className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <div className="opacity-60">AI Optimized</div>
            <div>{aiOptimizedCount} folders</div>
          </div>
        </div>
      </Card>

      <Card className="p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10">
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <div className="opacity-60">Recently Updated</div>
            <div>{recentUpdate}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
