# Quick Start Guide - Using Centralized Types & Utils

## 🚀 For New Components

### Before (❌ Old Way):
```typescript
// DON'T: Creating duplicate types
interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface MyPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// DON'T: Creating duplicate utilities
const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString()}`;
};

const getStatusColor = (status: string) => {
  switch(status) { ... }
};
```

### After (✅ New Way):
```typescript
// DO: Import from centralized locations
import type { DateRange, BasePanelProps } from '@/types';
import { formatCurrency, getOrderStatusVariant } from '@/utils';

// Extend base types when needed
interface MyPanelProps extends BasePanelProps {
  customProp?: string;
}

// Use utilities directly
const price = formatCurrency(1234.56); // "$1,234.56"
const variant = getOrderStatusVariant('shipped'); // "info"
```

---

## 📦 Common Imports Cheat Sheet

### Types
```typescript
// Common types
import type { 
  DateRange,           // Date picker ranges
  BaseEntity,          // id, createdAt, updatedAt
  UserReference,       // User info
  Option,              // Select options
  TeamType,            // Team types
  PriorityLevel        // Priority levels
} from '@/types';

// Status types
import type {
  OrderStatus,         // Order statuses
  PaymentStatus,       // Payment statuses
  ShipmentStatus,      // Shipment statuses
  TaskStatus,          // Task statuses
  ProductStatus        // Product statuses
} from '@/types/status';

// Table types
import type {
  TableColumn,         // Column definition
  TableState,          // Table state
  RowSelectionState,   // Selected rows
  TableAction          // Row actions
} from '@/types/tables';

// Filter types
import type {
  BaseFilterProps,     // Base filter props
  CommonFilters,       // Common filter fields
  FilterRule           // Filter rules
} from '@/types/filters';

// Form types
import type {
  BasePanelProps,      // Panel props (isOpen, onClose)
  EditPanelProps,      // Edit panel (adds data, mode)
  FormState,           // Form state management
  Address,             // Address type
  ContactInfo          // Contact info
} from '@/types/forms';
```

### Utilities
```typescript
// Formatting
import {
  formatCurrency,      // $1,234.56
  formatNumber,        // 1,234.56
  formatPercent,       // 12.5%
  formatPhone,         // (123) 456-7890
  formatFileSize,      // 1.5 MB
  truncate,            // Text ellipsis
  capitalize,          // First letter caps
  toTitleCase          // Title Case
} from '@/utils/formatting';

// Dates
import {
  formatDate,          // MMM dd, yyyy
  formatDateTime,      // MMM dd, yyyy HH:mm
  formatTime,          // HH:mm
  formatRelativeTime,  // "2 hours ago"
  getDateRange,        // Get range for period
  getToday             // Today at 00:00:00
} from '@/utils/date';

// Status helpers
import {
  getOrderStatusVariant,     // Order badge variant
  getPaymentStatusVariant,   // Payment badge variant
  getShipmentStatusVariant,  // Shipment badge variant
  getTaskStatusVariant,      // Task badge variant
  getProductStatusVariant,   // Product badge variant
  formatStatusText           // Format status display
} from '@/utils/status';

// Validation
import {
  isValidEmail,        // Email validation
  isValidPhone,        // Phone validation
  isValidUrl,          // URL validation
  isRequired,          // Required field
  minLength,           // Min length
  maxLength,           // Max length
  isValidSKU           // SKU validation
} from '@/utils/validation';

// Sorting
import {
  sortBy,              // Sort by field
  sortByMultiple,      // Multi-field sort
  naturalSort,         // Natural string sort
  sortByStatusPriority // Status priority sort
} from '@/utils/sorting';

// Filtering
import {
  filterBySearch,      // Search multiple fields
  filterByStatus,      // Filter by status
  filterByDateRange,   // Filter by date range
  filterByFields,      // Multi-field filter
  applyFilters         // Apply multiple filters
} from '@/utils/filtering';

// Table utilities
import {
  getSelectedIds,      // Get selected row IDs
  getSelectedRows,     // Get selected row data
  toggleAllRows,       // Select/deselect all
  paginateData,        // Paginate data
  exportToCSV          // Export to CSV
} from '@/utils/table';
```

---

## 💡 Common Patterns

### 1. Creating a Filter Component
```typescript
import type { BaseFilterProps, DateRange } from '@/types';
import { getDateRange } from '@/utils/date';

interface MyFiltersProps extends BaseFilterProps {
  status: string;
  onStatusChange: (status: string) => void;
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

export function MyFilters({ 
  status, 
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onFilterChange,
  onReset 
}: MyFiltersProps) {
  // Component implementation
}
```

### 2. Creating a Panel
```typescript
import type { BasePanelProps } from '@/types';

interface CreateProductPanelProps extends BasePanelProps {
  onSuccess?: (product: Product) => void;
}

export function CreateProductPanel({
  open,
  onOpenChange,
  onSuccess
}: CreateProductPanelProps) {
  // Panel implementation
}
```

### 3. Status Badge
```typescript
import { InfoBadge } from '@/components/ui/info-badge';
import { getOrderStatusVariant } from '@/utils/status';

<InfoBadge variant={getOrderStatusVariant(order.status)}>
  {order.status}
</InfoBadge>
```

### 4. Formatting Values
```typescript
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils';

<div className="space-y-1">
  <p>{formatCurrency(order.total)}</p>
  <p>{formatDate(order.createdAt)}</p>
  <p className="text-xs text-gray-500">
    {formatRelativeTime(order.createdAt)}
  </p>
</div>
```

### 5. Filtering Data
```typescript
import { filterBySearch, filterByStatus } from '@/utils';

const filteredOrders = filterByStatus(
  filterBySearch(orders, searchQuery, ['orderNumber', 'customer']),
  'status',
  selectedStatus
);
```

### 6. Sorting Data
```typescript
import { sortBy } from '@/utils';

const sortedOrders = sortBy(orders, 'createdAt', 'desc');
```

---

## 🎯 Decision Tree: Module-Specific vs Global

### Use Global Types/Utils When:
- ✅ Used in 3+ modules
- ✅ Standard business logic (currency, dates)
- ✅ Common patterns (filters, panels, tables)
- ✅ Validation rules
- ✅ Status enums

### Keep Module-Specific When:
- ✅ Domain-specific business logic
- ✅ Unique to one module
- ✅ Complex calculations specific to domain
- ✅ Module-specific constants (e.g., shipping carriers)
- ✅ Specialized data transformations

### Example:
```typescript
// ✅ Global
import { formatCurrency, getOrderStatusVariant } from '@/utils';

// ✅ Module-specific
import { calculateShippingCost } from './utils/shippingCalculations';
import { CARRIERS } from './utils/constants';
```

---

## 🔍 Finding What You Need

### Need a Type?
1. Check `/types/common.ts` first
2. Then `/types/status.ts` for status enums
3. Then `/types/tables.ts` for table-related
4. Then `/types/filters.ts` for filter-related
5. Then `/types/forms.ts` for form/panel-related

### Need a Utility?
1. Formatting numbers/text? → `/utils/formatting.ts`
2. Working with dates? → `/utils/date.ts`
3. Status badges? → `/utils/status.ts`
4. Validation? → `/utils/validation.ts`
5. Sorting? → `/utils/sorting.ts`
6. Filtering? → `/utils/filtering.ts`
7. Table operations? → `/utils/table.ts`

### Not Sure?
- Check `/CODEBASE_ANALYSIS.md` for detailed patterns
- Check `/ORGANIZATION_SUMMARY.md` for overview
- Search existing code for similar usage

---

## ⚠️ Common Mistakes to Avoid

### ❌ DON'T:
```typescript
// Don't create duplicate types
export interface DateRange { ... }

// Don't duplicate utilities
const formatMoney = (amount) => `$${amount}`;

// Don't hardcode status variants
const variant = status === 'pending' ? 'warning' : 'success';

// Don't create custom date formatters
const displayDate = new Date(date).toLocaleDateString();
```

### ✅ DO:
```typescript
// Import from centralized locations
import type { DateRange } from '@/types';
import { formatCurrency, getOrderStatusVariant, formatDate } from '@/utils';

// Use centralized helpers
const price = formatCurrency(1234);
const variant = getOrderStatusVariant(status);
const displayDate = formatDate(date, 'MMM dd, yyyy');
```

---

## 📚 Further Reading

- **Detailed Analysis:** `/CODEBASE_ANALYSIS.md`
- **Organization Summary:** `/ORGANIZATION_SUMMARY.md`
- **Type Definitions:** `/types/*`
- **Utility Functions:** `/utils/*`
- **Config/Constants:** `/lib/config/*`

---

## 🎉 You're Ready!

Start building with confidence using our centralized types and utilities. 

**Questions?** Check the analysis docs or search existing usage in the codebase.
