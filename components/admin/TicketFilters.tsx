'use client'

import { Search, X, Filter } from 'lucide-react'
import type { TicketStatus, Severity } from '@/types'

interface TicketFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: TicketStatus[]
  onStatusChange: (statuses: TicketStatus[]) => void
  severityFilter: Severity[]
  onSeverityChange: (severities: Severity[]) => void
}

const statusOptions: { value: TicketStatus; label: string }[] = [
  { value: 'pending_verification', label: 'Pending Review' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
]

const severityOptions: { value: Severity; label: string }[] = [
  { value: 'blocking', label: 'Blocking' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'suggestion', label: 'Suggestion' },
]

export function TicketFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  severityFilter,
  onSeverityChange,
}: TicketFiltersProps) {
  const toggleStatus = (status: TicketStatus) => {
    if (statusFilter.includes(status)) {
      onStatusChange(statusFilter.filter(s => s !== status))
    } else {
      onStatusChange([...statusFilter, status])
    }
  }

  const toggleSeverity = (severity: Severity) => {
    if (severityFilter.includes(severity)) {
      onSeverityChange(severityFilter.filter(s => s !== severity))
    } else {
      onSeverityChange([...severityFilter, severity])
    }
  }

  const clearFilters = () => {
    onSearchChange('')
    onStatusChange([])
    onSeverityChange([])
  }

  const hasFilters = searchQuery || statusFilter.length > 0 || severityFilter.length > 0

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <div className="flex flex-wrap gap-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleStatus(option.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  statusFilter.includes(option.value)
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">Severity:</span>
          <div className="flex flex-wrap gap-1">
            {severityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => toggleSeverity(option.value)}
                className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                  severityFilter.includes(option.value)
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <X className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}