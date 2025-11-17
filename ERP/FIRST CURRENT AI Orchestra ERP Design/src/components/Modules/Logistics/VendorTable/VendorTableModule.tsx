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
  Building,
  MapPin,
  Star,
  MoreVertical,
  Eye,
  ShoppingCart,
  Mail,
  Download,
} from "lucide-react";
import { STATUS_COLORS } from "./utils/constants";

// Types
interface Vendor {
  id: string;
  name: string;
  code: string;
  category: string;
  country: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  rating: number;
  totalOrders: number;
  totalSpent: number;
  paymentTerms: string;
  status: "Active" | "Inactive" | "Pending";
  products: string[];
}

interface VendorTableProps {
  data: Vendor[];
  onVendorClick?: (vendor: Vendor) => void;
  onCreatePO?: (vendor: Vendor) => void;
  searchTerm?: string;
  selectedCategory?: string;
  selectedCountry?: string;
}

export function VendorTableModule({
  data,
  onVendorClick,
  onCreatePO,
}: VendorTableProps) {
  const handleRowClick = (vendor: Vendor) => {
    if (onVendorClick) {
      onVendorClick(vendor);
    }
  };

  const handleCreatePO = (vendor: Vendor, e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCreatePO) {
      onCreatePO(vendor);
    }
  };

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-md">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[120px]">Code</TableHead>
              <TableHead className="min-w-[200px]">Vendor Name</TableHead>
              <TableHead className="w-[140px]">Category</TableHead>
              <TableHead className="w-[130px]">Country</TableHead>
              <TableHead className="w-[100px]">Rating</TableHead>
              <TableHead className="text-right w-[110px]">Total Orders</TableHead>
              <TableHead className="text-right w-[140px]">Total Spent</TableHead>
              <TableHead className="w-[120px]">Payment Terms</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-center w-[100px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  <p className="text-muted-foreground mb-0">No vendors found</p>
                </TableCell>
              </TableRow>
            ) : (
              data.map((vendor) => (
                <TableRow
                  key={vendor.id}
                  className="border-b border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(vendor)}
                >
                  <TableCell>
                    <span className="font-mono">{vendor.code}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-white" />
                      </div>
                      <span>{vendor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-border/50">
                      {vendor.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{vendor.country}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{vendor.rating || "N/A"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{vendor.totalOrders}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-[#DAB785]">
                      ${vendor.totalSpent.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span>{vendor.paymentTerms}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_COLORS[vendor.status]}>
                      {vendor.status}
                    </Badge>
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
                        <DropdownMenuItem onClick={() => handleRowClick(vendor)}>
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e: any) => handleCreatePO(vendor, e)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Create PO
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="w-4 h-4 mr-2" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="w-4 h-4 mr-2" />
                          Download History
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
