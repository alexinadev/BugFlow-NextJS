'use client'

import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Ticket as TicketIcon } from 'lucide-react'
import type { TicketStatus, Ticket } from '@/types'
import { KanbanTicket } from './KanbanTicket'

interface KanbanColumnProps {
  id: TicketStatus
  title: string
  tickets: Ticket[]
  selectedTickets: string[]
  onSelectTicket: (id: string) => void
  onTicketClick: (id: string) => void
  color: string
}

export function KanbanColumn({
  id,
  title,
  tickets,
  selectedTickets,
  onSelectTicket,
  onTicketClick,
  color,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div className="flex flex-col min-w-[280px] max-w-[320px]">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${color}`}>
        <TicketIcon className="h-4 w-4" />
        <span className="font-medium text-sm">{title}</span>
        <span className="ml-auto bg-white/20 text-white text-xs font-medium px-2 py-0.5 rounded-full">
          {tickets.length}
        </span>
      </div>
      
      <div
        ref={setNodeRef}
        className={`flex-1 bg-slate-100 dark:bg-slate-800/50 rounded-b-lg p-2 space-y-2 min-h-[400px] ${
          isOver ? 'ring-2 ring-blue-500' : ''
        }`}
      >
        <SortableContext items={tickets.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tickets.map((ticket) => (
            <KanbanTicket
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedTickets.includes(ticket.id)}
              onSelect={onSelectTicket}
              onClick={onTicketClick}
            />
          ))}
        </SortableContext>
        
        {tickets.length === 0 && (
          <div className="flex items-center justify-center h-32 text-slate-400 text-sm">
            No tickets
          </div>
        )}
      </div>
    </div>
  )
}