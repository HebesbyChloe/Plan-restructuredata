# Workflow & AI Department

## Overview
This document shows the complete Workflow & AI schema structure with data types, foreign keys, and change indicators.

**Legend:**
- 🆕 **NEW** - Newly created tables
- 🔄 **NORMALIZED** - Comma-separated values moved to junction tables
- 🗑️ **REMOVED** - Fields/tables removed or consolidated
- ✏️ **RENAMED** - Table/column renamed
- 📊 **DENORMALIZED** - Denormalized for performance (if any)

---

## Core Tables

#### `workflow` ✏️ (renamed from `db_workflow_ai`)
**Status**: AI workflow management

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | BIGSERIAL | PRIMARY KEY | |
| `uuid_page` | VARCHAR(255) | DEFAULT NULL | |
| `name` | VARCHAR(255) | NOT NULL | |
| `description` | TEXT | DEFAULT NULL | |
| `source` | workflow_source | DEFAULT 'internal' | 🆕 ENUM type |
| `status` | workflow_status | DEFAULT 'draft' | 🆕 ENUM type |
| `trigger_type` | workflow_trigger_type | DEFAULT 'manual' | 🆕 ENUM type |
| `trigger_config` | JSONB | DEFAULT NULL | 🆕 Changed to JSONB |
| `nodes` | JSONB | DEFAULT NULL | 🆕 Changed to JSONB |
| `edges` | JSONB | DEFAULT NULL | 🆕 Changed to JSONB |
| `runs_count` | INTEGER | DEFAULT 0 | |
| `success_rate` | NUMERIC(5,2) | DEFAULT 0.00 | |
| `last_run_at` | TIMESTAMP WITH TIME ZONE | DEFAULT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_created` |
| `updated_at` | TIMESTAMP WITH TIME ZONE | DEFAULT CURRENT_TIMESTAMP | ✏️ Renamed from `date_updated` |

**ENUM Types:**
- `workflow_source`: 'internal', 'n8n', 'gpts', 'zapier', 'make'
- `workflow_status`: 'active', 'paused', 'draft'
- `workflow_trigger_type`: 'webhook', 'event', 'schedule', 'manual'

**Indexes:**
- `idx_workflow_status`
- `idx_workflow_source`
- `idx_workflow_trigger_type`

---

## Summary

### Tables in Workflow & AI Department
1. **workflow** - AI workflow management

### Key Features
- **ENUM Types**: Source, status, and trigger type use ENUM types for data integrity
- **JSONB Fields**: Flexible schema for workflow configuration (trigger_config, nodes, edges)
- **Integration Support**: Multiple workflow sources (n8n, Zapier, Make, GPTs)
- **Performance Tracking**: Runs count and success rate tracking
- **Indexes**: Optimized for common queries (status, source, trigger_type)

### Relationships
- No direct foreign keys (standalone workflow system)

### Workflow Features
- **Multiple Sources**: Support for internal, n8n, GPTs, Zapier, and Make
- **Trigger Types**: Webhook, event, schedule, and manual triggers
- **Configuration**: JSONB fields for flexible workflow definitions
- **Status Management**: Active, paused, and draft states
- **Performance Metrics**: Track runs and success rates

