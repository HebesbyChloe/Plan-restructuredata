import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import { Badge } from "../../../../ui/badge";
import { Textarea } from "../../../../ui/textarea";
import { Checkbox } from "../../../../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../ui/table";
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
  Calendar as CalendarIcon,
  MessageSquare,
  Briefcase,
  Check,
  X,
  Send,
} from "lucide-react";
import { Column, EditingField } from "../types";
import { getStatusColor } from "../utils/constants";

interface TaskTableViewProps {
  columns: Column[];
  selectedTasks: Set<string>;
  editingField: EditingField | null;
  editValue: string;
  onToggleAll: () => void;
  onToggleTask: (taskId: string) => void;
  onStartEditing: (taskId: string, field: string, value: string) => void;
  onSaveEdit: (taskId: string, field: string) => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  onUpdateStatus: (taskId: string, status: string) => void;
  onUpdateAssignee: (taskId: string, assignee: string) => void;
}

export function TaskTableView({
  columns,
  selectedTasks,
  editingField,
  editValue,
  onToggleAll,
  onToggleTask,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onEditValueChange,
  onUpdateStatus,
  onUpdateAssignee,
}: TaskTableViewProps) {
  const allTasks = columns.flatMap((col) => col.tasks);

  return (
    <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F8F8F8] dark:bg-muted/30 hover:bg-[#F8F8F8] dark:hover:bg-muted/30">
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedTasks.size === allTasks.length &&
                    allTasks.length > 0
                  }
                  onCheckedChange={onToggleAll}
                />
              </TableHead>
              <TableHead className="min-w-[300px]">Task Title</TableHead>
              <TableHead className="min-w-[150px]">Assignee</TableHead>
              <TableHead className="min-w-[120px]">Status</TableHead>
              <TableHead className="min-w-[120px]">Date</TableHead>
              <TableHead className="min-w-[150px]">Project</TableHead>
              <TableHead className="min-w-[180px]">Project / Campaign</TableHead>
              <TableHead className="min-w-[120px]">Deadline</TableHead>
              <TableHead className="w-[100px]">Completed</TableHead>
              <TableHead className="w-[80px]">Note</TableHead>
              <TableHead className="w-[100px]">ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTasks.map((task) => (
              <TableRow
                key={task.id}
                className="hover:bg-[#F8F8F8] dark:hover:bg-muted/20"
              >
                <TableCell>
                  <Checkbox
                    checked={selectedTasks.has(task.id)}
                    onCheckedChange={() => onToggleTask(task.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {editingField?.taskId === task.id &&
                    editingField?.field === "title" ? (
                      <div className="flex items-center gap-2">
                        <Input
                          value={editValue}
                          onChange={(e) => onEditValueChange(e.target.value)}
                          className="flex-1 h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={() => onSaveEdit(task.id, "title")}
                        >
                          <Check className="w-3 h-3 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0"
                          onClick={onCancelEdit}
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <div
                        className="group/title cursor-pointer"
                        onClick={() => onStartEditing(task.id, "title", task.title)}
                      >
                        <p className="mb-0 group-hover/title:text-[#4B6BFB] transition-colors">
                          {task.title}
                        </p>
                      </div>
                    )}
                    {task.description && (
                      <p className="text-xs text-muted-foreground mb-0 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {editingField?.taskId === task.id &&
                  editingField?.field === "assignee" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => onEditValueChange(e.target.value)}
                        className="flex-1 h-8 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => onSaveEdit(task.id, "assignee")}
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={onCancelEdit}
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <Select
                      value={task.assignee}
                      onValueChange={(value) => onUpdateAssignee(task.id, value)}
                    >
                      <SelectTrigger className="h-8 text-sm bg-transparent border-none shadow-none hover:bg-accent">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Vy Ha">Vy Ha</SelectItem>
                        <SelectItem value="Nam Lam">Nam Lam</SelectItem>
                        <SelectItem value="Hang Tran">Hang Tran</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={task.status}
                    onValueChange={(value) => onUpdateStatus(task.id, value)}
                  >
                    <SelectTrigger className="h-8 text-sm bg-transparent border-none shadow-none hover:bg-accent">
                      <SelectValue>
                        <Badge
                          className={getStatusColor(task.status)}
                          variant="outline"
                        >
                          {task.status}
                        </Badge>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Todo">Todo</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Early">Early</SelectItem>
                      <SelectItem value="Done">Done</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 text-sm hover:bg-accent px-2"
                      >
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {task.date}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  {editingField?.taskId === task.id &&
                  editingField?.field === "project" ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => onEditValueChange(e.target.value)}
                        className="flex-1 h-8 text-sm"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => onSaveEdit(task.id, "project")}
                      >
                        <Check className="w-3 h-3 text-green-600" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={onCancelEdit}
                      >
                        <X className="w-3 h-3 text-red-600" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer hover:text-[#4B6BFB] transition-colors"
                      onClick={() =>
                        onStartEditing(task.id, "project", task.project)
                      }
                    >
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                      >
                        <Briefcase className="w-3 h-3 mr-1" />
                        {task.project}
                      </Badge>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Select defaultValue="halloween-campaign">
                    <SelectTrigger className="h-8 text-sm bg-transparent border-none shadow-none hover:bg-accent">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="halloween-campaign">Halloween Campaign</SelectItem>
                      <SelectItem value="mid-autumn">Mid-Autumn Campaign</SelectItem>
                      <SelectItem value="october-collection">October Collection</SelectItem>
                      <SelectItem value="november-planning">November Planning</SelectItem>
                      <SelectItem value="website-redesign">Website Redesign</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 text-sm hover:bg-accent px-2"
                      >
                        <CalendarIcon className="w-3 h-3 mr-1" />
                        {task.date}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={task.status === "Done"}
                    onCheckedChange={(checked) => {
                      onUpdateStatus(task.id, checked ? "Done" : "Todo");
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <MessageSquare className="w-4 h-4" />
                        {task.comments.length > 0 && (
                          <span className="ml-1 text-xs">
                            {task.comments.length}
                          </span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-3">
                        <h4 className="mb-0">Comments</h4>
                        {task.comments.length > 0 && (
                          <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {task.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className="p-2 rounded-lg bg-[#F8F8F8] dark:bg-muted/30 text-sm"
                              >
                                <div className="flex items-start justify-between mb-1">
                                  <span className="text-xs">
                                    {comment.user}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {comment.timestamp}
                                  </span>
                                </div>
                                <p className="text-xs mb-0">
                                  {comment.content}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="relative">
                          <Textarea
                            placeholder="Add a comment..."
                            className="bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] min-h-[60px] pr-10 text-sm"
                          />
                          <Button
                            size="sm"
                            className="absolute right-2 bottom-2 h-7 bg-[#4B6BFB] hover:bg-[#3B5BEB] text-white"
                          >
                            <Send className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    #{task.id}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
