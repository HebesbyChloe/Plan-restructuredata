import { Card } from "../../../../ui/card";
import { Badge } from "../../../../ui/badge";
import { Brain } from "lucide-react";
import { Progress } from "../../../../ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../../ui/table";
import type { AIFlow } from "../types";
import { statusConfig } from "../utils/constants";

interface FlowTableProps {
  flows: AIFlow[];
  onFlowClick: (flow: AIFlow) => void;
}

export function FlowTable({ flows, onFlowClick }: FlowTableProps) {
  return (
    <Card className="border-glass-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[280px]">Flow Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Quality</TableHead>
            <TableHead className="text-center">Efficiency</TableHead>
            <TableHead className="text-center">Tasks</TableHead>
            <TableHead className="text-right">Last Run</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flows.map((flow) => {
            const StatusIcon = statusConfig[flow.status].icon;
            return (
              <TableRow
                key={flow.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onFlowClick(flow)}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#4B6BFB]/10">
                      <Brain className="w-4 h-4 text-[#4B6BFB]" />
                    </div>
                    <div>
                      <p className="mb-0">{flow.name}</p>
                      <p className="text-xs opacity-60 mb-0">{flow.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{flow.category}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={`${statusConfig[flow.status].bgColor} ${
                      statusConfig[flow.status].textColor
                    } gap-1`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {flow.status.charAt(0).toUpperCase() + flow.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  {flow.metrics.quality === 0 ? (
                    "-"
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={flow.metrics.quality} className="h-1.5 w-12" />
                      <span className="text-xs whitespace-nowrap">{flow.metrics.quality}%</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {flow.metrics.efficiency === 0 ? (
                    "-"
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Progress value={flow.metrics.efficiency} className="h-1.5 w-12" />
                      <span className="text-xs whitespace-nowrap">{flow.metrics.efficiency}%</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {flow.metrics.tasksProcessed === 0
                    ? "-"
                    : flow.metrics.tasksProcessed.toLocaleString()}
                </TableCell>
                <TableCell className="text-right text-xs opacity-60">
                  {flow.createdDate}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
