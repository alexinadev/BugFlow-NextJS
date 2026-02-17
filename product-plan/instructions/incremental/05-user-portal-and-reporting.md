---

# Milestone 5: User Portal & Reporting

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** Milestone 1 (Foundation) complete, Milestones 2-4 complete

## Goal

Implement the User Portal & Reporting feature — a dashboard where users can view their submissions and generate reports.

## Overview

A comprehensive dashboard where users can view all their submitted bug reports and generate detailed reports about their submission history. This section provides complete visibility into user activity with summary statistics, detailed views, and export capabilities.

**Key Functionality:**
- View a summary dashboard with key metrics (total submissions, resolved tickets, average resolution time)
- Access detailed view of individual tickets with full history
- Generate and export reports in multiple formats (PDF, CSV)
- Filter and sort submissions by date, status, category, or priority
- View submission trends and resolution time statistics

## Recommended Approach: Test-Driven Development

Before implementing this section, **write tests first** based on the test specifications provided.

See `product-plan/sections/user-portal-and-reporting/tests.md` for detailed test-writing instructions.

## What to Implement

### Components

Copy the section components from `product-plan/sections/user-portal-and-reporting/components/`:

- `UserPortalDashboard.tsx` — Main portal dashboard

### Data Layer

```typescript
interface Ticket {
  id: string
  title: string
  status: 'new' | 'triaged' | 'in_progress' | 'pending' | 'investigating' | 'resolved'
  priority: 'low' | 'medium' | 'high' | 'critical'
  createdAt: string
  resolvedAt: string | null
  // ... more fields
}

interface Report {
  id: string
  title: string
  metrics: {
    totalSubmissions: number
    resolvedTickets: number
    averageResolutionTime: number
    resolutionRate: number
  }
  charts: ChartData[]
}

interface Metrics {
  totalSubmissions: number
  resolvedCount: number
  averageResolutionTime: number
}
```

### Callbacks

- `onViewTicket` — View ticket details
- `onGenerateReport` — Generate new report
- `onExportReport` — Export report
- `onDownloadExport` — Download exported file
- `onDeleteExport` — Delete export
- `onFilterTickets` — Filter tickets
- `onSortTickets` — Sort tickets

### Empty States

- **No tickets submitted:** Show empty state with CTA to submit first ticket
- **No reports generated:** Show empty state with option to generate first report

## Files to Reference

- `product-plan/sections/user-portal-and-reporting/README.md`
- `product-plan/sections/user-portal-and-reporting/tests.md`
- `product-plan/sections/user-portal-and-reporting/components/`
- `product-plan/sections/user-portal-and-reporting/types.ts`
- `product-plan/sections/user-portal-and-reporting/sample-data.json`

## Done When

- [ ] Tests written for key user flows
- [ ] All tests pass
- [ ] Dashboard shows metrics correctly
- [ ] Ticket list displays with filters
- [ ] Report generation works
- [ ] Export functionality works
- [ ] Empty states display properly
- [ ] Responsive on mobile
