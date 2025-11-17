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
  TrendingDown,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { STATUS_COLORS } from "./utils/constants";

// Types
interface OutboundShipment {
  id: string;
  code: string;
  idCodeShip?: string;
  storage?: string;
  status: "Delivered" | "Shipped" | "Processing" | "Delayed" | "Pending";
  dateCreated: string;
  updateTime: string;
  shipDate: string;
  deliveryDate: string;
  tracking: string;
  estimatedDate: string;
  updatedBy: string;
  note?: string;
  products?: number;
  items?: number;
  destination?: string;
  carrier?: string;
}

interface OutboundShipmentTableProps {
  data: OutboundShipment[];
  onShipmentClick?: (shipment: OutboundShipment) => void;
}

export function OutboundShipmentTableModule({
  data,
  onShipmentClick,
}: OutboundShipmentTableProps) {
  const handleRowClick = (shipment: OutboundShipment) => {
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
              <TableHead className="w-[130px]">Tracking</TableHead>
              <TableHead className="w-[140px]">Destination</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-center w-[100px]">Products</TableHead>
              <TableHead className="text-center w-[100px]">Items</TableHead>
              <TableHead className="w-[130px]">Ship Date</TableHead>
              <TableHead className="w-[140px]">Delivery Date</TableHead>
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
                    No outbound shipments found
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
                        <TrendingDown className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-mono">{shipment.code}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono">{shipment.tracking}</span>
                  </TableCell>
                  <TableCell>
                    <span>{shipment.destination || shipment.storage || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={STATUS_COLORS[shipment.status]}>
                        {shipment.status}
                      </Badge>
                      {shipment.status === "Delayed" && (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.products || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span>{shipment.items || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>{shipment.shipDate || "-"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span>{shipment.deliveryDate || "-"}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {shipment.estimatedDate}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {shipment.updateTime || "-"}
                    </span>
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
                          Print Label
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
