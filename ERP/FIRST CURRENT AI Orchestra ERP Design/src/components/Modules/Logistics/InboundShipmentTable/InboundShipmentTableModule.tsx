import { Card } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import {
  Package,
  MapPin,
  Calendar,
  TrendingUp,
  MoreVertical,
  Eye,
  Edit,
  FileText,
} from "lucide-react";
import { STATUS_COLORS } from "./utils/constants";

// Types
interface InboundShipment {
  id: string;
  code: string;
  location: "Internal Hub" | "Outbound" | "Main Warehouse" | "Warehouse A" | "Warehouse B";
  status: "Complete" | "Incoming" | "Processing" | "Delayed" | "Cancelled";
  products: number;
  items: number;
  tracking: string;
  estimatedDate: string;
  updateDate: string;
  vendor?: string;
  poNumber?: string;
  note?: string;
}

interface InboundShipmentTableProps {
  data: InboundShipment[];
  onShipmentClick?: (shipment: InboundShipment) => void;
  searchTerm?: string;
  selectedStatus?: string;
  selectedLocation?: string;
}

export function InboundShipmentTableModule({
  data,
  onShipmentClick,
}: InboundShipmentTableProps) {
  const handleRowClick = (shipment: InboundShipment) => {
    if (onShipmentClick) {
      onShipmentClick(shipment);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[140px]">Shipment Code</TableHead>
              <TableHead className="w-[140px]">PO Number</TableHead>
              <TableHead className="min-w-[180px]">Vendor</TableHead>
              <TableHead className="w-[140px]">Location</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-center w-[100px]">Products</TableHead>
              <TableHead className="text-center w-[100px]">Items</TableHead>
              <TableHead className="w-[160px]">Tracking</TableHead>
              <TableHead className="w-[140px]">Estimated Date</TableHead>
              <TableHead className="w-[140px]">Last Update</TableHead>
              <TableHead className="text-center w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8">
                  <p className="text-muted-foreground mb-0">
                    No inbound shipments found
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((shipment) => (
                <TableRow
                  key={shipment.id}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(shipment)}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-mono">{shipment.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.poNumber || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{shipment.vendor || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[shipment.status]}>
                      {shipment.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.products}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{shipment.items}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{shipment.tracking}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.estimatedDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">{shipment.updateDate}</span>
                  </TableCell>
                  <TableCell
                    className="text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRowClick(shipment)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Shipment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="w-4 h-4 mr-2" />
                          View PO
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
