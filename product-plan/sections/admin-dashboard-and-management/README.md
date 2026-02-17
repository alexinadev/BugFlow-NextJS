# Admin Dashboard & Management

## Overview

The centralized hub for administrators to view, sort, assign, and manage the entire ticket lifecycle. This section provides comprehensive tools for ticket management with multiple viewing options and efficient workflow capabilities.

## User Flows

- Admin views dashboard with all tickets in Kanban or list view
- Admin filters tickets by status, priority, assignee, or category
- Admin clicks on a ticket to see detailed information
- Admin updates ticket status or assigns to team members
- Admin adds comments or notes to tickets
- Admin searches for specific tickets
- Admin performs bulk actions on multiple selected tickets
- Admin uses drag-and-drop to change ticket status

## Components Provided

- `AdminDashboard.tsx` — Main dashboard with Kanban and list views
- `KanbanBoard.tsx` — Kanban board component
- `TicketList.tsx` — List view component

## Callback Props

| Callback | Description |
|----------|-------------|
| `onViewTicket` | Called when admin clicks to view ticket details |
| `onAssignTicket` | Called when admin assigns ticket to admin |
| `onChangeStatus` | Called when admin changes ticket status |
| `onViewToggle` | Called when admin switches between kanban/list views |
| `onDragDropStatus` | Called when admin drags ticket to new status |
