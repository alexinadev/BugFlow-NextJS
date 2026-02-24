---

# Milestone 4: Status Tracking & Notifications

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete, Milestones 2-3 complete

## Goal

Implement the Status Tracking & Notifications feature — a dashboard for users to monitor their ticket status with real-time updates.

## Overview

A centralized dashboard where users can monitor the real-time status of all their submitted bug reports. This section provides a comprehensive view of ticket progress with live updates and notification management.

**Key Functionality:**
- View a list of all submitted tickets with current status indicators
- Receive real-time notifications when ticket statuses change
- Sort and filter tickets by status, priority, or date
- View detailed status history for individual tickets
- Manage notification preferences and settings

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/status-tracking-and-notifications/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/status-tracking-and-notifications/components/`:

- `TicketTrackingDashboard.tsx` — Main tracking dashboard

### Data Layer

```typescript
interface Ticket {
  id: string
  title: string
  description: string
  status: 'new' | 'triaged' | 'in_progress' | 'pending' | 'investigating' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  updatedAt: string
  assignedTo: string | null
  reporter: string
  category: string
  estimatedHours: number
  actualHours: number
  statusHistory: StatusHistory[]
  notifications: Notification[]
}

interface StatusHistory {
  ticketId: string
  status: string
  changedAt: string
  changedBy: string
  reason: string
}

interface Notification {
  id: string
  ticketId: string
  userId: string
  type: 'status_change' | 'assignment' | 'resolution' | 'update'
  message: string
  createdAt: string
  read: boolean
  readAt: string | null
}
```

### Callbacks

- `onViewTicket` — View ticket details
- `onRefresh` — Refresh ticket list
- `onFilter` — Filter tickets
- `onSort` — Sort tickets
- `onUpdatePreferences` — Update notification preferences
- `onMarkNotificationRead` — Mark notification as read
- `onClearNotifications` — Clear all notifications

### Empty States

- **No tickets:** Show empty state "You haven't submitted any tickets yet"
- **No notifications:** Show "You're all caught up - no new notifications"

## Files to Reference

- `product-plan/sections/status-tracking-and-notifications/README.md`
- `product-plan/sections/status-tracking-and-notifications/tests.md`
- `product-plan/sections/status-tracking-and-notifications/components/`
- `product-plan/sections/status-tracking-and-notifications/types.ts`
- `product-plan/sections/status-tracking-and-notifications/sample-data.json`

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Ticket tracking dashboard renders
- [ ] Status indicators show correctly
- [ ] Filtering and sorting works
- [ ] Notifications display correctly
- [ ] Notification preferences can be updated
- [ ] Empty states display properly
- [ ] Responsive on mobile
