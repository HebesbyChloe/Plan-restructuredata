/**
 * ProjectCampaignDetail Constants
 * Metric options, mock data, and configuration constants
 */

import type { MetricOption, TaskDetails, ProjectFile, Activity } from "../types";

// Available metric options for campaigns/projects
export const METRIC_OPTIONS: MetricOption[] = [
  { value: "budget", label: "Budget", goalLabel: "Budget", resultLabel: "Spent", defaultGoal: "$15,000", defaultResult: "$12,000" },
  { value: "reach", label: "Reach", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "100K", defaultResult: "85K" },
  { value: "engagement", label: "Engagement", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "5.0%", defaultResult: "4.2%" },
  { value: "revenue", label: "Revenue", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "$35,000", defaultResult: "$28,500" },
  { value: "impressions", label: "Impressions", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "500K", defaultResult: "425K" },
  { value: "clicks", label: "Clicks", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "25K", defaultResult: "22K" },
  { value: "conversions", label: "Conversions", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "1,200", defaultResult: "1,050" },
  { value: "ctr", label: "Click Rate (CTR)", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "3.5%", defaultResult: "3.2%" },
  { value: "roi", label: "ROI", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "250%", defaultResult: "220%" },
  { value: "leads", label: "Leads", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "500", defaultResult: "450" },
  { value: "sales", label: "Sales", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "$50,000", defaultResult: "$45,000" },
  { value: "units", label: "Units Sold", goalLabel: "Goal", resultLabel: "Result", defaultGoal: "1,000", defaultResult: "850" },
];

// Default metric selection
export const DEFAULT_METRICS = ["budget", "reach", "engagement", "revenue"];

// All available team members (in a real app, this would come from an API)
export const ALL_MEMBERS = [
  "Sarah Chen", "Mike Johnson", "Emma Wilson", "Alex Lee",
  "Lisa Park", "David Kim", "Rachel Adams", "Tom Brown",
  "Jennifer Liu", "Chris Martinez", "Amanda Zhang", "Kevin White",
  "Nicole Garcia", "Brian Anderson", "Michelle Taylor", "Jason Lee"
];

// Mock task details data
export const TASK_DETAILS: Record<string, TaskDetails> = {
  "1": {
    deliverables: [
      { name: "Halloween_Post_1.jpg", status: "Approved" },
      { name: "Halloween_Post_2.jpg", status: "Approved" },
      { name: "Halloween_Story.mp4", status: "Pending" },
    ],
    comments: [
      { author: "Nam Lam", date: "Oct 10, 2024", text: "Completed all Halloween-themed social posts. Performance exceeded expectations." },
    ],
  },
  "2": {
    deliverables: [
      { name: "Email_Template_1.html", status: "Redo" },
      { name: "Email_Template_2.html", status: "Approved" },
    ],
    comments: [
      { author: "Hang Tran", date: "Oct 8, 2024", text: "Mobile responsiveness tested across all major email clients." },
    ],
  },
  "3": {
    deliverables: [
      { name: "Campaign_Report.pdf", status: "Approved" },
      { name: "Analytics_Dashboard.xlsx", status: "Approved" },
    ],
    comments: [
      { author: "Vy Ha", date: "Oct 12, 2024", text: "Final report shows 150% ROI. Campaign exceeded all KPI targets." },
    ],
  },
  "4": {
    deliverables: [
      { name: "Brand_Guidelines.pdf", status: "Approved" },
    ],
    comments: [],
  },
  "5": {
    deliverables: [
      { name: "Performance_Metrics.pdf", status: "Pending" },
    ],
    comments: [
      { author: "Nam Lam", date: "Oct 15, 2024", text: "Metrics compilation in progress. Expected completion tomorrow." },
    ],
  },
};

// Mock project files
export const PROJECT_FILES: ProjectFile[] = [
  { name: "Campaign Brief.pdf", size: "2.4 MB", date: "Oct 5, 2024" },
  { name: "Brand Guidelines.pdf", size: "8.1 MB", date: "Oct 3, 2024" },
  { name: "Social Media Assets.zip", size: "45.2 MB", date: "Oct 8, 2024" },
  { name: "Marketing Strategy.pptx", size: "12.5 MB", date: "Oct 1, 2024" },
];

// Mock activities data
export const MOCK_ACTIVITIES: Activity[] = [
  { date: "Oct 15, 2025", activity: "Campaign brief review", status: "approved" },
  { date: "Oct 16, 2025", activity: "Social media content creation", status: "approved" },
  { date: "Oct 17, 2025", activity: "Email template design v1", status: "redo" },
  { date: "Oct 18, 2025", activity: "Landing page mockup", status: "pending" },
  { date: "Oct 19, 2025", activity: "Budget allocation report", status: "missing" },
  { date: "Oct 20, 2025", activity: "Final campaign assets", status: "pending" },
  { date: "Oct 12, 2025", activity: "Stakeholder presentation", status: "approved" },
  { date: "Oct 14, 2025", activity: "Market research analysis", status: "approved" },
];
