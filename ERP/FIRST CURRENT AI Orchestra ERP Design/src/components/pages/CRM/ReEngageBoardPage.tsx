"use client";

import { useState, useMemo } from "react";
import { 
  ReengageStat, 
  ReengageBatchTableModule, 
  ReengageBatchDetailPanel,
  ReengageBatchEditDialog,
  type FilterCounts 
} from "../../Modules/CRM";
import { mockReengageBatches, type ReengageBatch } from "../../../sampledata";

export function ReEngageBoardPage() {
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [selectedRepFilter, setSelectedRepFilter] = useState<string>("all");
  const [selectedBatch, setSelectedBatch] = useState<ReengageBatch | null>(null);
  const [editingBatch, setEditingBatch] = useState<ReengageBatch | null>(null);
  const [batches, setBatches] = useState<ReengageBatch[]>(mockReengageBatches);

  // Filter batches
  const filteredBatches = useMemo(() => {
    let filtered = batches;

    // Apply status filter
    if (selectedStatusFilter !== "all") {
      filtered = filtered.filter(b => b.status.toLowerCase().replace(" ", "") === selectedStatusFilter);
    }

    // Apply rep filter
    if (selectedRepFilter !== "all") {
      filtered = filtered.filter(b => b.assignedRep === selectedRepFilter);
    }

    return filtered;
  }, [batches, selectedStatusFilter, selectedRepFilter]);

  // Calculate stats from filtered batches
  const stats = useMemo(() => {
    const totalBatches = filteredBatches.length;
    const totalCustomers = filteredBatches.reduce((sum, b) => sum + b.batchSize, 0);
    const totalHistoricalValue = filteredBatches.reduce((sum, b) => sum + b.historicalValue, 0);
    const avgResponse = filteredBatches.length > 0
      ? Math.round(filteredBatches.reduce((sum, b) => sum + b.responseRate, 0) / filteredBatches.length)
      : 0;

    const avgConversion = filteredBatches.length > 0
      ? Math.round(filteredBatches.reduce((sum, b) => sum + b.conversionRate, 0) / filteredBatches.length)
      : 0;

    const totalReactivatedRevenue = filteredBatches.reduce((sum, b) => {
      return sum + ((b.historicalValue * b.conversionRate) / 100);
    }, 0);

    return {
      totalBatches,
      totalCustomers,
      totalHistoricalValue,
      avgResponse,
      avgConversion,
      totalReactivatedRevenue
    };
  }, [filteredBatches]);

  // Calculate filter counts
  const filterCounts: FilterCounts = useMemo(() => ({
    all: batches.length,
    new: batches.filter(b => b.status === "New").length,
    inProgress: batches.filter(b => b.status === "In Progress").length,
    assigned: batches.filter(b => b.status === "Assigned").length,
    done: batches.filter(b => b.status === "Done").length
  }), [batches]);

  // Update handlers
  const updateBatchStatus = (batchId: string, newStatus: ReengageBatch["status"]) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, status: newStatus } : b));
    if (selectedBatch && selectedBatch.id === batchId) {
      setSelectedBatch({ ...selectedBatch, status: newStatus });
    }
  };

  const updateBatchName = (batchId: string, newName: string) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, name: newName } : b));
    if (selectedBatch && selectedBatch.id === batchId) {
      setSelectedBatch({ ...selectedBatch, name: newName });
    }
  };

  const updateAssignedRep = (batchId: string, newRep: string) => {
    setBatches(prev => prev.map(b => b.id === batchId ? { ...b, assignedRep: newRep } : b));
    if (selectedBatch && selectedBatch.id === batchId) {
      setSelectedBatch({ ...selectedBatch, assignedRep: newRep });
    }
  };

  return (
    <div className="space-y-8 max-w-[1600px]">
      {/* Header */}
      <div>
        <h1 className="mb-2">Re-Engage Board</h1>
        <p className="text-muted-foreground">Manage and track customer reactivation batches</p>
      </div>

      {/* Stats Cards */}
      <ReengageStat
        totalBatches={stats.totalBatches}
        totalCustomers={stats.totalCustomers}
        totalHistoricalValue={stats.totalHistoricalValue}
        responseRateAvg={stats.avgResponse}
        conversionRateAvg={stats.avgConversion}
        totalReactivatedRevenue={stats.totalReactivatedRevenue}
      />

      {/* Data Table */}
      <ReengageBatchTableModule
        batches={filteredBatches}
        selectedStatusFilter={selectedStatusFilter}
        selectedRepFilter={selectedRepFilter}
        filterCounts={filterCounts}
        onStatusFilterChange={setSelectedStatusFilter}
        onRepFilterChange={setSelectedRepFilter}
        onBatchClick={setSelectedBatch}
        onStatusUpdate={updateBatchStatus}
        onRepUpdate={updateAssignedRep}
        onNameEdit={setEditingBatch}
      />

      {/* Batch Detail Panel */}
      <ReengageBatchDetailPanel
        batch={selectedBatch}
        onClose={() => setSelectedBatch(null)}
        onStatusUpdate={updateBatchStatus}
        onRepUpdate={updateAssignedRep}
      />

      {/* Edit Name Dialog */}
      <ReengageBatchEditDialog
        batch={editingBatch}
        onClose={() => setEditingBatch(null)}
        onSave={updateBatchName}
      />
    </div>
  );
}
