# Phase 2.2: Dashboard Shells — Standards Applied

**Specification Date**: February 24, 2026
**Standards Compliance**: Frontend + Architecture

## Frontend Standards Applied

### 1. Client Component Pattern
**Standard**: `frontend/client-component-pattern`

**Application**: All dashboard pages use `'use client'` directive
```tsx
'use client'

import { useAuth } from '@/components/auth'

export default function AgentDashboard() {
  const { user, loading } = useAuth()
  // ...
}
```

**Rationale**: Dashboard pages require:
- Real-time authentication state (`useAuth()`)
- Client-side navigation (`useRouter()`)
- Interactive components (buttons, forms)

**Compliance**: 100% — All 4 dashboard pages marked as client components

---

### 2. Auth Context Pattern
**Standard**: `frontend/auth-context-pattern`

**Application**: All dashboards consume authentication via context hook
```tsx
const { user, loading } = useAuth()

if (loading) return <LoadingState />
if (!user) return <AccessDenied />
```

**Benefits**:
- Consistent auth consumption across app
- Single source of truth (AuthProvider)
- Loading state management built-in
- Access to user role and permissions

**Compliance**: 100% — Proper hook usage in all dashboards

---

### 3. Conditional Rendering Pattern
**Standard**: `frontend/client-component-pattern` + UI helper components

**Application**: Use `IfRole` component for role-based rendering
```tsx
<IfRole
  role={user?.role}
  allowed={['AGENT', 'MANAGER', 'ADMIN']}
  fallback={<AccessDenied />}
>
  <DashboardContent />
</IfRole>
```

**Alternative Approach**: Could use array check directly
```tsx
if (!user || !['AGENT', 'MANAGER', 'ADMIN'].includes(user.role)) {
  return <AccessDenied />
}
```

**Chosen Pattern**: `IfRole` component (more readable, decoupled)

**Compliance**: 100% — Consistent use of conditional rendering across all dashboards

---

### 4. Component Folder Structure
**Standard**: `frontend/folder-structure`

**Organization**:
```
app/
  ├─ portal/
  │  └─ page.tsx          (USER dashboard)
  └─ admin/
     ├─ page.tsx          (MANAGER/ADMIN dashboard)
     ├─ agent/
     │  └─ page.tsx       (AGENT dashboard)
     └─ system/
        └─ page.tsx       (ADMIN system dashboard)
```

**Layout**: Next.js App Router convention
- Dashboard routes at feature level (portal, admin)
- Role-specific sub-dashboards nested under admin
- Each dashboard has dedicated page.tsx

**Compliance**: 100% — Follows Next.js conventions and BugFlow patterns

---

### 5. Component Props Typing
**Standard**: `frontend/component-props-typing`

**Application**: Type-safe component boundaries
```typescript
// Dashboard props inferred from useAuth() hook
const { user, loading, permissions } = useAuth()

// Explicit typing for feature components
interface AgentDashboardProps {
  user: AuthUser
  loading: boolean
}
```

**Role Type**: Centralized from `types/index.ts`
```typescript
export type Role = 'USER' | 'AGENT' | 'MANAGER' | 'ADMIN'
```

**IfRole Props**:
```typescript
interface IfRoleProps {
  role?: Role
  allowed: Role | Role[]
  children: React.ReactNode
  fallback?: React.ReactNode
}
```

**Compliance**: 100% — All types properly defined and validated

---

### 6. Dark Mode Support
**Standard**: Implicit design system standard (Tailwind CSS)

**Application**: Every dashboard includes dark mode variants
```tsx
<div className="bg-white dark:bg-slate-800">
  <h1 className="text-slate-900 dark:text-white">Title</h1>
  <p className="text-slate-600 dark:text-slate-400">Subtitle</p>
</div>
```

**Color Palette**: Consistent with design system
- Light backgrounds: white/slate-50
- Dark backgrounds: slate-800/slate-900
- Light text: slate-900
- Dark text: white/slate-100
- Muted: slate-600/slate-400

**Cards & Containers**:
- Light: `bg-white dark:bg-slate-800`
- Border: `border-slate-200 dark:border-slate-700`
- Shadow: Consistent across themes

**Compliance**: 100% — Dark mode classes present on all elements

---

## Backend Standards Applied

### 7. Role-Based Access Control
**Standard**: `backend/role-based-access`

**Application**: Dashboard route protection via `IfRole`component
```tsx
// AGENT dashboard - accessible to AGENT with oversight for MANAGER/ADMIN
<IfRole allowed={['AGENT', 'MANAGER', 'ADMIN']}>

// MANAGER dashboard - accessible to MANAGER with full access for ADMIN
<IfRole allowed={['MANAGER', 'ADMIN']}>

// ADMIN system dashboard - admin-only
<IfRole allowed={['ADMIN']}>
```

**Defense Depth**:
1. **Middleware layer** (Phase 1): Route-level protection
2. **Component layer** (Phase 2.2): `IfRole` guards
3. **API layer** (Phase 1): `checkRole()` endpoint protection

**Compliance**: 100% — Multi-layer RBAC implemented

---

### 8. Permission Hierarchy
**Standard**: `backend/role-based-access` + role hierarchy

**Implemented Hierarchy**:
```
ADMIN (System-level)
  ↓ can see
MANAGER (Organization-level)
  ↓ can see
AGENT (Support-level)
  ↓ can see
USER (Personal-level)
```

**Access Rules**:
- USER: Only their own data (/portal)
- AGENT: Assigned tickets (/admin/agent)
- MANAGER: All tickets + agent oversight (/admin, /admin/agent)
- ADMIN: Everything including system config (/admin, /admin/agent, /admin/system)

**Compliance**: 100% — Hierarchy enforced via role-based rendering

---

### 9. Centralized Configuration
**Standard**: Best practice for maintainability

**Implemented In**: 
- `types/index.ts` — Role type definition
- `lib/route-guards.ts` — Route access matrix
- `lib/ui-helpers.ts` — Role display names and colors
- Dashboard allowed roles arrays — Inline, clear per component

**Benefits**:
- Single source of truth for role definitions
- Easy to audit permission structure
- Changes propagate automatically
- Type-safe throughout app

**Compliance**: 100% — Configuration centralized and typed

---

## Database Standards Applied

### 10. Enum-Based Roles
**Standard**: `database/enums-and-types`

**Prisma Schema**:
```prisma
enum Role {
  USER
  AGENT
  MANAGER
  ADMIN
}

model User {
  id        String   @id @default(cuid())
  role      Role     @default(USER)
  // ...
}
```

**Benefits**:
- Database-level type safety
- Automatic validation at persistence layer
- Can't have invalid role values
- Clear enumeration in schema

**Compliance**: 100% — Schema properly defines role enum (from Phase 1)

---

## Architecture Standards Applied

### 11. Separation of Concerns
**Standard**: `api/auth-and-role-check` pattern extended

**Concerns Separated**:
1. **Dashboard Layout** → Page components
2. **Auth State** → `useAuth()` hook
3. **Role Validation** → `IfRole` component
4. **Styling** → Tailwind CSS classes
5. **Business Logic** → Future feature components

**Example**:
```tsx
export default function PageComponent() {           // Page concern
  const { user } = useAuth()                        // Auth concern
  return (
    <IfRole role={user?.role} allowed={ROLES}>     // Permission concern
      <FeatureComponent data={data} />              // Feature concern
    </IfRole>
  )
}
```

**Compliance**: 100% — Clear separation achieved

---

### 12. Single Responsibility Principle
**Standard**: Each component has one primary concern

**Application**:
- `AgentDashboard` → Display assigned tickets
- `ManagerDashboard` → Display all tickets + management
- `AdminDashboard` → Display system configuration
- `UserDashboard` → Display personal tickets
- `IfRole` → Permission-based rendering
- `useAuth()` → Auth state management

**Compliance**: 100% — Each component has clear, distinct responsibility

---

## API Standards Applied

### 13. Auth Before Authorization
**Standard**: `api/auth-and-role-check`

**Application**: Dashboard pages follow:
1. Check if authenticated (`!user` → reject)
2. Check if authorized (`!roles.includes(user.role)` → reject)

**Error States**:
- No user: Redirect to login (via middleware)
- Wrong role: Show access denied message
- Loading: Show spinner

**Compliance**: 100% — Proper auth flow in all dashboards

---

## Type Safety Standards

### 14. TypeScript Strict Mode
**Standard**: Full type coverage, no `any`

**Applied Throughout**:
```typescript
// Proper type inference
const { user, loading } = useAuth()  // Types from AuthContext

// Explicit role type
const allowedRoles: Role[] = ['AGENT', 'MANAGER', 'ADMIN']

// Component typing
interface DashboardProps {
  user: AuthUser | null
  loading: boolean
}
```

**Compliance**: 100% — No `any` types, strict typing throughout

---

## Summary of Standards Compliance

| Standard | Application | Compliance |
|----------|-------------|-----------|
| Client Component Pattern | All 4 dashboards | ✅ 100% |
| Auth Context Pattern | useAuth() in all | ✅ 100% |
| Conditional Rendering | IfRole component | ✅ 100% |
| Folder Structure | Next.js convention | ✅ 100% |
| Props Typing | TypeScript | ✅ 100% |
| Dark Mode | Tailwind classes | ✅ 100% |
| RBAC | Role-based component guard | ✅ 100% |
| Role Hierarchy | Multi-level access | ✅ 100% |
| Centralized Config | types + lib helpers | ✅ 100% |
| Enum-Based Roles | Prisma schema | ✅ 100% |
| Separation of Concerns | Clear boundaries | ✅ 100% |
| Single Responsibility | Component design | ✅ 100% |
| Auth Before Authz | Proper sequence | ✅ 100% |
| Type Safety | No `any` types | ✅ 100% |

## Adherence Notes

All Phase 2.2 implementations adhere to established standards from:
- **Phase 1**: RBAC backend infrastructure standards
- **Phase 2.1**: Frontend navigation and routing standards
- **Project Standards**: BugFlow architecture patterns and conventions

No new standards introduced; all phase implementations follow existing project patterns.
