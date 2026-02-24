# Component Composition Pattern

Compose large features from smaller, focused components.

## Pattern

AdminDashboard is composed of:
```
AdminDashboard (parent)
  ├ KanbanBoard / TicketList (view toggle)
  ├ TicketFilters (filter/search controls)
  ├ TicketDetailModal (detail view)
  └ BulkActionsBar (multi-select actions)
```

## Rules

- **Parent manages:** Overall state, filters, view mode, data flow
- **Children receive:** Data via props, callbacks via onX handlers
- **Single responsibility:** Each component does one thing well
- **Prop drilling OK for 2-3 levels** — use Context only if 4+ levels

## When to Split

Create a new component when:
- Component file exceeds 200 lines
- Logic is reusable elsewhere
- Component has distinct visual section
- Testable independently

## Benefits

- **Readability:** Easier to understand large components
- **Reusability:** Child components usable in other contexts
- **Testing:** Small components easier to test
