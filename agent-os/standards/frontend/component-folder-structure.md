# Component Folder Structure

Organize components by feature/domain, not by component type.

## Pattern

```
components/
  admin/
    AdminDashboard.tsx
    KanbanBoard.tsx
    TicketFilters.tsx
    index.ts         ← exports all public components
  tickets/
    TicketSubmissionForm.tsx
    TicketSuccessModal.tsx
    index.ts
  portal/
    UserPortalDashboard.tsx
    MetricCard.tsx
    index.ts
```

## Rules

- Group related components by feature (admin, tickets, auth, portal)
- Create index.ts in each folder that re-exports public components
- Keep internal/helper components in the same folder
- Import: `import { AdminDashboard } from '@/components/admin'`

## Benefits

- **Scalability:** Easy to find related components
- **Isolation:** Feature components grouped together
- **Clean imports:** Single entry point per feature
