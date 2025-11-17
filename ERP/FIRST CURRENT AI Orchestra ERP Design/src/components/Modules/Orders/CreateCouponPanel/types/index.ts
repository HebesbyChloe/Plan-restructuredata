/**
 * CreateCouponPanel Module - Type Definitions
 */

export interface Store {
  value: string;
  label: string;
}

export interface CreateCouponPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string;
  stores: Store[];
  onSubmit?: (couponData: any) => void;
}
