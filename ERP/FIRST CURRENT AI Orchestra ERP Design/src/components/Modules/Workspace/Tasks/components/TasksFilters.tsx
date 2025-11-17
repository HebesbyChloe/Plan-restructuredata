import { Card } from "../../../../ui/card";
import { Button } from "../../../../ui/button";
import { Input } from "../../../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import { Search, Filter } from "lucide-react";

interface TasksFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function TasksFilters({
  searchTerm,
  onSearchChange,
}: TasksFiltersProps) {
  return (
    <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]"
          />
        </div>

        <Select>
          <SelectTrigger className="w-[140px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[140px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
            <SelectValue placeholder="Assignee" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Members</SelectItem>
            <SelectItem value="vyha">Vy Ha</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" size="sm" className="gap-2 border-[#E5E5E5]">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>
    </Card>
  );
}
