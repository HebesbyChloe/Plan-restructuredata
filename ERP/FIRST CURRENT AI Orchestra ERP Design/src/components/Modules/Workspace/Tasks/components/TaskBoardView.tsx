import { Card } from "../../../../ui/card";
import { CheckSquare } from "lucide-react";
import { Column, Task, EditingField } from "../types";
import { TaskCard } from "./TaskCard";

interface TaskBoardViewProps {
  columns: Column[];
  isFullBoard?: boolean;
  expandedTaskId: string | null;
  editingField: EditingField | null;
  editValue: string;
  newComment: string;
  urlInput: string;
  onTaskClick: (taskId: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
  onStartEditing: (taskId: string, field: string, value: string) => void;
  onSaveEdit: (taskId: string, field: string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  onNewCommentChange: (value: string) => void;
  onUrlInputChange: (value: string) => void;
  onAddComment: (taskId: string) => void;
  onSendUrl: (taskId: string) => void;
}

export function TaskBoardView({
  columns,
  isFullBoard = false,
  expandedTaskId,
  editingField,
  editValue,
  newComment,
  urlInput,
  onTaskClick,
  onUpdateStatus,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onEditValueChange,
  onNewCommentChange,
  onUrlInputChange,
  onAddComment,
  onSendUrl,
}: TaskBoardViewProps) {
  const displayColumns = isFullBoard ? columns : columns.slice(0, 3);
  const gridCols = isFullBoard ? "lg:grid-cols-4" : "lg:grid-cols-3";

  return (
    <div className={`grid grid-cols-1 ${gridCols} gap-6`}>
      {displayColumns.map((column) => (
        <Card
          key={column.id}
          className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden"
        >
          {/* Colored Top Border */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: column.color }}
          />

          <div className="mb-4 pt-1">
            <h3 className="mb-1">{column.title}</h3>
            <p className="text-sm text-muted-foreground mb-0">
              {column.tasks.length} tasks
            </p>
          </div>
          <div>
            {column.tasks.length > 0 ? (
              column.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  columnColor={column.color}
                  expandedTaskId={expandedTaskId}
                  editingField={editingField}
                  editValue={editValue}
                  newComment={newComment}
                  urlInput={urlInput}
                  onTaskClick={onTaskClick}
                  onUpdateStatus={onUpdateStatus}
                  onStartEditing={onStartEditing}
                  onSaveEdit={onSaveEdit}
                  onCancelEdit={onCancelEdit}
                  onEditValueChange={onEditValueChange}
                  onNewCommentChange={onNewCommentChange}
                  onUrlInputChange={onUrlInputChange}
                  onAddComment={onAddComment}
                  onSendUrl={onSendUrl}
                />
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm mb-0">No tasks</p>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
