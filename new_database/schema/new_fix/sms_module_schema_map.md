# SMS Module Schema

## Overview
This document provides a complete skeleton map and detailed listing of all SMS-related tables in the ERP system. The SMS module manages SMS messaging infrastructure, including sender accounts, phone numbers, service accounts, messages, attachments, reactions, and conversation analytics.

**Legend:**
- 🔗 **Foreign Key** - Relationship to another table
- 📊 **Indexed** - Column has an index for performance
- 🔒 **Unique** - Column has unique constraint
- ⏰ **Timestamp** - Time tracking column
- ✅ **Check Constraint** - Value validation constraint
- 🌐 **External** - External/referenced table

---

## Schema Skeleton Map

```
┌─────────────────────────────────────────────────────────────────┐
│                        SMS MODULE SCHEMA                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                  SMS_sender_accounts                              │
│  ────────────────────────────────────────────────────────────  │
│  • Upstream SMS provider accounts (e.g., Twilio)                │
│  • Tracks: account credentials, settings, status                 │
│  • Provider: Twilio, etc.                                       │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── 1:N ────► SMS_sender_phone_numbers (account_id)
         └─── 1:N ────► SMS_service_accounts (sender_account_id)


┌─────────────────────────────────────────────────────────────────┐
│              SMS_sender_phone_numbers                             │
│  ────────────────────────────────────────────────────────────  │
│  • Pool of phone numbers for sending/receiving SMS              │
│  • Tracks: phone number, friendly name, primary flag            │
│  • Links to: SMS_sender_accounts                                 │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► SMS_sender_accounts (account_id)
         └─── 1:N ────► SMS_messages (sender_phone_number_id)


┌─────────────────────────────────────────────────────────────────┐
│                  SMS_service_accounts                            │
│  ────────────────────────────────────────────────────────────  │
│  • Logical messaging services over provider accounts            │
│  • Types: campaign, conversation, support, marketing,           │
│    transactional                                                │
│  • Links to: campaigns, projects                                │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► SMS_sender_accounts (sender_account_id)
         ├─── N:1 ────► mkt_campaigns (linked_campaign_id)
         ├─── N:1 ────► project (linked_project_id)
         └─── 1:N ────► SMS_messages (service_account_id)


┌─────────────────────────────────────────────────────────────────┐
│                      SMS_contacts                                │
│  ────────────────────────────────────────────────────────────  │
│  • Address book of SMS recipients                                │
│  • Tracks: name, phone (E.164), timezone, CRM link              │
│  • Phone format: E.164 (e.g., +1234567890)                     │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── (Logical link via phone number to SMS_messages)


┌─────────────────────────────────────────────────────────────────┐
│                      SMS_messages                                │
│  ────────────────────────────────────────────────────────────  │
│  • Core message log (inbound/outbound)                          │
│  • Tracks: direction, status, provider, timestamps              │
│  • Links to: phone numbers, service accounts, conversations     │
│  • Body: up to 1600 chars (concatenated SMS)                    │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► SMS_sender_phone_numbers (sender_phone_number_id)
         ├─── N:1 ────► SMS_service_accounts (service_account_id)
         ├─── 1:N ────► SMS_attachments (message_id)
         ├─── 1:N ────► SMS_reactions (message_id)
         └─── N:1 ────► SMS_meta_conversation (via conversation_id)


┌─────────────────────────────────────────────────────────────────┐
│                    SMS_attachments                                │
│  ────────────────────────────────────────────────────────────  │
│  • Media attachments for messages                                │
│  • Tracks: file URL, name, type, size, MIME type                │
│  • Provider media ID tracking                                    │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► SMS_messages (message_id, CASCADE)


┌─────────────────────────────────────────────────────────────────┐
│                      SMS_reactions                                │
│  ────────────────────────────────────────────────────────────  │
│  • Message reactions                                             │
│  • Tracks: reaction type, value, who reacted                    │
└─────────────────────────────────────────────────────────────────┘
         │
         └─── N:1 ────► SMS_messages (message_id, CASCADE)


┌─────────────────────────────────────────────────────────────────┐
│                SMS_meta_conversation                             │
│  ────────────────────────────────────────────────────────────  │
│  • Conversation rollup/analytics                                 │
│  • Unique: conversation_id                                       │
│  • AI-generated summaries, sentiment, key points                │
│  • Links to: CRM customers, staff assignments                    │
└─────────────────────────────────────────────────────────────────┘
         │
         ├─── N:1 ────► crm_customers (customer_id_crm)
         ├─── N:1 ────► sys_users (assigned_staff_id)
         └─── 1:N ────► SMS_messages (via conversation_id, logical link)


┌─────────────────────────────────────────────────────────────────┐
│                    REFERENCED TABLES (External)                  │
│  ────────────────────────────────────────────────────────────  │
│  • mkt_campaigns        - Marketing campaigns                   │
│    └── Referenced by: SMS_service_accounts.linked_campaign_id  │
│  • project               - Project management                    │
│    └── Referenced by: SMS_service_accounts.linked_project_id    │
│  • crm_customers        - Customer records                      │
│    └── Referenced by: SMS_meta_conversation.customer_id_crm     │
│  • hr_staff             - Staff/employee records                │
│    └── Referenced by: SMS_meta_conversation.assigned_staff_id   │
└─────────────────────────────────────────────────────────────────┘


Relationship Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Provider Account Hierarchy:
  SMS_sender_accounts 1──N SMS_sender_phone_numbers
  SMS_sender_accounts 1──N SMS_service_accounts

Service Layer:
  SMS_service_accounts N──1 mkt_campaigns (optional)
  SMS_service_accounts N──1 project (optional)

Message Flow:
  SMS_sender_phone_numbers 1──N SMS_messages
  SMS_service_accounts 1──N SMS_messages
  SMS_messages 1──N SMS_attachments
  SMS_messages 1──N SMS_reactions

Conversation Management:
  SMS_meta_conversation 1──N SMS_messages (via conversation_id, logical)
  SMS_meta_conversation N──1 crm_customers
  SMS_meta_conversation N──1 sys_users

Contact Management:
  SMS_contacts (logical link via phone number to SMS_messages)
```

---

## Table Details

### 1. `SMS_sender_accounts`
**Purpose:** Represents upstream SMS provider accounts (e.g., Twilio) with credentials and settings.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Provider account identifier |
| `account_name` | VARCHAR | NULL | Human-readable account name |
| `provider` | VARCHAR | NULL | Provider name (e.g., 'Twilio', 'Vonage') |
| `account_sid` | VARCHAR | NULL | Provider account SID/identifier |
| `auth_token` | VARCHAR | NULL | Authentication token (should be encrypted) |
| `settings` | VARCHAR | NULL | Additional settings (consider JSONB) |
| `is_active` | INTEGER | NULL | Active status flag (0/1) |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Account creation timestamp |

**Use Cases:**
- Manage multiple SMS provider accounts
- Provider credential management
- Account-level configuration

**Security Notes:**
- `auth_token` should be encrypted at rest
- Consider using secure vault for sensitive credentials

---

### 2. `SMS_sender_phone_numbers`
**Purpose:** Pool of phone numbers used to send/receive SMS, tied to sender accounts.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Phone number identifier |
| `phone_number` | VARCHAR | NULL | Phone number (should be E.164 format) |
| `friendly_name` | VARCHAR | NULL | Human-readable name for the number |
| `is_primary` | INTEGER | NULL | Primary number flag (0/1) |
| `is_active` | INTEGER | NULL | Active status flag (0/1) |
| `assigned_to` | TEXT | NULL | Assignment information |
| `account_id` | UUID | NULL, FK → `SMS_sender_accounts(id)` | 🔗 Parent sender account |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `account_id` → `SMS_sender_accounts(id)`

**Indexes:**
- `idx_sms_phone_numbers_account_id(account_id)` - Account lookup 📊
- `idx_sms_phone_numbers_is_active(is_active)` - Active number filtering 📊
- `idx_sms_phone_numbers_is_primary(is_primary)` - Primary number lookup 📊

**Data Quality:**
- `phone_number` should be validated as E.164 format (e.g., +1234567890)
- Consider CHECK constraint or trigger for E.164 validation

**Use Cases:**
- Phone number pool management
- Primary number selection
- Number assignment tracking

---

### 3. `SMS_service_accounts`
**Purpose:** Logical "messaging services" layered over provider accounts, linkable to campaigns/projects.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY | Service account identifier |
| `sender_account_id` | UUID | NULL, FK → `SMS_sender_accounts(id)` | 🔗 Parent sender account |
| `service_name` | VARCHAR | NULL | Service name |
| `service_type` | VARCHAR | NULL | ✅ Service type: 'campaign', 'conversation', 'support', 'marketing', 'transactional' |
| `provider_service_sid` | VARCHAR | NULL | Provider service SID (e.g., Twilio MessagingServiceSid) |
| `settings` | JSONB | NULL | Flexible settings storage |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT true | Active status |
| `linked_campaign_id` | BIGINT | NULL, FK → `mkt_campaigns(id)` | 🔗 Linked marketing campaign |
| `linked_project_id` | BIGINT | NULL, FK → `project(id)` | 🔗 Linked project |
| `description` | TEXT | NULL | Service description |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |

**Foreign Keys:**
- `sender_account_id` → `SMS_sender_accounts(id)`
- `linked_campaign_id` → `mkt_campaigns(id)` (optional)
- `linked_project_id` → `project(id)` (optional)

**Indexes:**
- `idx_sms_service_accounts_sender_account(sender_account_id)` - Account lookup 📊
- `idx_sms_service_accounts_campaign(linked_campaign_id)` - Campaign lookup 📊
- `idx_sms_service_accounts_project(linked_project_id)` - Project lookup 📊
- `idx_sms_service_accounts_type(service_type)` - Type filtering 📊
- `idx_sms_service_accounts_active(is_active) WHERE is_active = true` - Partial index for active services 📊

**Use Cases:**
- Organize messaging by purpose (campaign, support, etc.)
- Link SMS services to marketing campaigns
- Link SMS services to projects
- Provider service management

---

### 4. `SMS_contacts`
**Purpose:** Address book of SMS recipients with contact information.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Contact identifier |
| `name` | VARCHAR | NULL | Contact name |
| `phone` | VARCHAR | NULL | Phone number (E.164 format, e.g., +1234567890) |
| `country_code` | TEXT | NULL | Country code |
| `area_code` | TEXT | NULL | Area code |
| `timezone` | TEXT | NULL | Contact timezone |
| `crm_id` | TEXT | NULL | CRM customer ID (link to crm_customers) |
| `last_contacted_at` | TEXT | NULL | ⏰ Last contact timestamp (should be timestamptz) |
| `assigned_phone_number_id` | TEXT | NULL | Assigned phone number (should be uuid FK) |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Data Quality Recommendations:**
- `phone` should be validated as E.164 format
- `last_contacted_at` should be converted to TIMESTAMPTZ
- `assigned_phone_number_id` should be converted to UUID and FK → `SMS_sender_phone_numbers(id)`

**Indexes:**
- `idx_sms_contacts_phone(phone)` - Phone lookup 📊
- `idx_sms_contacts_crm_id(crm_id)` - CRM lookup 📊
- `idx_sms_contacts_assigned_phone(assigned_phone_number_id)` - Assigned number lookup 📊

**Use Cases:**
- Contact management
- Phone number normalization
- CRM integration
- Timezone-aware messaging

---

### 5. `SMS_messages`
**Purpose:** Core message log for all inbound and outbound SMS messages.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Message identifier |
| `direction` | VARCHAR | NULL | ✅ Direction: 'inbound', 'outbound' |
| `from_number` | VARCHAR | NULL | Sender phone number |
| `to_number` | VARCHAR | NULL | Recipient phone number |
| `body` | TEXT | NULL | Message body (up to 1600 chars for concatenated SMS) |
| `media_count` | INTEGER | NULL | Number of media attachments |
| `status` | VARCHAR | NULL | Message status (e.g., 'sent', 'delivered', 'failed', 'read') |
| `provider` | VARCHAR | NULL | Provider name (e.g., 'Twilio') |
| `provider_message_sid` | VARCHAR | NULL | Provider message SID |
| `provider_error_code` | TEXT | NULL | Provider error code if failed |
| `provider_payload` | TEXT | NULL | Full provider response payload |
| `received_at` | TIMESTAMPTZ | NULL | ⏰ Message received timestamp |
| `sent_at` | TEXT | NULL | ⏰ Message sent timestamp (should be timestamptz) |
| `delivered_at` | TEXT | NULL | ⏰ Delivery timestamp (should be timestamptz) |
| `failed_at` | TEXT | NULL | ⏰ Failure timestamp (should be timestamptz) |
| `conversation_id` | VARCHAR | NULL | Conversation identifier (links to SMS_meta_conversation) |
| `user_id` | TEXT | NULL | User identifier |
| `metadata` | VARCHAR | NULL | Additional metadata (consider JSONB) |
| `message_type` | TEXT | NULL | Message type |
| `sender_phone_number_id` | UUID | NULL, FK → `SMS_sender_phone_numbers(id)` | 🔗 Sender phone number |
| `service_account_id` | UUID | NULL, FK → `SMS_service_accounts(id)` | 🔗 Service account used |
| `read_at` | TIMESTAMPTZ | NULL | ⏰ Message read timestamp |
| `created_at` | TIMESTAMPTZ | NULL | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NULL | ⏰ Last update timestamp |

**Foreign Keys:**
- `sender_phone_number_id` → `SMS_sender_phone_numbers(id)`
- `service_account_id` → `SMS_service_accounts(id)`

**Data Quality Recommendations:**
- `sent_at`, `delivered_at`, `failed_at` should be converted to TIMESTAMPTZ
- `metadata` should be converted to JSONB for better querying
- Consider FK-like enforcement for `conversation_id` → `SMS_meta_conversation.conversation_id`

**Indexes:**
- `idx_sms_messages_conversation_id(conversation_id)` - Conversation lookup 📊
- `idx_sms_messages_to_number(to_number)` - Recipient lookup 📊
- `idx_sms_messages_from_number(from_number)` - Sender lookup 📊
- `idx_sms_messages_status(status)` - Status filtering 📊
- `idx_sms_messages_service_account(service_account_id)` - Service account lookup 📊
- `idx_sms_messages_sender_phone(sender_phone_number_id)` - Sender phone lookup 📊
- `idx_sms_messages_received_at(received_at)` - Time-based queries 📊
- `idx_sms_messages_created_at(created_at)` - Time-based queries 📊
- `idx_sms_messages_read_at(read_at)` - Read status queries 📊
- Composite: `(conversation_id, created_at)` - Conversation message ordering 📊

**Use Cases:**
- Message logging and tracking
- Delivery status monitoring
- Conversation threading
- Analytics and reporting
- Provider integration

---

### 6. `SMS_attachments`
**Purpose:** Media attachments for SMS messages (images, videos, documents).

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Attachment identifier |
| `message_id` | UUID | NOT NULL, FK → `SMS_messages(id)` | 🔗 Parent message |
| `file_url` | TEXT | NULL | File URL/location |
| `file_name` | VARCHAR | NULL | Original file name |
| `file_type` | VARCHAR | NULL | File type |
| `file_size` | INTEGER | NULL | File size in bytes |
| `mime_type` | VARCHAR | NULL | MIME type |
| `provider_media_sid` | VARCHAR | NULL | Provider media ID (e.g., Twilio MediaSid) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |

**Foreign Keys:**
- `message_id` → `SMS_messages(id)` ON DELETE CASCADE (attachments deleted with message)

**Indexes:**
- `idx_sms_attachments_message_id(message_id)` - Message lookup 📊
- `idx_sms_attachments_provider_media(provider_media_sid)` - Provider media lookup 📊

**Use Cases:**
- Media attachment tracking
- File management
- Provider media ID mapping

---

### 7. `SMS_reactions`
**Purpose:** Message reactions (e.g., emoji reactions, thumbs up/down).

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Reaction identifier |
| `message_id` | UUID | NOT NULL, FK → `SMS_messages(id)` | 🔗 Parent message |
| `reaction_type` | VARCHAR | NULL | Reaction type |
| `reaction_value` | VARCHAR | NULL | Reaction value (e.g., '👍', '❤️') |
| `reacted_by` | TEXT | NULL | Who reacted (user identifier) |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Reaction timestamp |

**Foreign Keys:**
- `message_id` → `SMS_messages(id)` ON DELETE CASCADE (reactions deleted with message)

**Indexes:**
- `idx_sms_reactions_message_id(message_id)` - Message lookup 📊
- `idx_sms_reactions_reacted_by(reacted_by)` - User reaction lookup 📊

**Use Cases:**
- Message engagement tracking
- User interaction analytics
- Reaction history

---

### 8. `SMS_meta_conversation`
**Purpose:** Conversation rollup/analytics with AI-generated summaries, sentiment analysis, and metadata.

| Column | Data Type | Constraints | Notes |
|--------|-----------|-------------|-------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Conversation identifier |
| `conversation_id` | VARCHAR | NOT NULL, UNIQUE | 🔒 Conversation ID (matches SMS_messages.conversation_id) |
| `customer_id_crm` | INTEGER | NULL, FK → `crm_customers(id)` | 🔗 CRM customer |
| `assigned_staff_id` | INTEGER | NULL, FK → `sys_users(id)` | 🔗 Assigned staff member |
| `status` | VARCHAR | NOT NULL, DEFAULT 'active' | Conversation status |
| `priority` | VARCHAR | NOT NULL, DEFAULT 'medium' | Priority level |
| `tags` | TEXT[] | NULL | Conversation tags |
| `state` | VARCHAR | NOT NULL, DEFAULT 'open' | Conversation state |
| `conversation_start` | TIMESTAMPTZ | NULL | ⏰ Conversation start time |
| `conversation_end` | TIMESTAMPTZ | NULL | ⏰ Conversation end time |
| `last_message_at` | TIMESTAMPTZ | NULL | ⏰ Last message timestamp |
| `message_count` | INTEGER | NOT NULL, DEFAULT 0 | Total message count |
| `journey_stage` | VARCHAR | NULL | Customer journey stage |
| `emotion` | VARCHAR | NULL | Detected emotion |
| `next_action` | TEXT | NULL | Suggested next action |
| `summary_text` | TEXT | NULL | AI-generated conversation summary |
| `reply_quality` | VARCHAR | NULL | Reply quality assessment |
| `key_points` | TEXT[] | NULL | Key conversation points |
| `sentiment_score` | NUMERIC | NULL | Sentiment score (-1 to 1) |
| `ai_model` | VARCHAR | NULL | AI model used for analysis |
| `confidence_score` | NUMERIC | NULL | AI confidence score |
| `summary_updated_at` | TIMESTAMPTZ | NULL | ⏰ Last summary update |
| `created_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Creation timestamp |
| `updated_at` | TIMESTAMPTZ | NOT NULL, DEFAULT now() | ⏰ Last update timestamp |
| `unread_count` | INTEGER | NOT NULL, DEFAULT 0 | Unread message count |

**Foreign Keys:**
- `customer_id_crm` → `crm_customers(id)`
- `assigned_staff_id` → `sys_users(id)`

**Unique Constraints:**
- `conversation_id` (one meta record per conversation)

**Indexes:**
- `UNIQUE(conversation_id)` - Already defined 📊
- `idx_sms_meta_conversation_customer(customer_id_crm)` - Customer lookup 📊
- `idx_sms_meta_conversation_staff(assigned_staff_id)` - Staff assignment lookup 📊
- `idx_sms_meta_conversation_last_message(last_message_at)` - Recent conversations 📊
- `idx_sms_meta_conversation_status(status)` - Status filtering 📊
- `idx_sms_meta_conversation_state(state)` - State filtering 📊
- `idx_sms_meta_conversation_unread(unread_count) WHERE unread_count > 0` - Partial index for unread 📊

**Use Cases:**
- Conversation analytics
- AI-powered insights
- Staff assignment and workload
- Customer journey tracking
- Sentiment analysis
- Conversation prioritization

---

## Relationships Summary

### Provider Account Hierarchy

1. **`SMS_sender_accounts` → `SMS_sender_phone_numbers`** (One-to-Many)
   - One account can have many phone numbers
   - `SMS_sender_phone_numbers.account_id` → `SMS_sender_accounts.id`

2. **`SMS_sender_accounts` → `SMS_service_accounts`** (One-to-Many)
   - One account can have many service accounts
   - `SMS_service_accounts.sender_account_id` → `SMS_sender_accounts.id`

### Service Layer

3. **`SMS_service_accounts` → `mkt_campaigns`** (Many-to-One, Optional)
   - Service accounts can be linked to marketing campaigns
   - `SMS_service_accounts.linked_campaign_id` → `mkt_campaigns.id`

4. **`SMS_service_accounts` → `project`** (Many-to-One, Optional)
   - Service accounts can be linked to projects
    - `SMS_service_accounts.linked_project_id` → `project.id`

### Message Flow

5. **`SMS_sender_phone_numbers` → `SMS_messages`** (One-to-Many)
   - One phone number can send many messages
   - `SMS_messages.sender_phone_number_id` → `SMS_sender_phone_numbers.id`

6. **`SMS_service_accounts` → `SMS_messages`** (One-to-Many)
   - One service account can have many messages
   - `SMS_messages.service_account_id` → `SMS_service_accounts.id`

7. **`SMS_messages` → `SMS_attachments`** (One-to-Many)
   - One message can have many attachments
   - `SMS_attachments.message_id` → `SMS_messages.id` (CASCADE)

8. **`SMS_messages` → `SMS_reactions`** (One-to-Many)
   - One message can have many reactions
   - `SMS_reactions.message_id` → `SMS_messages.id` (CASCADE)

### Conversation Management

9. **`SMS_meta_conversation` ↔ `SMS_messages`** (One-to-Many, Logical)
   - One conversation can have many messages
   - Linked via `SMS_messages.conversation_id` = `SMS_meta_conversation.conversation_id`
   - **Note:** Consider adding FK-like enforcement via trigger

10. **`SMS_meta_conversation` → `crm_customers`** (Many-to-One)
    - Conversations can be linked to CRM customers
    - `SMS_meta_conversation.customer_id_crm` → `crm_customers.id`

11. **`SMS_meta_conversation` → `sys_users`** (Many-to-One)
    - Conversations can be assigned to staff
    - `SMS_meta_conversation.assigned_staff_id` → `sys_users.id`

### Contact Management

12. **`SMS_contacts` ↔ `SMS_messages`** (Logical)
    - Contacts linked to messages via phone number matching
    - `SMS_contacts.phone` matches `SMS_messages.from_number` or `to_number`

---

## Index Recommendations

### `SMS_sender_accounts`
- `idx_sms_sender_accounts_provider(provider)` - Provider filtering
- `idx_sms_sender_accounts_active(is_active) WHERE is_active = 1` - Partial index for active accounts

### `SMS_sender_phone_numbers`
- `idx_sms_phone_numbers_account_id(account_id)` - Account lookup 📊
- `idx_sms_phone_numbers_is_active(is_active)` - Active filtering 📊
- `idx_sms_phone_numbers_is_primary(is_primary)` - Primary number lookup 📊
- `idx_sms_phone_numbers_phone(phone_number)` - Phone number lookup

### `SMS_service_accounts`
- `idx_sms_service_accounts_sender_account(sender_account_id)` - Account lookup 📊
- `idx_sms_service_accounts_campaign(linked_campaign_id)` - Campaign lookup 📊
- `idx_sms_service_accounts_project(linked_project_id)` - Project lookup 📊
- `idx_sms_service_accounts_type(service_type)` - Type filtering 📊
- `idx_sms_service_accounts_active(is_active) WHERE is_active = true` - Partial index 📊

### `SMS_contacts`
- `idx_sms_contacts_phone(phone)` - Phone lookup 📊
- `idx_sms_contacts_crm_id(crm_id)` - CRM lookup 📊
- `idx_sms_contacts_assigned_phone(assigned_phone_number_id)` - Assigned number lookup 📊

### `SMS_messages`
- `idx_sms_messages_conversation_id(conversation_id)` - Conversation lookup 📊
- `idx_sms_messages_to_number(to_number)` - Recipient lookup 📊
- `idx_sms_messages_from_number(from_number)` - Sender lookup 📊
- `idx_sms_messages_status(status)` - Status filtering 📊
- `idx_sms_messages_service_account(service_account_id)` - Service account lookup 📊
- `idx_sms_messages_sender_phone(sender_phone_number_id)` - Sender phone lookup 📊
- `idx_sms_messages_received_at(received_at)` - Time-based queries 📊
- `idx_sms_messages_created_at(created_at)` - Time-based queries 📊
- `idx_sms_messages_read_at(read_at)` - Read status queries 📊
- Composite: `(conversation_id, created_at)` - Conversation message ordering 📊
- Composite: `(to_number, created_at)` - Recipient message history 📊

### `SMS_attachments`
- `idx_sms_attachments_message_id(message_id)` - Message lookup 📊
- `idx_sms_attachments_provider_media(provider_media_sid)` - Provider media lookup 📊

### `SMS_reactions`
- `idx_sms_reactions_message_id(message_id)` - Message lookup 📊
- `idx_sms_reactions_reacted_by(reacted_by)` - User reaction lookup 📊

### `SMS_meta_conversation`
- `UNIQUE(conversation_id)` - Already defined 📊
- `idx_sms_meta_conversation_customer(customer_id_crm)` - Customer lookup 📊
- `idx_sms_meta_conversation_staff(assigned_staff_id)` - Staff assignment lookup 📊
- `idx_sms_meta_conversation_last_message(last_message_at)` - Recent conversations 📊
- `idx_sms_meta_conversation_status(status)` - Status filtering 📊
- `idx_sms_meta_conversation_state(state)` - State filtering 📊
- `idx_sms_meta_conversation_unread(unread_count) WHERE unread_count > 0` - Partial index for unread 📊

---

## Data Quality Recommendations

### Timestamp Normalization

1. **`SMS_messages` timestamps:**
   - Convert `sent_at`, `delivered_at`, `failed_at` from TEXT to TIMESTAMPTZ
   - Enables proper indexing and time-based queries

2. **`SMS_contacts.last_contacted_at`:**
   - Convert from TEXT to TIMESTAMPTZ
   - Enables time-based contact queries

### Phone Number Validation

3. **E.164 Format Enforcement:**
   - Add CHECK constraint or trigger to validate E.164 format
   - Applies to: `SMS_contacts.phone`, `SMS_sender_phone_numbers.phone_number`
   - Format: `+[country code][number]` (e.g., +1234567890)

### Foreign Key Improvements

4. **`SMS_contacts.assigned_phone_number_id`:**
   - Convert from TEXT to UUID
   - Add FK → `SMS_sender_phone_numbers(id)`

5. **Conversation Integrity:**
   - Add trigger to ensure `SMS_messages.conversation_id` exists in `SMS_meta_conversation.conversation_id`
   - Or create `SMS_conversations` table with proper FK

### Data Type Improvements

6. **`SMS_messages.metadata`:**
   - Convert from VARCHAR to JSONB for flexible querying
   - Enables GIN index for efficient JSON queries

7. **`SMS_sender_accounts.settings`:**
   - Convert from VARCHAR to JSONB for structured settings

---

## Query Patterns

### Message Queries

**Get messages for conversation:**
```sql
SELECT m.*
FROM SMS_messages m
WHERE m.conversation_id = ?
ORDER BY m.created_at ASC;
```

**Get unread messages:**
```sql
SELECT m.*
FROM SMS_messages m
WHERE m.read_at IS NULL
  AND m.direction = 'inbound'
ORDER BY m.created_at DESC;
```

**Get messages by status:**
```sql
SELECT m.*
FROM SMS_messages m
WHERE m.status = ?
  AND m.created_at >= NOW() - INTERVAL '7 days'
ORDER BY m.created_at DESC;
```

### Conversation Queries

**Get active conversations:**
```sql
SELECT mc.*, c.name as customer_name
FROM SMS_meta_conversation mc
LEFT JOIN crm_customers c ON mc.customer_id_crm = c.id
WHERE mc.status = 'active'
  AND mc.state = 'open'
ORDER BY mc.last_message_at DESC;
```

**Get conversations assigned to staff:**
```sql
SELECT mc.*
FROM SMS_meta_conversation mc
WHERE mc.assigned_staff_id = ?
  AND mc.unread_count > 0
ORDER BY mc.last_message_at DESC;
```

**Get conversation with message count:**
```sql
SELECT 
  mc.*,
  COUNT(m.id) as actual_message_count
FROM SMS_meta_conversation mc
LEFT JOIN SMS_messages m ON mc.conversation_id = m.conversation_id
WHERE mc.conversation_id = ?
GROUP BY mc.id;
```

### Contact Queries

**Find contact by phone:**
```sql
SELECT c.*
FROM SMS_contacts c
WHERE c.phone = ?;
```

**Get contacts with recent messages:**
```sql
SELECT DISTINCT c.*
FROM SMS_contacts c
JOIN SMS_messages m ON c.phone = m.to_number OR c.phone = m.from_number
WHERE m.created_at >= NOW() - INTERVAL '30 days'
ORDER BY c.last_contacted_at DESC;
```

### Service Account Queries

**Get service accounts for campaign:**
```sql
SELECT sa.*
FROM SMS_service_accounts sa
WHERE sa.linked_campaign_id = ?
  AND sa.is_active = true;
```

**Get messages by service account:**
```sql
SELECT m.*
FROM SMS_messages m
WHERE m.service_account_id = ?
  AND m.created_at >= ?
ORDER BY m.created_at DESC;
```

---

## Design Considerations

### RLS (Row Level Security)

If exposing SMS tables to clients with user tokens:
- Enable RLS on all SMS tables
- Add policies for tenant- or user-scoped access
- Ensure required indexes exist for policy performance

### Conversation Integrity

**Current State:**
- `SMS_messages.conversation_id` is VARCHAR with logical link to `SMS_meta_conversation.conversation_id`
- No FK constraint exists

**Recommendations:**
1. Add trigger to validate `conversation_id` exists in `SMS_meta_conversation`
2. Or create `SMS_conversations` table with proper FK structure
3. Consider making `conversation_id` UUID in both tables

### Phone Number Management

- Enforce E.164 format across all phone number fields
- Normalize phone numbers on insert/update
- Consider phone number validation service integration

### Message Status Tracking

- Implement status state machine (sent → delivered → read)
- Track status transitions with timestamps
- Handle provider webhook callbacks for status updates

### AI Integration

- `SMS_meta_conversation` includes AI-generated summaries and sentiment
- Consider background jobs for AI processing
- Cache AI results to avoid reprocessing

---

## Notes

- **Provider Integration:** Tables designed for Twilio but flexible for other providers
- **Message Body:** Supports up to 1600 characters for concatenated SMS
- **Conversation Threading:** Logical link via `conversation_id` (consider FK enforcement)
- **Data Migration:** Several TEXT fields should be converted to proper types (timestamps, UUIDs)
- **Security:** `auth_token` in `SMS_sender_accounts` should be encrypted
- **Performance:** Consider partitioning `SMS_messages` by date for large volumes
- **RLS:** Currently disabled; enable if exposing to client applications

