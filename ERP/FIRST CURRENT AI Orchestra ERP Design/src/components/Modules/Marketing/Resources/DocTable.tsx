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
import { Download } from "lucide-react";
import { ReferenceDoc } from "./resourcesData";
import { toast } from "sonner";

interface DocTableProps {
  docs: ReferenceDoc[];
  onRowClick: (doc: ReferenceDoc) => void;
}

export function DocTable({ docs, onRowClick }: DocTableProps) {
  const handleDownload = (doc: ReferenceDoc, e: React.MouseEvent) => {
    e.stopPropagation();
    toast.success(`Downloading ${doc.title}...`);
  };

  return (
    <Card className="border-glass-border bg-glass-bg/30 backdrop-blur-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {docs.map((doc) => (
            <TableRow
              key={doc.id}
              className="cursor-pointer hover:bg-accent/50"
              onClick={() => onRowClick(doc)}
            >
              <TableCell>{doc.title}</TableCell>
              <TableCell>
                <Badge variant="outline">{doc.category}</Badge>
              </TableCell>
              <TableCell className="opacity-60 max-w-md truncate">
                {doc.description}
              </TableCell>
              <TableCell className="opacity-60">{doc.size || "—"}</TableCell>
              <TableCell className="opacity-60">{doc.updatedDate}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2"
                  onClick={(e) => handleDownload(doc, e)}
                >
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
