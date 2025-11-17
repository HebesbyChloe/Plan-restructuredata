/**
 * TypeScript Types: Vendor Filters Module
 */

export interface VendorFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedCountry: string;
  onCountryChange: (value: string) => void;
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
}
