# Next.js App Router URL Routing Implementation Plan

## Overview
Implement URL routing using Next.js App Router so that navigation updates the URL and direct URL access works. The existing `App.tsx` structure will be maintained and synchronized with URL state.

## Goals
- Clicking navigation items updates the browser URL
- Direct URL access (e.g., `/administration/user-management`) works correctly
- Browser back/forward buttons work properly
- URLs are shareable and bookmarkable
- Maintain backward compatibility with existing state-based navigation

## URL Structure

### Global Pages (No Category Prefix)
- `/` - Home page
- `/ai-flow` - Global AI Flow page

### Department Pages (With Category Prefix)
- `/administration` - Administration overview
- `/administration/overview` - Administration overview (alternative)
- `/administration/user-management` - User Management
- `/administration/role-permission` - Role & Permission
- `/administration/tenant-management` - Tenant Management
- `/administration/company-settings` - Company Settings
- `/administration/ai-agents` - AI Agents
- `/administration/ai-flow` - AI Flow (department-specific)
- `/administration/automation-integration` - Automation / Integration
- `/administration/audit-logs` - Audit Logs

Similar patterns for:
- `/orders/[page]` - Orders department pages
- `/products/[page]` - Products department pages
- `/logistics/[page]` - Logistics department pages
- `/marketing/[page]` - Marketing department pages
- `/crm/[page]` - CRM department pages
- `/fulfillment/[page]` - Fulfillment department pages
- `/workspace/[page]` - Workspace pages
- `/reports` - Reports main page

## Implementation Steps

### Step 1: Create URL Mapping Utility
**File:** `src/utils/routing.ts`

Create utility functions to convert between sidebar item names and URL slugs:

```typescript
// Convert "User Management" → "user-management"
export function sidebarItemToSlug(item: string): string

// Convert "user-management" → "User Management"
export function slugToSidebarItem(slug: string): string

// Convert "Administration" → "administration"
export function categoryToSlug(category: string): string

// Convert "administration" → "Administration"
export function slugToCategory(slug: string): string

// Generate full route path
export function getRoutePath(category: string, item?: string): string

// Parse URL path to extract category and page
export function parseRoutePath(pathname: string): { category: string | null; page: string | null }
```

**Slug Mapping Rules:**
- Convert to lowercase
- Replace spaces with hyphens
- Remove special characters (keep alphanumeric and hyphens)
- Handle special cases:
  - "Role & Permission" → "role-permission"
  - "Automation / Integration" → "automation-integration"
  - "AI Flow" → "ai-flow"
  - "Company Settings" → "company-settings"

### Step 2: Update App.tsx for URL Synchronization
**File:** `src/App.tsx`

**Changes:**
1. Import Next.js routing hooks:
   ```typescript
   import { useRouter, usePathname } from 'next/navigation'
   ```

2. Add URL reading on mount:
   ```typescript
   const router = useRouter()
   const pathname = usePathname()
   
   useEffect(() => {
     // Parse URL on mount and set state
     const { category, page } = parseRoutePath(pathname)
     if (category) setCurrentCategory(category)
     if (page) setSelectedSidebarItem(page)
   }, [pathname])
   ```

3. Update `handleCategoryChange`:
   ```typescript
   const handleCategoryChange = (category: string) => {
     setCurrentCategory(category)
     const slug = categoryToSlug(category)
     router.push(`/${slug}`)
   }
   ```

4. Update `handleSidebarItemClick`:
   ```typescript
   const handleSidebarItemClick = (item: string) => {
     setSelectedSidebarItem(item)
     const categorySlug = categoryToSlug(currentCategory)
     const pageSlug = sidebarItemToSlug(item)
     router.push(`/${categorySlug}/${pageSlug}`)
   }
   ```

### Step 3: Create Next.js App Router Route Files

#### 3.1 Global Routes

**File:** `app/ai-flow/page.tsx`
```typescript
"use client"
import { AIFlowPage } from "@/components/pages/AI"

export default function AIFlowRoute() {
  return <AIFlowPage />
}
```

#### 3.2 Department Dynamic Routes

**File:** `app/administration/[page]/page.tsx`
```typescript
"use client"
import { notFound } from 'next/navigation'
import { slugToSidebarItem } from '@/utils/routing'
import { 
  AdministrationMainPage,
  UserManagementPage,
  RolePermissionPage,
  TenantManagementPage,
  CompanySettingsPage,
  AIAgentsPage,
  AutomationIntegrationPage,
  AuditLogsPage,
} from '@/components/pages/Administration'
import { AIFlowPage } from '@/components/pages/AI'

export default function AdministrationPage({ params }: { params: { page: string } }) {
  const pageName = slugToSidebarItem(params.page)
  
  // Route to appropriate component
  switch (pageName) {
    case 'Overview':
      return <AdministrationMainPage />
    case 'User Management':
      return <UserManagementPage />
    case 'Role & Permission':
      return <RolePermissionPage />
    case 'Tenant Management':
      return <TenantManagementPage />
    case 'Company Settings':
      return <CompanySettingsPage />
    case 'AI Agents':
      return <AIAgentsPage />
    case 'AI Flow':
      return <AIFlowPage department="Administration" />
    case 'Automation / Integration':
      return <AutomationIntegrationPage />
    case 'Audit Logs':
      return <AuditLogsPage />
    default:
      notFound()
  }
}
```

**File:** `app/administration/page.tsx` (for overview)
```typescript
"use client"
import { AdministrationMainPage } from '@/components/pages/Administration'

export default function AdministrationOverviewPage() {
  return <AdministrationMainPage />
}
```

**Similar structure for other departments:**
- `app/orders/[page]/page.tsx`
- `app/products/[page]/page.tsx`
- `app/logistics/[page]/page.tsx`
- `app/marketing/[page]/page.tsx`
- `app/crm/[page]/page.tsx`
- `app/fulfillment/[page]/page.tsx`
- `app/workspace/[page]/page.tsx`
- `app/reports/page.tsx`

### Step 4: Update Root Page
**File:** `src/app/page.tsx`

Keep existing structure but ensure it handles root route:
```typescript
"use client"
import App from "../App"

export default function Home() {
  return <App />
}
```

### Step 5: Update Navigation Components

#### 5.1 ContextualSidebar
**File:** `src/components/layout/ContextualSidebar.tsx`

Update click handlers to use router:
```typescript
import { useRouter } from 'next/navigation'
import { getRoutePath } from '@/utils/routing'

// In component:
const router = useRouter()

const handleItemClick = (item: string) => {
  if (onSidebarItemClick) {
    onSidebarItemClick(item)
  }
  const path = getRoutePath(category, item)
  router.push(path)
}
```

#### 5.2 AdministrationMainPage
**File:** `src/components/pages/Administration/AdministrationMainPage.tsx`

Update `onNavigate` prop usage:
```typescript
import { useRouter } from 'next/navigation'
import { getRoutePath } from '@/utils/routing'

// In component:
const router = useRouter()

const handleQuickActionClick = (action) => {
  if (action.available && action.page) {
    const path = getRoutePath('Administration', action.page)
    router.push(path)
  }
}
```

### Step 6: Handle Edge Cases

1. **Default Route**: If no category/page in URL, use default from env or state
2. **Invalid Routes**: Return 404 for unknown routes
3. **Overview Pages**: Both `/category` and `/category/overview` should work
4. **Home Page**: `/` should render HomePage
5. **Browser Navigation**: Back/forward buttons should update state automatically

## File Structure After Implementation

```
src/
├── app/
│   ├── page.tsx (root - renders App)
│   ├── ai-flow/
│   │   └── page.tsx
│   ├── administration/
│   │   ├── page.tsx (overview)
│   │   └── [page]/
│   │       └── page.tsx
│   ├── orders/
│   │   └── [page]/
│   │       └── page.tsx
│   ├── products/
│   │   └── [page]/
│   │       └── page.tsx
│   ├── logistics/
│   │   └── [page]/
│   │       └── page.tsx
│   ├── marketing/
│   │   └── [page]/
│   │       └── page.tsx
│   ├── crm/
│   │   └── [page]/
│   │       └── page.tsx
│   ├── fulfillment/
│   │   └── [page]/
│   │       └── page.tsx
│   ├── workspace/
│   │   └── [page]/
│   │       └── page.tsx
│   └── reports/
│       └── page.tsx
├── utils/
│   └── routing.ts (NEW)
└── components/
    └── ... (existing components)
```

## Testing Checklist

- [ ] Clicking sidebar items updates URL
- [ ] Direct URL access works (e.g., `/administration/user-management`)
- [ ] Browser back button works
- [ ] Browser forward button works
- [ ] Overview pages work with and without `/overview` suffix
- [ ] Home page (`/`) works correctly
- [ ] Invalid routes show 404
- [ ] URL changes don't cause page reloads
- [ ] State stays in sync with URL
- [ ] Quick access cards in AdministrationMainPage navigate correctly

## Migration Notes

- Existing state-based navigation will continue to work
- URL will automatically sync with state changes
- No breaking changes to existing components
- All navigation should go through router.push() for consistency

## Implementation Order

1. Create `src/utils/routing.ts` utility
2. Update `src/App.tsx` with URL synchronization
3. Create route files starting with `app/administration/[page]/page.tsx`
4. Create other department route files
5. Create global route files (`app/ai-flow/page.tsx`)
6. Update navigation components to use router
7. Test all routes and navigation flows
8. Handle edge cases and error states

