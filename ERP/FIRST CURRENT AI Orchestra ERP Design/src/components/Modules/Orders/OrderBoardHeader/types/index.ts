/**
 * OrderBoardHeader Module - Type Definitions
 * 
 * Type definitions for the Order Board header component
 */

export interface Store {
  value: string;
  label: string;
}

export interface OrderBoardHeaderProps {
  onCreateOrder: (store: string) => void;
  onCreateCoupon: (store: string) => void;
  onCreateCart: (store: string) => void;
  onRefresh?: () => void;
  stores: Store[];
}
