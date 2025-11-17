/**
 * CreateCartPanel Module - Type Definitions
 */

export interface Store {
  value: string;
  label: string;
}

export interface CreateCartPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string;
  stores: Store[];
  onSubmit?: (cartData: any) => void;
}
