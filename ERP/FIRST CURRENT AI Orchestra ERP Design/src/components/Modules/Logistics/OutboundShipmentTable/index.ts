export { OutboundShipmentTableModule } from "./OutboundShipmentTableModule";
export type { OutboundShipment, OutboundShipmentTableProps } from "./types";

// Re-export constants for convenience
export { STATUS_COLORS } from "./utils/constants";

// Re-export helpers
export { formatDate, getStatusIcon, sortByStatus } from "./utils/helpers";
