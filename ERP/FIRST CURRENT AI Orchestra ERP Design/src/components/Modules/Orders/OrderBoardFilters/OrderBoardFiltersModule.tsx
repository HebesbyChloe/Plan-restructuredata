/**
 * OrderBoardFilters Module
 * 
 * Complete filter system for Order Board including:
 * - Search bar
 * - View tabs (My Orders / All Orders)
 * - Multiple filter dropdowns
 * - Date range picker with presets
 * - Expandable filter section
 */

import { useState } from "react";
import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Label } from "../../../ui/label";
import { Separator } from "../../../ui/separator";
import { Calendar } from "../../../ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../../ui/popover";
import {
  Search,
  Filter,
  CalendarIcon,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface FilterValues {
  shift: string;
  status: string;
  store: string;
  csat: string;
  approveRft: string;
  staff: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface OrderBoardFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  viewTab: "my" | "all";
  onViewTabChange: (tab: "my" | "all") => void;
  filters: FilterValues;
  onFilterChange: (key: keyof FilterValues, value: string) => void;
  onClearFilters: () => void;
  activeFilterCount: number;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  dateRangeLabel: string;
  onDatePreset: (preset: "7days" | "thisMonth" | "lastMonth") => void;
  onDateRangeClear: () => void;
  staffOptions: string[];
}

export function OrderBoardFiltersModule({
  searchTerm,
  onSearchChange,
  viewTab,
  onViewTabChange,
  filters,
  onFilterChange,
  onClearFilters,
  activeFilterCount,
  dateRange,
  onDateRangeChange,
  dateRangeLabel,
  onDatePreset,
  onDateRangeClear,
  staffOptions,
}: OrderBoardFiltersProps) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [dateRangeOpen, setDateRangeOpen] = useState(false);

  const handleDatePreset = (preset: "7days" | "thisMonth" | "lastMonth") => {
    onDatePreset(preset);
    setDateRangeOpen(false);
  };

  const handleDateRangeClear = () => {
    onDateRangeClear();
    setDateRangeOpen(false);
  };

  return (
    <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View Tabs - My Orders / All Orders */}
        <div className="inline-flex rounded-md border border-border bg-background p-1">
          <button
            onClick={() => onViewTabChange("my")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              viewTab === "my"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            My Orders
          </button>
          <button
            onClick={() => onViewTabChange("all")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              viewTab === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            All Orders
          </button>
        </div>

        {/* Filter Toggle Button */}
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2 relative"
          onClick={() => setFilterExpanded(!filterExpanded)}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-xs">
              {activeFilterCount}
            </Badge>
          )}
          {filterExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>

        {/* Date Range Picker */}
        <Popover open={dateRangeOpen} onOpenChange={setDateRangeOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <CalendarIcon className="w-4 h-4" />
              {dateRangeLabel}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex">
              {/* Presets */}
              <div className="border-r border-border p-3 space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => handleDatePreset("7days")}
                >
                  Last 7 Days
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => handleDatePreset("thisMonth")}
                >
                  This Month
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => handleDatePreset("lastMonth")}
                >
                  Last Month
                </Button>
                <Separator className="my-2" />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={handleDateRangeClear}
                >
                  Clear
                </Button>
              </div>
              
              {/* Calendar */}
              <div className="p-3">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) {
                      onDateRangeChange(range as any);
                      if (range.from && range.to) {
                        setDateRangeOpen(false);
                      }
                    }
                  }}
                  numberOfMonths={2}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Expandable Filter Section */}
      <AnimatePresence>
        {filterExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Separator className="my-3" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {/* Shift Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Shift</Label>
                <Select value={filters.shift} onValueChange={(value) => onFilterChange("shift", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Morning">Morning</SelectItem>
                    <SelectItem value="Afternoon">Afternoon</SelectItem>
                    <SelectItem value="Evening">Evening</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Status</Label>
                <Select value={filters.status} onValueChange={(value) => onFilterChange("status", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Store Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Store</Label>
                <Select value={filters.store} onValueChange={(value) => onFilterChange("store", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Hebes">Hebes</SelectItem>
                    <SelectItem value="Ritamie">Ritamie</SelectItem>
                    <SelectItem value="Livestream">Livestream</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CSAT Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">CSAT</Label>
                <Select value={filters.csat} onValueChange={(value) => onFilterChange("csat", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Approve Rft Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Approve Rft</Label>
                <Select value={filters.approveRft} onValueChange={(value) => onFilterChange("approveRft", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Staff</Label>
                <Select value={filters.staff} onValueChange={(value) => onFilterChange("staff", value)}>
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {staffOptions.map((rep) => (
                      <SelectItem key={rep} value={rep}>
                        {rep}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear All Filters Button */}
            {activeFilterCount > 0 && (
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
