---

# Milestone 3: Admin Dashboard & Management

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete, Milestone 2 complete

## Goal

Implement the Admin Dashboard & Management feature — a centralized hub for administrators to manage tickets.

## Overview

The centralized hub for administrators to view, sort, assign, and manage the entire ticket lifecycle. This section provides comprehensive tools for ticket management with multiple viewing options and efficient workflow capabilities.

**Key Functionality:**
- View all tickets in Kanban board or list view
- Filter tickets by status, priority, assignee, or category
- View detailed ticket information
- Update ticket status or assign to team members
- Add comments or notes to tickets
- Search for specific tickets
- Perform bulk actions on multiple tickets
- Drag-and-drop to change ticket status

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/admin-dashboard-and-management/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/admin-dashboard-and-management/components/`:

- `AdminDashboard.tsx` — Main dashboard component
- `KanbanBoard.tsx` — Kanban board view for tickets
- `TicketList.tsx` — List view for tickets

### Data Layer

The components expect these data shapes:

```typescript
interface Ticket {
  id: string
  title: string
  description: string
  stepsToReproduce: string[]
  severity: 'blocking' | 'major' | 'minor' | 'suggestion'
  status: 'incoming' | 'acknowledged' | 'in_progress' | 'review' | 'resolved'
  createdAt: string
  updatedAt: string
  assignedTo: string[]
  submitterId: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  category: string
  attachments: Attachment[]
  labels: string[]
  dueDate: string
  estimatedHours: number
  environmentDetails: EnvironmentDetails
}

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  avatar: string
}

interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: string
  isPublic: boolean
  mentions: string[]
}
```

### Callbacks

Wire up these user actions:

- `onViewTicket` — View ticket details
- `onAssignTicket` — Assign ticket to admin
- `onChangeStatus` — Change ticket status
- `onAddNote` — Add comment/note to ticket
- `onResolveTicket` — Mark ticket as resolved
- `onFilterByStatus` — Filter tickets by status
- `onFilterBySeverity` — Filter tickets by severity
- `onSearch` — Search tickets
- `onViewToggle` — Switch between kanban and list view
- `onDragDropStatus` — Drag and drop to change status
- `onBulkAssign` — Bulk assign tickets
- `onBulkStatusChange` — Bulk change status
- `onExportTickets` — Export selected tickets

### Empty States

- **No tickets:** Show empty state with "No tickets yet" message
- **No tickets matching filters:** Show "No tickets match your filters" with clear filters option

## Files to Reference

- `product-plan/sections/admin-dashboard-and-management/README.md` — Feature overview
- `product-plan/sections/admin-dashboard-and-management/tests.md` — Test-writing instructions
- `product-plan/sections/admin-dashboard-and-management/components/` — React components
- `product-plan/sections/admin-dashboard-and-management/types.ts` — TypeScript interfaces
- `product-plan/sections/admin-dashboard-and-management/sample-data.json` — Test data

## Expected User Flows

### Flow 1: View and Manage Tickets

1. Admin navigates to `/admin`
2. Admin sees all tickets in default Kanban view
3. Admin can switch to list view
4. Admin can filter by status, priority, or category
5. Admin can search for specific tickets

### Flow 2: Update Ticket Status

1. Admin drags a ticket from one column to another
2. **Outcome:** Ticket status updates automatically

### Flow 3: Assign Ticket to Admin

1. Admin clicks on a ticket
2. Admin selects "Assign" option
3. Admin selects admin(s) from list
4. **Outcome:** Ticket is assigned to selected admin(s)

## Done When

- [ ] Tests written for key user flows (success and failure paths)
- [ ] All tests pass
- [ ] Kanban board renders with all columns
- [ ] List view renders with sortable columns
- [ ] Filtering works for all filter types
- [ ] Search returns matching tickets
- [ ] Drag-and-drop status changes work
- [ ] Bulk actions work correctly
- [ ] Empty states display properly
- [ ] Responsive on mobile
