import { Button } from "../../../../ui/button";
import { CheckSquare, Plus, List, LayoutGrid, TableIcon } from "lucide-react";
import { ViewMode } from "../types";

interface TasksHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAddTask?: () => void;
}

export function TasksHeader({
  viewMode,
  onViewModeChange,
  onAddTask,
}: TasksHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
          <CheckSquare className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="mb-1">My Tasks</h1>
          <p className="text-sm text-muted-foreground mb-0">
            Manage and track all your tasks
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-[#F8F8F8] dark:bg-muted">
          <Button
            variant={viewMode === "week" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("week")}
            className={
              viewMode === "week"
                ? "bg-white dark:bg-card shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-card/50"
            }
          >
            <List className="w-4 h-4 mr-2" />
            This Week
          </Button>
          <Button
            variant={viewMode === "board" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("board")}
            className={
              viewMode === "board"
                ? "bg-white dark:bg-card shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-card/50"
            }
          >
            <LayoutGrid className="w-4 h-4 mr-2" />
            Full Board
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("table")}
            className={
              viewMode === "table"
                ? "bg-white dark:bg-card shadow-sm"
                : "hover:bg-white/50 dark:hover:bg-card/50"
            }
          >
            <TableIcon className="w-4 h-4 mr-2" />
            Table
          </Button>
        </div>

        <Button
          onClick={onAddTask}
          className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] to-[#5B7AEF] text-white"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
