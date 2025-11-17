import { ReturnShipmentData } from "../../../../../sampledata/returnShipmentsEnhanced";

export type { ReturnShipmentData };

export interface ReturnTableModuleProps {
  returns: ReturnShipmentData[];
  onReturnClick?: (returnShipment: ReturnShipmentData) => void;
}
