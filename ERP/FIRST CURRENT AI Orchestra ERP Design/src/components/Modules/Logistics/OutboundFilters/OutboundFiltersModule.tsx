/**
 * OutboundFiltersModule
 * 
 * Filter controls for outbound shipments:
 * - Search by code or tracking
 * - Filter by status
 * - Filter by carrier (optional)
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
interface OutboundFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedCarrier?: string;
  onCarrierChange?: (value: string) => void;
  onDateFilter?: () => void;
  onMoreFilters?: () => void;
}

export function OutboundFiltersModule({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedCarrier,
  onCarrierChange,
  onDateFilter,
  onMoreFilters,
}: OutboundFiltersProps) {
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

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[160px] bg-muted/50">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="delayed">Delayed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>

        {/* Carrier Filter (Optional) */}
        {selectedCarrier !== undefined && onCarrierChange && (
          <Select value={selectedCarrier} onValueChange={onCarrierChange}>
            <SelectTrigger className="w-[160px] bg-muted/50">
              <SelectValue placeholder="All Carriers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Carriers</SelectItem>
              <SelectItem value="UPS">UPS</SelectItem>
              <SelectItem value="FedEx">FedEx</SelectItem>
              <SelectItem value="DHL">DHL</SelectItem>
              <SelectItem value="USPS">USPS</SelectItem>
            </SelectContent>
          </Select>
        )}

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
