'use client'

import { Clock, User, ChevronRight, AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import type { Ticket, Severity, TicketStatus } from '@/types'

interface TicketStatusCardProps {
  ticket: Ticket
  onClick: () => void
}

const statusColors: Record<TicketStatus, string> = {
  pending_verification: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  closed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  incoming: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300',
  acknowledged: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
  review: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
  triaged: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  investigating: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
}

const statusLabels: Record<TicketStatus, string> = {
  pending_verification: 'Pending Review',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
  incoming: 'Incoming',
  acknowledged: 'Acknowledged',
  review: 'In Review',
  triaged: 'Triaged',
  investigating: 'Investigating',
  pending: 'Pending',
}

const severityIcons: Record<Severity, React.ReactNode> = {
  blocking: <AlertCircle className="h-4 w-4 text-red-500" />,
  major: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  minor: <Info className="h-4 w-4 text-yellow-500" />,
  suggestion: <Lightbulb className="h-4 w-4 text-blue-500" />,
}

export function TicketStatusCard({ ticket, onClick }: TicketStatusCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 hover:shadow-md transition-shadow text-left"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {ticket.id}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status as TicketStatus]}`}>
              {statusLabels[ticket.status as TicketStatus]}
            </span>
          </div>
          
          <h3 className="font-medium text-slate-900 dark:text-white truncate mb-1">
            {ticket.title}
          </h3>
          
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
            {ticket.description}
          </p>
          
          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              {severityIcons[ticket.severity as Severity]}
              <span className="capitalize">{ticket.severity}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
            {ticket.assignedTo && ticket.assignedTo.length > 0 && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                Assigned
              </div>
            )}
          </div>
        </div>
        
        <ChevronRight className="h-5 w-5 text-slate-400 flex-shrink-0 ml-2" />
      </div>
    </button>
  )
}