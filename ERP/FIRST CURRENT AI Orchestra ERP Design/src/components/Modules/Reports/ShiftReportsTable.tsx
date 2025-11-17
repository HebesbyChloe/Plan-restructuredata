import { Badge } from "../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { CheckCircle2, Clock } from "lucide-react";

interface ShiftReport {
  id: string;
  date: string;
  shift: string;
  name: string;
  revenue: number;
  firstOrders: number;
  cartSent: number;
  newLeads: number;
  messages: number;
  status: string;
}

interface ShiftReportsTableProps {
  reports: ShiftReport[];
}

export function ShiftReportsTable({ reports }: ShiftReportsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Shift</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Revenue</TableHead>
            <TableHead className="text-right">Orders</TableHead>
            <TableHead className="text-right">Cart Sent</TableHead>
            <TableHead className="text-right">New Leads</TableHead>
            <TableHead className="text-right">Messages</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>{report.date}</TableCell>
              <TableCell>{report.shift}</TableCell>
              <TableCell>{report.name}</TableCell>
              <TableCell className="text-right text-purple-600 dark:text-purple-400">
                ${report.revenue.toLocaleString()}
              </TableCell>
              <TableCell className="text-right">{report.firstOrders}</TableCell>
              <TableCell className="text-right">{report.cartSent}</TableCell>
              <TableCell className="text-right">{report.newLeads}</TableCell>
              <TableCell className="text-right">{report.messages}</TableCell>
              <TableCell>
                <Badge
                  variant={report.status === "submitted" ? "default" : "secondary"}
                  className={
                    report.status === "submitted"
                      ? "bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300"
                      : ""
                  }
                >
                  {report.status === "submitted" ? (
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                  ) : (
                    <Clock className="w-3 h-3 mr-1" />
                  )}
                  {report.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
