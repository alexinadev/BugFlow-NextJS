# Component Props Typing

Define explicit props interfaces for every component.

## Pattern

```tsx
interface AdminDashboardProps {
  tickets: Ticket[]
  isLoading?: boolean        ← optional
  onRefresh?: () => void     ← optional
  onUpdateTicket: (id: string, data: Partial<Ticket>) => Promise<void>  ← required
}

export function AdminDashboard({
  tickets,
  isLoading,
  onRefresh,
  onUpdateTicket,
}: AdminDashboardProps) {
  // ...
}
```

## Rules

- Use `interface` (not `type`) for component props
- Name interface `ComponentNameProps`
- Mark optional props with `?`
- Required props have no `?`
- Callbacks follow pattern: `on[Action]: (...args) => ReturnType`

## Benefits

- **Clarity:** Component contract is explicit
- **Type Safety:** TypeScript catches missing/wrong props
- **Documentation:** Props interface is self-documenting
