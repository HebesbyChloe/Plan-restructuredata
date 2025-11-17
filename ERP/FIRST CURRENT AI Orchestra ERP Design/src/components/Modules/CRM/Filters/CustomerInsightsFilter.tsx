import { Calendar, Filter } from "lucide-react";
import { Button } from "../../../ui/button";
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
import { Calendar as CalendarComponent } from "../../../ui/calendar";
import { format } from "date-fns";

interface CustomerInsightsFilterProps {
  dateRange: { from: Date | undefined; to: Date | undefined };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  channelFilter: string;
  setChannelFilter: (channel: string) => void;
}

export function CustomerInsightsFilter({
  dateRange,
  setDateRange,
  channelFilter,
  setChannelFilter,
}: CustomerInsightsFilterProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Date Range Picker */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[240px] justify-start">
            <Calendar className="w-4 h-4" />
            {dateRange.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "MMM dd, yyyy")} -{" "}
                  {format(dateRange.to, "MMM dd, yyyy")}
                </>
              ) : (
                format(dateRange.from, "MMM dd, yyyy")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <CalendarComponent
            mode="range"
            selected={{
              from: dateRange.from,
              to: dateRange.to,
            }}
            onSelect={(range: any) => {
              setDateRange({
                from: range?.from,
                to: range?.to,
              });
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      {/* Channel Filter */}
      <Select value={channelFilter} onValueChange={setChannelFilter}>
        <SelectTrigger className="w-[180px]">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="All Channels" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Channels</SelectItem>
          <SelectItem value="email">Email</SelectItem>
          <SelectItem value="instagram">Instagram</SelectItem>
          <SelectItem value="facebook">Facebook</SelectItem>
          <SelectItem value="direct">Direct</SelectItem>
          <SelectItem value="whatsapp">WhatsApp</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
