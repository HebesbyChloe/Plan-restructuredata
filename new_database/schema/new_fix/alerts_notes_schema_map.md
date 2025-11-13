# Alerts & Notes System Schema

## Overview
This document provides a complete skeleton map and detailed listing of the alerts and notes system in the ERP. The system manages alert types/keys, alert instances tied to entities, and general notes attached to entities.

**Legend:**
- 🔗 **Foreign Key** - Relationship to another table
- 📊 **Indexed** - Column has an index for performance
- 🔒 **Unique** - Column has unique constraint
- ⏰ **Timestamp** - Time tracking column
- ✅ **Check Constraint** - Value validation constraint

---

## Schema Skeleton Map

```
┌─────────────────────────────────────────────────────────────────┐
│                   ALERTS & NOTES SYSTEM SCHEMA                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      alert_keys                                  │
│  ────────────────────────────────────────────────────────────  │
│  • Registry of alert types/keys                                 │
│  • Defines: key, name, severity, active status                 │
│  • Unique: key                                                  │
│  • Severity: 'low', 'medium', 'high', 'critical'               │
└─────────────────────────────────────────────────────────────────┘
         │
         │ Referenced by alerts
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                         alerts                                   │
│  ────────────────────────────────────────────────────────────  │
│  • Alert instances tied to entities                             │
│  • Links to: alert_keys                                         │
│  • Tracks: entity, alert type, creator, resolution              │
│  • Polymorphic: entity_type + entity_id                         │
└─────────────────────────────────────────────────────────────────┘
         │
         │ FK: alert_key_id
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                      alert_keys                                  │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                         notes                                    │
│  ────────────────────────────────────────────────────────────  │
│  • General notes attached to entities                           │
│  • Links to: hr_staff (creator)                                 │
│  • Tracks: entity, content, creator, tenant                     │
│  • Polymorphic: entity_type + entity_id                         │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── FK: created_by ────► hr_staff


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                  │
│  ────────────────────────────────────────────────────────────  │
│  • hr_staff          - Staff/employee records                   │
│  • sys_tenants       - Tenant management (referenced by notes)  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Table Details

### 1. `alert_keys`
**Purpose:** Registry of alert types/keys that define the available alert categories in the system.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `key` | VARCHAR | UNIQUE, NOT NULL | 🔒 Unique identifier for alert type (e.g., 'low_stock', 'payment_failed') |
| `alert_name` | VARCHAR | NOT NULL | Human-readable name (e.g., 'Low Stock Alert', 'Payment Failed') |
| `severity` | VARCHAR | NOT NULL, CHECK constraint | ✅ Severity level: 'low', 'medium', 'high', 'critical' |
| `active` | BOOLEAN | NOT NULL, DEFAULT true | Whether this alert type is currently active/enabled |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Check Constraints:**
- `severity` must be one of: 'low', 'medium', 'high', 'critical'

**Use Cases:**
- Define alert types available in the system
- Configure alert severity levels
- Enable/disable alert types without deleting them
- Reference catalog for alert instances

**Example Alert Keys:**
- `low_stock` - "Low Stock Alert" (severity: 'high')
- `payment_failed` - "Payment Failed" (severity: 'critical')
- `shipment_delayed` - "Shipment Delayed" (severity: 'medium')
- `order_abandoned` - "Order Abandoned" (severity: 'low')

---

### 2. `alerts`
**Purpose:** Alert instances tied to specific entities (polymorphic relationship).

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `entity_type` | VARCHAR | NOT NULL | Type of entity (e.g., 'order', 'product', 'shipment', 'customer') |
| `entity_id` | BIGINT | NOT NULL | ID of the affected entity |
| `alert_key_id` | BIGINT | NOT NULL, FK → `alert_keys(id)` | 🔗 Reference to alert type definition |
| `created_by` | BIGINT | NULL | User/staff ID who created the alert (if manual) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Alert creation timestamp |
| `resolved_at` | TIMESTAMPTZ | NULL | ⏰ Alert resolution timestamp (NULL = unresolved) |

**Foreign Keys:**
- `alert_key_id` → `public.alert_keys(id)` (Constraint: `alerts_alert_key_id_fkey`)

**Polymorphic Relationship:**
- Uses `entity_type` + `entity_id` to reference any entity in the system
- Common entity types: 'order', 'product', 'shipment', 'customer', 'inventory', etc.

**Use Cases:**
- Track low stock alerts for products
- Monitor payment failures for orders
- Alert on shipment delays
- Flag abandoned carts
- System-generated alerts for various conditions
- Manual alerts created by staff

**Alert Lifecycle:**
- Created: `created_at` is set, `resolved_at` is NULL
- Resolved: `resolved_at` is set to resolution timestamp
- Query unresolved: `WHERE resolved_at IS NULL`

---

### 3. `notes`
**Purpose:** General notes attached to entities (polymorphic relationship) for comments, observations, and documentation.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGINT | PRIMARY KEY, GENERATED BY DEFAULT AS IDENTITY | Auto-incrementing primary key |
| `entity_type` | VARCHAR | NOT NULL | Type of entity (e.g., 'order', 'product', 'customer', 'shipment') |
| `entity_id` | BIGINT | NOT NULL | ID of the affected entity |
| `content` | TEXT | NOT NULL | Note content/text |
| `created_by` | BIGINT | NULL, FK → `hr_staff(id)` | 🔗 Staff member who created the note |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Note creation timestamp |
| `tenant_id` | INTEGER | NULL | Multi-tenant support (optional) |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `created_by` → `public.hr_staff(id)` (Constraint: `notes_created_by_fkey`)

**Polymorphic Relationship:**
- Uses `entity_type` + `entity_id` to reference any entity in the system
- Common entity types: 'order', 'product', 'customer', 'shipment', 'inventory', etc.

**Use Cases:**
- Customer service notes on orders
- Product notes and observations
- Internal comments on shipments
- Staff communication and collaboration
- Documentation and history tracking
- Multi-tenant note isolation

**Note Features:**
- Supports rich text content
- Tracks creator and timestamps
- Can be updated (tracked via `updated_at`)
- Tenant-aware for multi-tenant deployments

---

## Relationships Summary

### Internal Relationships

1. **`alert_keys` → `alerts`** (One-to-Many)
   - One alert key can have many alert instances
   - `alerts.alert_key_id` → `alert_keys.id`
   - Cascade behavior: Consider ON DELETE RESTRICT to prevent deleting alert keys with active alerts

### External Dependencies

1. **`hr_staff`** - Referenced by:
   - `notes.created_by`

2. **`sys_tenants`** - Referenced by:
   - `notes.tenant_id` (optional, for multi-tenant support)

---

## Index Recommendations

For optimal query performance, consider adding indexes on:

### `alert_keys`
- `key` (already unique, ensure index exists)
- `active` (filtering active/inactive alert types)
- `severity` (filtering by severity level)

### `alerts`
- `alert_key_id` (FK lookup, join performance)
- `entity_type, entity_id` (composite index for entity lookups) 📊 **CRITICAL**
- `resolved_at` (filtering unresolved alerts)
- `created_at` (time-based queries, sorting)
- `created_by` (filtering by creator)
- Composite: `(entity_type, entity_id, resolved_at)` for common query pattern

### `notes`
- `entity_type, entity_id` (composite index for entity lookups) 📊 **CRITICAL**
- `created_by` (FK lookup, filtering by creator)
- `created_at` (time-based queries, sorting)
- `updated_at` (tracking recent updates)
- `tenant_id` (multi-tenant filtering, if used)
- Composite: `(entity_type, entity_id, created_at)` for entity note history

---

## Data Patterns

### Alert Patterns

**Unresolved Alerts by Severity:**
```sql
SELECT ak.severity, COUNT(*) as count
FROM alerts a
JOIN alert_keys ak ON a.alert_key_id = ak.id
WHERE a.resolved_at IS NULL
GROUP BY ak.severity
ORDER BY 
  CASE ak.severity 
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END;
```

**Alerts for Specific Entity:**
```sql
SELECT a.*, ak.alert_name, ak.severity
FROM alerts a
JOIN alert_keys ak ON a.alert_key_id = ak.id
WHERE a.entity_type = ? AND a.entity_id = ?
ORDER BY 
  CASE ak.severity 
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  a.created_at DESC;
```

**Active Alert Types:**
```sql
SELECT * FROM alert_keys
WHERE active = true
ORDER BY 
  CASE severity 
    WHEN 'critical' THEN 1
    WHEN 'high' THEN 2
    WHEN 'medium' THEN 3
    WHEN 'low' THEN 4
  END,
  alert_name;
```

### Notes Patterns

**Notes for Specific Entity (Chronological):**
```sql
SELECT n.*, s.name as created_by_name
FROM notes n
LEFT JOIN hr_staff s ON n.created_by = s.id
WHERE n.entity_type = ? AND n.entity_id = ?
ORDER BY n.created_at DESC;
```

**Recent Notes Across All Entities:**
```sql
SELECT n.*, s.name as created_by_name
FROM notes n
LEFT JOIN hr_staff s ON n.created_by = s.id
WHERE n.tenant_id = ? -- if multi-tenant
ORDER BY n.updated_at DESC
LIMIT 50;
```

**Notes by Creator:**
```sql
SELECT n.*, s.name as created_by_name
FROM notes n
JOIN hr_staff s ON n.created_by = s.id
WHERE n.created_by = ?
ORDER BY n.created_at DESC;
```

---

## Common Query Patterns

### Alert Queries

**Get all unresolved critical alerts:**
```sql
SELECT a.*, ak.alert_name, ak.severity
FROM alerts a
JOIN alert_keys ak ON a.alert_key_id = ak.id
WHERE a.resolved_at IS NULL 
  AND ak.severity = 'critical'
ORDER BY a.created_at ASC;
```

**Resolve an alert:**
```sql
UPDATE alerts
SET resolved_at = NOW()
WHERE id = ?;
```

**Create a new alert:**
```sql
INSERT INTO alerts (entity_type, entity_id, alert_key_id, created_by)
VALUES (?, ?, 
  (SELECT id FROM alert_keys WHERE key = ?), 
  ?);
```

**Get alert statistics by entity:**
```sql
SELECT 
  entity_type,
  entity_id,
  COUNT(*) as total_alerts,
  COUNT(*) FILTER (WHERE resolved_at IS NULL) as unresolved_alerts
FROM alerts
GROUP BY entity_type, entity_id
HAVING COUNT(*) FILTER (WHERE resolved_at IS NULL) > 0;
```

### Notes Queries

**Get all notes for an order:**
```sql
SELECT n.*, s.name as created_by_name
FROM notes n
LEFT JOIN hr_staff s ON n.created_by = s.id
WHERE n.entity_type = 'order' AND n.entity_id = ?
ORDER BY n.created_at DESC;
```

**Create a new note:**
```sql
INSERT INTO notes (entity_type, entity_id, content, created_by, tenant_id)
VALUES (?, ?, ?, ?, ?);
```

**Update a note:**
```sql
UPDATE notes
SET content = ?, updated_at = NOW()
WHERE id = ?;
```

**Get notes updated in last 24 hours:**
```sql
SELECT n.*, s.name as created_by_name
FROM notes n
LEFT JOIN hr_staff s ON n.created_by = s.id
WHERE n.updated_at >= NOW() - INTERVAL '24 hours'
ORDER BY n.updated_at DESC;
```

---

## Design Considerations

### Alert System

1. **Alert Key Management:**
   - Alert keys should be created during system initialization
   - Use descriptive `key` values (e.g., 'low_stock', 'payment_failed')
   - The `active` flag allows disabling alert types without deleting them

2. **Alert Resolution:**
   - `resolved_at` being NULL indicates an unresolved alert
   - Consider adding a `resolved_by` column if tracking who resolved alerts
   - May want to add `resolution_notes` for context

3. **Severity Levels:**
   - Use severity for prioritization and filtering
   - Consider adding a `priority` integer field for custom sorting
   - Severity can drive notification channels (email, SMS, dashboard)

4. **Polymorphic Design:**
   - `entity_type` + `entity_id` allows alerts on any entity
   - Consider adding a CHECK constraint or enum for valid entity types
   - Index the composite `(entity_type, entity_id)` for performance

### Notes System

1. **Content Management:**
   - `content` is TEXT, allowing long-form notes
   - Consider adding support for rich text or markdown
   - May want to add `is_private` flag for internal-only notes

2. **Versioning:**
   - Current design allows updates but doesn't track history
   - Consider adding `notes_history` table if versioning is needed
   - `updated_at` tracks last modification time

3. **Multi-Tenancy:**
   - `tenant_id` is optional but recommended for multi-tenant deployments
   - Add index on `tenant_id` for tenant-scoped queries
   - Consider adding FK constraint to `sys_tenants` if tenant_id is always set

4. **Polymorphic Design:**
   - Same pattern as alerts: `entity_type` + `entity_id`
   - Consider adding CHECK constraint for valid entity types
   - Index the composite `(entity_type, entity_id)` for performance

---

## Potential Enhancements

### For `alerts` table:
- Add `resolved_by` (BIGINT, FK → `hr_staff.id`) - track who resolved
- Add `resolution_notes` (TEXT) - context for resolution
- Add `priority` (INTEGER) - custom priority beyond severity
- Add `expires_at` (TIMESTAMPTZ) - auto-expire alerts
- Add `notification_sent` (BOOLEAN) - track notification delivery
- Add `tenant_id` (INTEGER) - multi-tenant support

### For `notes` table:
- Add `is_private` (BOOLEAN) - private/internal notes flag
- Add `is_pinned` (BOOLEAN) - pin important notes
- Add `note_type` (VARCHAR) - categorize notes (e.g., 'internal', 'customer', 'system')
- Add `tags` (JSONB or separate table) - tag notes for organization
- Add `tenant_id` FK constraint if always set

### For `alert_keys` table:
- Add `description` (TEXT) - detailed description of alert type
- Add `category` (VARCHAR) - group alert types (e.g., 'inventory', 'payment', 'shipping')
- Add `notification_template` (TEXT) - template for notifications
- Add `auto_resolve_after` (INTERVAL) - auto-resolve after time period

---

## Integration Points

### With Logging System
- Alerts can be created from `logs_api` errors
- `logs_human` can track alert creation/resolution
- `logs_system` can track automated alert generation

### With Other Modules
- **Orders:** Alerts for payment failures, abandoned carts
- **Products:** Alerts for low stock, price changes
- **Shipments:** Alerts for delays, delivery issues
- **Customers:** Alerts for high-value customers, churn risk
- **Inventory:** Alerts for stock levels, reorder points

---

## Notes

- Both `alerts` and `notes` use polymorphic relationships via `entity_type` + `entity_id`
- Consider adding database-level constraints or application-level validation for valid entity types
- The `alert_keys` table acts as a catalog/reference table - changes here affect all alert instances
- `notes.tenant_id` is nullable - ensure application logic handles both single-tenant and multi-tenant scenarios
- Consider adding soft delete support (e.g., `deleted_at` column) if needed
- Both tables use `BIGINT` for IDs to support large-scale deployments

