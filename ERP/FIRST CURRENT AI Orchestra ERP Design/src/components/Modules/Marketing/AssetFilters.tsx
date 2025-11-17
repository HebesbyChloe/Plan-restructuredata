import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Label } from "../../ui/label";
import { Search, Filter, Tag } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

interface AssetFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTags: string[];
  setSelectedTags: (tags: string[] | ((prev: string[]) => string[])) => void;
  allTags: string[];
  isFilterOpen: boolean;
  setIsFilterOpen: (open: boolean) => void;
}

export function AssetFilters({
  searchQuery,
  setSearchQuery,
  selectedTags,
  setSelectedTags,
  allTags,
  isFilterOpen,
  setIsFilterOpen,
}: AssetFiltersProps) {
  return (
    <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
          {(selectedTags.length > 0 || searchQuery) && (
            <Badge className="ml-1 h-5 px-1.5 bg-[#4B6BFB] text-white">
              {selectedTags.length + (searchQuery ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4">
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label className="text-xs opacity-60 mb-2 block">Search</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
              <Input
                type="search"
                placeholder="Search assets by name or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label className="text-xs opacity-60 mb-2 block">Filter by Tags</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedTags((prev) =>
                      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                    );
                  }}
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedTags.length > 0 || searchQuery) && (
            <div className="pt-2 border-t">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTags([]);
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
