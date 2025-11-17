import { Input } from "../../../ui/input";
import { Search } from "lucide-react";

interface ResourcesFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  placeholder?: string;
}

export function ResourcesFilters({ 
  searchTerm, 
  setSearchTerm,
  placeholder = "Search..." 
}: ResourcesFiltersProps) {
  return (
    <div className="mb-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="pl-10 bg-glass-bg/30 border-glass-border"
        />
      </div>
    </div>
  );
}
