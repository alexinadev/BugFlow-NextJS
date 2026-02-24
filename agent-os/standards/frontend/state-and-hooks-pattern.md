# State and Hooks Pattern

Manage state at the appropriate level: local in child, lifted to parent if shared.

## Pattern

### Local State

Child components manage their own local UI state:

```tsx
function TicketFilters({ onFilterChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('')  // local
  const [selectedStatus, setSelectedStatus] = useState(null)  // local
  
  const handleFilterChange = () => {
    onFilterChange({ searchQuery, selectedStatus })  // notify parent
  }
}
```

### Lifted State

Parent manages state used by multiple children:

```tsx
function AdminDashboard() {
  const [selectedTickets, setSelectedTickets] = useState([])  // shared state
  
  return (
    <>
      <TicketList onSelectTicket={(id) => setSelectedTickets([...selectedTickets, id])} />
      <BulkActionsBar selectedTickets={selectedTickets} />
    </>
  )
}
```

## Rules

- **Local:** Form inputs, UI toggles (open/close modals), view preferences
- **Lifted:** Data used by multiple siblings, selection state for bulk actions
- **Callback Props:** `on[Action]` pattern for child → parent communication
- **useMemo:** Memoize expensive calculations (filtering, sorting large lists)

## Avoid

- Redux/Context for global state (not currently used)
- Prop drilling 4+ levels (use Context if needed)
