"use client";

/**
 * OutboundShipmentPage
 * 
 * Manage outgoing shipments to customers and destinations.
 * 
 * Features:
 * - Track outbound shipments with status tracking
 * - Filter by status, carrier, and date
 * - Create new shipments
 * - View shipment details and tracking information
 * - Export shipment data
 * 
 * Access: Logistics → Outbound Shipments
 */

import { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Truck, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import {
  OutboundStatsCardsModule,
  OutboundFiltersModule,
  OutboundShipmentTableModule,
} from "../../Modules/Logistics";
import { mockOutboundShipments, OutboundShipment } from "../../../sampledata/outboundShipments";
import { CreateOutboundShipmentPanel } from "../../panels/CreateOutboundShipmentPanel";

export function OutboundShipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCarrier, setSelectedCarrier] = useState("all");
  const [showCreatePanel, setShowCreatePanel] = useState(false);
  const [shipments, setShipments] = useState<OutboundShipment[]>(mockOutboundShipments);

  // Filter shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment) => {
      const matchesSearch =
        shipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shipment.destination?.toLowerCase() || "").includes(searchTerm.toLowerCase());
      
      const matchesStatus =
        selectedStatus === "all" ||
        shipment.status.toLowerCase() === selectedStatus.toLowerCase();
      
      const matchesCarrier =
        selectedCarrier === "all" ||
        shipment.carrier === selectedCarrier;
      
      return matchesSearch && matchesStatus && matchesCarrier;
    });
  }, [shipments, searchTerm, selectedStatus, selectedCarrier]);

  // Calculate stats
  const stats = useMemo(() => {
    const pending = shipments.filter((s) => s.status === "Pending").length;
    const shipped = shipments.filter((s) => s.status === "Shipped").length;
    const delivered = shipments.filter((s) => s.status === "Delivered").length;

    return {
      totalShipments: shipments.length,
      pending,
      shipped,
      delivered,
    };
  }, [shipments]);

  // Action Handlers
  const handleCreateShipment = () => {
    setShowCreatePanel(true);
  };

  const handleSaveShipment = (shipmentData: any) => {
    const newShipment: OutboundShipment = {
      id: (shipments.length + 1).toString(),
      code: shipmentData.code,
      idCodeShip: shipmentData.idCodeShip || "📦",
      storage: shipmentData.storage || shipmentData.status,
      status: shipmentData.status,
      dateCreated: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      updateTime: shipmentData.updateTime || "-",
      shipDate: shipmentData.shipDate || "-",
      deliveryDate: shipmentData.deliveryDate || "-",
      tracking: shipmentData.tracking,
      estimatedDate: shipmentData.estimatedDate || "TBD",
      updatedBy: shipmentData.updatedBy || "-",
      note: shipmentData.note || "",
      products: shipmentData.products || 0,
      items: shipmentData.items || 0,
      destination: shipmentData.destination || "",
      carrier: shipmentData.carrier || "",
    };
    
    setShipments([newShipment, ...shipments]);
    toast.success("Outbound shipment created successfully");
  };

  const handleShipmentClick = (shipment: OutboundShipment) => {
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
            <Truck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Outbound Shipments</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Manage and track outgoing deliveries
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
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
            onClick={handleCreateShipment}
            className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] hover:to-[#B89763] text-white shadow-md"
          >
            <Plus className="w-4 h-4" />
            Create Shipment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <OutboundStatsCardsModule
        totalShipments={stats.totalShipments}
        pending={stats.pending}
        shipped={stats.shipped}
        delivered={stats.delivered}
      />

      {/* Filters */}
      <OutboundFiltersModule
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedCarrier={selectedCarrier}
        onCarrierChange={setSelectedCarrier}
        onDateFilter={handleDateFilter}
        onMoreFilters={handleMoreFilters}
      />

      {/* Shipments Table */}
      <OutboundShipmentTableModule
        data={filteredShipments}
        onShipmentClick={handleShipmentClick}
      />

      {/* Create Shipment Panel */}
      <CreateOutboundShipmentPanel
        isOpen={showCreatePanel}
        onClose={() => setShowCreatePanel(false)}
        onSave={handleSaveShipment}
      />
    </div>
  );
}
