"use client";

/**
 * VendorsSuppliersPage
 * 
 * Manage vendor and supplier relationships.
 * 
 * Features:
 * - Track vendor information and contacts
 * - Filter by category, country, and status
 * - View vendor ratings and performance
 * - Monitor spending and payment terms
 * - Create purchase orders directly from vendor view
 * 
 * Access: Logistics → Vendors & Suppliers
 */

import { useState, useMemo } from "react";
import { Button } from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Building, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import {
  VendorStatsCardsModule,
  VendorFiltersModule,
  VendorTableModule,
} from "../../Modules/Logistics";
import { mockVendors, Vendor } from "../../../sampledata/vendors";

export function VendorsSuppliersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [vendors] = useState<Vendor[]>(mockVendors);

  // Filter vendors
  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory =
        selectedCategory === "all" || vendor.category === selectedCategory;
      
      const matchesCountry =
        selectedCountry === "all" || vendor.country === selectedCountry;
      
      const matchesStatus =
        selectedStatus === "all" || vendor.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesCountry && matchesStatus;
    });
  }, [vendors, searchTerm, selectedCategory, selectedCountry, selectedStatus]);

  // Calculate stats
  const stats = useMemo(() => {
    const activeVendors = vendors.filter((v) => v.status === "Active").length;
    const totalSpent = vendors.reduce((sum, v) => sum + v.totalSpent, 0);
    const averageRating =
      vendors.length > 0
        ? vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
        : 0;

    return {
      totalVendors: vendors.length,
      activeVendors,
      totalSpent,
      averageRating,
    };
  }, [vendors]);

  // Action Handlers
  const handleViewDetails = (vendor: Vendor) => {
    toast.success(`Viewing details for ${vendor.name}`);
    // Would open a detail panel or navigate to detail page
  };

  const handleCreatePO = (vendor: Vendor) => {
    toast.success(`Creating purchase order for ${vendor.name}`);
    // Would open CreatePurchaseOrderPanel with vendor pre-filled
  };

  const handleAddVendor = () => {
    toast.info("Add Vendor dialog would open here");
    // Would open a CreateVendorPanel
  };

  const handleExport = (type: string) => {
    if (type === "list") {
      toast.success("Exporting vendor list...");
    } else if (type === "history") {
      toast.success("Exporting purchase history...");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#DAB785] to-[#C9A874] flex items-center justify-center shadow-lg">
            <Building className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="mb-1">Vendors & Suppliers</h1>
            <p className="text-sm text-muted-foreground mb-0">
              Manage supplier relationships and procurement sources
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
              <DropdownMenuItem onClick={() => handleExport("list")}>
                Export Vendor List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport("history")}>
                Export Purchase History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            onClick={handleAddVendor}
            className="gap-2 bg-gradient-to-r from-[#DAB785] to-[#C9A874] hover:from-[#C9A874] hover:to-[#B89763] text-white shadow-md"
          >
            <Plus className="w-4 h-4" />
            Add Vendor
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <VendorStatsCardsModule
        totalVendors={stats.totalVendors}
        activeVendors={stats.activeVendors}
        totalSpent={stats.totalSpent}
        averageRating={stats.averageRating}
      />

      {/* Filters */}
      <VendorFiltersModule
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* Vendors Table */}
      <VendorTableModule
        data={filteredVendors}
        onVendorClick={handleViewDetails}
        onCreatePO={handleCreatePO}
      />
    </div>
  );
}
