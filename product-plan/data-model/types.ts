// =============================================================================
// Global Data Model Types
// =============================================================================

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

export interface Ticket {
  id: string
  title: string
  description: string
  stepsToReproduce: string[]
  severity: 'blocking' | 'major' | 'minor' | 'suggestion'
  status: 'pending_verification' | 'open' | 'in_progress' | 'resolved' | 'closed' | 'incoming' | 'acknowledged' | 'review' | 'triaged' | 'investigating' | 'pending'
  createdAt: string
  updatedAt: string
  userEmail: string
  userFullName: string
  environmentDetails: EnvironmentDetails
  attachments: Attachment[]
  assignedTo?: string[]
  submitterId?: string
  priority?: 'urgent' | 'high' | 'medium' | 'low'
  category?: string
  labels?: string[]
  dueDate?: string
  estimatedHours?: number
  actualHours?: number
  resolvedAt?: string | null
  reporter?: string
  resolutionSummary?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  createdAt: string
  avatar?: string
  department?: string
  ticketsSubmitted?: number
  lastActivity?: string
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

export interface StatusHistory {
  ticketId: string
  status: string
  changedAt: string
  changedBy: string
  reason: string
}
