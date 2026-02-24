// =============================================================================
// Global Data Model Types
// =============================================================================

export type Role = 'USER' | 'AGENT' | 'MANAGER' | 'ADMIN'

export interface EnvironmentDetails {
  browser: string
  browserVersion: string
  os: string
  osVersion: string
  deviceType: 'Mobile' | 'Desktop' | 'Tablet'
  screenResolution: string
  windowSize: string
}

export interface Attachment {
  id: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
}

export type Severity = 'blocking' | 'major' | 'minor' | 'suggestion'

export type TicketStatus = 
  | 'pending_verification' 
  | 'open' 
  | 'in_progress' 
  | 'resolved' 
  | 'closed' 
  | 'incoming' 
  | 'acknowledged' 
  | 'review' 
  | 'triaged' 
  | 'investigating' 
  | 'pending'

export type Priority = 'urgent' | 'high' | 'medium' | 'low'

export interface Ticket {
  id: string
  title: string
  description: string
  stepsToReproduce: string[]
  severity: Severity
  status: TicketStatus
  createdAt: Date
  updatedAt: Date
  userEmail: string
  userFullName: string
  environmentDetails?: EnvironmentDetails
  attachments?: Attachment[]
  assignedTo?: string[]
  submitterId?: string
  priority?: Priority
  category?: string
  labels?: string[]
  dueDate?: Date
  estimatedHours?: number
  actualHours?: number
  resolvedAt?: Date | null
  reporter?: string
  resolutionSummary?: string
}

export interface User {
  id: string
  name: string
  phone: string
  role: Role
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export type NotificationType = 'status_change' | 'assignment' | 'resolution' | 'update'

export interface Comment {
  id: string
  ticketId: string
  userId: string
  content: string
  createdAt: Date
  isPublic: boolean
  mentions: string[]
}

export interface Notification {
  id: string
  ticketId: string
  userId: string
  type: NotificationType
  message: string
  createdAt: Date
  read: boolean
  readAt: Date | null
}

export interface StatusHistory {
  id: string
  ticketId: string
  status: string
  changedAt: Date
  changedBy: string
  reason?: string
}

// Auth types
export interface AuthUser {
  id: string
  name: string
  phone: string
  role: Role
  avatar?: string
}

export interface LoginCredentials {
  phone: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  error?: string
}

// Navigation types
export interface NavigationItem {
  label: string
  href: string
  roles: Role[]
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

// Permission types
export interface RolePermissions {
  role: Role
  permissions: string[]
}