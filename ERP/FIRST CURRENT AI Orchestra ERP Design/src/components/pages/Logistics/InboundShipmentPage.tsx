"use client";

/**
 * InboundShipmentPage
 * 
 * Manage incoming inventory shipments from vendors and suppliers.
 * 
 * Features:
 * - Track inbound shipments with status tracking
 * - Filter by location, status, and date
 * - Create new shipments and purchase orders
 * - View shipment details and tracking information
 * - Export shipment data
 * 
 * Access: Logistics → Inbound Shipments
 */

import { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { TrendingUp, Plus, Download, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  InboundStatsCardsModule,
  InboundFiltersModule,
  InboundShipmentTableModule,
} from "../../Modules/Logistics";
import { mockInboundShipments, InboundShipment } from "../../../sampledata/inboundShipments";
import { CreateInboundShipmentPanel } from "../../panels/CreateInboundShipmentPanel";

export function InboundShipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [shipments, setShipments] = useState<InboundShipment[]>(mockInboundShipments);

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch =
        shipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shipment.vendor?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        selectedStatus === "all" ||
        shipment.status.toLowerCase() === selectedStatus.toLowerCase();
      
      const matchesLocation =
        selectedLocation === "all" ||
        shipment.location === selectedLocation;
      
      return matchesSearch && matchesStatus && matchesLocation;
    });
  }, [shipments, searchTerm, selectedStatus, selectedLocation]);

  // Calculate stats
  const stats = useMemo(() => {
    const incoming = shipments.filter((s) => s.status === "Incoming").length;
    const processing = shipments.filter((s) => s.status === "Processing").length;
    const complete = shipments.filter((s) => s.status === "Complete").length;

    return {
      totalShipments: shipments.length,
      incoming,
      processing,
      complete,
    };
  }, [shipments]);

  // Action Handlers
  const handleCreatePO = () => {
    toast.info("Create Purchase Order - Opening panel...");
    // Would navigate to PO creation or open a different panel
  };

  const handleAddShipment = () => {
    setShowCreatePanel(true);
  };

  const handleSaveShipment = (shipmentData: any) => {
    const newShipment: InboundShipment = {
      id: (shipments.length + 1).toString(),
      code: shipmentData.code,
      poNumber: shipmentData.poNumber,
      vendor: shipmentData.vendor,
      location: shipmentData.location,
      status: shipmentData.status,
      products: shipmentData.productsCount || 0,
      items: shipmentData.items || 0,
      tracking: shipmentData.tracking,
      estimatedDate: shipmentData.estimatedDate || "TBD",
      updateDate: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      }),
      note: shipmentData.note,
    };
    
    setShipments([newShipment, ...shipments]);
    toast.success("Inbound shipment created successfully");
  };

  const handleShipmentClick = (shipment: InboundShipment) => {
    toast.info(`View details for ${shipment.code}`);
    // Would open a detail panel or navigate to detail page
  };

  const handleExport = (format: string) => {
    toast.success(`Exporting ${filteredShipments.length} shipments as ${format}...`);
  };

  const handleDateFilter = () => {
    toast.info("Date filter dialog would open here");
  };

  const handleMoreFilters = () => {
    toast.info("Advanced filters dialog would open here");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Inbound Shipments</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Track incoming inventory and deliveries
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2"
            onClick={handleCreatePO}
          >
            <ShoppingCart className="w-4 h-4" />
            Create PO
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExport("CSV")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("Excel")}>
                Export as Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("PDF")}>
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            onClick={handleAddShipment}
            className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] hover:to-[#B89763] text-white shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Shipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <InboundStatsCardsModule
        totalShipments={stats.totalShipments}
        incoming={stats.incoming}
        processing={stats.processing}
        complete={stats.complete}
      />

      {/* Filters */}
      <InboundFiltersModule
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLocation={selectedLocation}
        onLocationChange={setSelectedLocation}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        onDateFilter={handleDateFilter}
        onMoreFilters={handleMoreFilters}
      />

      {/* Shipments Table */}
      <InboundShipmentTableModule
        data={filteredShipments}
        onShipmentClick={handleShipmentClick}
      />

      {/* Create Shipment Panel */}
      <CreateInboundShipmentPanel
        open={showCreatePanel}
        onClose={() => setShowCreatePanel(false)}
        onSave={handleSaveShipment}
      />
    </div>
  );
}
