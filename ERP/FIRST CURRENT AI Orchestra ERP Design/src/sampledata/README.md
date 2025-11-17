# Sample Data Structure

This directory contains all sample/mock data used throughout the AI Orchestra ERP system. Data is organized into two main categories:

## 📁 Directory Structure

```
/sampledata/
├── README.md                      # This file
├── customers.ts                   # Customer records
├── products.ts                    # Product catalog
├── orders.ts                      # Order records
├── users.ts                       # System users & team members
├── campaigns.ts                   # Marketing campaigns
├── tasks.ts                       # Task management data
├── vendors.ts                     # Vendor/supplier records
├── materials.ts                   # Raw materials & inventory
└── computed/                      # Computed/aggregated data
    ├── salesMetrics.ts           # Sales performance metrics
    ├── customerStats.ts          # Customer analytics
    └── dashboardMetrics.ts       # Dashboard KPIs & stats
```

## 📊 Data Categories

### Raw Data Tables
These files contain primary data records that represent actual entities in the system:

- **customers.ts** - Customer profiles, contact info, status, and interaction history
- **products.ts** - Product catalog with SKUs, pricing, inventory, and attributes
- **orders.ts** - Order records with customer, items, payment, and shipping info
- **users.ts** - System users, team members, roles, and permissions
- **campaigns.ts** - Marketing campaigns with budgets, metrics, and channels
- **tasks.ts** - Task records with assignments, priorities, and due dates
- **vendors.ts** - Vendor/supplier information and purchasing data
- **materials.ts** - Raw materials, components, and packaging inventory

### Computed Data
Located in `/sampledata/computed/`, these files contain aggregated, calculated, or derived data:

- **salesMetrics.ts** - Sales KPIs, team performance, conversion funnels, and trends
- **customerStats.ts** - Customer analytics, segmentation, LTV, and retention metrics
- **dashboardMetrics.ts** - Dashboard KPIs, quick stats, activities, and alerts

## 🔧 Usage

### Importing Data

```typescript
// Import raw data
import { mockCustomers } from '@/sampledata/customers';
import { mockProducts } from '@/sampledata/products';
import { mockOrders } from '@/sampledata/orders';

// Import computed data
import { dailySalesKPIs, teamPerformanceByBrand } from '@/sampledata/computed/salesMetrics';
import { customerStats } from '@/sampledata/computed/customerStats';
```

### Type Safety

All data files export TypeScript interfaces along with the mock data:

```typescript
import { Customer, mockCustomers } from '@/sampledata/customers';

// Use types for component props
interface CustomerListProps {
  customers: Customer[];
}
```

## 📝 Data Relationships

### Primary Relationships

- **Orders** reference **Customers** (via customer name/email)
- **Tasks** can relate to **Customers**, **Orders**, **Campaigns**, or **Products**
- **Products** use **Materials** (implicit relationship)
- **Orders** contain **Products** (implicit relationship)
- **Campaigns** track performance across **Orders** and **Customers**

### Computed Data Dependencies

- **salesMetrics.ts** aggregates data from **orders.ts** and **users.ts**
- **customerStats.ts** aggregates data from **customers.ts** and **orders.ts**
- **dashboardMetrics.ts** combines data from multiple sources

## 🎯 Best Practices

### 1. Separation of Concerns
- Keep raw data in root `/sampledata/`
- Keep computed/derived data in `/sampledata/computed/`
- Don't mix data logic with UI components

### 2. Data Consistency
- Use consistent ID formats across related data
- Maintain referential integrity in relationships
- Keep date formats consistent (ISO 8601 recommended)

### 3. Realistic Data
- Use realistic Vietnamese and English names
- Include edge cases (empty fields, various statuses)
- Reflect real business scenarios

### 4. Type Definitions
- Always export interfaces with data
- Use union types for status/enum fields
- Make optional fields explicit with `?`

## 🔄 Migration from Components

When refactoring components to use centralized sample data:

1. **Identify sample data** in the component file
2. **Move data** to appropriate file in `/sampledata/`
3. **Update imports** in the component
4. **Verify types** match and update if needed
5. **Test component** to ensure it works with imported data

### Example Refactor

**Before:**
```typescript
// In ProductBoardPage.tsx
const [products] = useState<Product[]>([
  { id: "1", sku: "JW-001", name: "Bracelet", ... },
  // ... more data
]);
```

**After:**
```typescript
// In ProductBoardPage.tsx
import { mockProducts } from '@/sampledata/products';

const [products] = useState(mockProducts);
```

## 📦 Future Additions

Planned data files to be added:

- `preorders.ts` - Pre-order records
- `shipments.ts` - Shipping and logistics data
- `transactions.ts` - Financial transactions
- `expenses.ts` - Business expenses
- `bills.ts` - Vendor invoices and bills
- `promotions.ts` - Promotion and discount records
- `returns.ts` - Return and warranty data
- `bundles.ts` - Product bundle configurations
- `diamonds.ts` - Diamond and gemstone inventory
- `computed/productAnalytics.ts` - Product performance metrics
- `computed/campaignMetrics.ts` - Campaign ROI and analytics
- `computed/financialSummary.ts` - Financial dashboards
- `computed/inventoryMetrics.ts` - Stock and inventory analytics

## 🤝 Contributing

When adding new sample data files:

1. Create TypeScript file with `.ts` extension
2. Export interface(s) for type definitions
3. Export `mock[EntityName]` array with sample records
4. Update this README with file description
5. Ensure data is realistic and diverse
6. Include at least 5-7 sample records
7. Follow existing naming conventions

## 📚 Related Documentation

- See `/lib/config/constants.ts` for system constants and enums
- See `/lib/config/enums.ts` for status values and categories
- See component-specific README files for usage examples
