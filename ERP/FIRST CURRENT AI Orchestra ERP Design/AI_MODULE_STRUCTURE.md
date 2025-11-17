# Current AI Module Structure & UX/UI Design

## 1. Core AI Components (`src/components/AI/`)

### Structure:
```
src/components/AI/
├── AIAssistant.tsx              # Global floating AI assistant panel
├── AIAgentSelectionMain.tsx     # Reusable agent selector component
├── AIchatboxdepartmentmain.tsx  # Full-page department chatbox
└── index.ts                     # Exports all components
```

### A. AIAssistant.tsx (Global Floating Panel)
- **Location**: Right-side sliding panel (500px wide on desktop)
- **Usage**: Used in `App.tsx` - accessible from any page via footer button
- **Features**:
  - 11 predefined agents (Captain + 10 department leads)
  - Agent selection with robotic avatars
  - Category-aware (switches agent based on current department)
  - Chat interface with message history
  - Currently: Mock responses with setTimeout
- **UX Pattern**: Fixed position, slides in from right, collapses sidebar when open

### B. AIAgentSelectionMain.tsx (Reusable Selector)
- **Purpose**: Agent selection UI component
- **Features**:
  - Robotic avatar with animations
  - Expandable agent lineup
  - Size variants (small, medium, large)
  - Used by: AIAssistant, MyWorkSpace, and other pages
- **Props**: `agents[]`, `selectedAgentId`, `onAgentSelect`, `size`, `showSparkle`

### C. AIchatboxdepartmentmain.tsx (Full-Page Chatbox)
- **Purpose**: Full-page AI chat interface for department pages
- **Features**:
  - Welcome screen with agent selection
  - Suggested prompts (rotating featured prompt)
  - Chat message interface
  - Agent switching
  - Currently: Mock `onSendMessage` callback
- **Used In**:
  - `OrderMainPage.tsx` - Order management AI
  - `ProductMainPage.tsx` - Product management AI
  - `ProductInsightsPage.tsx` - Product insights AI
  - `LogisticsMainPage.tsx` - Logistics AI
  - `FulfillmentMainPage.tsx` - Fulfillment AI
  - `OrderInsightsPage.tsx` - Order insights AI

## 2. AI Pages (`src/components/pages/AI/`)

### Structure:
```
src/components/pages/AI/
├── AIFlow/
│   ├── AIFlowPageModule.tsx     # Main AI Flow management page
│   ├── components/
│   │   ├── FlowTable.tsx        # Table displaying AI flows
│   │   └── LayerExplainer.tsx   # Explains 3-layer system
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── aiFlowData.ts        # Mock flow data
│   │   └── constants.ts         # Configuration constants
│   └── index.ts
└── index.ts
```

### AIFlowPageModule.tsx
- **Purpose**: Manage AI automation flows (3-layer system)
- **Features**:
  - Layer 1: Fully Automated flows (real-time, no human interaction)
  - Layer 2: Human-Triggered flows (on-demand execution)
  - Layer 3: Interactive Conversational flows (chat-based)
  - External tools integration (ChatGPT, Midjourney, etc.)
  - Flow metrics and statistics
  - Request new flow functionality
- **Currently**: Uses mock data from `aiFlowData.ts`
- **Access**: Via "AI" category in main navigation

## 3. Department-Specific AI Pages

### A. MarketingAgentPage (`src/components/pages/Marketing/MarketingAgent/`)
- **Purpose**: Marketing-specific AI agent page
- **Features**: Custom marketing agent interface with notices banner
- **Access**: Default page when "Marketing" category selected (no sidebar item)
- **Currently**: Mock responses via `generateAIResponse()` helper

### B. SalesCRMAgentPage (`src/components/pages/CRM/SalesCRMAgentPage.tsx`)
- **Purpose**: CRM-specific AI agent page
- **Features**: Large robotic avatar, CRM-focused interface
- **Access**: Default page when "CRM" category selected (no sidebar item)
- **Currently**: Mock responses

## 4. AI Modules Used in Other Components

### A. AINotificationCard (`src/components/Modules/Global/AINotificationCard/`)
- **Purpose**: Display AI-generated insights/notifications
- **Used In**:
  - `CustomerBoardPage.tsx` - Customer insights
  - `CampaignBoardPage.tsx` - Campaign suggestions
  - `CampaignCalendarPage.tsx` - Calendar optimizations
  - `BrandHubPage.tsx` - Brand recommendations
  - `ProjectsCampaignsPage.tsx` - Project insights
  - `Inspiration.tsx` - Content ideas
- **UX Pattern**: Banner card with action button, dismissible

### B. AIControlsCard (`src/components/Modules/Fulfillment/AIControlsCard/`)
- **Purpose**: AI automation controls for fulfillment
- **Used In**: `AutomationControlPage.tsx`
- **Features**: Visual automation builder interface

### C. AIRecommendationCard (`src/components/Modules/Marketing/ProjectCampaignDetail/components/`)
- **Purpose**: AI recommendations for campaigns
- **Used In**: Project campaign detail pages

### D. PromotionAIBanner (`src/components/Modules/Marketing/Promotions/`)
- **Purpose**: AI-powered promotion suggestions
- **Used In**: `PromotionPage.tsx`

### E. AIOrganizationBanner (`src/components/Modules/Marketing/`)
- **Purpose**: AI organization insights
- **Used In**: `AssetLibraryPage.tsx`

### F. ShiftScheduleAICard (`src/components/Modules/Workspace/`)
- **Purpose**: AI suggestions for shift scheduling
- **Used In**: Workspace pages

### G. AI Suggestions Utilities
- `src/components/Modules/Fulfillment/ShippingTable/utils/aiSuggestions.ts`
  - Provides AI suggestions for shipping optimization
  - Used in shipping table modules

## 5. Current Usage Map

### Global AI (Available Everywhere):
- **AIAssistant**: Floating panel, accessible via footer button
  - Location: `App.tsx` (line 460)
  - Trigger: Footer AI button or TopNavBar AI button

### Department Default Pages (No Sidebar Item Selected):
- **Marketing** → `MarketingAgentPage` (full-page AI chat)
- **CRM** → `SalesCRMAgentPage` (full-page AI chat)
- **Orders** → `OrderMainPage` (includes `AIchatboxdepartmentmain`)
- **Products** → `ProductMainPage` (includes `AIchatboxdepartmentmain`)
- **Logistics** → `LogisticsMainPage` (includes `AIchatboxdepartmentmain`)
- **Fulfillment** → `FulfillmentMainPage` (includes `AIchatboxdepartmentmain`)

### Specific Pages with AI:
- `OrderInsightsPage` → Uses `AIchatboxdepartmentmain`
- `ProductInsightsPage` → Uses `AIchatboxdepartmentmain`
- `AutomationControlPage` → Uses `AIControlsCard`
- `AIFlowPage` → Full AI flow management (via "AI" category)

### AI Notification Cards (Contextual):
- Multiple pages show `AINotificationCard` for contextual AI insights

## 6. Current Data Flow (All Mocked)

```
User Input
  ↓
Component (AIAssistant/AIchatboxdepartmentmain)
  ↓
setTimeout() simulation
  ↓
Mock response
  ↓
Display in UI
```

**No Database**: All conversations are in-memory, lost on page refresh  
**No API**: All responses are hardcoded or generated via simple functions  
**No Persistence**: No conversation history saved

## 7. Agent Configuration (Currently Hardcoded)

**11 Predefined Agents** (in `AIAssistant.tsx`):
1. Captain Agent - Global orchestrator
2. Marketing Lead - Marketing specialist
3. CRM Lead - Customer relationship manager
4. Orders Lead - Order management specialist
5. Products Lead - Product management expert
6. Logistics Lead - Supply chain coordinator
7. HR Lead - Human resources manager
8. Finance Lead - Financial operations expert
9. Administration Lead - System administration expert
10. Reports Lead - Analytics specialist
11. Workspace Lead - Task & project coordinator

Each agent has:
- `id`, `name`, `role`, `description`
- `category` (department)
- `color`, `gradient` (UI styling)
- `greeting` (initial message)

## 8. UX/UI Design Patterns

### Pattern 1: Floating Panel (AIAssistant)
- Fixed right position
- Slides in/out with animation
- 500px width on desktop
- Full width on mobile
- Auto-collapses sidebar when opened

### Pattern 2: Full-Page Chatbox (AIchatboxdepartmentmain)
- Takes full page width
- Welcome screen with agent selection
- Rotating featured prompts
- Grid of suggested prompts
- Chat interface below

### Pattern 3: Notification Cards (AINotificationCard)
- Banner-style cards
- Dismissible
- Action buttons
- Contextual placement on pages

### Pattern 4: Flow Management (AIFlowPage)
- Tabbed interface (Layer 1, 2, 3, External Tools)
- Table view of flows
- Metrics dashboard
- Sheet panels for details

## 9. Integration Points for Database/API

### Components to Update:
1. `AIAssistant.tsx` - Replace mock with API calls
2. `AIchatboxdepartmentmain.tsx` - Replace `onSendMessage` mock
3. `AIFlowPageModule.tsx` - Replace mock data with API
4. `MarketingAgentPageModule.tsx` - Replace mock responses
5. `SalesCRMAgentPage.tsx` - Replace mock responses

### Data Sources to Replace:
- `aiFlowData.ts` → Database `ai_flows` table
- Hardcoded agents → Database `ai_agents` table
- In-memory messages → Database `ai_messages` table
- Mock responses → API calls to AI service

