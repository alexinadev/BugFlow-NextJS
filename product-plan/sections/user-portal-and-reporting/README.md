# User Portal & Reporting

## Overview

A comprehensive dashboard where users can view all their submitted bug reports and generate detailed reports about their submission history. This section provides complete visibility into user activity with summary statistics, detailed views, and export capabilities.

## User Flows

- View a summary dashboard of all user submissions with key metrics
- Access detailed view of individual tickets with full history
- Generate and export reports in multiple formats (PDF, CSV)
- Filter and sort submissions by date, status, category, or priority
- View submission trends and resolution time statistics

## Components Provided

- `UserPortalDashboard.tsx` — Main portal dashboard

## Callback Props

| Callback | Description |
|----------|-------------|
| `onViewTicket` | Called when user wants to view ticket details |
| `onGenerateReport` | Called when user wants to generate a report |
| `onExportReport` | Called when user wants to export a report |
