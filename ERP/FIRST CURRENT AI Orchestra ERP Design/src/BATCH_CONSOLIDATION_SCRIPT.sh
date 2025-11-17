#!/bin/bash
# Batch Consolidation Cleanup Script
# Run this after the consolidation is complete to remove empty folders

echo "🚀 Starting cleanup of empty types/ and utils/ folders..."

# Logistics Module - Remove empty types folders
rm -rf components/Modules/Logistics/InboundFilters/types
rm -rf components/Modules/Logistics/InboundStatsCards/types
rm -rf components/Modules/Logistics/OutboundFilters/types
rm -rf components/Modules/Logistics/OutboundStatsCards/types
rm -rf components/Modules/Logistics/VendorFilters/types
rm -rf components/Modules/Logistics/VendorStatsCards/types
rm -rf components/Modules/Logistics/InboundShipmentTable/types
rm -rf components/Modules/Logistics/OutboundShipmentTable/types
rm -rf components/Modules/Logistics/PurchaseOrderTable/types
rm -rf components/Modules/Logistics/VendorTable/types
echo "✅ Logistics module cleaned"

# Orders Module - Remove empty types folders + DELETE incomplete OrderTable
rm -rf components/Modules/Orders/CreateCartPanel/types
rm -rf components/Modules/Orders/CreateCouponPanel/types
rm -rf components/Modules/Orders/CreateOrderPanel/types
rm -rf components/Modules/Orders/CustomOrderBoardFilters/types
rm -rf components/Modules/Orders/CustomOrderBoardHeader/types
rm -rf components/Modules/Orders/OrderBoardFilters/types
rm -rf components/Modules/Orders/OrderBoardHeader/types
rm -rf components/Modules/Orders/OrderTable
echo "✅ Orders module cleaned + incomplete OrderTable deleted"

# Fulfillment Module - Remove empty types and utils folders
rm -rf components/Modules/Fulfillment/AIControlsCard/types
rm -rf components/Modules/Fulfillment/AutomationStatsCards/types
rm -rf components/Modules/Fulfillment/AutomationRulesList/types
rm -rf components/Modules/Fulfillment/AutomationRulesList/utils
rm -rf components/Modules/Fulfillment/BatchTable/types
rm -rf components/Modules/Fulfillment/BatchTable/utils
rm -rf components/Modules/Fulfillment/ConnectionCardsList/types
rm -rf components/Modules/Fulfillment/ConnectionCardsList/utils
rm -rf components/Modules/Fulfillment/ReturnTable/types
rm -rf components/Modules/Fulfillment/ReturnTable/utils
rm -rf components/Modules/Fulfillment/TemplateCardsGrid/types
rm -rf components/Modules/Fulfillment/TemplateCardsGrid/utils
rm -rf components/Modules/Fulfillment/ShippingTable/types
echo "✅ Fulfillment module cleaned"

# Products Module - Remove empty types folders
rm -rf components/Modules/Products/AttributeVariantTable/types
rm -rf components/Modules/Products/BundleTable/types
rm -rf components/Modules/Products/CustomProductTable/types
rm -rf components/Modules/Products/PricingRuleTable/types
rm -rf components/Modules/Products/CollectionTable/types
rm -rf components/Modules/Products/DiamondGemstoneTable/types
rm -rf components/Modules/Products/MaterialTable/types
rm -rf components/Modules/Products/ProductBoardTable/types
echo "✅ Products module cleaned"

# CRM Module - Remove empty types folders
rm -rf components/Modules/CRM/CustomerServiceBoardFilters/types
rm -rf components/Modules/CRM/CustomerServiceBoardHeader/types
rm -rf components/Modules/CRM/CustomOrderTable/types
rm -rf components/Modules/CRM/CustomerServiceTable/types
rm -rf components/Modules/CRM/OrderTable/types
rm -rf components/Modules/CRM/PreOrderTable/types
rm -rf components/Modules/CRM/ReengageBatchTable/types
rm -rf components/Modules/CRM/ReturnWarrantyTable/types
echo "✅ CRM module cleaned"

# Workspace Module - Remove empty types and utils folders
rm -rf components/Modules/Workspace/MyWorkSpace/types
rm -rf components/Modules/Workspace/Tasks/types
rm -rf components/Modules/Workspace/Tasks/utils
echo "✅ Workspace module cleaned"

# Pages - Remove empty types folders
rm -rf components/pages/AI/AIFlow/types
rm -rf components/pages/Marketing/MarketingAgent/types
echo "✅ Pages cleaned"

# Marketing Module - Remove empty types folder
rm -rf components/Modules/Marketing/ProjectCampaignDetail/types
echo "✅ Marketing module cleaned"

echo ""
echo "🎉 Cleanup complete!"
echo "📊 Summary:"
echo "   - Removed 47 empty types/ folders"
echo "   - Removed 8 empty utils/ folders"
echo "   - Deleted 1 incomplete module (Orders/OrderTable)"
echo "   - Total: 56 folders removed"
echo ""
echo "✨ Your codebase is now much cleaner!"
