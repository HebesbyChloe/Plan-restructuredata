import { Card } from "../../../ui/card";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import { Copy } from "lucide-react";
import { UTMLink, calculateConversionRate } from "./resourcesData";
import { toast } from "sonner";

interface UTMTableProps {
  utmLinks: UTMLink[];
  onRowClick: (link: UTMLink) => void;
}

export function UTMTable({ utmLinks, onRowClick }: UTMTableProps) {
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success("URL copied to clipboard");
  };

  return (
    <Card className="border-glass-border bg-glass-bg/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Campaign</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Medium</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Conversions</TableHead>
            <TableHead>CVR</TableHead>
            <TableHead>Short URL</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {utmLinks.map((link) => (
            <TableRow
              key={link.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onRowClick(link)}
            >
              <TableCell>{link.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{link.campaign}</Badge>
              </TableCell>
              <TableCell className="opacity-60">{link.source}</TableCell>
              <TableCell className="opacity-60">{link.medium}</TableCell>
              <TableCell>{link.clicks.toLocaleString()}</TableCell>
              <TableCell>{link.conversions}</TableCell>
              <TableCell>
                <span className={
                  parseFloat(calculateConversionRate(link.clicks, link.conversions)) > 5
                    ? "text-green-600 dark:text-green-400"
                    : ""
                }>
                  {calculateConversionRate(link.clicks, link.conversions)}
                </span>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-xs opacity-60">{link.shortUrl}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => handleCopy(link.shortUrl, e)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
