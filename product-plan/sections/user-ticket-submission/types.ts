// =============================================================================
// Data Types
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
  status: 'pending_verification' | 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt: string
  updatedAt: string
  userEmail: string
  userFullName: string
  environmentDetails: EnvironmentDetails
  attachments: Attachment[]
}

// =============================================================================
// Component Props
// =============================================================================

export interface TicketSubmissionFormProps {
  onSubmit?: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void
  onCancel?: () => void
  onPreview?: (ticketData: Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void
  initialData?: Partial<Omit<Ticket, 'id' | 'status' | 'createdAt' | 'updatedAt'>>
  isSubmitting?: boolean
  environmentDetails?: EnvironmentDetails
}
