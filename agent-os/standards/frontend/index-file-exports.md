# Index File Exports

Every component folder has an index.ts that exports public components.

## Pattern

```typescript
// components/admin/index.ts
export { AdminDashboard } from './AdminDashboard'
export { KanbanBoard } from './KanbanBoard'
export { TicketFilters } from './TicketFilters'
```

## Rules

- Export main/public components only
- Export types if needed (prefix with `type`)
- Keep index.ts simple — one export per line
- Internal/helper components don't need export

## Benefits

- **Clean Imports:** `import { AdminDashboard } from '@/components/admin'` instead of `'./admin/AdminDashboard'`
- **Refactoring Safe:** Can reorganize files inside folder without breaking imports
- **Discoverability:** Index acts as folder API documentation
