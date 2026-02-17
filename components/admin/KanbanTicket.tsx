'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, AlertCircle, AlertTriangle, Info, Lightbulb } from 'lucide-react'
import type { Ticket, Severity } from '@/types'

interface KanbanTicketProps {
  ticket: Ticket
  isSelected: boolean
  onSelect: (id: string) => void
  onClick: (id: string) => void
}

const severityIcons: Record<Severity, React.ReactNode> = {
  blocking: <AlertCircle className="h-4 w-4 text-red-500" />,
  major: <AlertTriangle className="h-4 w-4 text-orange-500" />,
  minor: <Info className="h-4 w-4 text-yellow-500" />,
  suggestion: <Lightbulb className="h-4 w-4 text-blue-500" />,
}

const severityColors: Record<Severity, string> = {
  blocking: 'border-l-red-500',
  major: 'border-l-orange-500',
  minor: 'border-l-yellow-500',
  suggestion: 'border-l-blue-500',
}

export function KanbanTicket({ ticket, isSelected, onSelect, onClick }: KanbanTicketProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 border-l-4 ${severityColors[ticket.severity]} ${
        isDragging ? 'opacity-50 shadow-lg' : ''
      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(ticket.id)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <button
            onClick={() => onClick(ticket.id)}
            className="flex-1 text-left"
          >
            <div className="flex items-center gap-2 mb-1">
              {severityIcons[ticket.severity]}
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {ticket.id}
              </span>
            </div>
            <h4 className="font-medium text-slate-900 dark:text-white text-sm line-clamp-2">
              {ticket.title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {ticket.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-slate-400">
                {new Date(ticket.createdAt).toLocaleDateString()}
              </span>
              {ticket.assignedTo && ticket.assignedTo.length > 0 && (
                <div className="flex -space-x-2">
                  {ticket.assignedTo.slice(0, 3).map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 flex items-center justify-center"
                    >
                      <span className="text-[8px] text-white font-medium">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </button>
          <button
            {...attributes}
            {...listeners}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}