import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { UserPlus, Zap, ShoppingCart, Target } from "lucide-react";

interface TeamMember {
  name: string;
  revenue: number;
  newLeads: number;
  potential: number;
  highPotential: number;
  converted: number;
  newCustomerPercent: number;
  returningCustomerPercent: number;
}

interface TeamMetricsTableProps {
  members: TeamMember[];
}

export function TeamMetricsTable({ members }: TeamMetricsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[140px]">Name</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">New Leads</TableHead>
            <TableHead className="text-right">Potential</TableHead>
            <TableHead className="text-right">Cart Sent</TableHead>
            <TableHead className="text-right">Converted</TableHead>
            <TableHead className="text-right">Conv. Rate</TableHead>
            <TableHead className="text-right min-w-[120px]">Retention</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const conversionRate = ((member.converted / member.newLeads) * 100).toFixed(1);
            return (
              <TableRow key={member.name}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center text-white text-xs">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{member.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="text-purple-600 dark:text-purple-400">
                    ${member.revenue.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <UserPlus className="w-3.5 h-3.5 text-blue-500" />
                    <span>{member.newLeads}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>{member.potential}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <ShoppingCart className="w-3.5 h-3.5 text-pink-500" />
                    <span>{member.highPotential}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Target className="w-3.5 h-3.5 text-green-500" />
                    <span>{member.converted}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={
                      parseFloat(conversionRate) >= 40
                        ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                        : parseFloat(conversionRate) >= 30
                        ? "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        : "bg-muted text-muted-foreground"
                    }
                  >
                    {conversionRate}%
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <span className="text-muted-foreground">New:</span>
                      <span>{member.newCustomerPercent}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-violet-500"></div>
                      <span className="text-muted-foreground">Ret:</span>
                      <span>{member.returningCustomerPercent}%</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
