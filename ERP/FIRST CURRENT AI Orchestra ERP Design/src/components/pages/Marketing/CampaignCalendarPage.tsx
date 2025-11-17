"use client";

import { Card } from "../../ui/card";
import { Calendar, ChevronLeft, ChevronRight, Plus, Filter, Clock } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Badge } from "../../ui/badge";
import { useState, useEffect } from "react";
import { AINotificationCard } from "../../Modules/Global/AINotificationCard";
import { toast } from "sonner";
import { getAllCampaignActivities } from "../../../lib/supabase/marketing/campaign-data";
import { getCampaigns } from "../../../lib/supabase/marketing/campaigns";
import { useTenantContext } from "../../../contexts/TenantContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../../ui/dropdown-menu";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Activity {
  id: string;
  title: string;
  type: "email" | "social" | "paid-ads" | "content" | "event" | "launch";
  status: "scheduled" | "active" | "completed" | "cancelled";
  date: Date;
  startTime: string; // e.g., "13:00" for 1pm
  endTime: string; // e.g., "14:00" for 2pm
  duration: number; // days
  budget?: string;
  reach?: string;
  campaignId: string;
}

interface Campaign {
  id: string;
  name: string;
  color: string;
}

const activityTypeColors = {
  email: "#4B6BFB",
  social: "#EC4899",
  "paid-ads": "#F59E0B",
  content: "#10B981",
  event: "#8B5CF6",
  launch: "#EF4444",
};

const activityTypeLabels = {
  email: "Email Marketing",
  social: "Social Media",
  "paid-ads": "Paid Advertising",
  content: "Content Marketing",
  event: "Events",
  launch: "Product Launch",
};

// Format time from 24h to 12h format
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "pm" : "am";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}${ampm}`;
};

// Draggable Activity Component
function DraggableActivity({
  activity,
  campaign,
  onDragStart,
}: {
  activity: Activity;
  campaign: Campaign | undefined;
  onDragStart?: () => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "activity",
    item: activity,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className={`p-1 sm:p-1.5 rounded text-[10px] sm:text-xs truncate cursor-move transition-opacity ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{
        backgroundColor: `${campaign?.color || activityTypeColors[activity.type]}20`,
        borderLeft: `2px solid ${campaign?.color || activityTypeColors[activity.type]}`,
      }}
      title={`${campaign?.name}: ${activity.title} (${formatTime(activity.startTime)} - ${formatTime(activity.endTime)})`}
    >
      <div className="flex items-center gap-0.5 sm:gap-1">
        <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 opacity-60" />
        <span className="opacity-80">{formatTime(activity.startTime)}</span>
      </div>
      <div className="truncate">{activity.title}</div>
    </div>
  );
}

// Droppable Calendar Cell
function DroppableCalendarCell({
  day,
  isToday,
  activities,
  campaigns,
  onDrop,
}: {
  day: number;
  isToday: boolean;
  activities: Activity[];
  campaigns: Campaign[];
  onDrop: (activity: Activity, newDate: Date) => void;
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "activity",
    drop: (item: Activity) => {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      onDrop(item, newDate);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <motion.div
      ref={drop}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`p-1 sm:p-2 min-h-[80px] sm:min-h-[120px] rounded-lg border transition-all hover:shadow-lg cursor-pointer ${
        isToday
          ? "bg-[#4B6BFB]/10 border-[#4B6BFB]"
          : isOver
          ? "bg-[#4B6BFB]/5 border-[#4B6BFB] ring-2 ring-[#4B6BFB]/30"
          : "bg-accent/10 border-glass-border hover:border-[#4B6BFB]/30"
      }`}
    >
      <div
        className={`mb-1 sm:mb-2 text-sm sm:text-base font-medium ${
          isToday ? "text-[#4B6BFB]" : "opacity-60"
        }`}
      >
        {day}
      </div>
      <div className="space-y-0.5 sm:space-y-1">
        {activities.slice(0, 2).map((activity) => {
          const activityCampaign = campaigns.find((c) => c.id === activity.campaignId);
          return (
            <DraggableActivity
              key={activity.id}
              activity={activity}
              campaign={activityCampaign}
            />
          );
        })}
        {activities.length > 2 && (
          <div className="text-[10px] sm:text-xs opacity-60 pl-0.5 sm:pl-1">
            +{activities.length - 2} more
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function CampaignCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [filterCampaign, setFilterCampaign] = useState<string | null>(null);
  const [filterActivityType, setFilterActivityType] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"month" | "list">("month");

  // Data states
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get tenant from context
  const { currentTenantId } = useTenantContext();

  // Load data from Supabase
  useEffect(() => {
    if (!currentTenantId) return;
    
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Load campaigns
        const { data: campaignsData, error: campaignsError } = await getCampaigns(currentTenantId);
        if (campaignsError) {
          console.error('Error loading campaigns:', campaignsError);
          toast.error('Failed to load campaigns');
        } else {
          // Map campaigns to calendar format
          const campaignColors: Record<string, string> = {
            email: "#4B6BFB",
            social: "#EC4899",
            "paid-ads": "#F59E0B",
            content: "#10B981",
            event: "#8B5CF6",
            launch: "#EF4444",
          };
          
          const mappedCampaigns: Campaign[] = (campaignsData || []).map((campaign) => ({
            id: String(campaign.id),
            name: campaign.name,
            color: campaignColors[campaign.type] || "#4B6BFB",
          }));
          setCampaigns(mappedCampaigns);
        }

        // Load activities for current month
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const { data: activitiesData, error: activitiesError } = await getAllCampaignActivities(
          currentTenantId,
          startOfMonth,
          endOfMonth
        );
        
        if (activitiesError) {
          console.error('Error loading activities:', activitiesError);
          toast.error('Failed to load activities');
        } else {
          setActivities(activitiesData || []);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        toast.error(`Failed to load calendar data: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentTenantId, currentDate]);

  const handleActivityDrop = (activity: Activity, newDate: Date) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activity.id
          ? { ...a, date: newDate }
          : a
      )
    );
    toast.success(`Moved "${activity.title}" to ${newDate.toLocaleDateString()}`);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getActivitiesForDate = (day: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return getFilteredActivities().filter((activity) => {
      const activityStart = new Date(activity.date);
      const activityEnd = new Date(activity.date);
      activityEnd.setDate(activityEnd.getDate() + activity.duration - 1);

      return (
        targetDate >= new Date(activityStart.toDateString()) &&
        targetDate <= new Date(activityEnd.toDateString())
      );
    }).sort((a, b) => a.startTime.localeCompare(b.startTime)); // Sort by time
  };

  const getFilteredActivities = () => {
    let filtered = activities;
    
    // Filter by campaign
    if (filterCampaign) {
      filtered = filtered.filter((a) => a.campaignId === filterCampaign);
    }
    
    // Filter by activity type
    if (filterActivityType) {
      filtered = filtered.filter((a) => a.type === filterActivityType);
    }
    
    return filtered;
  };

  const filteredActivities = getFilteredActivities();

  const activeActivities = activities.filter((a) => a.status === "active").length;
  const scheduledActivities = activities.filter((a) => a.status === "scheduled").length;
  const totalBudget = activities
    .filter((a) => a.budget)
    .reduce((sum, a) => sum + parseFloat(a.budget!.replace(/[$,]/g, "")), 0);

  const selectedCampaign = campaigns.find((c) => c.id === filterCampaign);
  const hasActiveFilters = filterCampaign || filterActivityType;

  // Show loading state
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4B6BFB] mx-auto mb-4"></div>
          <p className="opacity-60">Loading calendar...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading calendar: {error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl mb-1 sm:mb-2">Campaign Calendar</h1>
              <p className="text-sm sm:text-base opacity-60">Plan, schedule, and track all your marketing campaigns</p>
            </div>
            <Button className="gap-2 bg-[#4B6BFB] hover:bg-[#3A5BEB] w-full sm:w-auto">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Campaign</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </motion.div>

        {/* AI Insights Banner */}
        <div className="mb-8">
          <AINotificationCard
            message={<><span className="opacity-100">AI Scheduling Insight:</span> Your Spring Campaign activities are optimally scheduled. Consider adding social media posts on Oct 18-19 for maximum engagement during peak hours.</>}
            actionLabel="Schedule →"
            onAction={() => toast.success("Opening schedule optimization...")}
            animated={true}
          />
        </div>

        {/* Calendar Controls */}
        <Card className="p-4 sm:p-6 border-glass-border bg-glass-bg/30 backdrop-blur-sm mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h3 className="min-w-[150px] sm:min-w-[200px] text-center text-base sm:text-lg">{monthName}</h3>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
                className="gap-2 w-full sm:w-auto"
              >
                <Calendar className="w-4 h-4" />
                Today
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 p-1 rounded-lg bg-accent/50">
                <Button
                  variant={viewMode === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("month")}
                  className={viewMode === "month" ? "bg-[#4B6BFB] hover:bg-[#3A5BEB]" : ""}
                >
                  Month
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-[#4B6BFB] hover:bg-[#3A5BEB]" : ""}
                >
                  List
                </Button>
              </div>

              {/* Campaign Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="gap-2"
                    style={
                      selectedCampaign
                        ? {
                            backgroundColor: `${selectedCampaign.color}20`,
                            borderColor: selectedCampaign.color,
                          }
                        : {}
                    }
                  >
                    <Filter className="w-4 h-4" />
                    {selectedCampaign ? selectedCampaign.name : "All Campaigns"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterCampaign(null)}>
                    All Campaigns
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {campaigns.map((campaign) => (
                    <DropdownMenuItem key={campaign.id} onClick={() => setFilterCampaign(campaign.id)}>
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: campaign.color }}
                      />
                      {campaign.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Activity Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="w-4 h-4" />
                    {filterActivityType
                      ? activityTypeLabels[filterActivityType as keyof typeof activityTypeLabels]
                      : "All Channels"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setFilterActivityType(null)}>
                    All Channels
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {Object.entries(activityTypeLabels).map(([key, label]) => (
                    <DropdownMenuItem key={key} onClick={() => setFilterActivityType(key)}>
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: activityTypeColors[key as keyof typeof activityTypeColors] }}
                      />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {viewMode === "month" ? (
            <>
              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {/* Day Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-1 sm:p-2 text-center opacity-60 text-xs sm:text-sm">
                    <span className="hidden sm:inline">{day}</span>
                    <span className="sm:hidden">{day.substring(0, 1)}</span>
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDay }).map((_, index) => (
                  <div key={`empty-${index}`} className="p-2 min-h-[120px] rounded-lg bg-accent/20" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayActivities = getActivitiesForDate(day);
                  const isToday =
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <DroppableCalendarCell
                      key={day}
                      day={day}
                      isToday={isToday}
                      activities={dayActivities}
                      campaigns={campaigns}
                      onDrop={handleActivityDrop}
                    />
                  );
                })}
              </div>
            </>
          ) : (
            /* List View */
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => {
                const activityCampaign = campaigns.find((c) => c.id === activity.campaignId);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-3 sm:p-4 border-glass-border bg-glass-bg/30 backdrop-blur-sm hover:shadow-lg transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1">
                          <div
                            className="w-1 h-12 sm:h-16 rounded-full flex-shrink-0"
                            style={{ backgroundColor: activityCampaign?.color || activityTypeColors[activity.type] }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                              <h4 className="text-sm sm:text-base truncate">{activity.title}</h4>
                              <Badge
                                variant={
                                  activity.status === "active"
                                    ? "default"
                                    : activity.status === "completed"
                                    ? "secondary"
                                    : "outline"
                                }
                                className={
                                  activity.status === "active"
                                    ? "bg-green-500/20 text-green-500 border-green-500/30"
                                    : activity.status === "scheduled"
                                    ? "bg-[#4B6BFB]/20 text-[#4B6BFB] border-[#4B6BFB]/30"
                                    : ""
                                }
                              >
                                {activity.status}
                              </Badge>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 opacity-60 text-xs sm:text-sm">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(activity.startTime)} - {formatTime(activity.endTime)}</span>
                              </div>
                              <span className="hidden sm:inline">•</span>
                              <span className="truncate">{activityCampaign?.name}</span>
                              <span className="hidden sm:inline">•</span>
                              <span className="hidden md:inline">{activityTypeLabels[activity.type]}</span>
                              <span className="hidden sm:inline">•</span>
                              <span>{activity.date.toLocaleDateString()}</span>
                              <span>•</span>
                              <span>{activity.duration} days</span>
                              {activity.reach && (
                                <>
                                  <span>•</span>
                                  <span>Reach: {activity.reach}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        {activity.budget && (
                          <div className="text-right">
                            <div className="opacity-60 mb-1">Budget</div>
                            <div>{activity.budget}</div>
                          </div>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </DndProvider>
  );
}
