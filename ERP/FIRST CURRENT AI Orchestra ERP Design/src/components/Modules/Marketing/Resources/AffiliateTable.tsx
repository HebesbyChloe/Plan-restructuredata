import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Affiliate, getStatusColor } from "./resourcesData";

interface AffiliateTableProps {
  affiliates: Affiliate[];
  onRowClick: (affiliate: Affiliate) => void;
}

export function AffiliateTable({ affiliates, onRowClick }: AffiliateTableProps) {
  return (
    <Card className="border-glass-border bg-glass-bg/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Platform</TableHead>
            <TableHead>Commission</TableHead>
            <TableHead>Revenue</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {affiliates.map((affiliate) => (
            <TableRow
              key={affiliate.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onRowClick(affiliate)}
            >
              <TableCell>
                <div>
                  <div>{affiliate.name}</div>
                  <div className="text-xs opacity-60">{affiliate.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{affiliate.type}</Badge>
              </TableCell>
              <TableCell className="opacity-60">{affiliate.platform || "—"}</TableCell>
              <TableCell>{affiliate.commissionRate}%</TableCell>
              <TableCell>${affiliate.revenue.toLocaleString()}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(affiliate.status)}>
                  {affiliate.status}
                </Badge>
              </TableCell>
              <TableCell className="opacity-60">{affiliate.joinDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
