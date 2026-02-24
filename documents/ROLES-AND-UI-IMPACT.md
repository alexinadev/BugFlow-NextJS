# BugFlow: Roles & UI Impact Analysis

## Current Role Structure (from fix.docx.md)

| Role | Key Responsibility | Tier |
|------|-------------------|------|
| **Employee (Reporter)** | Submit bugs, view own tickets, comment | End User |
| **IT Agent** | Handle assigned tickets, update status, resolve | Support Staff |
| **IT Manager** | Dashboard oversight, assign agents, analytics | Management |
| **System Admin** | User management, system settings, access logs | Platform Admin |

---

## Refined Role Definitions

### 1. **Employee (Reporter)** 
- **Role ID:** `USER`
- **Description:** Any staff member experiencing an IT issue
- **Key Actions:**
  - Submit bug reports with details and attachments
  - View own submitted tickets and their status
  - Add user-visible comments to own tickets
  - Mark own tickets as resolved
  - Receive notifications on status changes
- **Data Access:** Own tickets only (filtered by userId)

### 2. **IT Agent** 
- **Role ID:** `AGENT`
- **Description:** Technical support staff handling ticket resolution
- **Key Actions:**
  - View assigned tickets (dashboard)
  - Update ticket status (Open → In Progress → Pending Info → Resolved → Closed)
  - Add resolution notes (visible to reporters)
  - Add internal notes (IT staff only, hidden from reporters)
  - Request additional info from reporters via comments
  - Upload images/attachments to tickets
- **Data Access:** Assigned tickets + viewing unassigned ticket list
- **Permissions:** Cannot create categories, cannot assign to self without manager

### 3. **IT Manager**
- **Role ID:** `MANAGER`
- **Description:** Head of IT department managing workflow and resources
- **Key Actions:**
  - View ALL tickets with advanced filters
  - Assign tickets to IT Agents
  - Change ticket priority and status
  - View analytics (open/closed counts, avg resolution time, department breakdown)
  - Add internal notes visible only to IT staff
  - Export ticket data (CSV, PDF)
  - Configure ticket categories and SLA rules
  - View team workload and performance metrics
- **Data Access:** All tickets, see internal notes
- **Permissions:** Full ticket lifecycle control

### 4. **System Admin**
- **Role ID:** `ADMIN`
- **Description:** Platform administrator maintaining system integrity
- **Key Actions:**
  - User management (create, disable, role assignment)
  - System settings and configuration
  - Access logs and audit trail
  - Database backups and recovery
  - Integration and webhook management
- **Data Access:** All data including system logs
- **Permissions:** Highest privilege level

---

## Frontend UI Changes by Role

### Dashboard Layout Changes

#### **Employee (Reporter)**
```
/portal
├── My Tickets (list view)
│   ├── Filters: Status (Open, In Progress, Pending Info, Resolved, Closed)
│   ├── Search by ticket ID or title
│   └── Sort by: Created date, Updated date, Status
├── Submit New Ticket (form)
└── Ticket Detail View
    ├── Status history (read-only)
    ├── Comments (user-visible only)
    ├── Attachments (view/download)
    └── Action: Add comment, Mark Resolved
```

#### **IT Agent**
```
/admin/agent
├── My Assigned Tickets (Kanban or List)
│   ├── Columns: Open | In Progress | Pending Info | Resolved | Closed
│   └── Count/priority badges
├── All Tickets (reference, read-only except assigned)
├── Ticket Detail View
    ├── Status (editable dropdown)
    ├── Resolution notes (text area)
    ├── Internal notes (italic, IT-only badge)
    ├── Comments history (filtered by visibility)
    ├── Attachments (view/upload)
    └── Actions: Update Status, Add Note, Request Info, Upload Attachment
└── Profile card showing assigned count
```

#### **IT Manager**
```
/admin
├── Dashboard (overview metrics)
│   ├── Total tickets (open/closed/pending)
│   ├── Avg resolution time
│   ├── Department breakdown (chart)
│   ├── Team workload (agents assigned tickets count)
│   └── SLA compliance status
├── Ticket Management
│   ├── Advanced filters panel
│   │   ├── Status, Priority, Category, Assigned Agent
│   │   ├── Date range (created/updated)
│   │   ├── Department, Reporter
│   │   └── SLA status
│   ├── List View (sortable columns)
│   │   ├── ID, Title, Reporter, Status, Priority, Assigned Agent, Created, Updated
│   │   └── Bulk actions: Assign, Change Priority, Change Status
│   └── Ticket Detail View
│       ├── Full status history with timestamps
│       ├── All comments + internal notes (both visible)
│       ├── Edit priority/category/assigned agent
│       ├── Edit SLA rules for ticket
│       └── Export ticket + comments as PDF
├── Configuration
│   ├── Category management (create, edit, delete)
│   ├── SLA rules (define by category/priority)
│   ├── Agent management (view workload, reassign tickets)
│   └── Report builder
└── Analytics
    ├── Charts: Resolution trends, response times, category breakdown
    ├── Export data (CSV, PDF)
    └── Scheduled reports email
```

#### **System Admin**
```
/admin/system
├── User Management
│   ├── User list (all employees)
│   ├── Role assignment matrix
│   ├── Create/enable/disable users
│   ├── Department management
│   └── Bulk user import
├── System Settings
│   ├── Email configuration (SMTP)
│   ├── Notification preferences
│   ├── File upload limits
│   ├── SLA defaults
│   └── Custom fields
├── Audit & Logs
│   ├── Activity log (user actions)
│   ├── Login/logout history
│   ├── Permission change log
│   ├── Data access log
│   └── Search/filter capabilities
└── Maintenance
    ├── Database status
    ├── Backup history
    ├── System health check
    └── Integration management
```

---

## Permission Matrix

| Feature | Employee | Agent | Manager | Admin |
|---------|----------|-------|---------|-------|
| Submit Ticket | ✓ | ✓ | ✓ | ✗ |
| View Own Tickets | ✓ | ✓ | ✓ | ✓ |
| View All Tickets | ✗ | Limited* | ✓ | ✓ |
| Update Status | ✗ | ✓ | ✓ | ✓ |
| Assign Ticket | ✗ | ✗ | ✓ | ✓ |
| Add Comments | ✓ | ✓ | ✓ | ✗ |
| Add Internal Notes | ✗ | ✓ | ✓ | ✓ |
| Configure Categories | ✗ | ✗ | ✓ | ✓ |
| View Analytics | ✗ | ✗ | ✓ | ✓ |
| Export Data | ✗ | ✗ | ✓ | ✓ |
| Manage Users | ✗ | ✗ | ✗ | ✓ |
| System Settings | ✗ | ✗ | ✗ | ✓ |
| View Audit Logs | ✗ | ✗ | ✗ | ✓ |

*Agents see assigned tickets + can view unassigned queue

---

## Component-Level UI Visibility Rules

### Conditional Rendering by Role

```typescript
// Navigation Menu
const navItems = {
  USER: ['/portal', '/portal/my-tickets', '/portal/submit'],
  AGENT: ['/admin/agent', '/admin/agent/assigned', '/admin/agent/tickets'],
  MANAGER: ['/admin', '/admin/tickets', '/admin/analytics', '/admin/config'],
  ADMIN: ['/admin/system', '/admin/users', '/admin/settings', '/admin/audit']
}

// Ticket Detail Actions
const ticketActions = {
  USER: ['addComment', 'markResolved', 'viewHistory'],
  AGENT: ['updateStatus', 'addNote', 'addInternalNote', 'uploadAttachment', 'requestInfo'],
  MANAGER: ['reassign', 'changePriority', 'editCategory', 'changeSLA', 'exportPDF'],
  ADMIN: ['archiveTicket', 'deleteTicket', 'viewSystemData']
}

// Comment Visibility
const commentVisibility = {
  USER_TO_USER: 'visible to reporter and IT staff',
  INTERNAL_NOTE: 'visible to IT staff only (Agent, Manager, Admin)',
  RESOLUTION: 'visible to reporter and assigned agent'
}
```

---

## UI Components Affected

### Global Changes
- **Navigation Bar:** Role-based menu items
- **Sidebar:** Different sections per role
- **Avatar Menu:** Different profile options

### Page-Level Changes
- `/admin` → Shows Manager dashboard (invisible to USER/AGENT)
- `/portal` → Shows Employee dashboard (visible to USER role)
- `/admin/agent` → Shows Agent assignment view (invisible to USER/ADMIN**)
- `/admin/system` → Shows Admin panel (Admin only)

### Component-Level Changes
- **TicketCard:** Show/hide internal notes, assignment info
- **CommentThread:** Filter internal vs. public comments
- **ActionButtons:** Show/hide based on role
- **FilterPanel:** Advanced filters for Manager only
- **SpotlightAnalytics:** Manager/Admin only features
- **BulkActions:** Manager/Admin only feature

### Modal/Dialog Changes
- **Ticket Assignment Modal:** Manager/Admin only
- **SLA Configuration Modal:** Manager/Admin only
- **Category Management Modal:** Manager/Admin only
- **User Role Assignment Modal:** Admin only

---

## Authentication & Authorization Flow

```
Login
  ↓
Verify phone + password
  ↓
Fetch user + role from JWT
  ↓
Set auth context with { user, role, permissions }
  ↓
Route guards redirect based on role
  ↓
Components conditionally render features
```

---

## API Endpoint Access Control

All endpoints should verify role in middleware:

```typescript
// Example: POST /api/tickets/:id/assign
// Only MANAGER and ADMIN can access
export async function POST(request: Request) {
  const user = await getCurrentUser()
  
  if (!['MANAGER', 'ADMIN'].includes(user.role)) {
    return NextResponse.json(
      { success: false, error: 'Insufficient permissions' },
      { status: 403 }
    )
  }
  
  // Process assignment...
}
```

---

## Summary of UI Changes

| Area | Changes |
|------|---------|
| **Navigation** | Role-specific menu items and routes |
| **Dashboards** | Completely different per role |
| **Ticket Views** | Filtered data + role-specific actions |
| **Modals** | Some hidden entirely per role |
| **Comments** | Visibility filtering (internal vs. public) |
| **Forms** | Different fields/options per role |
| **Analytics** | Manager/Admin only sections |
| **Settings** | Admin-only configuration |

This role system requires role-based access control (RBAC) middleware, conditional component rendering, and API endpoint protection.
