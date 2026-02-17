'use client'

import { useState, useMemo } from 'react'
import { Search, RefreshCw, Filter, FileText, History } from 'lucide-react'
import { TicketStatusCard } from './TicketStatusCard'
import { StatusHistoryModal } from './StatusHistoryModal'
import type { Ticket, TicketStatus, Severity } from '@/types'

interface StatusHistoryItem {
  id: string
  status: string
  changedAt: string
  changedBy: string
  reason?: string
}

interface TicketTrackingDashboardProps {
  tickets: Ticket[]
  isLoading?: boolean
  onRefresh?: () => void
  onViewHistory: (ticketId: string) => Promise<StatusHistoryItem[]>
}

export function TicketTrackingDashboard({
  tickets,
  isLoading,
  onRefresh,
  onViewHistory,
}: TicketTrackingDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus[]>([])
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([])
  const [historyModal, setHistoryModal] = useState<{
    isOpen: boolean
    ticketId: string | null
    ticketTitle: string
    history: StatusHistoryItem[]
  }>({
    isOpen: false,
    ticketId: null,
    ticketTitle: '',
    history: [],
  })

  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
      )
    }

    if (statusFilter.length > 0) {
      result = result.filter((t) => statusFilter.includes(t.status as TicketStatus))
    }

    if (severityFilter.length > 0) {
      result = result.filter((t) => severityFilter.includes(t.severity as Severity))
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return result
  }, [tickets, searchQuery, statusFilter, severityFilter])

  const handleViewHistory = async (ticket: Ticket) => {
    const history = await onViewHistory(ticket.id)
    setHistoryModal({
      isOpen: true,
      ticketId: ticket.id,
      ticketTitle: ticket.title,
      history,
    })
  }

  const toggleStatusFilter = (status: TicketStatus) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const toggleSeverityFilter = (severity: Severity) => {
    setSeverityFilter((prev) =>
      prev.includes(severity) ? prev.filter((s) => s !== severity) : [...prev, severity]
    )
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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            My Tickets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Track the status of your submitted tickets
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  onClick={() => toggleStatusFilter(option.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                    statusFilter.includes(option.value)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
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
                  onClick={() => toggleSeverityFilter(option.value)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-full transition-colors ${
                    severityFilter.includes(option.value)
                      ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 text-center">
            <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No tickets found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {tickets.length === 0
                ? "You haven't submitted any tickets yet"
                : 'No tickets match your filters'}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="relative">
              <TicketStatusCard
                ticket={ticket}
                onClick={() => handleViewHistory(ticket)}
              />
              <button
                onClick={() => handleViewHistory(ticket)}
                className="absolute top-4 right-12 p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400"
                title="View History"
              >
                <History className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Status History Modal */}
      <StatusHistoryModal
        isOpen={historyModal.isOpen}
        ticketId={historyModal.ticketId}
        ticketTitle={historyModal.ticketTitle}
        history={historyModal.history}
        onClose={() => setHistoryModal({ isOpen: false, ticketId: null, ticketTitle: '', history: [] })}
      />
    </div>
  )
}