'use client'

import { X, AlertCircle, AlertTriangle, Info, Lightbulb, User, Calendar, Monitor, MessageSquare } from 'lucide-react'
import type { Ticket, Severity } from '@/types'

interface TicketDetailModalProps {
  isOpen: boolean
  ticket: Ticket | null
  onClose: () => void
  onAssign: (adminId: string) => void
  onChangeStatus: (status: Ticket['status']) => void
  admins: { id: string; name: string }[]
}

const severityIcons: Record<Severity, React.ReactNode> = {
  blocking: <AlertCircle className="h-5 w-5 text-red-500" />,
  major: <AlertTriangle className="h-5 w-5 text-orange-500" />,
  minor: <Info className="h-5 w-5 text-yellow-500" />,
  suggestion: <Lightbulb className="h-5 w-5 text-blue-500" />,
}

const statusOptions: { value: Ticket['status']; label: string }[] = [
  { value: 'pending_verification', label: 'Pending Review' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export function TicketDetailModal({
  isOpen,
  ticket,
  onClose,
  onAssign,
  onChangeStatus,
  admins,
}: TicketDetailModalProps) {
  if (!isOpen || !ticket) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            {severityIcons[ticket.severity]}
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                {ticket.title}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
                {ticket.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6 max-h-[calc(90vh-140px)]">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Description
            </h3>
            <p className="text-slate-600 dark:text-slate-400">
              {ticket.description}
            </p>
          </div>

          {/* Steps to Reproduce */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Steps to Reproduce
            </h3>
            <ol className="list-decimal list-inside space-y-1">
              {ticket.stepsToReproduce.map((step, index) => (
                <li key={index} className="text-slate-600 dark:text-slate-400">
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Environment Details */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Environment Details
            </h3>
            <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">Browser:</span>
                <span className="ml-2 text-slate-700 dark:text-slate-200">
                  {ticket.environmentDetails?.browser} {ticket.environmentDetails?.browserVersion}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">OS:</span>
                <span className="ml-2 text-slate-700 dark:text-slate-200">
                  {ticket.environmentDetails?.os} {ticket.environmentDetails?.osVersion}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Device:</span>
                <span className="ml-2 text-slate-700 dark:text-slate-200">
                  {ticket.environmentDetails?.deviceType}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">Screen:</span>
                <span className="ml-2 text-slate-700 dark:text-slate-200">
                  {ticket.environmentDetails?.screenResolution}
                </span>
              </div>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Created: {new Date(ticket.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Submitter: {ticket.userFullName || ticket.userEmail}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Status</label>
            <select
              value={ticket.status}
              onChange={(e) => onChangeStatus(e.target.value as Ticket['status'])}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block">Assign To</label>
            <select
              onChange={(e) => e.target.value && onAssign(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
              defaultValue=""
            >
              <option value="" disabled>Select admin...</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}