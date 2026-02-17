'use client'

import { useState, useMemo } from 'react'
import { LayoutGrid, List, RefreshCw } from 'lucide-react'
import { KanbanBoard } from './KanbanBoard'
import { TicketList } from './TicketList'
import { TicketDetailModal } from './TicketDetailModal'
import { TicketFilters } from './TicketFilters'
import { BulkActionsBar } from './BulkActionsBar'
import type { Ticket, TicketStatus, Severity } from '@/types'

interface AdminDashboardProps {
  tickets: Ticket[]
  admins: { id: string; name: string }[]
  isLoading?: boolean
  onRefresh?: () => void
  onUpdateTicket: (ticketId: string, updates: Partial<Ticket>) => Promise<void>
  onBulkUpdate: (ticketIds: string[], updates: Partial<Ticket>) => Promise<void>
  onExport: (ticketIds: string[]) => void
}

export function AdminDashboard({
  tickets,
  admins,
  isLoading,
  onRefresh,
  onUpdateTicket,
  onBulkUpdate,
  onExport,
}: AdminDashboardProps) {
  const [view, setView] = useState<'kanban' | 'list'>('kanban')
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TicketStatus[]>([])
  const [severityFilter, setSeverityFilter] = useState<Severity[]>([])
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  // Filter and sort tickets
  const filteredTickets = useMemo(() => {
    let result = [...tickets]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query)
      )
    }

    // Status filter
    if (statusFilter.length > 0) {
      result = result.filter((t) => statusFilter.includes(t.status))
    }

    // Severity filter
    if (severityFilter.length > 0) {
      result = result.filter((t) => severityFilter.includes(t.severity))
    }

    // Sort
    result.sort((a, b) => {
      let aVal: string | number = ''
      let bVal: string | number = ''

      switch (sortField) {
        case 'id':
          aVal = a.id
          bVal = b.id
          break
        case 'title':
          aVal = a.title
          bVal = b.title
          break
        case 'status':
          aVal = a.status
          bVal = b.status
          break
        case 'severity':
          const severityOrder = { blocking: 0, major: 1, minor: 2, suggestion: 3 }
          aVal = severityOrder[a.severity]
          bVal = severityOrder[b.severity]
          break
        case 'createdAt':
        default:
          aVal = new Date(a.createdAt).getTime()
          bVal = new Date(b.createdAt).getTime()
          break
      }

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

    return result
  }, [tickets, searchQuery, statusFilter, severityFilter, sortField, sortDirection])

  const toggleTicketSelection = (id: string) => {
    setSelectedTickets((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    )
  }

  const selectAllTickets = (selected: boolean) => {
    if (selected) {
      setSelectedTickets(filteredTickets.map((t) => t.id))
    } else {
      setSelectedTickets([])
    }
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleDragEnd = async (ticketId: string, newStatus: TicketStatus) => {
    await onUpdateTicket(ticketId, { status: newStatus })
  }

  const handleAssign = async (adminId: string) => {
    if (selectedTicket) {
      await onUpdateTicket(selectedTicket.id, { assignedTo: [adminId] })
      setSelectedTicket(null)
    }
  }

  const handleStatusChange = async (status: TicketStatus) => {
    if (selectedTicket) {
      await onUpdateTicket(selectedTicket.id, { status })
    }
  }

  const handleBulkAssign = async (adminId: string) => {
    await onBulkUpdate(selectedTickets, { assignedTo: [adminId] })
    setSelectedTickets([])
  }

  const handleBulkStatusChange = async (status: TicketStatus) => {
    await onBulkUpdate(selectedTickets, { status })
    setSelectedTickets([])
  }

  const handleExport = () => {
    onExport(selectedTickets)
    setSelectedTickets([])
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
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

          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => setView('kanban')}
              className={`p-2 rounded transition-colors ${
                view === 'kanban'
                  ? 'bg-white dark:bg-slate-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="Kanban View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded transition-colors ${
                view === 'list'
                  ? 'bg-white dark:bg-slate-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <TicketFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        severityFilter={severityFilter}
        onSeverityChange={setSeverityFilter}
      />

      {/* Content */}
      {view === 'kanban' ? (
        <KanbanBoard
          tickets={filteredTickets}
          selectedTickets={selectedTickets}
          onSelectTicket={toggleTicketSelection}
          onTicketClick={(id) => setSelectedTicket(filteredTickets.find((t) => t.id === id) || null)}
          onDragEnd={handleDragEnd}
        />
      ) : (
        <TicketList
          tickets={filteredTickets}
          selectedTickets={selectedTickets}
          onSelectTicket={toggleTicketSelection}
          onSelectAll={selectAllTickets}
          onTicketClick={(id) => setSelectedTicket(filteredTickets.find((t) => t.id === id) || null)}
          onSort={handleSort}
          sortField={sortField}
          sortDirection={sortDirection}
        />
      )}

      {/* Ticket Detail Modal */}
      <TicketDetailModal
        isOpen={!!selectedTicket}
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onAssign={handleAssign}
        onChangeStatus={handleStatusChange}
        admins={admins}
      />

      {/* Bulk Actions Bar */}
      <BulkActionsBar
        selectedCount={selectedTickets.length}
        onClearSelection={() => setSelectedTickets([])}
        onBulkAssign={handleBulkAssign}
        onBulkStatusChange={handleBulkStatusChange}
        onExport={handleExport}
        admins={admins}
      />
    </div>
  )
}