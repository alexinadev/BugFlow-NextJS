'use client'

import { AlertCircle, AlertTriangle, Info, Lightbulb, ArrowUpDown } from 'lucide-react'
import type { Ticket, Severity } from '@/types'

interface TicketListProps {
  tickets: Ticket[]
  selectedTickets: string[]
  onSelectTicket: (id: string) => void
  onSelectAll: (selected: boolean) => void
  onTicketClick: (id: string) => void
  onSort: (field: string) => void
  sortField?: string
  sortDirection?: 'asc' | 'desc'
}

const severityIcons: Record<Severity, React.ReactNode> = {
  blocking: <AlertCircle className="h-4 w-4 text-red-500" />,
  major: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  minor: <Info className="h-4 w-4 text-yellow-500" />,
  suggestion: <Lightbulb className="h-4 w-4 text-blue-500" />,
}

const statusColors: Record<string, string> = {
  pending_verification: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200',
  open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  resolved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  closed: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
}

const statusLabels: Record<string, string> = {
  pending_verification: 'Pending Review',
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export function TicketList({
  tickets,
  selectedTickets,
  onSelectTicket,
  onSelectAll,
  onTicketClick,
  onSort,
  sortField,
  sortDirection,
}: TicketListProps) {
  const allSelected = tickets.length > 0 && selectedTickets.length === tickets.length
  const someSelected = selectedTickets.length > 0 && selectedTickets.length < tickets.length

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="w-12 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('id')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  ID
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('title')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  Title
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('status')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  Status
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('severity')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  Severity
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button
                  onClick={() => onSort('createdAt')}
                  className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hover:text-slate-700"
                >
                  Created
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Assigned
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className={`hover:bg-slate-50 dark:hover:bg-slate-700/50 ${
                  selectedTickets.includes(ticket.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedTickets.includes(ticket.id)}
                    onChange={() => onSelectTicket(ticket.id)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono text-sm text-slate-600 dark:text-slate-400">
                    {ticket.id}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => onTicketClick(ticket.id)}
                    className="text-left hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <span className="font-medium text-slate-900 dark:text-white">
                      {ticket.title}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {severityIcons[ticket.severity]}
                    <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">
                      {ticket.severity}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  {ticket.assignedTo && ticket.assignedTo.length > 0 ? (
                    <div className="flex -space-x-2">
                      {ticket.assignedTo.slice(0, 3).map((_, i) => (
                        <div
                          key={i}
                          className="h-6 w-6 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 flex items-center justify-center"
                        >
                          <span className="text-[10px] text-white font-medium">
                            {i + 1}
                          </span>
                        </div>
                      ))}
                      {ticket.assignedTo.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-slate-300 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center">
                          <span className="text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                            +{ticket.assignedTo.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tickets.length === 0 && (
        <div className="text-center py-12 text-slate-500 dark:text-slate-400">
          No tickets found
        </div>
      )}
    </div>
  )
}