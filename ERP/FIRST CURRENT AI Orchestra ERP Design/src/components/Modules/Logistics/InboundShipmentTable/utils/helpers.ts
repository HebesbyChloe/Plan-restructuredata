import { InboundShipment } from "../types";

export function filterInboundShipments(
  shipments: InboundShipment[],
  searchTerm: string,
  status: string,
  location: string
): InboundShipment[] {
  return shipments.filter((shipment) => {
    const matchesSearch =
      !searchTerm ||
      shipment.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (shipment.vendor &&
        shipment.vendor.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (shipment.poNumber &&
        shipment.poNumber.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      !status ||
      status === "all" ||
      shipment.status.toLowerCase() === status.toLowerCase();

    const matchesLocation =
      !location ||
      location === "all" ||
      shipment.location.toLowerCase() === location.toLowerCase();

    return matchesSearch && matchesStatus && matchesLocation;
  });
}

export function getInboundShipmentStats(shipments: InboundShipment[]) {
  const complete = shipments.filter((s) => s.status === "Complete").length;
  const incoming = shipments.filter((s) => s.status === "Incoming").length;
  const processing = shipments.filter((s) => s.status === "Processing").length;
  const delayed = shipments.filter((s) => s.status === "Delayed").length;
  const totalItems = shipments.reduce((sum, s) => sum + s.items, 0);
  const totalProducts = shipments.reduce((sum, s) => sum + s.products, 0);

  return {
    total: shipments.length,
    complete,
    incoming,
    processing,
    delayed,
    totalItems,
    totalProducts,
  };
}
