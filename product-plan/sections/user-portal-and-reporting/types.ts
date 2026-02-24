// =============================================================================
// Data Types
// =============================================================================

export interface Ticket {
  id: string
  title: string
  status: string
  priority: string
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
}

export interface UserPortalProps {
  currentUser: User
  tickets: Ticket[]
  onViewTicket?: (ticketId: string) => void
  onGenerateReport?: () => void
}
