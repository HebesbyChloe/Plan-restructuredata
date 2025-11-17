import { Vendor } from "../types";

export function filterVendors(
  vendors: Vendor[],
  searchTerm: string,
  category: string,
  country: string
): Vendor[] {
  return vendors.filter((vendor) => {
    const matchesSearch =
      !searchTerm ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      !category ||
      category === "all" ||
      vendor.category.toLowerCase() === category.toLowerCase();

    const matchesCountry =
      !country ||
      country === "all" ||
      vendor.country.toLowerCase() === country.toLowerCase();

    return matchesSearch && matchesCategory && matchesCountry;
  });
}

export function getVendorStats(vendors: Vendor[]) {
  const activeVendors = vendors.filter((v) => v.status === "Active").length;
  const totalSpent = vendors.reduce((sum, v) => sum + v.totalSpent, 0);
  const avgRating =
    vendors.length > 0
      ? vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.length
      : 0;

  return {
    total: vendors.length,
    active: activeVendors,
    totalSpent,
    avgRating,
  };
}
