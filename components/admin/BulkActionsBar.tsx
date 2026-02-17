'use client'

import { X, UserPlus, ArrowRight, Download } from 'lucide-react'
import type { TicketStatus } from '@/types'

interface BulkActionsBarProps {
  selectedCount: number
  onClearSelection: () => void
  onBulkAssign: (adminId: string) => void
  onBulkStatusChange: (status: TicketStatus) => void
  onExport: () => void
  admins: { id: string; name: string }[]
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'pending_verification', label: 'Pending Review' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

export function BulkActionsBar({
  selectedCount,
  onClearSelection,
  onBulkAssign,
  onBulkStatusChange,
  onExport,
  admins,
}: BulkActionsBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-4 z-40">
      <span className="text-sm font-medium">
        {selectedCount} ticket{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="h-6 w-px bg-slate-600" />
      
      {/* Bulk Assign */}
      <div className="flex items-center gap-2">
        <UserPlus className="h-4 w-4 text-slate-400" />
        <select
          onChange={(e) => e.target.value && onBulkAssign(e.target.value)}
          className="bg-transparent border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>Assign to...</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id} className="bg-slate-800">
              {admin.name}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk Status Change */}
      <div className="flex items-center gap-2">
        <ArrowRight className="h-4 w-4 text-slate-400" />
        <select
          onChange={(e) => e.target.value && onBulkStatusChange(e.target.value as TicketStatus)}
          className="bg-transparent border border-slate-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          defaultValue=""
        >
          <option value="" disabled>Change status...</option>
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-slate-800">
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Export */}
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-3 py-1 bg-slate-700 hover:bg-slate-600 rounded text-sm transition-colors"
      >
        <Download className="h-4 w-4" />
        Export
      </button>

      <div className="h-6 w-px bg-slate-600" />

      {/* Clear Selection */}
      <button
        onClick={onClearSelection}
        className="p-1 hover:bg-slate-600 rounded transition-colors"
        title="Clear selection"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}