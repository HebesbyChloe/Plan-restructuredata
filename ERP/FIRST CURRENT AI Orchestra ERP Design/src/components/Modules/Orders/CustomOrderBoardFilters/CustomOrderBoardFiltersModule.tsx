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
import { Calendar } from "../../../ui/calendar";
import {
  Search,
  Filter,
  ChevronUp,
  ChevronDown,
  Calendar as CalendarIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Types
interface CustomOrderFilterValues {
  rankFilter: string;
  statusFilter: string;
  storeFilter: string;
  staffFilter: string;
  paymentFilter: string;
  designFilter: string;
  materialFilter: string;
  completionFilter: string;
}

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface CustomOrderBoardFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  orderViewTab: "my" | "all";
  onOrderViewTabChange: (value: "my" | "all") => void;
  filterValues: CustomOrderFilterValues;
  onFilterChange: (values: CustomOrderFilterValues) => void;
  filterExpanded: boolean;
  onFilterExpandedChange: (expanded: boolean) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
  dateRangeLabel: string;
  onDateRangeLabelChange: (label: string) => void;
  staffList?: string[];
}

/**
 * CustomOrderBoardFiltersModule
 * 
 * Comprehensive filter component for Custom Order Board.
 * 
 * Features:
 * - Search functionality
 * - My/All custom orders toggle
 * - 8 specialized filters: Rank, Status, Store, Staff, Payment, Design, Material, Completion
 * - Date range picker with presets
 * - Expandable filter panel
 * - Active filter count badge
 */
export function CustomOrderBoardFiltersModule({
  searchTerm,
  onSearchChange,
  orderViewTab,
  onOrderViewTabChange,
  filterValues,
  onFilterChange,
  filterExpanded,
  onFilterExpandedChange,
  dateRange,
  onDateRangeChange,
  dateRangeLabel,
  onDateRangeLabelChange,
  staffList = [],
}: CustomOrderBoardFiltersProps) {
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
  };

  // Count active filters
  const activeFilterCount = [
    filterValues.rankFilter !== "All",
    filterValues.statusFilter !== "All",
    filterValues.storeFilter !== "All",
    filterValues.staffFilter !== "All",
    filterValues.paymentFilter !== "All",
    filterValues.designFilter !== "All",
    filterValues.materialFilter !== "All",
    filterValues.completionFilter !== "All",
  ].filter(Boolean).length;

  // Clear all filters
  const handleClearAllFilters = () => {
    onFilterChange({
      rankFilter: "All",
      statusFilter: "All",
      storeFilter: "All",
      staffFilter: "All",
      paymentFilter: "All",
      designFilter: "All",
      materialFilter: "All",
      completionFilter: "All",
    });
  };

  return (
    <Card className="p-3 sm:p-4 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search custom orders..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* View Tabs - My Orders / All Orders */}
        <div className="inline-flex rounded-md border border-border bg-background p-1">
          <button
            onClick={() => onOrderViewTabChange("my")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              orderViewTab === "my"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            My Custom Orders
          </button>
          <button
            onClick={() => onOrderViewTabChange("all")}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              orderViewTab === "all"
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
            }`}
          >
            All Custom Orders
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
        <Popover>
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
                  onClick={() => {
                    onDateRangeChange({ from: undefined, to: undefined });
                    onDateRangeLabelChange("Date Range");
                  }}
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
                        onDateRangeLabelChange(
                          `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                        );
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
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {/* Rank Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Rank</Label>
                <Select
                  value={filterValues.rankFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, rankFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="VVIP">VVIP</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="Repeat">Repeat</SelectItem>
                    <SelectItem value="New">New</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                    <SelectItem value="Processing">Processing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Store Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Store</Label>
                <Select
                  value={filterValues.storeFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, storeFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Stores</SelectItem>
                    <SelectItem value="Hebes">Hebes</SelectItem>
                    <SelectItem value="Ritamie">Ritamie</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Staff</Label>
                <Select
                  value={filterValues.staffFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, staffFilter: value })
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

              {/* Payment Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Payment</Label>
                <Select
                  value={filterValues.paymentFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, paymentFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Full">Full Payment</SelectItem>
                    <SelectItem value="Plan">Payment Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Design Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Design</Label>
                <Select
                  value={filterValues.designFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, designFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Requested">Requested</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Material Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Material</Label>
                <Select
                  value={filterValues.materialFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, materialFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Highland">Highland Brand</SelectItem>
                    <SelectItem value="Data">Data Material</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Completion Filter */}
              <div className="space-y-1.5">
                <Label className="text-xs opacity-60">Completion</Label>
                <Select
                  value={filterValues.completionFilter}
                  onValueChange={(value) =>
                    onFilterChange({ ...filterValues, completionFilter: value })
                  }
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Ship">Ship Date</SelectItem>
                    <SelectItem value="Status">Status</SelectItem>
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
