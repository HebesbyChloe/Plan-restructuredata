/**
 * InboundFiltersModule
 * 
 * Filter controls for inbound shipments:
 * - Search by code or tracking
 * - Filter by location
 * - Filter by status
 * - Date filter
 * - More filters
 */

import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Search, Calendar, Filter } from "lucide-react";

// Types
interface InboundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  onDateFilter?: () => void;
  onMoreFilters?: () => void;
}

export function InboundFiltersModule({
  searchTerm,
  onSearchChange,
  selectedLocation,
  onLocationChange,
  selectedStatus,
  onStatusChange,
  onDateFilter,
  onMoreFilters,
}: InboundFiltersProps) {
  return (
    <Card className="p-4 glass-card border-border/50 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by code or tracking..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>

        {/* Location Filter */}
        <Select value={selectedLocation} onValueChange={onLocationChange}>
          <SelectTrigger className="w-[160px] bg-muted/50">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Internal Hub">Internal Hub</SelectItem>
            <SelectItem value="Outbound">Outbound</SelectItem>
            <SelectItem value="Warehouse A">Warehouse A</SelectItem>
            <SelectItem value="Warehouse B">Warehouse B</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] bg-muted/50">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="incoming">Incoming</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Filter */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onDateFilter}
        >
          <Calendar className="w-4 h-4" />
          Select Date
        </Button>

        {/* More Filters */}
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={onMoreFilters}
        >
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>
    </Card>
  );
}
