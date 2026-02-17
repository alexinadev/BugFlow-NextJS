// =============================================================================
// Data Types
// =============================================================================

export interface Attachment {
  id: string
  filename: string
  url: string
  size: number
  type: string
}

export interface EnvironmentDetails {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: 'Desktop' | 'Mobile' | 'Tablet'
  screenResolution: string
  windowSize: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  avatar: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  stepsToReproduce: string[]
  severity: 'blocking' | 'major' | 'minor' | 'suggestion'
  status: 'incoming' | 'acknowledged' | 'in_progress' | 'review' | 'resolved'
  createdAt: string
  updatedAt: string
  assignedTo: string[]
  submitterId: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  category: string
  attachments: Attachment[]
  labels: string[]
  dueDate: string
  estimatedHours: number
  environmentDetails: EnvironmentDetails
}

export interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: string
  isPublic: boolean
  mentions: string[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface AdminDashboardProps {
  data: AdminDashboardData
  onViewTicket?: (ticketId: string) => void
  onAssignTicket?: (ticketId: string, adminId: string) => void
  onChangeStatus?: (ticketId: string, newStatus: Ticket['status']) => void
  onAddNote?: (ticketId: string, content: string, isPublic: boolean) => void
  onResolveTicket?: (ticketId: string) => void
  onFilterByStatus?: (statuses: Ticket['status'][]) => void
  onFilterBySeverity?: (severities: Ticket['severity'][]) => void
  onSearch?: (query: string) => void
  onViewToggle?: (view: 'kanban' | 'list') => void
  onDragDropStatus?: (ticketId: string, newStatus: Ticket['status']) => void
  onBulkAssign?: (ticketIds: string[], adminId: string) => void
  onBulkStatusChange?: (ticketIds: string[], newStatus: Ticket['status']) => void
  onExportTickets?: (ticketIds: string[]) => void
  selectedTickets?: string[]
  currentView?: 'kanban' | 'list'
  filters?: {
    status: Ticket['status'][]
    severity: Ticket['severity'][]
    searchQuery: string
    assignedTo: string[]
  }
  isLoading?: boolean
  error?: string | null
}

export interface AdminDashboardData {
  _meta: {
    models: {
      User: string
      Ticket: string
      Comment: string
    }
    relationships: string[]
  }
  users: User[]
  tickets: Ticket[]
  comments: Comment[]
}
