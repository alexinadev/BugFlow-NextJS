// =============================================================================
// Data Types
// =============================================================================

export interface StatusHistory {
  ticketId: string
  status: string
  changedAt: string
  changedBy: string
  reason: string
}

export interface Notification {
  id: string
  ticketId: string
  userId: string
  type: 'status_change' | 'assignment' | 'resolution' | 'update'
  message: string
  createdAt: string
  read: boolean
  readAt: string | null
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: string
  priority: string
  createdAt: string
  updatedAt: string
  assignedTo: string | null
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  notificationPreferences: {
    email: boolean
    push: boolean
    sms: boolean
    frequency: string
  }
}

export interface StatusTrackingProps {
  tickets: Ticket[]
  currentUser: User
  onViewTicket?: (ticketId: string) => void
  onRefresh?: () => void
  onFilter?: (filters: any) => void
  onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void
}
