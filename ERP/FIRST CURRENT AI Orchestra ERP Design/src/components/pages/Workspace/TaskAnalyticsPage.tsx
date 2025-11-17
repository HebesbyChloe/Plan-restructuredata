"use client";

import { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  Clock,
  Users,
  Calendar,
  Target,
  Download,
  Zap,
  X,
} from "lucide-react";
import { Progress } from "../../ui/progress";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { motion } from "motion/react";

export function TaskAnalyticsPage() {
  const [showComingSoon, setShowComingSoon] = useState(true);
  // Sample data
  const completionData = [
    { name: "Week 1", completed: 12, total: 15 },
    { name: "Week 2", completed: 18, total: 20 },
    { name: "Week 3", completed: 15, total: 18 },
    { name: "Week 4", completed: 22, total: 25 },
  ];

  const projectData = [
    { name: "Halloween Campaign", tasks: 24, completed: 18, pending: 6 },
    { name: "October Collection", tasks: 18, completed: 11, pending: 7 },
    { name: "Website Redesign", tasks: 56, completed: 25, pending: 31 },
    { name: "November Planning", tasks: 12, completed: 2, pending: 10 },
    { name: "Q4 Sales Push", tasks: 28, completed: 3, pending: 25 },
  ];

  const statusDistribution = [
    { name: "Todo", value: 48, color: "#94A3B8" },
    { name: "Processing", value: 32, color: "#10B981" },
    { name: "Done", value: 67, color: "#4B6BFB" },
    { name: "Early", value: 15, color: "#F59E0B" },
  ];

  const teamPerformance = [
    { name: "Vy Ha", completed: 45, pending: 12, avgTime: "2.5h" },
    { name: "Nam Lam", completed: 38, pending: 8, avgTime: "3.2h" },
    { name: "Hang Tran", completed: 32, pending: 6, avgTime: "2.8h" },
    { name: "Mai Nguyen", completed: 28, pending: 10, avgTime: "3.5h" },
    { name: "Minh Tran", completed: 25, pending: 7, avgTime: "3.0h" },
  ];

  const productivityTrend = [
    { month: "Jun", efficiency: 75 },
    { month: "Jul", efficiency: 78 },
    { month: "Aug", efficiency: 82 },
    { month: "Sep", efficiency: 85 },
    { month: "Oct", efficiency: 88 },
  ];

  return (
    <div className="relative space-y-6">
      {/* Coming Soon Overlay */}
      {showComingSoon && (
        <div 
          className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md flex items-center justify-center cursor-pointer"
          onClick={() => setShowComingSoon(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-4 -right-4 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
              onClick={() => setShowComingSoon(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4B6BFB] via-purple-500 to-cyan-400 flex items-center justify-center shadow-2xl">
                <Zap className="w-12 h-12 text-white" />
              </div>
            </motion.div>
            
            <motion.h2 
              className="mb-3 bg-gradient-to-r from-[#4B6BFB] via-purple-500 to-cyan-400 bg-clip-text text-transparent"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Coming Soon
            </motion.h2>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Advanced AI-powered task analytics are being crafted for an extraordinary insights experience
            </p>
            
            <Button
              onClick={() => setShowComingSoon(false)}
              className="bg-gradient-to-r from-[#4B6BFB] to-[#6B8AFF] hover:opacity-90 transition-opacity"
            >
              Close & Start Working
            </Button>
          </motion.div>
        </div>
      )}
      
      {/* Header */}
      <div className={`flex items-center justify-between ${showComingSoon ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center shadow-lg">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Task Analytics</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Insights and performance metrics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Select defaultValue="last-30">
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="this-year">This year</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 border-[#E5E5E5]">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${showComingSoon ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <CheckSquare className="w-6 h-6 text-[#4B6BFB]" />
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <h2 className="mb-1">162</h2>
          <p className="text-xs text-muted-foreground mb-0">
            67 completed this month
          </p>
        </Card>

        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+8%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Completion Rate</p>
          <h2 className="mb-1">88%</h2>
          <div className="mt-2">
            <Progress value={88} className="h-2" />
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingDown className="w-4 h-4" />
              <span>-15%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Avg. Completion Time</p>
          <h2 className="mb-1">2.8h</h2>
          <p className="text-xs text-muted-foreground mb-0">
            15% faster than last month
          </p>
        </Card>

        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+5%</span>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">Team Productivity</p>
          <h2 className="mb-1">92%</h2>
          <div className="mt-2">
            <Progress value={92} className="h-2" />
          </div>
        </Card>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${showComingSoon ? 'blur-sm pointer-events-none select-none' : ''}`}>
        {/* Task Completion Trend */}
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Task Completion Trend</h3>
              <p className="text-sm text-muted-foreground mb-0">
                Weekly completion vs total tasks
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={completionData}>
              <defs>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4B6BFB" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4B6BFB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94A3B8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#94A3B8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="name" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#94A3B8"
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#4B6BFB"
                fillOpacity={1}
                fill="url(#colorCompleted)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Status Distribution */}
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Task Status Distribution</h3>
              <p className="text-sm text-muted-foreground mb-0">
                Current task status breakdown
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Project Progress */}
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Project Progress</h3>
              <p className="text-sm text-muted-foreground mb-0">
                Tasks by project
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={projectData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis type="number" stroke="#94A3B8" />
              <YAxis dataKey="name" type="category" stroke="#94A3B8" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" stackId="a" fill="#4B6BFB" />
              <Bar dataKey="pending" stackId="a" fill="#E5E5E5" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Productivity Trend */}
        <Card className="p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="mb-1">Productivity Trend</h3>
              <p className="text-sm text-muted-foreground mb-0">
                Monthly efficiency score
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productivityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
              <XAxis dataKey="month" stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="efficiency"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: "#10B981", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Performance */}
      <Card className={`p-6 bg-white dark:bg-card border-[#E5E5E5] dark:border-border ${showComingSoon ? 'blur-sm pointer-events-none select-none' : ''}`}>
        <h3 className="mb-4">Team Performance</h3>
        <div className="space-y-4">
          {teamPerformance.map((member, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#4B6BFB] to-[#6B8AFF] flex items-center justify-center text-white">
                    {member.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="mb-0">{member.name}</p>
                    <p className="text-xs text-muted-foreground mb-0">
                      Avg. time: {member.avgTime}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm mb-0">
                      <span className="text-green-600">{member.completed}</span>{" "}
                      completed
                    </p>
                    <p className="text-xs text-muted-foreground mb-0">
                      {member.pending} pending
                    </p>
                  </div>
                  <div className="w-32">
                    <Progress
                      value={(member.completed / (member.completed + member.pending)) * 100}
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
