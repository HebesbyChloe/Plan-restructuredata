/**
 * Sample Data: Vendors & Suppliers
 * 
 * Contains sample data for vendors and suppliers
 * Used in: VendorsSuppliersPage (Logistics)
 */

export interface Vendor {
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

export const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Vietnam Supplier Co.",
    code: "VN-001",
    category: "Materials",
    country: "Vietnam",
    contact: {
      email: "sales@vnsupplier.com",
      phone: "+84 28 1234 5678",
      address: "Ho Chi Minh City, Vietnam",
    },
    rating: 4.8,
    totalOrders: 156,
    totalSpent: 245000,
    paymentTerms: "Net 30",
    status: "Active",
    products: ["Gold Wire", "Silver Chain", "Findings"],
  },
  {
    id: "2",
    name: "US Gemstone Inc.",
    code: "US-002",
    category: "Gemstones",
    country: "United States",
    contact: {
      email: "orders@usgemstone.com",
      phone: "+1 212 555 0123",
      address: "New York, NY, USA",
    },
    rating: 4.9,
    totalOrders: 89,
    totalSpent: 456000,
    paymentTerms: "Net 60",
    status: "Active",
    products: ["Sapphires", "Rubies", "Emeralds"],
  },
  {
    id: "3",
    name: "Diamond Direct LLC",
    code: "US-003",
    category: "Diamonds",
    country: "United States",
    contact: {
      email: "info@diamonddirect.com",
      phone: "+1 310 555 7890",
      address: "Los Angeles, CA, USA",
    },
    rating: 4.7,
    totalOrders: 45,
    totalSpent: 890000,
    paymentTerms: "Net 30",
    status: "Active",
    products: ["Round Brilliant", "Princess Cut", "Emerald Cut"],
  },
  {
    id: "4",
    name: "Pearl Imports Ltd.",
    code: "JP-004",
    category: "Pearls",
    country: "Japan",
    contact: {
      email: "contact@pearlimports.jp",
      phone: "+81 3 1234 5678",
      address: "Tokyo, Japan",
    },
    rating: 4.6,
    totalOrders: 67,
    totalSpent: 123000,
    paymentTerms: "Net 45",
    status: "Active",
    products: ["Akoya Pearls", "South Sea Pearls"],
  },
  {
    id: "5",
    name: "Gold Metals Supply",
    code: "CN-005",
    category: "Materials",
    country: "China",
    contact: {
      email: "info@goldmetals.cn",
      phone: "+86 10 8888 9999",
      address: "Beijing, China",
    },
    rating: 4.5,
    totalOrders: 122,
    totalSpent: 345000,
    paymentTerms: "Net 30",
    status: "Active",
    products: ["24K Gold", "18K Gold", "White Gold"],
  },
  {
    id: "6",
    name: "Thai Jewelry Components",
    code: "TH-006",
    category: "Components",
    country: "Thailand",
    contact: {
      email: "sales@thaijewelry.th",
      phone: "+66 2 555 1234",
      address: "Bangkok, Thailand",
    },
    rating: 4.3,
    totalOrders: 78,
    totalSpent: 89000,
    paymentTerms: "Net 45",
    status: "Active",
    products: ["Clasps", "Chains", "Settings"],
  },
  {
    id: "7",
    name: "European Diamonds GmbH",
    code: "DE-007",
    category: "Diamonds",
    country: "Germany",
    contact: {
      email: "contact@eurodiamonds.de",
      phone: "+49 30 1234 5678",
      address: "Berlin, Germany",
    },
    rating: 4.9,
    totalOrders: 34,
    totalSpent: 1200000,
    paymentTerms: "Net 60",
    status: "Active",
    products: ["Certified Diamonds", "Fancy Cuts"],
  },
  {
    id: "8",
    name: "New Vendor Pending",
    code: "PEND-008",
    category: "Gemstones",
    country: "India",
    contact: {
      email: "info@newvendor.in",
      phone: "+91 11 9999 8888",
      address: "Mumbai, India",
    },
    rating: 0,
    totalOrders: 0,
    totalSpent: 0,
    paymentTerms: "TBD",
    status: "Pending",
    products: [],
  },
  {
    id: "9",
    name: "Australian Opal Traders",
    code: "AU-009",
    category: "Gemstones",
    country: "Australia",
    contact: {
      email: "sales@auopal.com.au",
      phone: "+61 2 9876 5432",
      address: "Sydney, Australia",
    },
    rating: 4.7,
    totalOrders: 52,
    totalSpent: 178000,
    paymentTerms: "Net 30",
    status: "Active",
    products: ["Black Opal", "Boulder Opal", "White Opal"],
  },
  {
    id: "10",
    name: "Italian Gold Artisans",
    code: "IT-010",
    category: "Materials",
    country: "Italy",
    contact: {
      email: "info@italiangold.it",
      phone: "+39 06 1234 5678",
      address: "Rome, Italy",
    },
    rating: 4.8,
    totalOrders: 94,
    totalSpent: 567000,
    paymentTerms: "Net 45",
    status: "Active",
    products: ["Italian Gold Chain", "Filigree Components", "Gold Clasps"],
  },
];
