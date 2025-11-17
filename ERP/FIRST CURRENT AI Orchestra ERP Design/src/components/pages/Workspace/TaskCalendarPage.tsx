"use client";

import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Users,
  Briefcase,
  Filter,
} from "lucide-react";
import { motion } from "motion/react";

interface CalendarTask {
  id: string;
  title: string;
  date: Date;
  assignee: string;
  project: string;
  status: "Todo" | "Processing" | "Done";
  color: string;
}

export function TaskCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9, 1)); // October 2024
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "week">("month");

  const tasks: CalendarTask[] = [
    { id: "1", title: "Pre-Launch Halloween Meeting", date: new Date(2024, 9, 13), assignee: "Vy Ha", project: "Halloween Campaign", status: "Todo", color: "#F59E0B" },
    { id: "2", title: "Campaign Report", date: new Date(2024, 9, 13), assignee: "Vy Ha", project: "Mid-Autumn", status: "Todo", color: "#10B981" },
    { id: "3", title: "Generate Concept Images", date: new Date(2024, 9, 15), assignee: "Vy Ha", project: "October Collection", status: "Processing", color: "#8B5CF6" },
    { id: "4", title: "Social Media Posts", date: new Date(2024, 9, 14), assignee: "Nam Lam", project: "Halloween Campaign", status: "Processing", color: "#F59E0B" },
    { id: "5", title: "Email Template Design", date: new Date(2024, 9, 10), assignee: "Hang Tran", project: "Halloween Campaign", status: "Done", color: "#F59E0B" },
    { id: "6", title: "Product Photography", date: new Date(2024, 9, 16), assignee: "Minh Tran", project: "October Collection", status: "Processing", color: "#8B5CF6" },
    { id: "7", title: "Website Redesign Review", date: new Date(2024, 9, 18), assignee: "Nam Lam", project: "Website Redesign", status: "Todo", color: "#EC4899" },
    { id: "8", title: "Q4 Strategy Meeting", date: new Date(2024, 9, 20), assignee: "Mai Nguyen", project: "Q4 Sales Push", status: "Todo", color: "#EF4444" },
    { id: "9", title: "Collection Launch Event", date: new Date(2024, 9, 25), assignee: "Thao Le", project: "October Collection", status: "Todo", color: "#8B5CF6" },
    { id: "10", title: "November Planning", date: new Date(2024, 9, 28), assignee: "Vy Ha", project: "November Planning", status: "Todo", color: "#4B6BFB" },
    { id: "11", title: "Theme Research", date: new Date(2024, 9, 30), assignee: "Vy Ha", project: "November Planning", status: "Todo", color: "#4B6BFB" },
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getTasksForDate = (date: Date) => {
    return tasks.filter(
      (task) =>
        task.date.getDate() === date.getDate() &&
        task.date.getMonth() === date.getMonth() &&
        task.date.getFullYear() === date.getFullYear()
    );
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Todo":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
      case "Processing":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Done":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Task Calendar</h1>
            <p className="text-sm text-muted-foreground mb-0">
              View and manage tasks by date
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button className="gap-2 bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:from-[#3B5BEB] to-[#5B7AEF] text-white">
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all-projects">
            <SelectTrigger className="w-[180px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-projects">All Projects</SelectItem>
              <SelectItem value="halloween">Halloween Campaign</SelectItem>
              <SelectItem value="october">October Collection</SelectItem>
              <SelectItem value="november">November Planning</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-assignees">
            <SelectTrigger className="w-[180px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Assignee" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-assignees">All Assignees</SelectItem>
              <SelectItem value="vyha">Vy Ha</SelectItem>
              <SelectItem value="namlam">Nam Lam</SelectItem>
              <SelectItem value="hangtran">Hang Tran</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="all-status">
            <SelectTrigger className="w-[180px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="todo">Todo</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="done">Done</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-2 border-[#E5E5E5] ml-auto">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Calendar Card */}
      <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="mb-0">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={previousMonth}
              className="h-8 w-8 p-0 border-[#E5E5E5]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
              className="h-8 px-3 border-[#E5E5E5]"
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={nextMonth}
              className="h-8 w-8 p-0 border-[#E5E5E5]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {/* Days of Week Header */}
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="text-center py-2 text-sm text-muted-foreground"
            >
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
            <div key={`empty-${index}`} className="min-h-[120px]" />
          ))}

          {/* Calendar Days */}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            const date = new Date(
              currentDate.getFullYear(),
              currentDate.getMonth(),
              day
            );
            const dayTasks = getTasksForDate(date);
            const today = isToday(date);

            return (
              <motion.div
                key={day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.01 }}
                className={`min-h-[120px] p-2 border rounded-lg transition-all cursor-pointer ${
                  today
                    ? "border-[#4B6BFB] bg-blue-50 dark:bg-blue-900/10"
                    : "border-[#E5E5E5] dark:border-border hover:border-[#4B6BFB] hover:bg-accent/50"
                }`}
                onClick={() => setSelectedDate(date)}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-sm mb-2 ${
                    today
                      ? "bg-[#4B6BFB] text-white"
                      : "text-foreground"
                  }`}
                >
                  {day}
                </div>

                <div className="space-y-1">
                  {dayTasks.slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="px-2 py-1 rounded text-xs truncate"
                      style={{ backgroundColor: `${task.color}20`, color: task.color }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-muted-foreground px-2">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
        <h3 className="mb-4">Upcoming Tasks</h3>
        <div className="space-y-3">
          {tasks
            .filter((task) => task.date >= new Date())
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 5)
            .map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-[#F8F8F8] dark:bg-muted/30 hover:bg-white dark:hover:bg-card transition-all"
              >
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: task.color }}
                />
                <div className="flex-1">
                  <p className="mb-1">{task.title}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3 h-3" />
                      {task.date.toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {task.assignee}
                    </span>
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3 h-3" />
                      {task.project}
                    </span>
                  </div>
                </div>
                <Badge className={getStatusColor(task.status)} variant="outline">
                  {task.status}
                </Badge>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}
