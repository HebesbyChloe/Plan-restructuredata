/**
 * Sample Data: Re-Engage Batches
 * 
 * Mock data for customer re-engagement batches used in CRM Re-Engage Board.
 * Includes batch information, status tracking, and performance metrics.
 */

export interface ReengageBatch {
  id: string;
  name: string;
  assignedRep: string;
  batchSize: number;
  historicalValue: number;
  status: "New" | "In Progress" | "Assigned" | "Done";
  responseRate: number;
  conversionRate: number;
  createdDate: string;
  rebatch: number; // Number of customers moved on to another batch
}

export const mockReengageBatches: ReengageBatch[] = [
  {
    id: "1",
    name: "Q4 2024 High-Value Inactive",
    assignedRep: "Sarah Nguyen",
    batchSize: 450,
    historicalValue: 125000,
    status: "In Progress",
    responseRate: 32,
    conversionRate: 18,
    createdDate: "Sep 15, 2024",
    rebatch: 25
  },
  {
    id: "2",
    name: "Summer 2024 Lapsed Customers",
    assignedRep: "Michael Tran",
    batchSize: 320,
    historicalValue: 89000,
    status: "Done",
    responseRate: 28,
    conversionRate: 15,
    createdDate: "Aug 1, 2024",
    rebatch: 18
  },
  {
    id: "3",
    name: "VIP Dormant Accounts",
    assignedRep: "Jessica Lee",
    batchSize: 125,
    historicalValue: 215000,
    status: "In Progress",
    responseRate: 45,
    conversionRate: 28,
    createdDate: "Sep 20, 2024",
    rebatch: 12
  },
  {
    id: "4",
    name: "Q3 2024 90-Day Inactive",
    assignedRep: "David Chen",
    batchSize: 580,
    historicalValue: 98000,
    status: "Done",
    responseRate: 22,
    conversionRate: 12,
    createdDate: "Jul 10, 2024",
    rebatch: 32
  },
  {
    id: "5",
    name: "New Product Launch Reactivation",
    assignedRep: "Sarah Nguyen",
    batchSize: 275,
    historicalValue: 67500,
    status: "New",
    responseRate: 0,
    conversionRate: 0,
    createdDate: "Oct 1, 2024",
    rebatch: 0
  },
  {
    id: "6",
    name: "Holiday Season Reactivation 2024",
    assignedRep: "Emma Wilson",
    batchSize: 395,
    historicalValue: 142000,
    status: "In Progress",
    responseRate: 38,
    conversionRate: 22,
    createdDate: "Oct 15, 2024",
    rebatch: 28
  },
  {
    id: "7",
    name: "Anniversary Special Campaign",
    assignedRep: "James Park",
    batchSize: 210,
    historicalValue: 178000,
    status: "Assigned",
    responseRate: 0,
    conversionRate: 0,
    createdDate: "Oct 20, 2024",
    rebatch: 0
  }
];

export const reengageSalesReps = [
  "Sarah Nguyen",
  "Michael Tran",
  "Jessica Lee",
  "David Chen",
  "Emma Wilson",
  "James Park"
];
