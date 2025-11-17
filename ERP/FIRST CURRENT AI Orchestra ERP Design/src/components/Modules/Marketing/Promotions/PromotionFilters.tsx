import { Input } from "../../../ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import { Search, Filter } from "lucide-react";
import { promotionTypeLabels } from "./promotionData";

interface PromotionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterType: string | null;
  setFilterType: (type: string | null) => void;
}

export function PromotionFilters({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
}: PromotionFiltersProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        <Input
          type="search"
          placeholder="Search expired promotions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 bg-glass-bg/50 border-glass-border"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors">
            <Filter className="w-4 h-4" />
            {filterType ? promotionTypeLabels[filterType as keyof typeof promotionTypeLabels] : "All Types"}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-background border-border">
          <DropdownMenuItem onClick={() => setFilterType(null)}>
            All Types
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setFilterType("percentage")}>
            Percentage Off
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterType("value")}>
            Value Off
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterType("bogo")}>
            Buy One Get One
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterType("free-items")}>
            Free Items
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setFilterType("bmgm")}>
            Buy More Get More
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
