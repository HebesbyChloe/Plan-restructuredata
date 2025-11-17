import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Calendar, ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { DATE_FILTERS, CONTACT_METHODS } from "../../../lib/config";

interface DateRangeFilterProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  channelFilter: string;
  setChannelFilter: (value: string) => void;
  onClear?: () => void;
}

export function DateRangeFilter({
  dateRange,
  setDateRange,
  channelFilter,
  setChannelFilter,
  onClear,
}: DateRangeFilterProps) {
  const handleClear = () => {
    setDateRange("7-days");
    setChannelFilter("all");
    onClear?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-4 backdrop-blur-sm bg-glass-bg border-glass-border">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range Filter */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 opacity-60" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                {DATE_FILTERS.map((date) => (
                  <SelectItem key={date.value} value={date.value}>
                    {date.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Omni Channel Filter */}
          <Select value={channelFilter} onValueChange={setChannelFilter}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All Channels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              {CONTACT_METHODS.map((channel) => (
                <SelectItem key={channel.value} value={channel.value}>
                  {channel.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Clear Button */}
          <Button variant="ghost" size="sm" onClick={handleClear}>
            Clear
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
