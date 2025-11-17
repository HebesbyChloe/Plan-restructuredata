/**
 * CreateOrderPanel Module - Type Definitions
 */

export interface Store {
  value: string;
  label: string;
}

export interface CreateOrderPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedStore: string;
  stores: Store[];
  onSubmit?: (orderData: any) => void;
}
