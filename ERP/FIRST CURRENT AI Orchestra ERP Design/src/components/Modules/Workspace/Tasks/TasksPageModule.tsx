import { useState } from "react";
import { toast } from "sonner";
import { Column, ViewMode, EditingField } from "./types";
import {
  TasksHeader,
  TasksFilters,
  TaskBoardView,
  TaskTableView,
} from "./components";

export function TasksPageModule() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [editValue, setEditValue] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "thisweek",
      title: "This Week",
      color: "#4B6BFB",
      tasks: [
        {
          id: "3",
          title: "Pre-Launch Halloween Campaign Meeting",
          description: "Action: Họp meeting - Báo cáo bảng tin Tháng 10, Handbook cho C...",
          actions: ["Họp meeting - Báo cáo bảng tin Tháng 10, Handbook cho Campaign"],
          deliverable: "Meeting notes and action items",
          purpose: "Align team on Halloween campaign strategy",
          timeEstimate: "2 hours",
          status: "Todo",
          date: "Oct 13",
          assignee: "Vy Ha",
          project: "Halloween Campaign",
          comments: [],
        },
        {
          id: "4",
          title: "[Report] Campaign Trung Thu Performance",
          description: "Action: Tổng hợp kết quả các metrics - Phân tích - Video - Hình ảnh - Tạo Camp...",
          actions: ["Tổng hợp kết quả các metrics", "Phân tích", "Video - Hình ảnh"],
          deliverable: "Full performance report with visuals",
          purpose: "Evaluate campaign success and learnings",
          timeEstimate: "4 hours",
          status: "Todo",
          date: "Oct 13",
          assignee: "Vy Ha",
          project: "Mid-Autumn Campaign",
          comments: [],
        },
      ],
    },
    {
      id: "today",
      title: "Today",
      color: "#F59E0B",
      tasks: [],
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "#10B981",
      tasks: [
        {
          id: "5",
          title: "[Generate] Ảnh Concept BST Tháng 10",
          description: "Action: Sử dụng AI để tạo ảnh concept cho bộ sưu tập Tháng 10",
          actions: ["Sử dụng AI để tạo ảnh concept cho bộ sưu tập Tháng 10."],
          deliverable: "Bộ các ảnh concept chất lượng cao, phù hợp chủ đề Tháng 10.",
          purpose: "Phục vụ cho công tác trình bày thiết kế và quảng bá BST mới.",
          timeEstimate: "4 giờ.",
          status: "Processing",
          date: "Oct 15",
          assignee: "Vy Ha",
          project: "October Collection",
          comments: [
            {
              id: "c1",
              user: "Vy Ha",
              content: "hiện chưa có ảnh",
              timestamp: "09:44 Oct. 10",
            },
            {
              id: "c2",
              user: "Vy Ha",
              content: "dợi final retouch nền trắng",
              timestamp: "17:10 Oct. 10",
            },
          ],
        },
      ],
    },
    {
      id: "thismonth",
      title: "This Month",
      color: "#8B5CF6",
      tasks: [
        {
          id: "1",
          title: "[Plan] Chi tiết 3 tubing Tháng 11",
          description: "Action: Tính tiền tất cả đối tác và sẵn bài túilet cắp ý tưởng c...",
          actions: ["Tính tiền tất cả đối tác", "Sẵn bài túilet cắp ý tưởng"],
          status: "Todo",
          date: "Oct 30",
          assignee: "Vy Ha",
          project: "November Planning",
          comments: [],
        },
        {
          id: "2",
          title: "[Research] Idea/Theme cho Campaign Tháng 11",
          description: "Action: Nghiên cứu 3 tubing theme cho các campaign...",
          actions: ["Nghiên cứu 3 tubing theme cho các campaign"],
          status: "Todo",
          date: "Oct 28",
          assignee: "Vy Ha",
          project: "November Planning",
          comments: [],
        },
      ],
    },
  ]);

  const handleTaskClick = (taskId: string) => {
    setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
  };

  const handleAddComment = (taskId: string) => {
    if (!newComment.trim()) return;

    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: `c${Date.now()}`,
                    user: "Vy Ha",
                    content: newComment,
                    timestamp: new Date().toLocaleString(),
                  },
                ],
              }
            : task
        ),
      }))
    );

    setNewComment("");
    toast.success("Comment added!");
  };

  const handleSendUrl = (taskId: string) => {
    if (!urlInput.trim()) return;

    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                comments: [
                  ...task.comments,
                  {
                    id: `c${Date.now()}`,
                    user: "Vy Ha",
                    content: `🔗 ${urlInput}`,
                    timestamp: new Date().toLocaleString(),
                  },
                ],
              }
            : task
        ),
      }))
    );

    setUrlInput("");
    toast.success("URL shared!");
  };

  const startEditing = (taskId: string, field: string, currentValue: string) => {
    setEditingField({ taskId, field });
    setEditValue(currentValue);
  };

  const saveEdit = (taskId: string, field: string) => {
    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, [field]: editValue } : task
        ),
      }))
    );
    setEditingField(null);
    toast.success("Updated!");
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValue("");
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus as any } : task
        ),
      }))
    );
    toast.success("Status updated!");
  };

  const updateTaskAssignee = (taskId: string, assignee: string) => {
    setColumns(
      columns.map((column) => ({
        ...column,
        tasks: column.tasks.map((task) =>
          task.id === taskId ? { ...task, assignee } : task
        ),
      }))
    );
  };

  const toggleTaskSelection = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const toggleAllTasks = () => {
    const allTaskIds = columns.flatMap((col) => col.tasks.map((t) => t.id));
    if (selectedTasks.size === allTaskIds.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(allTaskIds));
    }
  };

  return (
    <div className="space-y-6">
      <TasksHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddTask={() => toast.info("Add Task feature coming soon!")}
      />

      <TasksFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* This Week View */}
      {viewMode === "week" && (
        <TaskBoardView
          columns={columns}
          isFullBoard={false}
          expandedTaskId={expandedTaskId}
          editingField={editingField}
          editValue={editValue}
          newComment={newComment}
          urlInput={urlInput}
          onTaskClick={handleTaskClick}
          onUpdateStatus={updateTaskStatus}
          onStartEditing={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditValueChange={setEditValue}
          onNewCommentChange={setNewComment}
          onUrlInputChange={setUrlInput}
          onAddComment={handleAddComment}
          onSendUrl={handleSendUrl}
        />
      )}

      {/* Full Board View */}
      {viewMode === "board" && (
        <TaskBoardView
          columns={columns}
          isFullBoard={true}
          expandedTaskId={expandedTaskId}
          editingField={editingField}
          editValue={editValue}
          newComment={newComment}
          urlInput={urlInput}
          onTaskClick={handleTaskClick}
          onUpdateStatus={updateTaskStatus}
          onStartEditing={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditValueChange={setEditValue}
          onNewCommentChange={setNewComment}
          onUrlInputChange={setUrlInput}
          onAddComment={handleAddComment}
          onSendUrl={handleSendUrl}
        />
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <TaskTableView
          columns={columns}
          selectedTasks={selectedTasks}
          editingField={editingField}
          editValue={editValue}
          onToggleAll={toggleAllTasks}
          onToggleTask={toggleTaskSelection}
          onStartEditing={startEditing}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
          onEditValueChange={setEditValue}
          onUpdateStatus={updateTaskStatus}
          onUpdateAssignee={updateTaskAssignee}
        />
      )}
    </div>
  );
}
