# Phase 2.2: Dashboard Shells — Architecture & Shaping Notes

**Created**: February 24, 2026, ~17:35
**Status**: Implementation Complete

## Current State Assessment

### Before Phase 2.2
- ✅ Phase 1 Complete: RBAC backend infrastructure (roles, middleware, API helpers)
- ✅ Phase 2.1 Complete: Frontend navigation infrastructure (route guards, UI helpers, MainNav)
- ❌ Dashboard pages: Only `/portal` existed; `/admin`, `/admin/agent`, `/admin/system` were missing landing pages

### After Phase 2.2
- ✅ All 4 dashboard shells created
- ✅ Role-based landing pages for each user type
- ✅ Navigation integration complete end-to-end
- ✅ Ready for feature implementation in Phase 3

## Architecture Decisions

### Dashboard Page Hierarchy

```
/portal
  └─ USER (all authenticated) → UserPortalDashboard
     - Own submitted tickets
     - Status tracking
     - Issue submission workflow

/admin
  ├─ MANAGER + ADMIN → AdminDashboard (existing)
     - All tickets list
     - Bulk actions
     - Ticket assignment
     - Export reports

/admin/agent
  ├─ AGENT → AgentDashboard (new)
  ├─ MANAGER → AgentDashboard (oversight mode)
  └─ ADMIN → AgentDashboard (audit mode)
     - Kanban board (assigned tickets)
     - Quick assignment queue
     - Status workflow

/admin/system
  └─ ADMIN only → AdminSystemDashboard (new)
     - User management
     - System settings
     - Audit logs
     - Health monitoring
```

### Role Visibility Rules

**Key Decision**: Implement role-hierarchy visibility where higher roles can see lower-role dashboards for oversight/auditing

**Rationale**:
- MANAGER can view AGENT queue (understand capacity, reassign)
- ADMIN can view both AGENT and MANAGER dashboards (full oversight)
- This enables supervisory workflows without separate "view as" logic

**Implementation**: Array-based role checks
```typescript
allowed={['AGENT', 'MANAGER', 'ADMIN']}  // AGENT sees own, MANAGER/ADMIN see for audit
allowed={['MANAGER', 'ADMIN']}            // Both see ticket management
allowed={['ADMIN']}                       // ADMIN-only system config
```

### Component Architecture Pattern

All dashboards follow `Client Component → useAuth → IfRole → Dashboard Content` pattern:

```
Page Component (use client)
  └─ useAuth() hook (gets user, permissions, loading)
  └─ if (loading) LoadingSpinner
  └─ IfRole component (role guard)
     └─ Dashboard layout
        ├─ Header
        ├─ Main content area
        ├─ Metric cards (4-grid)
        └─ Additional sections (optional)
```

**Benefits**:
- Consistent pattern across all dashboards
- Easy to understand at a glance
- Built-in loading and error states
- Reusable `IfRole` reduces boilerplate

### Styling & Theming

**Decision**: Use Tailwind CSS utility classes with dark mode support

**Applied to**:
- Container and padding: `container mx-auto px-4 py-8`
- Typography: `text-3xl font-bold text-slate-900 dark:text-white`
- Card design: `bg-white dark:bg-slate-800 rounded-lg shadow-md border`
- Grid layouts: `grid grid-cols-2 md:grid-cols-4 gap-4`
- Status colors: Blue (open), Amber (in-progress), Purple (pending), Green (resolved)

**Dark mode**: Every color has light and dark variant for consistency

### Placeholder Strategy

Each dashboard includes strategic comments indicating:
- Where actual components will be integrated
- What data sources to connect
- Example of expected feature

Example comments:
```tsx
{/* Placeholder content - to be replaced with actual Kanban board */}
{/* Quick stats - will connect to ticket query for real counts */}
{/* System Info grid showing current zero-state values */}
```

This enables Phase 3 developers to quickly identify integration points.

## Success Criteria

✅ **All dashboards created** with proper role-based access control
✅ **Navigation routing** correctly maps users to appropriate dashboards
✅ **Role visibility hierarchy** allows supervisory oversight
✅ **Consistent architecture** across all page components
✅ **Dark mode support** throughout all dashboards
✅ **Loading states** functional and properly styled
✅ **Access denial messaging** clear and appropriate per role
✅ **Type-safe** — no TypeScript errors
✅ **Placeholder comments** guide Phase 3 feature integration

## Key Implementation Details

### AGENT Dashboard (/admin/agent)
- **Purpose**: Kanban board for ticket resolution workflow
- **Role Access**: AGENT (see own) + MANAGER/ADMIN (oversee)
- **Main Feature**: Kanban columns (Open, In Progress, Pending Info, Resolved)
- **Stats**: Quick counts showing ticket distribution
- **Next**: Connect to ticket API, integrate KanbanBoard component

### MANAGER Dashboard (/admin)
- **Purpose**: Ticket management and team oversight
- **Role Access**: MANAGER + ADMIN
- **Main Feature**: Reuses existing AdminDashboard component (no changes needed)
- **Capabilities**: Filter, bulk actions, assign, export reports
- **Next**: Optional MANAGER-specific enhancements (agent productivity, SLA tracking)

### ADMIN Dashboard (/admin/system)
- **Purpose**: System configuration and compliance
- **Role Access**: ADMIN only (strict separation)
- **Main Features**: 
  - User Management (add, edit, disable)
  - System Settings (configure defaults)
  - Audit Logs (compliance tracking)
  - System Health (performance monitoring)
- **Stats**: System information (user count, sessions, DB size, uptime)
- **Next**: Create sub-pages for each admin section (UserTable, SettingsForm, etc.)

### USER Dashboard (/portal)
- **Purpose**: Personal ticket submission and tracking
- **Role Access**: All authenticated users
- **Status**: Already implemented; no changes needed
- **Next**: Enhancement opportunities (dashboard widgets, reports)

## Routing Flow Diagram

```
User Login (successful)
  ↓
AuthProvider sets user + role
  ↓
MainNav component loads
  ↓
Navigate based on role:
  ├─ USER → Click "Your Tickets" → /portal
  ├─ AGENT → Click "My Queue" → /admin/agent
  ├─ MANAGER → Click "All Tickets" → /admin
  └─ ADMIN → Click "System Settings" → /admin/system
  ↓
Dashboard page loads
  ↓
useAuth() hook retrieves user + role
  ↓
IfRole component checks authorization
  ├─ If authorized → Render dashboard content
  └─ If denied → Show "Access Denied" message
```

## Integration Points for Phase 3

### Quick Links (Placeholders to Replace)
- AGENT's Kanban board: `<KanbanBoard />`
- ADMIN's User Management: `<UserManagementTable />`
- ADMIN's Settings: `<SettingsForm />`
- ADMIN's Audit Logs: `<AuditLogViewer />`

### Data Connections
- Replace hardcoded zero counts with real API queries
- Fetch assigned tickets for AGENT dashboard
- Fetch all tickets for MANAGER dashboard
- Fetch user list, system metrics for ADMIN dashboard

### Component Reuse
- MANAGER dashboard already uses `AdminDashboard` component
- Can create similar wrapper components for AGENT and ADMIN dashboards
- Leverage existing components: `KanbanBoard`, `TicketFilters`, `BulkActionsBar`

## Files Overview

| File | Type | Status | Lines |
|------|------|--------|-------|
| app/admin/agent/page.tsx | Page | ✅ Created | 106 |
| app/admin/system/page.tsx | Page | ✅ Created | 164 |
| app/admin/page.tsx | Page | ✅ Modified | -6/+6 |
| app/portal/page.tsx | Page | ✅ Verified | (unchanged) |

## Type Safety Validation

**TypeScript Compilation**: ✅ All files compile without errors
**Role Type**: `'USER' | 'AGENT' | 'MANAGER' | 'ADMIN'` used consistently
**Component Props**: `IfRole` properly typed
**useAuth() Hook**: Correct return type with `user: AuthUser | null`

## Dark Mode Testing

All dashboards include dark mode classes:
- Status cards: `dark:bg-blue-900/20`, `dark:border-blue-800`
- Container: `dark:bg-slate-800`, `dark:text-white`
- Text: `dark:text-slate-400`, `dark:text-slate-300`

Tested via VS Code theme toggle and browser DevTools.

## Notes for Next Phase

### Phase 3 Planning
1. **AGENT Features**: Implement Kanban board, ticket cards, drag-to-update
2. **ADMIN Features**: Create user table, settings forms, audit log viewer
3. **Data Integration**: Wire dashboards to real APIs
4. **Real Metrics**: Replace placeholder counts with live queries
5. **Error Handling**: Add error boundaries and fallback states

### Potential Enhancements
- Dashboard widgets/customization
- Real-time updates via WebSockets
- Performance analytics
- User preference persistence (default dashboard, theme, layout)

---

## Summary

Phase 2.2 successfully created the structural foundation for role-specific dashboards. All 4 user types now have designated landing pages with appropriate access controls, consistent architecture, and clear integration points for Phase 3 feature implementation. The system is fully typed, styled, and ready for feature development.
