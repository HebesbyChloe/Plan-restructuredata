"use client";

import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Search,
  Download,
  RefreshCw,
  RotateCcw,
  Clock,
  CheckCircle2,
  DollarSign,
  ChevronDown,
  Upload,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { ReturnTableModule } from "../../Modules/Fulfillment";
import { mockReturnShipmentsEnhanced, type ReturnShipmentData } from "../../../sampledata/returnShipmentsEnhanced";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { getReturnWarrantyExtraByOrderNumber, RETURN_WARRANTY_STATUS } from "../../../sampledata/returnWarrantyExtraData";

export function ReturnManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReturn, setSelectedReturn] = useState<ReturnShipmentData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  // Use sample data with sales rep names added
  const [returns] = useState<ReturnShipmentData[]>(
    mockReturnShipmentsEnhanced.map((ret, idx) => ({
      ...ret,
      salesRepName: idx % 3 === 0 ? "Chuyet Vo" : idx % 3 === 1 ? "Hai Lam" : "Hang Tran",
    }))
  );

  const handleReturnClick = (returnShipment: ReturnShipmentData) => {
    setSelectedReturn(returnShipment);
    // Could open a detail panel here
    console.log("Return clicked:", returnShipment);
  };

  // Apply filters
  const filteredReturns = returns.filter((returnShipment) => {
    const matchesSearch =
      searchTerm === "" ||
      returnShipment.returnShipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnShipment.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnShipment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      returnShipment.returnItems.some((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Match status using RETURN_WARRANTY_STATUS from extra data
    const extraData = getReturnWarrantyExtraByOrderNumber(returnShipment.orderNumber);
    const matchesStatus = statusFilter === "all" || extraData?.returnWarrantyStatus === statusFilter;
    
    const matchesType = typeFilter === "all" || returnShipment.returnType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Calculate stats
  const totalReturns = returns.length;
  const pendingReturns = returns.filter(
    (r) => r.returnStatus === "pending" || r.returnStatus === "approved"
  ).length;
  const completedReturns = returns.filter(
    (r) => r.returnStatus === "completed" || r.returnStatus === "refunded"
  ).length;
  const totalRefundAmount = returns.reduce((sum, r) => sum + (r.refundAmount || 0), 0);

  // Status-based filtered lists for tabs using RETURN_WARRANTY_STATUS
  const allReturns = filteredReturns;
  
  // Filter by RETURN_WARRANTY_STATUS using the extra data lookup
  const inComingReturns = filteredReturns.filter((r) => {
    const extraData = getReturnWarrantyExtraByOrderNumber(r.orderNumber);
    return extraData?.returnWarrantyStatus === RETURN_WARRANTY_STATUS.CUSTOMER_SHIPPED;
  });
  
  const labelCreatedReturns = filteredReturns.filter((r) => {
    const extraData = getReturnWarrantyExtraByOrderNumber(r.orderNumber);
    return extraData?.returnWarrantyStatus === RETURN_WARRANTY_STATUS.LABEL_CREATED;
  });

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50/50 via-white to-green-50/30 dark:from-blue-950/20 dark:via-gray-900 dark:to-green-950/20 -m-8 p-8">
      {/* Summary Bar */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Returns</p>
              <h3 className="text-2xl mb-0">{totalReturns}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#4B6BFB] to-[#7C3AED] flex items-center justify-center">
              <RotateCcw className="w-5 h-5 text-white" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <h3 className="text-2xl mb-0">{pendingReturns}</h3>
              <p className="text-xs text-amber-600 dark:text-amber-400 mb-0">Needs attention</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Completed</p>
              <h3 className="text-2xl mb-0">{completedReturns}</h3>
              <p className="text-xs text-green-600 dark:text-green-400 mb-0">Processed</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Refunds</p>
              <h3 className="text-2xl mb-0">${totalRefundAmount.toLocaleString()}</h3>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="mb-2">Return Management</h1>
          <p className="text-muted-foreground mb-0">
            Process returns, manage refunds, and track return shipments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#E5E5E5] bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2">
              Actions
              <ChevronDown className="w-4 h-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Download className="w-4 h-4 mr-2" />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Upload className="w-4 h-4 mr-2" />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-sm mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search returns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5] dark:border-border"
            />
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[160px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Return Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="return">Return</SelectItem>
              <SelectItem value="warranty">Warranty</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] bg-[#F8F8F8] dark:bg-muted border-[#E5E5E5]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {Object.values(RETURN_WARRANTY_STATUS).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Tabs with Return Table */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-white dark:bg-card border border-[#E5E5E5] dark:border-border">
          <TabsTrigger value="incoming">
            In Coming
            {inComingReturns.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-xs">
                {inComingReturns.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="label-created">
            Label Created
            {labelCreatedReturns.length > 0 && (
              <span className="ml-2 px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-xs">
                {labelCreatedReturns.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="all">
            All
            <span className="ml-2 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-xs">
              {allReturns.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="incoming">
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <ReturnTableModule returns={inComingReturns} onReturnClick={handleReturnClick} />
          </Card>
        </TabsContent>

        <TabsContent value="label-created">
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <ReturnTableModule returns={labelCreatedReturns} onReturnClick={handleReturnClick} />
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card className="bg-white dark:bg-card border-[#E5E5E5] dark:border-border shadow-md">
            <ReturnTableModule returns={allReturns} onReturnClick={handleReturnClick} />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
