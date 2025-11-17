import { motion, AnimatePresence } from "motion/react";
import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Badge } from "../../../../ui/badge";
import { Textarea } from "../../../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../../ui/popover";
import { Calendar } from "../../../../ui/calendar";
import {
  ChevronDown,
  ChevronUp,
  User,
  Calendar as CalendarIcon,
  MessageSquare,
  Briefcase,
  Edit2,
  Check,
  X,
  Send,
  Smile,
} from "lucide-react";
import { getStatusColor, emojis } from "../utils/constants";
import { Task, EditingField } from "../types";

interface TaskCardProps {
  task: Task;
  columnColor: string;
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

export function TaskCard({
  task,
  columnColor,
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
}: TaskCardProps) {
  const isExpanded = expandedTaskId === task.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3"
    >
      <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border hover:shadow-md transition-all overflow-hidden">
        {/* Task Header - Always Visible */}
        <div
          onClick={() => onTaskClick(task.id)}
          className="p-4 cursor-pointer group"
        >
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-2">
              {editingField?.taskId === task.id &&
              editingField?.field === "title" ? (
                <div
                  className="flex-1 flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    value={editValue}
                    onChange={(e) => onEditValueChange(e.target.value)}
                    className="flex-1"
                    autoFocus
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSaveEdit(task.id, "title")}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                    <X className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ) : (
                <h4 className="text-sm mb-0 line-clamp-2 flex-1 group-hover:text-[#4B6BFB] transition-colors">
                  {task.title}
                </h4>
              )}
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </div>

            {!isExpanded && task.description && (
              <p className="text-xs text-muted-foreground mb-0 line-clamp-2">
                {task.description}
              </p>
            )}

            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(task.status)} variant="outline">
                  {task.status}
                </Badge>

                {/* Project Badge */}
                <Badge
                  variant="outline"
                  className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                >
                  <Briefcase className="w-3 h-3 mr-1" />
                  {task.project}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  <span>{task.date}</span>
                </div>

                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{task.assignee}</span>
                </div>

                {task.comments.length > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{task.comments.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-[#E5E5E5] dark:border-border"
            >
              <div className="p-4 space-y-4" onClick={(e) => e.stopPropagation()}>
                {/* Editable Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Status
                    </label>
                    <Select
                      value={task.status}
                      onValueChange={(value) => onUpdateStatus(task.id, value)}
                    >
                      <SelectTrigger className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Todo">Todo</SelectItem>
                        <SelectItem value="Processing">Processing</SelectItem>
                        <SelectItem value="Early">Early</SelectItem>
                        <SelectItem value="Done">Done</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Due Date
                    </label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
                        >
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          {task.date}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" />
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Project */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Project
                    </label>
                    {editingField?.taskId === task.id &&
                    editingField?.field === "project" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => onEditValueChange(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSaveEdit(task.id, "project")}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-[#F8F8F8] dark:bg-muted border border-[#E5E5E5] text-sm">
                          {task.project}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            onStartEditing(task.id, "project", task.project)
                          }
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Assignee */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Assignee
                    </label>
                    {editingField?.taskId === task.id &&
                    editingField?.field === "assignee" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => onEditValueChange(e.target.value)}
                          className="flex-1"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onSaveEdit(task.id, "assignee")}
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={onCancelEdit}>
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="flex-1 px-3 py-2 rounded-lg bg-[#F8F8F8] dark:bg-muted border border-[#E5E5E5] text-sm flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {task.assignee}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            onStartEditing(task.id, "assignee", task.assignee)
                          }
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Details */}
                {task.actions.length > 0 && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Action
                    </label>
                    {editingField?.taskId === task.id &&
                    editingField?.field === "actions" ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editValue}
                          onChange={(e) => onEditValueChange(e.target.value)}
                          className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] min-h-[60px]"
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => onSaveEdit(task.id, "actions")}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={onCancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative group/action">
                        <p className="text-sm mb-0 px-3 py-2 rounded-lg bg-[#F8F8F8] dark:bg-muted/30">
                          {task.actions[0]}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-2 right-2 opacity-0 group-hover/action:opacity-100 transition-opacity"
                          onClick={() =>
                            onStartEditing(task.id, "actions", task.actions[0])
                          }
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {task.deliverable && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Deliverable
                    </label>
                    <p className="text-sm text-muted-foreground mb-0 px-3 py-2 rounded-lg bg-[#F8F8F8] dark:bg-muted/30">
                      {task.deliverable}
                    </p>
                  </div>
                )}

                {task.purpose && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Purpose
                    </label>
                    <p className="text-sm text-muted-foreground mb-0 px-3 py-2 rounded-lg bg-[#F8F8F8] dark:bg-muted/30">
                      {task.purpose}
                    </p>
                  </div>
                )}

                {task.timeEstimate && (
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">
                      Time Estimate
                    </label>
                    <p className="text-sm text-muted-foreground mb-0 px-3 py-2 rounded-lg bg-[#F8F8F8] dark:bg-muted/30">
                      {task.timeEstimate}
                    </p>
                  </div>
                )}

                {/* Comments Section */}
                <div className="pt-4 border-t border-[#E5E5E5] dark:border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="mb-0 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Comments ({task.comments.length})
                    </h4>
                  </div>

                  {/* URL Input */}
                  <div className="relative">
                    <Input
                      placeholder="Paste file URL here..."
                      value={urlInput}
                      onChange={(e) => onUrlInputChange(e.target.value)}
                      className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] pr-24"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-accent"
                          >
                            <Smile className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2" align="end">
                          <div className="grid grid-cols-4 gap-2">
                            {emojis.map((emoji) => (
                              <button
                                key={emoji}
                                onClick={() => onUrlInputChange(urlInput + emoji)}
                                className="text-xl hover:bg-accent p-2 rounded transition-colors"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <Button
                        size="sm"
                        onClick={() => onSendUrl(task.id)}
                        className="h-8 bg-[#4B6BFB] hover:bg-[#3B5BEB] text-white"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Comments List */}
                  {task.comments.length > 0 && (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {task.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="p-3 rounded-lg bg-[#F8F8F8] dark:bg-muted/30"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <span className="text-sm">{comment.user}</span>
                            <span className="text-xs text-muted-foreground">
                              {comment.timestamp}
                            </span>
                          </div>
                          <p className="text-sm mb-0">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment */}
                  <div className="relative">
                    <Textarea
                      placeholder="Type your comment here..."
                      value={newComment}
                      onChange={(e) => onNewCommentChange(e.target.value)}
                      className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] min-h-[80px] pr-12"
                    />
                    <Button
                      size="sm"
                      onClick={() => onAddComment(task.id)}
                      className="absolute right-2 bottom-2 bg-[#4B6BFB] hover:bg-[#3B5BEB] text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
