import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronDown, Download } from "lucide-react";
import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu";
import { ReengageBatch, reengageSalesReps } from "../../../../sampledata";
import { 
  getReengageBatchStatusColor, 
  formatReengageCurrency,
  sortReengageBatches
} from "../../../../utils/modules/crm";
import {
  SortColumn,
  SortDirection,
  FilterCounts,
  ReengageBatchTableProps
} from "../../../../types/modules/crm";

export function ReengageBatchTableModule({
  batches,
  selectedStatusFilter,
  selectedRepFilter,
  filterCounts,
  onStatusFilterChange,
  onRepFilterChange,
  onBatchClick,
  onStatusUpdate,
  onRepUpdate,
  onNameEdit,
}: ReengageBatchTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedBatches = sortReengageBatches(batches, sortColumn, sortDirection);

  const SortButton = ({ column, label }: { column: SortColumn; label: string }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-2 hover:opacity-100 transition-opacity"
    >
      {label}
      {sortColumn === column ? (
        sortDirection === "asc" ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )
      ) : (
        <ArrowUpDown className="w-4 h-4 opacity-40" />
      )}
    </button>
  );

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      {/* Filter Bar */}
      <div className="border-b border-border/50 px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter Tabs */}
          <button
            onClick={() => onStatusFilterChange("all")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedStatusFilter === "all"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            All ({filterCounts.all})
          </button>
          <button
            onClick={() => onStatusFilterChange("new")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedStatusFilter === "new"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            New ({filterCounts.new})
          </button>
          <button
            onClick={() => onStatusFilterChange("inprogress")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedStatusFilter === "inprogress"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            In Progress ({filterCounts.inProgress})
          </button>
          <button
            onClick={() => onStatusFilterChange("assigned")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedStatusFilter === "assigned"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Assigned ({filterCounts.assigned})
          </button>
          <button
            onClick={() => onStatusFilterChange("done")}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              selectedStatusFilter === "done"
                ? "bg-foreground text-background"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            Done ({filterCounts.done})
          </button>

          <div className="flex-1" />

          {/* Sales Rep Filter */}
          <Select value={selectedRepFilter} onValueChange={onRepFilterChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All Sales Reps" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sales Reps</SelectItem>
              {reengageSalesReps.map((rep) => (
                <SelectItem key={rep} value={rep}>
                  {rep}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/30 border-b border-border/50">
            <tr>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="name" label="Batch Name" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="assignedRep" label="Assigned Rep" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="batchSize" label="Batch Size" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="historicalValue" label="Historical Value" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="status" label="Status" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="responseRate" label="Response %" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="conversionRate" label="Conversion %" />
              </th>
              <th className="text-left px-6 py-4 text-sm opacity-70">
                <SortButton column="createdDate" label="Created Date" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedBatches.map((batch, index) => (
              <motion.tr
                key={batch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b border-border/30 hover:bg-accent/30 transition-colors cursor-pointer"
                onClick={() => onBatchClick(batch)}
              >
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div
                    className="hover:text-ai-blue transition-colors cursor-pointer"
                    onClick={() => onNameEdit(batch)}
                  >
                    <p className="mb-0">{batch.name}</p>
                  </div>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="flex items-center gap-2 hover:text-ai-blue transition-colors">
                      <p className="text-muted-foreground mb-0">{batch.assignedRep}</p>
                      <ChevronDown className="w-3 h-3 opacity-60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {reengageSalesReps.map((rep) => (
                        <DropdownMenuItem
                          key={rep}
                          onClick={() => onRepUpdate(batch.id, rep)}
                          className={batch.assignedRep === rep ? "bg-accent" : ""}
                        >
                          {rep}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
                <td className="px-6 py-4">
                  <p className="mb-0">{batch.batchSize}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-emerald-600 dark:text-emerald-400 mb-0">
                    {formatReengageCurrency(batch.historicalValue)}
                  </p>
                </td>
                <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                  <div className="space-y-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex items-center gap-2">
                        <Badge className={getReengageBatchStatusColor(batch.status)}>
                          {batch.status}
                        </Badge>
                        <ChevronDown className="w-3 h-3 opacity-60" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "New")}>
                          <Badge className={getReengageBatchStatusColor("New")}>New</Badge>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "Assigned")}>
                          <Badge className={getReengageBatchStatusColor("Assigned")}>Assigned</Badge>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "In Progress")}>
                          <Badge className={getReengageBatchStatusColor("In Progress")}>In Progress</Badge>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onStatusUpdate(batch.id, "Done")}>
                          <Badge className={getReengageBatchStatusColor("Done")}>Done</Badge>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5 overflow-hidden">
                        <motion.div
                          className="h-full bg-ai-blue rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${batch.responseRate}%` }}
                          transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.05 }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mb-0">{batch.responseRate}% contacted</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-blue-600 dark:text-blue-400 mb-0">
                    {batch.responseRate}%
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-amber-600 dark:text-amber-400 mb-0">
                    {batch.conversionRate}%
                  </p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-muted-foreground mb-0">{batch.createdDate}</p>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedBatches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No batches found for this filter</p>
        </div>
      )}
    </Card>
  );
}
