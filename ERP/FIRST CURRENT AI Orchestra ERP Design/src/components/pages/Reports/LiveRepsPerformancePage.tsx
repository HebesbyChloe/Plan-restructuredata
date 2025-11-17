"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { 
  Radio, 
  Users, 
  Clock,
  RefreshCw,
  Filter,
  Sun,
  Sunset,
  Moon,
  UserPlus,
  MessageSquare,
  DollarSign
} from "lucide-react";
import { EmployeePerformanceCard } from "../../Modules/Reports/EmployeePerformanceCard";
import {
  liveEmployeePerformance,
  sortByRecentActivity,
  getCurrentShift,
  SHIFT_TIMES,
  type EmployeeShift,
} from "../../../sampledata/computed";

export function LiveRepsPerformancePage() {
  const [employees, setEmployees] = useState<EmployeeShift[]>([]);
  const [shiftFilter, setShiftFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load and sort employees
  useEffect(() => {
    loadEmployees();
  }, [shiftFilter, statusFilter]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      loadEmployees();
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, shiftFilter, statusFilter]);

  const loadEmployees = () => {
    let filtered = [...liveEmployeePerformance];

    // Filter by shift
    if (shiftFilter !== "all") {
      filtered = filtered.filter((emp) => emp.shift === shiftFilter);
    }

    // Filter by status
    if (statusFilter === "on-shift") {
      filtered = filtered.filter((emp) => emp.isOnShift);
    } else if (statusFilter === "off-shift") {
      filtered = filtered.filter((emp) => !emp.isOnShift);
    }

    // Sort by recent activity
    filtered = sortByRecentActivity(filtered);
    setEmployees(filtered);
  };

  const handleRefresh = () => {
    loadEmployees();
    setLastUpdate(new Date());
  };

  const currentShift = getCurrentShift();
  const onShiftCount = liveEmployeePerformance.filter((emp) => emp.isOnShift).length;
  const totalRevenue = employees.reduce((sum, emp) => sum + emp.todayRevenue, 0);
  const totalNewLeads = employees.reduce((sum, emp) => sum + emp.newLeads, 0);
  const totalMessages = employees.reduce((sum, emp) => sum + emp.totalMessages, 0);

  const getShiftIcon = (shift: string) => {
    switch (shift) {
      case "morning":
        return <Sun className="w-4 h-4" />;
      case "afternoon":
        return <Sunset className="w-4 h-4" />;
      case "night":
        return <Moon className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {/* Total Revenue */}
        <Card className="p-4 bg-gradient-to-br from-ai-blue/10 to-purple-500/10 backdrop-blur-sm border-ai-blue/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Revenue Today</p>
              <p className="text-2xl font-semibold text-ai-blue mb-0">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-ai-blue/20 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-ai-blue" />
            </div>
          </div>
        </Card>

        {/* On Shift */}
        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Currently On Shift</p>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400 mb-0">
                {onShiftCount} / {liveEmployeePerformance.length}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        {/* Total New Leads */}
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm border-amber-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total New Leads</p>
              <p className="text-2xl font-semibold text-amber-600 dark:text-amber-400 mb-0">
                {totalNewLeads}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        {/* Total Messages */}
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-sm border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Messages</p>
              <p className="text-2xl font-semibold text-purple-600 dark:text-purple-400 mb-0">
                {totalMessages}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Filters & Controls */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-4 backdrop-blur-sm bg-glass-bg border-glass-border">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 opacity-60" />
              
              {/* Shift Filter */}
              <Select value={shiftFilter} onValueChange={setShiftFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Shifts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Shifts</SelectItem>
                  <SelectItem value="morning">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4" />
                      Morning
                    </div>
                  </SelectItem>
                  <SelectItem value="afternoon">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-4 h-4" />
                      Afternoon
                    </div>
                  </SelectItem>
                  <SelectItem value="night">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Night
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Employees</SelectItem>
                  <SelectItem value="on-shift">On Shift</SelectItem>
                  <SelectItem value="off-shift">Off Shift</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShiftFilter("all");
                  setStatusFilter("all");
                }}
              >
                Clear
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {/* Auto Refresh Toggle */}
              <div className="flex items-center gap-2">
                <Badge variant={autoRefresh ? "default" : "outline"} className="text-xs">
                  {autoRefresh ? "Auto-refresh: ON" : "Auto-refresh: OFF"}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  Toggle
                </Button>
              </div>

              {/* Manual Refresh */}
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>

              {/* Last Update */}
              <span className="text-xs text-muted-foreground">
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Employee Cards Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {employees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {employees.map((employee, index) => (
              <EmployeePerformanceCard
                key={employee.employeeId}
                employee={employee}
                index={index}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-card/50 backdrop-blur-sm">
            <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg mb-2">No employees found</p>
            <p className="text-sm text-muted-foreground mb-0">
              Try adjusting your filters to see more results
            </p>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
