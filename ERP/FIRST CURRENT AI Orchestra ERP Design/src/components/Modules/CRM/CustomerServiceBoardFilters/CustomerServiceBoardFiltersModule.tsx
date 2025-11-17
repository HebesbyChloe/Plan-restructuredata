import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Badge } from "../../../ui/badge";
import { Label } from "../../../ui/label";
import { Separator } from "../../../ui/separator";
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
import { Calendar as CalendarComp } from "../../../ui/calendar";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CustomerServiceBoardFiltersProps } from "../../../../types/modules/crm";

/**
 * CustomerServiceBoardFiltersModule
 * 
 * Comprehensive filter component for Customer Service Board.
 * 
 * Features:
 * - Search functionality
 * - My/All tickets toggle
 * - 5 specialized filters: Status, Priority, Category, Assigned To, Satisfaction
 * - Date range picker with presets
 * - Expandable filter panel
 * - Active filter count badge
 */
export function CustomerServiceBoardFiltersModule({
  searchTerm,
  onSearchChange,
  ticketViewTab,
  onTicketViewTabChange,
  filterValues,
  onFilterChange,
  filterExpanded,
  onFilterExpandedChange,
  dateRange,
  onDateRangeChange,
  dateRangeLabel,
  onDateRangeLabelChange,
  dateRangeOpen,
  onDateRangeOpenChange,
  staffList = [],
}: CustomerServiceBoardFiltersProps) {
  // Date range preset handlers
  const handleDatePreset = (preset: "7days" | "thisMonth" | "lastMonth") => {
    const today = new Date();
    let from: Date;
    let to: Date = today;

    switch (preset) {
      case "7days":
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        onDateRangeLabelChange("Last 7 Days");
        break;
      case "thisMonth":
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        onDateRangeLabelChange("This Month");
        break;
      case "lastMonth":
        from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        to = new Date(today.getFullYear(), today.getMonth(), 0);
        onDateRangeLabelChange("Last Month");
        break;
    }

    onDateRangeChange({ from, to });
    onDateRangeOpenChange(false);
  };

  // Count active filters
  const activeFilterCount = [
    filterValues.statusFilter !== "All",
    filterValues.priorityFilter !== "All",
    filterValues.categoryFilter !== "All",
    filterValues.assignedFilter !== "All",
    filterValues.satisfactionFilter !== "All",
  ].filter(Boolean).length;

  // Clear all filters
  const handleClearAllFilters = () => {
    onFilterChange({
      statusFilter: "All",
      priorityFilter: "All",
      categoryFilter: "All",
      assignedFilter: "All",
      satisfactionFilter: "All",
    });
  };

  return (
    <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View Tabs - My Tickets / All Tickets */}
        <div className="inline-flex rounded-md border border-border bg-background p-1">
          <button
            onClick={() => onTicketViewTabChange("my")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              ticketViewTab === "my"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            My Tickets
          </button>
          <button
            onClick={() => onTicketViewTabChange("all")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              ticketViewTab === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            All Tickets
          </button>
        </div>

        {/* Filter Toggle Button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2 relative"
          onClick={() => onFilterExpandedChange(!filterExpanded)}
        >
          <Filter className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-primary text-xs">
              {activeFilterCount}
            </Badge>
          )}
          {filterExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>

        {/* Date Range Picker */}
        <Popover open={dateRangeOpen} onOpenChange={onDateRangeOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
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
                  onClick={() => {
                    onDateRangeChange({ from: undefined, to: undefined });
                    onDateRangeLabelChange("Date Range");
                    onDateRangeOpenChange(false);
                  }}
                >
                  Clear
                </Button>
              </div>

              {/* Calendar */}
              <div className="p-3">
                <CalendarComp
                  mode="range"
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range) {
                      onDateRangeChange(range as any);
                      if (range.from && range.to) {
                        onDateRangeLabelChange(
                          `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                        );
                        onDateRangeOpenChange(false);
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {/* Status Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Status</Label>
                <Select
                  value={filterValues.statusFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, statusFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Priority Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Priority</Label>
                <Select
                  value={filterValues.priorityFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, priorityFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Category</Label>
                <Select
                  value={filterValues.categoryFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, categoryFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Quality">Quality</SelectItem>
                    <SelectItem value="Shipping">Shipping</SelectItem>
                    <SelectItem value="Payment">Payment</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Custom Order">Custom Order</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Assigned To Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Assigned To</Label>
                <Select
                  value={filterValues.assignedFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, assignedFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Staff</SelectItem>
                    {staffList.map((staff) => (
                      <SelectItem key={staff} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Satisfaction Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Satisfaction</Label>
                <Select
                  value={filterValues.satisfactionFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, satisfactionFilter: value })
                  }
                >
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
            </div>

            {/* Clear All Filters Button */}
            {activeFilterCount > 0 && (
              <div className="mt-3 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearAllFilters}
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
