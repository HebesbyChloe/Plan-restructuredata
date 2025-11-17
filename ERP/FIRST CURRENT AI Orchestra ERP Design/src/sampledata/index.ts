// Central export point for all sample data
// This allows for cleaner imports: import { mockCustomers, mockProducts } from '@/sampledata'

// Raw data exports
export * from './customers';
export * from './products';
export * from './orders';
export * from './users';
export * from './campaigns';
export * from './tasks';
export * from './vendors';
export * from './materials';
export * from './endShiftReports';
export * from './requestOffData';
export * from './timesheetData';
export * from './SampleRequestSchedule';
export * from './reengageBatches';
export * from './orderBoardData';
export * from './preOrderData';
export * from './customOrderData';
export * from './returnWarrantyData';
export * from './customerServiceData';
export * from './socialReviewData';
export * from './productCatalog';
export * from './promotions';
export * from './customizeOrderExtraData';
export * from './returnWarrantyExtraData';
export * from './internalOrderDataExtra';

// Product Management Data
export * from './categories';
export * from './collections';
export * from './diamonds';
export * from './gemstones';
export * from './attributes';
export * from './variants';
export * from './bundles';
export * from './pricingRules';
export * from './productsEnhanced';
export * from './customProducts';

// Fulfillment Data
export * from './shipments';
export * from './batches';
export * from './inventory';
export * from './automationData';

// Logistics Data
export * from './inboundShipments';
export * from './outboundShipments';

// Enhanced Fulfillment Data (with proper relationships)
export * from './ordersEnhanced';
export * from './shipmentsEnhanced';
export * from './batchesEnhanced';
export * from './returnsEnhanced';
export * from './returnShipmentsEnhanced';

// Computed data exports
export * from './computed/salesMetrics';
export * from './computed/customerStats';
export * from './computed/dashboardMetrics';
