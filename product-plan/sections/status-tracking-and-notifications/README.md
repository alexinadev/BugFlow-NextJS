# Status Tracking & Notifications

## Overview

A centralized dashboard where users can monitor the real-time status of all their submitted bug reports. This section provides a comprehensive view of ticket progress with live updates and notification management.

## User Flows

- View a list of all submitted tickets with current status indicators
- Receive real-time notifications when ticket statuses change
- Sort and filter tickets by status, priority, or date
- View detailed status history for individual tickets
- Manage notification preferences and settings

## Components Provided

- `TicketTrackingDashboard.tsx` — Main tracking dashboard

## Callback Props

| Callback | Description |
|----------|-------------|
| `onViewTicket` | Called when user wants to view ticket details |
| `onRefresh` | Called when user wants to refresh the list |
| `onFilter` | Called when user applies filters |
