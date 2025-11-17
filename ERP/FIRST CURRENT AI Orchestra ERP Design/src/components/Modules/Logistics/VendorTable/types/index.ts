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

export interface VendorTableProps {
  data: Vendor[];
  onVendorClick?: (vendor: Vendor) => void;
  onCreatePO?: (vendor: Vendor) => void;
  searchTerm?: string;
  selectedCategory?: string;
  selectedCountry?: string;
}
