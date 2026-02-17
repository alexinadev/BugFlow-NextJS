'use client'

import { X, Clock, User, ArrowRight } from 'lucide-react'

interface StatusHistoryItem {
  id: string
  status: string
  changedAt: string
  changedBy: string
  reason?: string
}

interface StatusHistoryModalProps {
  isOpen: boolean
  ticketId: string | null
  ticketTitle: string
  history: StatusHistoryItem[]
  onClose: () => void
}

const statusColors: Record<string, string> = {
  pending_verification: 'bg-slate-500 text-white',
  open: 'bg-blue-500 text-white',
  in_progress: 'bg-yellow-500 text-white',
  resolved: 'bg-emerald-500 text-white',
  closed: 'bg-purple-500 text-white',
  incoming: 'bg-cyan-500 text-white',
  acknowledged: 'bg-indigo-500 text-white',
  review: 'bg-pink-500 text-white',
  triaged: 'bg-orange-500 text-white',
  investigating: 'bg-amber-500 text-white',
  pending: 'bg-gray-500 text-white',
}

const statusLabels: Record<string, string> = {
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

export function StatusHistoryModal({
  isOpen,
  ticketId,
  ticketTitle,
  history,
  onClose,
}: StatusHistoryModalProps) {
  if (!isOpen || !ticketId) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Status History
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
              {ticketTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 max-h-[calc(80vh-80px)]">
          {history.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400">
              No status history available
            </div>
          ) : (
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              
              {/* History items */}
              <div className="space-y-4">
                {history.map((item, index) => (
                  <div key={item.id} className="relative pl-10">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 top-1 h-4 w-4 rounded-full ${statusColors[item.status] || 'bg-gray-400'} ring-2 ring-white dark:ring-slate-800`} />
                    
                    <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status] || 'bg-gray-400 text-white'}`}>
                          {statusLabels[item.status] || item.status}
                        </span>
                        {index === 0 && (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                            Current
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(item.changedAt).toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {item.changedBy}
                        </div>
                      </div>
                      
                      {item.reason && (
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                          {item.reason}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}