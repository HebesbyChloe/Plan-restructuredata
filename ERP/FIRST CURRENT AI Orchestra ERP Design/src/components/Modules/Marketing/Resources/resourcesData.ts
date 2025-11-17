// Resources Module Data Types and Sample Data
// Used across Affiliates, UTM Links, Reference Docs, and Channels

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Affiliate {
  id: string;
  name: string;
  type: "Affiliate" | "KOL" | "Influencer";
  email: string;
  platform?: string;
  commissionRate: number;
  revenue: number;
  status: "active" | "inactive" | "pending";
  joinDate: string;
}

export interface UTMLink {
  id: string;
  name: string;
  url: string;
  shortUrl: string;
  campaign: string;
  source: string;
  medium: string;
  clicks: number;
  conversions: number;
  createdDate: string;
}

export interface ReferenceDoc {
  id: string;
  title: string;
  category: string;
  description: string;
  fileUrl?: string;
  updatedDate: string;
  size?: string;
}

export interface Channel {
  id: string;
  name: string;
  type: string;
  platform: string;
  reach: number;
  engagement: number;
  status: "active" | "inactive";
  budget?: number;
}

export type PanelMode = "view" | "edit" | "create";

export type ResourceTab = "affiliates" | "utm-links" | "references" | "channels";

// ============================================================================
// SAMPLE DATA
// ============================================================================

export const sampleAffiliates: Affiliate[] = [
  {
    id: "1",
    name: "Sarah Chen",
    type: "KOL",
    email: "sarah@example.com",
    platform: "Instagram",
    commissionRate: 15,
    revenue: 18290,
    status: "active",
    joinDate: "Jan 15, 2024",
  },
  {
    id: "2",
    name: "John Smith",
    type: "Affiliate",
    email: "john@example.com",
    commissionRate: 10,
    revenue: 12450,
    status: "active",
    joinDate: "Mar 20, 2024",
  },
  {
    id: "3",
    name: "Emma Wilson",
    type: "Influencer",
    email: "emma@example.com",
    platform: "TikTok",
    commissionRate: 20,
    revenue: 17550,
    status: "pending",
    joinDate: "Oct 10, 2025",
  },
  {
    id: "4",
    name: "Michael Brown",
    type: "KOL",
    email: "michael@example.com",
    platform: "YouTube",
    commissionRate: 18,
    revenue: 24100,
    status: "active",
    joinDate: "Feb 5, 2024",
  },
  {
    id: "5",
    name: "Lisa Garcia",
    type: "Influencer",
    email: "lisa@example.com",
    platform: "Pinterest",
    commissionRate: 12,
    revenue: 9800,
    status: "inactive",
    joinDate: "Jun 12, 2024",
  },
];

export const sampleUTMLinks: UTMLink[] = [
  {
    id: "1",
    name: "Holiday Campaign 2024",
    url: "https://example.com/products?utm_source=newsletter&utm_medium=email&utm_campaign=holiday2024",
    shortUrl: "short.link/hol24",
    campaign: "holiday2024",
    source: "newsletter",
    medium: "email",
    clicks: 1248,
    conversions: 89,
    createdDate: "Dec 1, 2024",
  },
  {
    id: "2",
    name: "Instagram Story Promo",
    url: "https://example.com/sale?utm_source=instagram&utm_medium=social&utm_campaign=flash_sale",
    shortUrl: "short.link/ig-flash",
    campaign: "flash_sale",
    source: "instagram",
    medium: "social",
    clicks: 2156,
    conversions: 124,
    createdDate: "Oct 15, 2025",
  },
  {
    id: "3",
    name: "Google Ads Spring Collection",
    url: "https://example.com/spring?utm_source=google&utm_medium=cpc&utm_campaign=spring_collection",
    shortUrl: "short.link/spring",
    campaign: "spring_collection",
    source: "google",
    medium: "cpc",
    clicks: 3421,
    conversions: 287,
    createdDate: "Mar 1, 2025",
  },
  {
    id: "4",
    name: "Facebook Product Launch",
    url: "https://example.com/new?utm_source=facebook&utm_medium=social&utm_campaign=product_launch",
    shortUrl: "short.link/fb-launch",
    campaign: "product_launch",
    source: "facebook",
    medium: "social",
    clicks: 1892,
    conversions: 156,
    createdDate: "Jul 20, 2025",
  },
];

export const sampleReferenceDocs: ReferenceDoc[] = [
  {
    id: "1",
    title: "Brand Guidelines 2025",
    category: "Brand",
    description: "Complete brand identity guidelines including logo usage, colors, and typography",
    fileUrl: "#",
    updatedDate: "Oct 1, 2025",
    size: "2.4 MB",
  },
  {
    id: "2",
    title: "Social Media Playbook",
    category: "Campaign Templates",
    description: "Comprehensive guide for social media marketing strategies",
    fileUrl: "#",
    updatedDate: "Sep 20, 2025",
    size: "1.8 MB",
  },
  {
    id: "3",
    title: "API Integration Guide",
    category: "Technical",
    description: "Developer documentation for marketing API integrations",
    fileUrl: "#",
    updatedDate: "Oct 10, 2025",
    size: "890 KB",
  },
  {
    id: "4",
    title: "Email Marketing Templates",
    category: "Campaign Templates",
    description: "Pre-designed email templates for various campaign types",
    fileUrl: "#",
    updatedDate: "Aug 15, 2025",
    size: "1.2 MB",
  },
  {
    id: "5",
    title: "Content Calendar Template",
    category: "Planning",
    description: "Monthly content planning template with best practices",
    fileUrl: "#",
    updatedDate: "Sep 5, 2025",
    size: "650 KB",
  },
  {
    id: "6",
    title: "Influencer Partnership Agreement",
    category: "Legal",
    description: "Standard contract template for influencer collaborations",
    fileUrl: "#",
    updatedDate: "Oct 12, 2025",
    size: "420 KB",
  },
];

export const sampleChannels: Channel[] = [
  {
    id: "1",
    name: "Instagram Main",
    type: "Social Media",
    platform: "Instagram",
    reach: 850000,
    engagement: 7.2,
    status: "active",
    budget: 5000,
  },
  {
    id: "2",
    name: "Newsletter Weekly",
    type: "Email Marketing",
    platform: "Email",
    reach: 125000,
    engagement: 24.5,
    status: "active",
    budget: 1200,
  },
  {
    id: "3",
    name: "Google Search Ads",
    type: "Paid Advertising",
    platform: "Google Ads",
    reach: 450000,
    engagement: 3.8,
    status: "active",
    budget: 12000,
  },
  {
    id: "4",
    name: "TikTok Brand Channel",
    type: "Social Media",
    platform: "TikTok",
    reach: 620000,
    engagement: 9.4,
    status: "active",
    budget: 3500,
  },
  {
    id: "5",
    name: "Facebook Retargeting",
    type: "Paid Advertising",
    platform: "Facebook Ads",
    reach: 280000,
    engagement: 4.2,
    status: "inactive",
    budget: 2800,
  },
  {
    id: "6",
    name: "YouTube Content Series",
    type: "Content Marketing",
    platform: "YouTube",
    reach: 190000,
    engagement: 12.1,
    status: "active",
    budget: 4200,
  },
];

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function getStatusColor(status: "active" | "inactive" | "pending"): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
  }
}

export function getTypeIcon(type: Affiliate["type"]) {
  // Returns appropriate icon identifier for affiliate type
  return type === "KOL" ? "star" : type === "Influencer" ? "users" : "link";
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(0)}K`;
  }
  return num.toString();
}

export function calculateConversionRate(clicks: number, conversions: number): string {
  if (clicks === 0) return "0.0%";
  return ((conversions / clicks) * 100).toFixed(1) + "%";
}
