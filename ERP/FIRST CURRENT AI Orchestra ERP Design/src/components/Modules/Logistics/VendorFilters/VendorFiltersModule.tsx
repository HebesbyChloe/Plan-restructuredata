/**
 * VendorFiltersModule
 * 
 * Filter controls for vendors and suppliers:
 * - Search by name/code/category
 * - Filter by category
 * - Filter by country
 * - Filter by status (optional)
 */

import { Card } from "../../../ui/card";
import { Input } from "../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../ui/select";
import { Search } from "lucide-react";

// Types
interface VendorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
}

export function VendorFiltersModule({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
  selectedStatus,
  onStatusChange,
}: VendorFiltersProps) {
  return (
    <Card className="p-4 glass-card border-border/50 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-muted/50"
          />
        </div>

        {/* Category Filter */}
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-[160px] bg-muted/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Materials">Materials</SelectItem>
            <SelectItem value="Gemstones">Gemstones</SelectItem>
            <SelectItem value="Diamonds">Diamonds</SelectItem>
            <SelectItem value="Pearls">Pearls</SelectItem>
            <SelectItem value="Components">Components</SelectItem>
          </SelectContent>
        </Select>

        {/* Country Filter */}
        <Select value={selectedCountry} onValueChange={onCountryChange}>
          <SelectTrigger className="w-[160px] bg-muted/50">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            <SelectItem value="Vietnam">Vietnam</SelectItem>
            <SelectItem value="United States">United States</SelectItem>
            <SelectItem value="Japan">Japan</SelectItem>
            <SelectItem value="China">China</SelectItem>
            <SelectItem value="Thailand">Thailand</SelectItem>
            <SelectItem value="Germany">Germany</SelectItem>
            <SelectItem value="India">India</SelectItem>
            <SelectItem value="Australia">Australia</SelectItem>
            <SelectItem value="Italy">Italy</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter (Optional) */}
        {selectedStatus !== undefined && onStatusChange && (
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[160px] bg-muted/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </Card>
  );
}
