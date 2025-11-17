import { Button } from "../../../ui/button";
import { Download, RefreshCw, Palette } from "lucide-react";

// Types
interface CustomOrderBoardHeaderProps {
  onRefresh?: () => void;
  onExport?: () => void;
}

/**
 * CustomOrderBoardHeaderModule
 * 
 * Reusable header component for the Custom Order Board page.
 * Features:
 * - Pink/Rose gradient icon and title
 * - Refresh and Export action buttons
 * - Consistent styling with other order boards
 */
export function CustomOrderBoardHeaderModule({
  onRefresh,
  onExport,
}: CustomOrderBoardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-border/50">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <h1 className="bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-0">
            Customize Order Board
          </h1>
        </div>
        <p className="text-muted-foreground">
          Manage custom design orders and production tracking
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={onRefresh}
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={onExport}
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
